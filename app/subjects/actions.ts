"use server";

import { auth } from "@/lib/auth";
import { createSubject, deleteSubject } from "@/lib/services/subjects";
import { revalidatePath } from "next/cache";

export async function createSubjectAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");

  const name = formData.get("name") as string;
  const professor = formData.get("professor") as string;
  const schedule = formData.get("schedule") as string;

  await createSubject(session.user.id, { name, professor, schedule });
  revalidatePath("/subjects");
}

export async function deleteSubjectAction(subjectId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");

  await deleteSubject(session.user.id, subjectId);
  revalidatePath("/subjects");
}