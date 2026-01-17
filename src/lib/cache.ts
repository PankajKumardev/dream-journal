import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";

export const CACHE_TAGS = {
  dreams: (userId: string) => `dreams-${userId}`,
  stats: (userId: string) => `stats-${userId}`,
  patterns: (userId: string) => `patterns-${userId}`,
  user: (userId: string) => `user-${userId}`,
} as const;

// Cached dream fetching
export const getCachedDreams = (userId: string, limit = 50, offset = 0) =>
  unstable_cache(
    async () => {
      return prisma.dream.findMany({
        where: { userId },
        include: {
          analysis: {
            select: {
              analysisStatus: true,
              themes: true,
              isNightmare: true,
              isLucid: true,
              vividness: true,
              summary: true,
            },
          },
        },
        orderBy: { recordedAt: "desc" },
        take: limit,
        skip: offset,
      });
    },
    [`dreams-${userId}-${limit}-${offset}`],
    {
      revalidate: 60, // 1 minute
      tags: [CACHE_TAGS.dreams(userId)],
    }
  )();

// Cached stats fetching (heavier query, longer cache)
export const getCachedStats = (userId: string) =>
  unstable_cache(
    async () => {
      const dreams = await prisma.dream.findMany({
        where: { userId },
        include: { analysis: true },
        orderBy: { recordedAt: "desc" },
      });

      const totalDreams = dreams.length;
      const analyzedDreams = dreams.filter(
        (d) => d.analysis?.analysisStatus === "done"
      ).length;
      const nightmareCount = dreams.filter(
        (d) => d.analysis?.isNightmare
      ).length;
      const lucidCount = dreams.filter((d) => d.analysis?.isLucid).length;

      const vividnessValues = dreams
        .filter((d) => d.analysis?.vividness)
        .map((d) => d.analysis!.vividness);
      const avgVividness =
        vividnessValues.length > 0
          ? vividnessValues.reduce((a, b) => a + b, 0) / vividnessValues.length
          : 0;

      // Theme frequency
      const themeCounts: Record<string, number> = {};
      dreams.forEach((dream) => {
        if (dream.analysis?.themes) {
          const themes = dream.analysis.themes as string[];
          themes.forEach((theme) => {
            themeCounts[theme] = (themeCounts[theme] || 0) + 1;
          });
        }
      });
      const themes = Object.entries(themeCounts)
        .map(([theme, count]) => ({ theme, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Emotion aggregation
      const emotionTotals: Record<string, number[]> = {};
      dreams.forEach((dream) => {
        if (dream.analysis?.emotions) {
          const emotions = dream.analysis.emotions as Record<string, number>;
          Object.entries(emotions).forEach(([emotion, value]) => {
            if (!emotionTotals[emotion]) emotionTotals[emotion] = [];
            emotionTotals[emotion].push(value);
          });
        }
      });
      const emotions = Object.entries(emotionTotals)
        .map(([emotion, values]) => ({
          emotion,
          value: values.reduce((a, b) => a + b, 0) / values.length,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

      return {
        totalDreams,
        analyzedDreams,
        nightmareCount,
        lucidCount,
        avgVividness,
        themes,
        emotions,
      };
    },
    [`stats-${userId}`],
    {
      revalidate: 120, // 2 minutes (heavier computation)
      tags: [CACHE_TAGS.stats(userId)],
    }
  )();

// Cached patterns fetching
export const getCachedPatterns = (userId: string) =>
  unstable_cache(
    async () => {
      return prisma.pattern.findMany({
        where: { userId },
        orderBy: [{ confidence: "desc" }, { occurrenceCount: "desc" }],
        take: 20,
      });
    },
    [`patterns-${userId}`],
    {
      revalidate: 300, // 5 minutes
      tags: [CACHE_TAGS.patterns(userId)],
    }
  )();

// Cached single dream fetching
export const getCachedDream = (dreamId: string, userId: string) =>
  unstable_cache(
    async () => {
      return prisma.dream.findFirst({
        where: { id: dreamId, userId },
        include: { analysis: true },
      });
    },
    [`dream-${dreamId}`],
    {
      revalidate: 60,
      tags: [CACHE_TAGS.dreams(userId), `dream-${dreamId}`],
    }
  )();
