import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCachedDreams, CACHE_TAGS } from "@/lib/cache";

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
    console.error("Error fetching dreams:", error);
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

    const body = await request.json();
    const { transcript, moodBefore, stressLevel, sleepQuality } = body;

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 }
      );
    }

    // Create dream with pending status
    const dream = await prisma.dream.create({
      data: {
        userId: session.user.id,
        transcript,
        moodBefore: moodBefore ? parseInt(moodBefore) : null,
        stressLevel: stressLevel ? parseInt(stressLevel) : null,
        sleepQuality: sleepQuality ? parseInt(sleepQuality) : null,
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

    return NextResponse.json(dream, { status: 201 });
  } catch (error) {
    console.error("Error creating dream:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
