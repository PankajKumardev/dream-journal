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
    const theme = searchParams.get("theme");

    if (!theme) {
      return NextResponse.json({ error: "Theme parameter required" }, { status: 400 });
    }

    // Fetch all analyzed dreams and filter by theme
    // (Prisma JSON array filtering is limited, so we filter in application)
    const allDreams = await prisma.dream.findMany({
      where: {
        userId: session.user.id,
        analysis: {
          analysisStatus: "done",
        },
      },
      select: {
        id: true,
        title: true,
        recordedAt: true,
        analysis: {
          select: {
            themes: true,
            summary: true,
          },
        },
      },
      orderBy: { recordedAt: "desc" },
      take: 100, // Get last 100 analyzed dreams
    });

    // Filter dreams that contain the theme
    const themeLower = theme.toLowerCase();
    const filteredDreams = allDreams.filter((dream) => {
      const themes = dream.analysis?.themes as string[] | null;
      return themes?.some((t) => t.toLowerCase() === themeLower);
    }).slice(0, 20); // Limit to 20 results

    return NextResponse.json(filteredDreams);
  } catch (error) {
    console.error("Error fetching dreams by theme:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

