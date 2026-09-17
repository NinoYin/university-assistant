"use client";

import { useActionState } from "react";
import { createTaskAction, type ActionState } from "./actions";

type Subject = { id: string; name: string };

const initialResult: ActionState = { error: null, success: false };

export default function CreateTaskForm({ subjects }: { subjects: Subject[] }) {
  const [state, formAction, pending] = useActionState(createTaskAction, initialResult);

  return (
    <form action={formAction} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm mb-10 flex flex-col gap-4">
      {state.error && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 px-3 py-2 rounded-lg">
          {state.error}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input name="title" placeholder="Título de la tarea" required className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
        <select name="subjectId" required className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 outline-none">
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <textarea name="description" placeholder="Descripción (opcional)" className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 outline-none sm:col-span-2 resize-none" rows={2} />
        <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4 items-center">
          <input name="dueDate" type="date" required className="w-full sm:w-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
          <button type="submit" disabled={pending} className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl px-4 py-3 transition-colors disabled:opacity-50">
            {pending ? "Guardando..." : "Agregar Tarea"}
          </button>
        </div>
      </div>
    </form>
  );
}