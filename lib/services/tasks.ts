import { prisma } from "@/lib/prisma";

export async function getTasks(userId: string) {
  return prisma.task.findMany({
    where: { subject: { userId } },
    include: { subject: true },
    orderBy: { dueDate: "asc" },
  });
}

export async function createTask(
  userId: string,
  data: { subjectId: string; title: string; description?: string; dueDate: Date }
) {
  // Verificamos que la materia sea del usuario antes de crear la tarea
  const subject = await prisma.subject.findFirst({
    where: { id: data.subjectId, userId },
  });
  if (!subject) throw new Error("Materia no encontrada o no autorizada");

  return prisma.task.create({ data });
}

export async function toggleTaskCompleted(userId: string, taskId: string) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, subject: { userId } },
  });
  if (!task) throw new Error("Tarea no encontrada o no autorizada");

  return prisma.task.update({
    where: { id: taskId },
    data: { completed: !task.completed },
  });
}

export async function deleteTask(userId: string, taskId: string) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, subject: { userId } },
  });
  if (!task) throw new Error("Tarea no encontrada o no autorizada");

  return prisma.task.delete({ where: { id: taskId } });
}