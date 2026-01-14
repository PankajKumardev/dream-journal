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

    const dream = await prisma.dream.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        analysis: true,
      },
    });

    if (!dream) {
      return NextResponse.json({ error: "Dream not found" }, { status: 404 });
    }

    return NextResponse.json(dream);
  } catch (error) {
    console.error("Error fetching dream:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const existing = await prisma.dream.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Dream not found" }, { status: 404 });
    }

    const dream = await prisma.dream.update({
      where: { id },
      data: {
        title: body.title,
        transcript: body.transcript,
        moodBefore: body.moodBefore,
        stressLevel: body.stressLevel,
        sleepQuality: body.sleepQuality,
      },
      include: {
        analysis: true,
      },
    });

    return NextResponse.json(dream);
  } catch (error) {
    console.error("Error updating dream:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const existing = await prisma.dream.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Dream not found" }, { status: 404 });
    }

    await prisma.dream.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting dream:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
