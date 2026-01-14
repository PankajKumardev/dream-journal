import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const patterns = await prisma.pattern.findMany({
      where: { userId: session.user.id },
      orderBy: [{ confidence: "desc" }, { occurrenceCount: "desc" }],
      take: 20,
    });

    return NextResponse.json(patterns);
  } catch (error) {
    console.error("Error fetching patterns:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
