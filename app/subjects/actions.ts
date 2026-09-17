"use server";

import { auth } from "@/lib/auth";
import { createSubject, updateSubject, deleteSubject } from "@/lib/services/subjects";
import { subjectSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export type ActionState = { error: string | null; success: boolean };

export async function createSubjectAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autenticado", success: false };

  const parsed = subjectSchema.safeParse({
    name: formData.get("name"),
    professor: formData.get("professor"),
    schedule: formData.get("schedule"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false };
  }

  try {
    await createSubject(session.user.id, parsed.data);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error al crear la materia", success: false };
  }

  revalidatePath("/subjects");
  return { error: null, success: true };
}

export async function updateSubjectAction(
  subjectId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autenticado", success: false };

  const parsed = subjectSchema.safeParse({
    name: formData.get("name"),
    professor: formData.get("professor"),
    schedule: formData.get("schedule"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false };
  }

  try {
    await updateSubject(session.user.id, subjectId, parsed.data);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error al actualizar la materia", success: false };
  }

  revalidatePath("/subjects");
  return { error: null, success: true };
}

export async function deleteSubjectAction(subjectId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");
  await deleteSubject(session.user.id, subjectId);
  revalidatePath("/subjects");
}