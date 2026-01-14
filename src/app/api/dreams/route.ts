import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const dreams = await prisma.dream.findMany({
      where: { userId: session.user.id },
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

    return NextResponse.json(dream, { status: 201 });
  } catch (error) {
    console.error("Error creating dream:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
