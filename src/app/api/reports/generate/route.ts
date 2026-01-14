import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateWeeklyReport } from "@/lib/groq";
import { getWeekStart } from "@/lib/utils";
import { subDays } from "date-fns";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const weekStart = getWeekStart();
    const weekEnd = new Date();

    // Get dreams from the past week
    const dreams = await prisma.dream.findMany({
      where: {
        userId: session.user.id,
        recordedAt: {
          gte: subDays(weekEnd, 7),
          lte: weekEnd,
        },
      },
      include: {
        analysis: true,
      },
    });

    if (dreams.length === 0) {
      return NextResponse.json(
        { error: "No dreams recorded this week" },
        { status: 400 }
      );
    }

    // Aggregate stats
    const themeCounts: Record<string, number> = {};
    const emotionTotals: Record<string, number[]> = {};
    let nightmareCount = 0;
    let lucidCount = 0;
    let totalVividness = 0;
    let vividnessCount = 0;

    dreams.forEach((dream) => {
      if (dream.analysis) {
        if (dream.analysis.isNightmare) nightmareCount++;
        if (dream.analysis.isLucid) lucidCount++;
        if (dream.analysis.vividness) {
          totalVividness += dream.analysis.vividness;
          vividnessCount++;
        }

        const themes = dream.analysis.themes as string[];
        themes?.forEach((theme) => {
          themeCounts[theme] = (themeCounts[theme] || 0) + 1;
        });

        const emotions = dream.analysis.emotions as Record<string, number>;
        if (emotions) {
          Object.entries(emotions).forEach(([emotion, value]) => {
            if (!emotionTotals[emotion]) emotionTotals[emotion] = [];
            emotionTotals[emotion].push(value);
          });
        }
      }
    });

    // Calculate emotion averages
    const emotionAverages: Record<string, number> = {};
    Object.entries(emotionTotals).forEach(([emotion, values]) => {
      emotionAverages[emotion] = values.reduce((a, b) => a + b, 0) / values.length;
    });

    // Get patterns
    const patterns = await prisma.pattern.findMany({
      where: { userId: session.user.id },
      orderBy: { confidence: "desc" },
      take: 5,
    });

    const patternDescriptions = patterns.map((p) => {
      if (p.patternType === "recurring_theme") {
        return `Recurring theme: ${(p.patternData as { theme?: string }).theme}`;
      }
      if (p.patternType === "temporal") {
        return `${(p.patternData as { day?: string }).day} pattern detected`;
      }
      if (p.patternType === "correlation") {
        return (p.patternData as { message?: string }).message || "";
      }
      return "";
    }).filter(Boolean);

    // Generate report using AI
    const reportContent = await generateWeeklyReport({
      totalDreams: dreams.length,
      themes: themeCounts,
      emotions: emotionAverages,
      nightmareCount,
      lucidCount,
      avgVividness: vividnessCount > 0 ? totalVividness / vividnessCount : 5,
      patterns: patternDescriptions,
    });

    // Save or update report
    const report = await prisma.weeklyReport.upsert({
      where: {
        userId_weekStart: {
          userId: session.user.id,
          weekStart,
        },
      },
      create: {
        userId: session.user.id,
        weekStart,
        content: reportContent,
        stats: {
          totalDreams: dreams.length,
          themes: themeCounts,
          emotions: emotionAverages,
          nightmareCount,
          lucidCount,
        },
      },
      update: {
        content: reportContent,
        stats: {
          totalDreams: dreams.length,
          themes: themeCounts,
          emotions: emotionAverages,
          nightmareCount,
          lucidCount,
        },
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
