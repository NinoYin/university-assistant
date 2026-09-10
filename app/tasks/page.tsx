import { auth } from "@/lib/auth";
import { getTasks } from "@/lib/services/tasks";
import { getSubjects } from "@/lib/services/subjects";
import { createTaskAction, toggleTaskAction, deleteTaskAction } from "./actions";
import Link from "next/link";
import Sidebar from "../components/Sidebar";

export default async function TasksPage() {
  const session = await auth();
  if (!session?.user?.id) return <p className="p-6">Debes iniciar sesión.</p>;

  const [tasks, subjects] = await Promise.all([getTasks(session.user.id), getSubjects(session.user.id)]);

  return (
    <div className="dark">
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
              {tasks.length === 0 && <p className="text-center text-slate-400 py-6">Libre de tareas ( ´ ▽ ` )ﾉ</p>}
              {tasks.map((t) => (
                <div key={t.id} className={`border ${t.completed ? 'bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60' : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800'} rounded-2xl p-4 flex justify-between items-center transition-all`}>
                  <div className="flex items-center gap-4">
                    <form action={toggleTaskAction.bind(null, t.id)}>
                      <button type="submit" className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${t.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500'}`}>
                        {t.completed && <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                      </button>
                    </form>
                    <div>
                      <p className={`font-semibold ${t.completed ? "line-through text-slate-500" : "text-slate-800 dark:text-slate-200"}`}>{t.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 px-2 py-0.5 rounded-full mr-2">{t.subject.name}</span>
                        📅 {new Date(t.dueDate).toLocaleDateString("es-MX")}
                      </p>
                    </div>
                  </div>
                  <form action={deleteTaskAction.bind(null, t.id)}>
                    <button className="text-slate-400 hover:text-red-500 p-2"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}