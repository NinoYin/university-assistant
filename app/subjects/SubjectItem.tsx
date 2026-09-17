"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { updateSubjectAction, deleteSubjectAction, type ActionState } from "./actions";

const initialResult: ActionState = { error: null, success: false };
type Subject = { id: string; name: string; professor: string | null; schedule: string | null };

export default function SubjectItem({ subject }: { subject: Subject }) {
  const [editing, setEditing] = useState(false);
  const updateWithId = updateSubjectAction.bind(null, subject.id);
  const [state, formAction, pending] = useActionState(updateWithId, initialResult);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- cierra el modo edición solo cuando el guardado ya terminó con éxito, no en cada render
    if (state.success) setEditing(false);
  }, [state]);

  if (editing) {
    return (
      <form action={formAction} className="bg-white dark:bg-slate-950 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-5 flex flex-col gap-3">
        {state.error && (
          <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 px-3 py-2 rounded-lg">
            {state.error}
          </p>
        )}
        <input name="name" defaultValue={subject.name} required className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5" />
        <input name="professor" defaultValue={subject.professor ?? ""} placeholder="Profesor" className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5" />
        <input name="schedule" defaultValue={subject.schedule ?? ""} placeholder="Horario" className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5" />
        <div className="flex gap-2">
          <button type="submit" disabled={pending} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-50">
            {pending ? "Guardando..." : "Guardar"}
          </button>
          <button type="button" onClick={() => setEditing(false)} className="text-slate-500 text-sm px-4 py-2">Cancelar</button>
        </div>
      </form>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex justify-between items-center hover:shadow-md transition-shadow group">
      <div>
        <p className="font-bold text-lg text-emerald-700 dark:text-emerald-400">{subject.name}</p>
        <div className="flex gap-4 mt-1 text-sm text-slate-500">
          {subject.professor && <span>👨‍🏫 {subject.professor}</span>}
          {subject.schedule && <span>⏱️ {subject.schedule}</span>}
        </div>
      </div>
      <div className="flex gap-1">
        <button onClick={() => setEditing(true)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </button>
        <form action={deleteSubjectAction.bind(null, subject.id)}>
          <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
}