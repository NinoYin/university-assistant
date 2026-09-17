"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { updateTaskAction, toggleTaskAction, deleteTaskAction, type ActionState } from "./actions";

type Task = {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date;
  completed: boolean;
  subject: { id: string; name: string };
};
type Subject = { id: string; name: string };

const initialResult: ActionState = { error: null, success: false };

export default function TaskItem({ task, subjects }: { task: Task; subjects: Subject[] }) {
  const [editing, setEditing] = useState(false);
  const dueDateValue = new Date(task.dueDate).toISOString().split("T")[0];
  const updateWithId = updateTaskAction.bind(null, task.id);
  const [state, formAction, pending] = useActionState(updateWithId, initialResult);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- cierra el modo edición solo cuando el guardado terminó con éxito
    if (state.success) setEditing(false);
  }, [state]);

  if (editing) {
    return (
      <form action={formAction} className="border border-emerald-200 dark:border-emerald-900 bg-white dark:bg-slate-950 rounded-2xl p-4 flex flex-col gap-3">
        {state.error && (
          <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 px-3 py-2 rounded-lg">
            {state.error}
          </p>
        )}
        <input name="title" defaultValue={task.title} required className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5" />
        <select name="subjectId" defaultValue={task.subject.id} required className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5">
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <textarea name="description" defaultValue={task.description ?? ""} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 resize-none" rows={2} />
        <input name="dueDate" type="date" defaultValue={dueDateValue} required className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5" />
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
    <div className={`border ${task.completed ? "bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60" : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"} rounded-2xl p-4 flex justify-between items-center transition-all`}>
      <div className="flex items-center gap-4">
        <form action={toggleTaskAction.bind(null, task.id)}>
          <button type="submit" className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 dark:border-slate-600 hover:border-emerald-500"}`}>
            {task.completed && <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
          </button>
        </form>
        <div>
          <p className={`font-semibold ${task.completed ? "line-through text-slate-500" : "text-slate-800 dark:text-slate-200"}`}>{task.title}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 px-2 py-0.5 rounded-full mr-2">{task.subject.name}</span>
            📅 {new Date(task.dueDate).toLocaleDateString("es-MX")}
          </p>
        </div>
      </div>
      <div className="flex gap-1">
        <button onClick={() => setEditing(true)} className="text-slate-400 hover:text-emerald-600 p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </button>
        <form action={deleteTaskAction.bind(null, task.id)}>
          <button className="text-slate-400 hover:text-red-500 p-2"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
        </form>
      </div>
    </div>
  );
}