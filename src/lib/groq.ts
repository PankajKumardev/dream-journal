import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Exponential backoff retry logic
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: unknown) {
      const err = error as { status?: number };
      if (err.status === 429 && i < maxRetries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}

// Transcribe audio using Whisper
export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  return withRetry(async () => {
    // Convert Buffer to Uint8Array for File constructor compatibility
    const uint8Array = new Uint8Array(audioBuffer);
    const file = new File([uint8Array], "audio.webm", { type: "audio/webm" });
    
    const transcription = await groq.audio.transcriptions.create({
      file,
      model: "whisper-large-v3",
      language: "en",
      response_format: "text",
    });

    return transcription as unknown as string;
  });
}

// Analyze dream content using Llama
export async function analyzeDream(transcript: string): Promise<{
  title: string;
  themes: string[];
  emotions: Record<string, number>;
  symbols: string[];
  people: string[];
  settings: string[];
  isNightmare: boolean;
  isLucid: boolean;
  vividness: number;
  summary: string;
}> {
  return withRetry(async () => {
    const prompt = `You are a dream analyst. Analyze the following dream transcript and extract structured information.

Dream transcript:
"${transcript}"

Respond ONLY with a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "title": "A short, evocative title for this dream (max 8 words)",
  "themes": ["theme1", "theme2", "theme3"],
  "emotions": {"emotion1": 0.8, "emotion2": 0.5},
  "symbols": ["symbol1", "symbol2"],
  "people": ["person1", "person2"],
  "settings": ["setting1", "setting2"],
  "isNightmare": false,
  "isLucid": false,
  "vividness": 7,
  "summary": "A 2-3 sentence summary of the dream's meaning and significance."
}

Rules:
- themes: 2-5 main themes (e.g., "flying", "water", "chase", "transformation")
- emotions: object with emotion names as keys and intensity 0-1 as values
- symbols: significant objects or elements with symbolic meaning
- people: people mentioned (use relationships like "mother", "stranger", "friend")
- settings: locations where the dream takes place
- isNightmare: true if the dream is frightening or distressing
- isLucid: true if the dreamer was aware they were dreaming
- vividness: 1-10 scale of how vivid/detailed the dream is
- summary: psychological interpretation in 2-3 sentences`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content || "{}";
    
    // Clean the response - remove markdown code blocks if present
    const cleanedContent = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    try {
      return JSON.parse(cleanedContent);
    } catch {
      // Return default structure if parsing fails
      return {
        title: "Untitled Dream",
        themes: [],
        emotions: {},
        symbols: [],
        people: [],
        settings: [],
        isNightmare: false,
        isLucid: false,
        vividness: 5,
        summary: "Analysis could not be completed.",
      };
    }
  });
}

// Generate weekly report
export async function generateWeeklyReport(
  stats: {
    totalDreams: number;
    themes: Record<string, number>;
    emotions: Record<string, number>;
    nightmareCount: number;
    lucidCount: number;
    avgVividness: number;
    patterns: string[];
  }
): Promise<string> {
  return withRetry(async () => {
    const prompt = `You are a friendly dream journal assistant. Create a warm, insightful weekly dream report based on this data:

Statistics:
- Total dreams recorded: ${stats.totalDreams}
- Most common themes: ${Object.entries(stats.themes).slice(0, 5).map(([t, c]) => `${t} (${c}x)`).join(", ")}
- Dominant emotions: ${Object.entries(stats.emotions).slice(0, 5).map(([e, v]) => `${e} (${Math.round(v * 100)}%)`).join(", ")}
- Nightmares: ${stats.nightmareCount}
- Lucid dreams: ${stats.lucidCount}
- Average vividness: ${stats.avgVividness.toFixed(1)}/10
- Detected patterns: ${stats.patterns.join(", ") || "None yet"}

Write a friendly, encouraging 150-200 word report that:
1. Summarizes the week's dream activity
2. Highlights interesting patterns or themes
3. Offers gentle psychological insights
4. Ends with an encouraging note

Use a warm, supportive tone. Don't use bullet points - write in flowing paragraphs.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || "Report generation failed.";
  });
}

export default groq;
