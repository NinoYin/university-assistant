"use server";

import { auth } from "@/lib/auth";
import { createTask, toggleTaskCompleted, deleteTask } from "@/lib/services/tasks";
import { revalidatePath } from "next/cache";

export async function createTaskAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");

  const subjectId = formData.get("subjectId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dueDate = new Date(formData.get("dueDate") as string);

  await createTask(session.user.id, { subjectId, title, description, dueDate });
  revalidatePath("/tasks");
}

export async function toggleTaskAction(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");

  await toggleTaskCompleted(session.user.id, taskId);
  revalidatePath("/tasks");
}

export async function deleteTaskAction(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");

  await deleteTask(session.user.id, taskId);
  revalidatePath("/tasks");
}