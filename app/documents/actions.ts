"use server";

import { auth } from "@/lib/auth";
import { uploadDocument, deleteDocument, getDocumentDownloadUrl } from "@/lib/services/documents";
import { revalidatePath } from "next/cache";

export type ActionState = { error: string | null; success: boolean };

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB, coincide con el límite de Server Actions ya configurado
const ALLOWED_EXTENSIONS = ["pdf", "docx", "txt"];

export async function uploadDocumentAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autenticado", success: false };

  const file = formData.get("file") as File | null;
  const subjectId = formData.get("subjectId") as string;

  if (!file || file.size === 0) {
    return { error: "Selecciona un archivo para subir", success: false };
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    return { error: "Solo se aceptan archivos PDF, DOCX o TXT", success: false };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { error: "El archivo no debe superar 10MB", success: false };
  }

  try {
    await uploadDocument(session.user.id, subjectId || null, file);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error al subir el documento", success: false };
  }

  revalidatePath("/documents");
  return { error: null, success: true };
}

export async function deleteDocumentAction(documentId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");
  await deleteDocument(session.user.id, documentId);
  revalidatePath("/documents");
}

export async function getDownloadUrlAction(
  documentId: string
): Promise<{ url: string | null; error: string | null }> {
  const session = await auth();
  if (!session?.user?.id) return { url: null, error: "No autenticado" };

  try {
    const url = await getDocumentDownloadUrl(session.user.id, documentId);
    return { url, error: null };
  } catch (err) {
    return { url: null, error: err instanceof Error ? err.message : "Error al generar el enlace" };
  }
}