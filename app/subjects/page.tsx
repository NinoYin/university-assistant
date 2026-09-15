//app/subjects/page.tsx
import { auth } from "@/lib/auth";
import { getSubjects } from "@/lib/services/subjects";
import { createSubjectAction } from "./actions";
import SubjectItem from "./SubjectItem";
//import Link from "next/link";
import Sidebar from "../components/Sidebar";

export default async function SubjectsPage() {
  const session = await auth();
  if (!session?.user?.id) return <p className="p-6">Debes iniciar sesión.</p>;

  const subjects = await getSubjects(session.user.id);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <Sidebar currentPath="/subjects" />

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">📚 Mis Materias</h1>
            <p className="text-slate-500 dark:text-slate-400">Gestiona las clases de tu semestre actual.</p>
          </header>

          <form action={createSubjectAction} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm mb-10 flex flex-col gap-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wide">Agregar nueva materia</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="name" placeholder="Ej. Álgebra Lineal" required className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
              <input name="professor" placeholder="Profesor (opcional)" className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
              <input name="schedule" placeholder="Ej. Lun/Mie 10:00am" className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:col-span-2" />
            </div>
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl px-4 py-3 transition-colors mt-2">
              Guardar Materia
            </button>
          </form>

          <div className="space-y-4">
            {subjects.length === 0 && (
              <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                ( •_•)<br/>Aún no tienes materias registradas.
              </div>
            )}
            {subjects.map((s) => <SubjectItem key={s.id} subject={s} />)}
          </div>
        </div>
      </main>
    </div>
  );
}