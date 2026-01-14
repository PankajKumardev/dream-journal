import { prisma } from "./prisma";

interface DreamWithAnalysis {
  id: string;
  recordedAt: Date;
  stressLevel: number | null;
  analysis: {
    themes: string[];
    emotions: Record<string, number>;
    isNightmare: boolean;
  } | null;
}

// Calculate confidence score (normalized 0-1)
export function calculateConfidence(
  occurrenceCount: number,
  totalDreams: number
): number {
  return Math.min(1, occurrenceCount / Math.max(totalDreams, 1));
}

// Detect recurring theme patterns
export function detectRecurringThemes(
  dreams: DreamWithAnalysis[]
): { theme: string; count: number; confidence: number }[] {
  const themeCounts: Record<string, number> = {};

  dreams.forEach((dream) => {
    if (dream.analysis?.themes) {
      const themes = Array.isArray(dream.analysis.themes)
        ? dream.analysis.themes
        : [];
      themes.forEach((theme: string) => {
        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
      });
    }
  });

  return Object.entries(themeCounts)
    .filter(([, count]) => count >= 2)
    .map(([theme, count]) => ({
      theme,
      count,
      confidence: calculateConfidence(count, dreams.length),
    }))
    .sort((a, b) => b.count - a.count);
}

// Detect temporal patterns (nightmare rate by day of week)
export function detectTemporalPatterns(
  dreams: DreamWithAnalysis[]
): { day: string; nightmareRate: number; dreamCount: number }[] {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const byDayOfWeek: Record<number, DreamWithAnalysis[]> = {};

  dreams.forEach((dream) => {
    const day = new Date(dream.recordedAt).getDay();
    if (!byDayOfWeek[day]) byDayOfWeek[day] = [];
    byDayOfWeek[day].push(dream);
  });

  return Object.entries(byDayOfWeek)
    .map(([day, dayDreams]) => {
      const nightmares = dayDreams.filter(
        (d) => d.analysis?.isNightmare
      ).length;
      return {
        day: dayNames[parseInt(day)],
        nightmareRate: dayDreams.length > 0 ? nightmares / dayDreams.length : 0,
        dreamCount: dayDreams.length,
      };
    })
    .filter((p) => p.dreamCount >= 2);
}

// Detect stress-nightmare correlation
export function detectStressCorrelation(
  dreams: DreamWithAnalysis[]
): { correlation: number; message: string } | null {
  const highStressDreams = dreams.filter(
    (d) => d.stressLevel && d.stressLevel > 7
  );

  if (highStressDreams.length < 3) return null;

  const nightmares = highStressDreams.filter(
    (d) => d.analysis?.isNightmare
  ).length;
  const correlation = nightmares / highStressDreams.length;

  if (correlation > 0.5) {
    return {
      correlation,
      message: `High stress levels correlate with ${Math.round(
        correlation * 100
      )}% nightmare rate`,
    };
  }

  return null;
}

// Aggregate emotion trends
export function aggregateEmotions(
  dreams: DreamWithAnalysis[]
): Record<string, number> {
  const emotionTotals: Record<string, number[]> = {};

  dreams.forEach((dream) => {
    if (dream.analysis?.emotions) {
      const emotions =
        typeof dream.analysis.emotions === "object"
          ? dream.analysis.emotions
          : {};
      Object.entries(emotions).forEach(([emotion, value]) => {
        if (!emotionTotals[emotion]) emotionTotals[emotion] = [];
        emotionTotals[emotion].push(value as number);
      });
    }
  });

  const averages: Record<string, number> = {};
  Object.entries(emotionTotals).forEach(([emotion, values]) => {
    averages[emotion] = values.reduce((a, b) => a + b, 0) / values.length;
  });

  return averages;
}

// Save or update patterns in database
export async function updatePatterns(userId: string): Promise<void> {
  const dreams = await prisma.dream.findMany({
    where: {
      userId,
      analysis: {
        analysisStatus: "done",
      },
    },
    include: {
      analysis: true,
    },
    orderBy: {
      recordedAt: "desc",
    },
    take: 100, // Last 100 dreams for pattern analysis
  });

  if (dreams.length < 3) return;

  const dreamsWithAnalysis: DreamWithAnalysis[] = dreams.map((d) => ({
    id: d.id,
    recordedAt: d.recordedAt,
    stressLevel: d.stressLevel,
    analysis: d.analysis
      ? {
          themes: d.analysis.themes as string[],
          emotions: d.analysis.emotions as Record<string, number>,
          isNightmare: d.analysis.isNightmare,
        }
      : null,
  }));

  // Recurring themes
  const recurringThemes = detectRecurringThemes(dreamsWithAnalysis);
  for (const theme of recurringThemes.slice(0, 10)) {
    await prisma.pattern.upsert({
      where: {
        id: `${userId}-theme-${theme.theme}`,
      },
      create: {
        id: `${userId}-theme-${theme.theme}`,
        userId,
        patternType: "recurring_theme",
        patternData: { theme: theme.theme },
        confidence: theme.confidence,
        occurrenceCount: theme.count,
      },
      update: {
        confidence: theme.confidence,
        occurrenceCount: theme.count,
        lastSeen: new Date(),
      },
    });
  }

  // Temporal patterns
  const temporalPatterns = detectTemporalPatterns(dreamsWithAnalysis);
  for (const pattern of temporalPatterns.filter((p) => p.nightmareRate > 0.4)) {
    await prisma.pattern.upsert({
      where: {
        id: `${userId}-temporal-${pattern.day}`,
      },
      create: {
        id: `${userId}-temporal-${pattern.day}`,
        userId,
        patternType: "temporal",
        patternData: {
          day: pattern.day,
          nightmareRate: pattern.nightmareRate,
        },
        confidence: pattern.nightmareRate,
        occurrenceCount: pattern.dreamCount,
      },
      update: {
        patternData: {
          day: pattern.day,
          nightmareRate: pattern.nightmareRate,
        },
        confidence: pattern.nightmareRate,
        occurrenceCount: pattern.dreamCount,
        lastSeen: new Date(),
      },
    });
  }

  // Stress correlation
  const stressCorrelation = detectStressCorrelation(dreamsWithAnalysis);
  if (stressCorrelation) {
    await prisma.pattern.upsert({
      where: {
        id: `${userId}-correlation-stress`,
      },
      create: {
        id: `${userId}-correlation-stress`,
        userId,
        patternType: "correlation",
        patternData: { message: stressCorrelation.message },
        confidence: stressCorrelation.correlation,
        occurrenceCount: dreams.filter((d) => d.stressLevel && d.stressLevel > 7)
          .length,
      },
      update: {
        patternData: { message: stressCorrelation.message },
        confidence: stressCorrelation.correlation,
        lastSeen: new Date(),
      },
    });
  }
}
