import { prisma } from "@/lib/prisma";
import { getSubjects } from "@/lib/services/subjects";
import { getTasks, createTask, toggleTaskCompleted, deleteTask } from "@/lib/services/tasks";
import { semanticSearch } from "@/lib/rag/search";

interface ToolArgs {
  onlyPending?: boolean;
  subjectName?: string;
  title?: string;
  description?: string;
  dueDate?: string;
  taskId?: string;
  query?: string;
}

export async function executeTool(userId: string, name: string, args: ToolArgs): Promise<string> {
  switch (name) {
    case "get_subjects": {
      const subjects = await getSubjects(userId);
      return JSON.stringify(
        subjects.map((s) => ({ id: s.id, name: s.name, professor: s.professor, schedule: s.schedule }))
      );
    }

    case "get_tasks": {
      const tasks = await getTasks(userId);
      const filtered = args.onlyPending ? tasks.filter((t) => !t.completed) : tasks;
      return JSON.stringify(
        filtered.map((t) => ({
          id: t.id,
          title: t.title,
          dueDate: t.dueDate,
          completed: t.completed,
          subject: t.subject.name,
        }))
      );
    }

    case "create_task": {
      const subject = await prisma.subject.findFirst({
        where: { userId, name: { contains: args.subjectName, mode: "insensitive" } },
      });
      if (!subject) {
        return JSON.stringify({
          error: `No se encontró una materia llamada "${args.subjectName}". Usa get_subjects primero.`,
        });
      }
      const task = await createTask(userId, {
        subjectId: subject.id,
        title: args.title!,
        description: args.description,
        dueDate: new Date(args.dueDate!),
      });
      return JSON.stringify({ success: true, taskId: task.id });
    }

    case "toggle_task_completed": {
      const task = await toggleTaskCompleted(userId, args.taskId!);
      return JSON.stringify({ success: true, completed: task.completed });
    }

    case "delete_task": {
      await deleteTask(userId, args.taskId!);
      return JSON.stringify({ success: true });
    }

    case "search_documents": {
      const chunks = await semanticSearch(userId, args.query!, 5);
      return JSON.stringify(chunks.map((c) => ({ content: c.content, source: c.filename, page: c.page })));
    }

    default:
      return JSON.stringify({ error: `Herramienta desconocida: ${name}` });
  }
}