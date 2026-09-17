"use client";

import { useActionState } from "react";
import { createSubjectAction, type ActionState } from "./actions";

const initialResult: ActionState = { error: null, success: false };

export default function CreateSubjectForm() {
  const [state, formAction, pending] = useActionState(createSubjectAction, initialResult);

  return (
    <form action={formAction} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm mb-10 flex flex-col gap-4">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wide">Agregar nueva materia</h2>
      {state.error && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 px-3 py-2 rounded-lg">
          {state.error}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input name="name" placeholder="Ej. Álgebra Lineal" required className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
        <input name="professor" placeholder="Profesor (opcional)" className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
        <input name="schedule" placeholder="Ej. Lun/Mie 10:00am" className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:col-span-2" />
      </div>
      <button type="submit" disabled={pending} className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl px-4 py-3 transition-colors mt-2 disabled:opacity-50">
        {pending ? "Guardando..." : "Guardar Materia"}
      </button>
    </form>
  );
}