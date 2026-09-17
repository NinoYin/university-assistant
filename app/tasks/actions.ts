"use server";

import { auth } from "@/lib/auth";
import { createTask, updateTask, toggleTaskCompleted, deleteTask } from "@/lib/services/tasks";
import { taskSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export type ActionState = { error: string | null; success: boolean };

export async function createTaskAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autenticado", success: false };

  const parsed = taskSchema.safeParse({
    subjectId: formData.get("subjectId"),
    title: formData.get("title"),
    description: formData.get("description"),
    dueDate: formData.get("dueDate"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false };
  }

  try {
    await createTask(session.user.id, {
      subjectId: parsed.data.subjectId,
      title: parsed.data.title,
      description: parsed.data.description,
      dueDate: new Date(parsed.data.dueDate),
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error al crear la tarea", success: false };
  }

  revalidatePath("/tasks");
  return { error: null, success: true };
}

export async function updateTaskAction(
  taskId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autenticado", success: false };

  const parsed = taskSchema.safeParse({
    subjectId: formData.get("subjectId"),
    title: formData.get("title"),
    description: formData.get("description"),
    dueDate: formData.get("dueDate"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false };
  }

  try {
    await updateTask(session.user.id, taskId, {
      subjectId: parsed.data.subjectId,
      title: parsed.data.title,
      description: parsed.data.description,
      dueDate: new Date(parsed.data.dueDate),
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error al actualizar la tarea", success: false };
  }

  revalidatePath("/tasks");
  return { error: null, success: true };
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