import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the current dream
    const dream = await prisma.dream.findFirst({
      where: { id, userId: session.user.id },
      include: { analysis: true },
    });

    if (!dream) {
      return NextResponse.json({ error: "Dream not found" }, { status: 404 });
    }

    // Try vector similarity first
    if (dream.embeddingStatus === "done") {
      try {
        const similarDreams = await prisma.$queryRaw<
          Array<{
            id: string;
            title: string | null;
            transcript: string;
            recordedAt: Date;
            distance: number;
          }>
        >`
          SELECT id, title, transcript, "recordedAt",
            embedding <=> (SELECT embedding FROM "Dream" WHERE id = ${id}) AS distance
          FROM "Dream"
          WHERE "userId" = ${session.user.id}
            AND id != ${id}
            AND embedding IS NOT NULL
          ORDER BY distance
          LIMIT 5
        `;

        return NextResponse.json(
          similarDreams.map((d) => ({
            ...d,
            similarity: 1 - d.distance, // Convert distance to similarity
          }))
        );
      } catch (vectorError) {
        console.error("Vector search failed, falling back to theme matching:", vectorError);
      }
    }

    // Fallback: Theme-based similarity
    if (dream.analysis?.themes) {
      const themes = dream.analysis.themes as string[];
      
      if (themes.length > 0) {
        const allDreams = await prisma.dream.findMany({
          where: {
            userId: session.user.id,
            id: { not: id },
            analysis: {
              analysisStatus: "done",
            },
          },
          include: {
            analysis: {
              select: {
                themes: true,
              },
            },
          },
          take: 50,
        });

        // Calculate theme overlap
        const withSimilarity = allDreams
          .map((d) => {
            const otherThemes = (d.analysis?.themes as string[]) || [];
            const sharedThemes = themes.filter((t) => otherThemes.includes(t));
            const similarity =
              sharedThemes.length / Math.max(themes.length, otherThemes.length, 1);
            return {
              id: d.id,
              title: d.title,
              transcript: d.transcript,
              recordedAt: d.recordedAt,
              similarity,
            };
          })
          .filter((d) => d.similarity > 0)
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, 5);

        return NextResponse.json(withSimilarity);
      }
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error("Error finding similar dreams:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
