import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small", // 1536 dimensiones, coincide con la columna vector(1536)
    input: texts,
  });
  return response.data.map((d) => d.embedding);
}