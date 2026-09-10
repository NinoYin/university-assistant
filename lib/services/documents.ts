import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";

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

  return prisma.document.create({
    data: {
      userId,
      subjectId: subjectId || null,
      filename: file.name,
      storageKey,
    },
  });
}

export async function getDocumentDownloadUrl(userId: string, documentId: string) {
  const doc = await prisma.document.findFirst({
    where: { id: documentId, userId },
  });
  if (!doc) throw new Error("Documento no encontrado o no autorizado");

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUrl(doc.storageKey, 60); // URL válida 60 segundos

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