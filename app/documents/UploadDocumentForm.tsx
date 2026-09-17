"use client";

import { useActionState, useEffect, useRef } from "react";
import { uploadDocumentAction, type ActionState } from "./actions";

type Subject = { id: string; name: string };

const initialResult: ActionState = { error: null, success: false };

export default function UploadDocumentForm({ subjects }: { subjects: Subject[] }) {
  const [state, formAction, pending] = useActionState(uploadDocumentAction, initialResult);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm mb-10 flex flex-col gap-4"
    >
      {state.error && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 px-3 py-2 rounded-lg">
          {state.error}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <select name="subjectId" className="w-full sm:w-1/3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20">
          <option value="">(Sin materia asignada)</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input
          name="file"
          type="file"
          accept=".pdf,.docx,.txt"
          required
          className="w-full sm:flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-xl px-4 py-2.5 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-900/30 dark:file:text-emerald-400"
        />
      </div>
      <button type="submit" disabled={pending} className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl px-4 py-3 mt-2 transition-colors disabled:opacity-50">
        {pending ? "Subiendo y procesando..." : "Subir Documento"}
      </button>
    </form>
  );
}