"use server";

import { auth } from "@/lib/auth";
import { uploadDocument, deleteDocument, getDocumentDownloadUrl } from "@/lib/services/documents";
import { revalidatePath } from "next/cache";

export async function uploadDocumentAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");

  const file = formData.get("file") as File;
  const subjectId = formData.get("subjectId") as string;

  if (!file || file.size === 0) throw new Error("No seleccionaste ningún archivo");

  await uploadDocument(session.user.id, subjectId || null, file);
  revalidatePath("/documents");
}

export async function deleteDocumentAction(documentId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");

  await deleteDocument(session.user.id, documentId);
  revalidatePath("/documents");
}

export async function getDownloadUrlAction(documentId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");

  return getDocumentDownloadUrl(session.user.id, documentId);
}