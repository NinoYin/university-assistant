import { prisma } from "@/lib/prisma";
import { embedTexts } from "./embed";

export interface RetrievedChunk {
  content: string;
  page: number | null;
  filename: string;
  documentId: string;
  distance: number;
}

export async function semanticSearch(
  userId: string,
  query: string,
  topK = 5
): Promise<RetrievedChunk[]> {
  const [queryEmbedding] = await embedTexts([query]);
  const vectorLiteral = `[${queryEmbedding.join(",")}]`;

  return prisma.$queryRaw<RetrievedChunk[]>`
    SELECT
      dc.content,
      dc.page,
      d.filename,
      d.id as "documentId",
      dc.embedding <=> ${vectorLiteral}::vector AS distance
    FROM "DocumentChunk" dc
    JOIN "Document" d ON d.id = dc."documentId"
    WHERE d."userId" = ${userId}
    ORDER BY distance ASC
    LIMIT ${topK}
  `;
}