import { auth } from "@/lib/auth";
import { getDocuments } from "@/lib/services/documents";
import { getSubjects } from "@/lib/services/subjects";
import UploadDocumentForm from "./UploadDocumentForm";
import DocumentItem from "./DocumentItem";
import Sidebar from "../components/Sidebar";

export default async function DocumentsPage() {
  const session = await auth();
  if (!session?.user?.id) return <p className="p-6">Debes iniciar sesión.</p>;

  const [documents, subjects] = await Promise.all([
    getDocuments(session.user.id),
    getSubjects(session.user.id),
  ]);

  const groups = new Map<string, typeof documents>();
  for (const doc of documents) {
    const key = doc.subject?.name ?? "General";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(doc);
  }
  const sortedGroupNames = [...groups.keys()].sort((a, b) =>
    a === "General" ? 1 : b === "General" ? -1 : a.localeCompare(b)
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans overflow-hidden pb-16 md:pb-0">
      <Sidebar currentPath="/documents" />
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">📁 Mis Documentos</h1>
            <p className="text-slate-500 dark:text-slate-400">Guarda apuntes, PDFs y lecturas importantes.</p>
          </header>

          <UploadDocumentForm subjects={subjects} />

          {documents.length === 0 && (
            <p className="text-slate-400 text-center py-6">No hay archivos. ( ~_~)</p>
          )}

          {sortedGroupNames.map((groupName) => (
            <div key={groupName} className="mb-8">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3">{groupName}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {groups.get(groupName)!.map((d) => (
                  <DocumentItem key={d.id} doc={d} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}