"use client";

import { useState } from "react";
import { deleteDocumentAction, getDownloadUrlAction } from "./actions";

type DocumentType = {
  id: string;
  filename: string;
  subject: { name: string } | null;
  uploadedAt: Date;
};

export default function DocumentItem({ doc }: { doc: DocumentType }) {
  const [loadingView, setLoadingView] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  async function handleView() {
    setLoadingView(true);
    setViewError(null);
    const result = await getDownloadUrlAction(doc.id);
    setLoadingView(false);
    if (result.url) {
      window.open(result.url, "_blank");
    } else {
      setViewError(result.error ?? "No se pudo abrir el documento");
    }
  }

  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex gap-4 items-center">
      <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center text-2xl shrink-0">
        📄
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate" title={doc.filename}>{doc.filename}</p>
        <p className="text-xs text-slate-500 mt-1">
          {doc.subject?.name || "General"} • {new Date(doc.uploadedAt).toLocaleDateString("es-MX")}
        </p>
        {viewError && <p className="text-xs text-red-500 mt-1">{viewError}</p>}
      </div>
      <button
        onClick={handleView}
        disabled={loadingView}
        title="Ver / Descargar"
        className="text-slate-400 hover:text-emerald-600 p-2 disabled:opacity-50 shrink-0"
      >
        {loadingView ? (
          <span className="text-xs">...</span>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
      <form action={deleteDocumentAction.bind(null, doc.id)}>
        <button className="text-slate-400 hover:text-red-500 p-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </form>
    </div>
  );
}