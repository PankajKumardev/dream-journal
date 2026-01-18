import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeDream } from "@/lib/groq";
import { generateEmbeddingWithRetry } from "@/lib/jina";
import { updatePatterns } from "@/lib/patterns";
import { logger } from "@/lib/logger";

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
    logger.error("Error triggering analysis", error);
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
  const startTime = Date.now();
  
  try {
    // Run Groq analysis and Jina embedding in PARALLEL for faster processing
    logger.debug("Starting parallel analysis", { dreamId });
    
    const [analysisResult, embeddingResult] = await Promise.allSettled([
      analyzeDream(transcript),
      generateEmbeddingWithRetry(transcript),
    ]);

    const parallelTime = Date.now() - startTime;
    logger.debug(`Parallel tasks completed in ${parallelTime}ms`, { dreamId });

    // Handle analysis result
    if (analysisResult.status === "fulfilled") {
      const analysis = analysisResult.value;
      
      // Update dream with title
      await prisma.dream.update({
        where: { id: dreamId },
        data: { title: analysis.title },
      });

      // Update analysis data
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
      
      logger.debug(`DB updates completed in ${Date.now() - startTime}ms`, { dreamId });
    } else {
      logger.error("Analysis failed", analysisResult.reason, { dreamId });
      await prisma.dreamAnalysis.update({
        where: { dreamId },
        data: { analysisStatus: "failed" },
      });
    }

    // Handle embedding result
    if (embeddingResult.status === "fulfilled") {
      const embedding = embeddingResult.value;
      await prisma.$executeRaw`
        UPDATE "Dream" 
        SET embedding = ${embedding}::vector, "embeddingStatus" = 'done'
        WHERE id = ${dreamId}
      `;
    } else {
      logger.error("Embedding generation failed", embeddingResult.reason, { dreamId });
      await prisma.dream.update({
        where: { id: dreamId },
        data: { embeddingStatus: "failed" },
      });
    }

    // Update patterns in background (don't block)
    if (analysisResult.status === "fulfilled") {
      // Fire and forget - don't await
      updatePatterns(userId).catch((err) => {
        logger.error("Pattern update failed", err, { userId });
      });
    }
    
    const totalTime = Date.now() - startTime;
    logger.info(`Dream analysis completed in ${totalTime}ms`, { dreamId, userId });
    
  } catch (error) {
    logger.error("Background analysis failed", error, { dreamId });
    
    // Mark analysis as failed
    await prisma.dreamAnalysis.update({
      where: { dreamId },
      data: { analysisStatus: "failed" },
    });
  }
}
