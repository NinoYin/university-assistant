import { auth } from "@/lib/auth";
import { getDocuments } from "@/lib/services/documents";
import { getSubjects } from "@/lib/services/subjects";
import { uploadDocumentAction, deleteDocumentAction } from "./actions";
//import Link from "next/link";
import Sidebar from "../components/Sidebar";

export default async function DocumentsPage() {
  const session = await auth();
  if (!session?.user?.id) return <p className="p-6">Debes iniciar sesión.</p>;

  const [documents, subjects] = await Promise.all([getDocuments(session.user.id), getSubjects(session.user.id)]);

  return (
    <div className="dark">
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans overflow-hidden">
        
        {/* SIDEBAR */}
        <Sidebar currentPath="/documents" />

        {/* ÁREA PRINCIPAL */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-3xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-2">📁 Mis Documentos</h1>
              <p className="text-slate-500 dark:text-slate-400">Guarda apuntes, PDFs y lecturas importantes.</p>
            </header>

            <form action={uploadDocumentAction} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm mb-10 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <select name="subjectId" className="w-full sm:w-1/3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20">
                  <option value="">(Sin materia asignada)</option>
                  {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <input name="file" type="file" accept=".pdf,.docx,.txt" required className="w-full sm:flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-xl px-4 py-2.5 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-900/30 dark:file:text-emerald-400" />
              </div>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl px-4 py-3 mt-2 transition-colors">
                Subir Documento
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {documents.length === 0 && <p className="text-slate-400 col-span-2 text-center py-6">No hay archivos. ( ~_~)</p>}
              {documents.map((d) => (
                <div key={d.id} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex gap-4 items-center">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center text-2xl shrink-0">
                    📄
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate" title={d.filename}>{d.filename}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {d.subject?.name || "General"} • {new Date(d.uploadedAt).toLocaleDateString("es-MX")}
                    </p>
                  </div>
                  <form action={deleteDocumentAction.bind(null, d.id)}>
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