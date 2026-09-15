//app/tasks/page.tsx
import { auth } from "@/lib/auth";
import { getTasks } from "@/lib/services/tasks";
import { getSubjects } from "@/lib/services/subjects";
import { createTaskAction } from "./actions";
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
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans overflow-hidden">
      
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
            <form action={createTaskAction} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm mb-10 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="title" placeholder="Título de la tarea" required className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                <select name="subjectId" required className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 outline-none">
                  {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <textarea name="description" placeholder="Descripción (opcional)" className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 outline-none sm:col-span-2 resize-none" rows={2} />
                <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4 items-center">
                  <input name="dueDate" type="date" required className="w-full sm:w-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                  <button type="submit" className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl px-4 py-3 transition-colors">
                    Agregar Tarea
                  </button>
                </div>
              </div>
            </form>
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