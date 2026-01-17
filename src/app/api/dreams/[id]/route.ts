import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCachedDream, CACHE_TAGS } from "@/lib/cache";

export const dynamic = "force-dynamic";

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

    // Use cached query
    const dream = await getCachedDream(id, session.user.id);

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

    // Invalidate caches
    revalidateTag(CACHE_TAGS.dreams(session.user.id), "max");
    revalidateTag(`dream-${id}`, "max");

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

    // Invalidate all related caches
    revalidateTag(CACHE_TAGS.dreams(session.user.id), "max");
    revalidateTag(CACHE_TAGS.stats(session.user.id), "max");
    revalidateTag(CACHE_TAGS.patterns(session.user.id), "max");
    revalidateTag(`dream-${id}`, "max");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting dream:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
