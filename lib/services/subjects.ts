import { prisma } from "@/lib/prisma";

export async function getSubjects(userId: string) {
  return prisma.subject.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createSubject(
  userId: string,
  data: { name: string; professor?: string; schedule?: string }
) {
  return prisma.subject.create({
    data: { ...data, userId },
  });
}

export async function deleteSubject(userId: string, subjectId: string) {
  // Verificamos que la materia sea del usuario antes de borrar
  const subject = await prisma.subject.findFirst({
    where: { id: subjectId, userId },
  });
  if (!subject) throw new Error("Materia no encontrada o no autorizada");

  return prisma.subject.delete({ where: { id: subjectId } });
}