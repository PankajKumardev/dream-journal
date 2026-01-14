import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format, subDays } from "date-fns";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all dreams with analysis
    const dreams = await prisma.dream.findMany({
      where: { userId: session.user.id },
      include: {
        analysis: true,
      },
      orderBy: { recordedAt: "desc" },
    });

    // Basic counts
    const totalDreams = dreams.length;
    const analyzedDreams = dreams.filter(
      (d) => d.analysis?.analysisStatus === "done"
    ).length;
    const nightmareCount = dreams.filter(
      (d) => d.analysis?.isNightmare
    ).length;
    const lucidCount = dreams.filter((d) => d.analysis?.isLucid).length;

    // Average vividness
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

    // Dream activity (last 14 days)
    const activityMap: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const date = format(subDays(new Date(), i), "MMM d");
      activityMap[date] = 0;
    }
    dreams.forEach((dream) => {
      const date = format(new Date(dream.recordedAt), "MMM d");
      if (activityMap[date] !== undefined) {
        activityMap[date]++;
      }
    });
    const activity = Object.entries(activityMap).map(([date, count]) => ({
      date,
      count,
    }));

    // Mood trend (last 14 days)
    const moodTrendMap: Record<string, { moods: number[]; stresses: number[] }> = {};
    for (let i = 13; i >= 0; i--) {
      const date = format(subDays(new Date(), i), "MMM d");
      moodTrendMap[date] = { moods: [], stresses: [] };
    }
    dreams.forEach((dream) => {
      const date = format(new Date(dream.recordedAt), "MMM d");
      if (moodTrendMap[date]) {
        if (dream.moodBefore) moodTrendMap[date].moods.push(dream.moodBefore);
        if (dream.stressLevel) moodTrendMap[date].stresses.push(dream.stressLevel);
      }
    });
    const moodTrend = Object.entries(moodTrendMap)
      .map(([date, { moods, stresses }]) => ({
        date,
        mood: moods.length > 0 ? moods.reduce((a, b) => a + b, 0) / moods.length : 5,
        stress:
          stresses.length > 0
            ? stresses.reduce((a, b) => a + b, 0) / stresses.length
            : 5,
      }));

    return NextResponse.json({
      totalDreams,
      analyzedDreams,
      nightmareCount,
      lucidCount,
      avgVividness,
      themes,
      emotions,
      activity,
      moodTrend,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
