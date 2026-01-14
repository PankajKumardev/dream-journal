// Jina AI Embeddings Service

const JINA_API_URL = "https://api.jina.ai/v1/embeddings";

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch(JINA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.JINA_API_KEY}`,
    },
    body: JSON.stringify({
      input: [text],
      model: "jina-embeddings-v3",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Jina API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

// Generate embedding with retry logic
export async function generateEmbeddingWithRetry(
  text: string,
  maxRetries: number = 3
): Promise<number[]> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await generateEmbedding(text);
    } catch (error: unknown) {
      const err = error as { message?: string };
      if (err.message?.includes("429") && i < maxRetries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded for embedding generation");
}
