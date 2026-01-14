import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { transcribeAudio } from "@/lib/groq";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { audio } = body;

    if (!audio || typeof audio !== "string") {
      return NextResponse.json(
        { error: "Audio data is required" },
        { status: 400 }
      );
    }

    // Extract base64 data from data URL
    const base64Data = audio.split(",")[1];
    if (!base64Data) {
      return NextResponse.json(
        { error: "Invalid audio format" },
        { status: 400 }
      );
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(base64Data, "base64");

    // Transcribe using Groq Whisper
    const transcript = await transcribeAudio(audioBuffer);

    return NextResponse.json({ transcript });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 }
    );
  }
}
