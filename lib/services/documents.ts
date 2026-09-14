import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";
import { extractPages } from "@/lib/rag/extract";
import { chunkPages } from "@/lib/rag/chunk";
import { embedTexts } from "@/lib/rag/embed";
import { randomUUID } from "crypto";

const BUCKET = "documents";

export async function getDocuments(userId: string) {
  return prisma.document.findMany({
    where: { userId },
    include: { subject: true },
    orderBy: { uploadedAt: "desc" },
  });
}

export async function uploadDocument(
  userId: string,
  subjectId: string | null,
  file: File
) {
  const storageKey = `${userId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(storageKey, file);

  if (uploadError) throw new Error(`Error al subir archivo: ${uploadError.message}`);

  const document = await prisma.document.create({
    data: {
      userId,
      subjectId: subjectId || null,
      filename: file.name,
      storageKey,
    },
  });

  try {
    const pages = await extractPages(file);
    const chunks = chunkPages(pages);

    if (chunks.length > 0) {
      const embeddings = await embedTexts(chunks.map((c) => c.content));

      for (let i = 0; i < chunks.length; i++) {
        const id = randomUUID();
        const vectorLiteral = `[${embeddings[i].join(",")}]`;
        await prisma.$executeRaw`
          INSERT INTO "DocumentChunk" (id, "documentId", content, page, embedding)
          VALUES (${id}, ${document.id}, ${chunks[i].content}, ${chunks[i].page}, ${vectorLiteral}::vector)
        `;
      }
    }
  } catch (err) {
    console.error("Error procesando documento para RAG:", err);
  }

  return document;
}

export async function getDocumentDownloadUrl(userId: string, documentId: string) {
  const doc = await prisma.document.findFirst({
    where: { id: documentId, userId },
  });
  if (!doc) throw new Error("Documento no encontrado o no autorizado");

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUrl(doc.storageKey, 60);

  if (error) throw new Error(`Error al generar URL: ${error.message}`);
  return data.signedUrl;
}

export async function deleteDocument(userId: string, documentId: string) {
  const doc = await prisma.document.findFirst({
    where: { id: documentId, userId },
  });
  if (!doc) throw new Error("Documento no encontrado o no autorizado");

  await supabaseAdmin.storage.from(BUCKET).remove([doc.storageKey]);
  return prisma.document.delete({ where: { id: documentId } });
}