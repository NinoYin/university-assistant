import { z } from "zod";

export const subjectSchema = z.object({
  name: z.string().trim().min(1, "El nombre de la materia es obligatorio").max(120, "El nombre es demasiado largo"),
  professor: z.string().trim().max(120, "El nombre del profesor es demasiado largo").optional().or(z.literal("")),
  schedule: z.string().trim().max(120, "El horario es demasiado largo").optional().or(z.literal("")),
});

export const taskSchema = z.object({
  subjectId: z.string().min(1, "Selecciona una materia"),
  title: z.string().trim().min(1, "El título es obligatorio").max(200, "El título es demasiado largo"),
  description: z.string().trim().max(2000, "La descripción es demasiado larga").optional().or(z.literal("")),
  dueDate: z.string().min(1, "La fecha de entrega es obligatoria"),
});