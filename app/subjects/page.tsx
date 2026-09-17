//app/subjects/page.tsx
import { auth } from "@/lib/auth";
import { getSubjects } from "@/lib/services/subjects";
import SubjectItem from "./SubjectItem";
//import Link from "next/link";
import Sidebar from "../components/Sidebar";
import CreateSubjectForm from "./CreateSubjectForm";

export default async function SubjectsPage() {
  const session = await auth();
  if (!session?.user?.id) return <p className="p-6">Debes iniciar sesión.</p>;

  const subjects = await getSubjects(session.user.id);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans overflow-hidden pb-16 md:pb-0">
      
      {/* SIDEBAR */}
      <Sidebar currentPath="/subjects" />

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">📚 Mis Materias</h1>
            <p className="text-slate-500 dark:text-slate-400">Gestiona las clases de tu semestre actual.</p>
          </header>

          <CreateSubjectForm />

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