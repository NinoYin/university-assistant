//app/tasks/page.tsx
import { auth } from "@/lib/auth";
import { getTasks } from "@/lib/services/tasks";
import { getSubjects } from "@/lib/services/subjects";
import CreateTaskForm from "./CreateTaskForm";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import TaskItem from "./TaskItem";

export default async function TasksPage() {
  const session = await auth();
  if (!session?.user?.id) return <p className="p-6">Debes iniciar sesión.</p>;

  const [tasks, subjects] = await Promise.all([getTasks(session.user.id), getSubjects(session.user.id)]);

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans overflow-hidden pb-16 md:pb-0">
      
      {/* SIDEBAR */}
      <Sidebar currentPath="/tasks" />

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">📝 Mis Tareas</h1>
            <p className="text-slate-500 dark:text-slate-400">Mantén al día tus entregas y proyectos.</p>
          </header>

          {subjects.length === 0 ? (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-500 p-6 rounded-2xl mb-8">
              Primero necesitas crear al menos una <Link href="/subjects" className="font-bold underline">materia</Link> para agregar tareas.
            </div>
          ) : (
            <CreateTaskForm subjects={subjects} />
          )}

          <div className="space-y-3">
            {pendingTasks.length === 0 && completedTasks.length === 0 && (
              <p className="text-center text-slate-400 py-6">Libre de tareas ( ´ ▽ ` )ﾉ</p>
            )}
            {pendingTasks.map((t) => (
              <TaskItem key={t.id} task={t} subjects={subjects} />
            ))}
          </div>

          {completedTasks.length > 0 && (
            <>
              <div className="flex items-center gap-3 my-8">
                <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Completadas</span>
                <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="space-y-3">
                {completedTasks.map((t) => (
                  <TaskItem key={t.id} task={t} subjects={subjects} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}