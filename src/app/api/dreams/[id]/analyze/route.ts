import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeDream } from "@/lib/groq";
import { generateEmbeddingWithRetry } from "@/lib/jina";
import { updatePatterns } from "@/lib/patterns";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const dream = await prisma.dream.findFirst({
      where: { id, userId: session.user.id },
      include: { analysis: true },
    });

    if (!dream) {
      return NextResponse.json({ error: "Dream not found" }, { status: 404 });
    }

    // Start async analysis (don't await - return immediately)
    analyzeInBackground(id, dream.transcript, session.user.id);

    return NextResponse.json({ status: "analyzing" });
  } catch (error) {
    console.error("Error triggering analysis:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function analyzeInBackground(
  dreamId: string,
  transcript: string,
  userId: string
) {
  try {
    // Step 1: Generate AI analysis
    const analysis = await analyzeDream(transcript);

    // Update dream with title and analysis
    await prisma.dream.update({
      where: { id: dreamId },
      data: { title: analysis.title },
    });

    await prisma.dreamAnalysis.update({
      where: { dreamId },
      data: {
        analysisStatus: "done",
        themes: analysis.themes,
        emotions: analysis.emotions,
        symbols: analysis.symbols,
        people: analysis.people,
        settings: analysis.settings,
        isNightmare: analysis.isNightmare,
        isLucid: analysis.isLucid,
        vividness: analysis.vividness,
        summary: analysis.summary,
      },
    });

    // Step 2: Generate embedding (optional - may fail)
    try {
      const embedding = await generateEmbeddingWithRetry(transcript);
      
      // Store embedding using raw SQL (Prisma doesn't support vector type directly)
      await prisma.$executeRaw`
        UPDATE "Dream" 
        SET embedding = ${embedding}::vector, "embeddingStatus" = 'done'
        WHERE id = ${dreamId}
      `;
    } catch (embeddingError) {
      console.error("Embedding generation failed:", embeddingError);
      await prisma.dream.update({
        where: { id: dreamId },
        data: { embeddingStatus: "failed" },
      });
    }

    // Step 3: Update patterns
    try {
      await updatePatterns(userId);
    } catch (patternError) {
      console.error("Pattern update failed:", patternError);
    }
  } catch (error) {
    console.error("Background analysis failed:", error);
    
    // Mark analysis as failed
    await prisma.dreamAnalysis.update({
      where: { dreamId },
      data: { analysisStatus: "failed" },
    });
  }
}
