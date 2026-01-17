import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCachedPatterns } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const patterns = await getCachedPatterns(session.user.id);
    return NextResponse.json(patterns);
  } catch (error) {
    console.error("Error fetching patterns:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
