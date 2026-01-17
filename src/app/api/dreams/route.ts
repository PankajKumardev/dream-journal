import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCachedDreams, CACHE_TAGS } from "@/lib/cache";
import { checkRateLimit, getClientIP, getRateLimitHeaders } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { RATE_LIMITS } from "@/lib/constants";
import { createDreamSchema, validateInput } from "@/lib/validations";

// Enable edge runtime for better performance
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Use cached query
    const dreams = await getCachedDreams(session.user.id, limit, offset);

    return NextResponse.json(dreams);
  } catch (error) {
    logger.api.error("/api/dreams GET", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitKey = `${session.user.id}:${clientIP}`;
    const rateLimit = checkRateLimit(rateLimitKey, "DREAMS_CREATE");
    
    if (!rateLimit.success) {
      logger.warn("Rate limit exceeded for dream creation", { 
        userId: session.user.id, 
        ip: clientIP 
      });
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit, RATE_LIMITS.DREAMS_CREATE),
        }
      );
    }

    const body = await request.json();
    
    // Validate input with Zod
    const validation = validateInput(createDreamSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    const { transcript, moodBefore, stressLevel, sleepQuality } = validation.data;

    // Create dream with pending status
    const dream = await prisma.dream.create({
      data: {
        userId: session.user.id,
        transcript,
        moodBefore: moodBefore ?? null,
        stressLevel: stressLevel ?? null,
        sleepQuality: sleepQuality ?? null,
        embeddingStatus: "pending",
      },
      include: {
        analysis: true,
      },
    });

    // Create initial analysis record
    await prisma.dreamAnalysis.create({
      data: {
        dreamId: dream.id,
        analysisStatus: "pending",
      },
    });

    // Invalidate cache after mutation
    revalidateTag(CACHE_TAGS.dreams(session.user.id), "max");
    revalidateTag(CACHE_TAGS.stats(session.user.id), "max");

    logger.info("Dream created", { dreamId: dream.id, userId: session.user.id });

    return NextResponse.json(dream, { status: 201 });
  } catch (error) {
    logger.api.error("/api/dreams POST", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
