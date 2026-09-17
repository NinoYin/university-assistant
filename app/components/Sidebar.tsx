"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type SidebarProps = {
  currentPath: string;
};

export default function Sidebar({ currentPath }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isActive = (path: string) => currentPath === path;

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
      isActive(path)
        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;

  const mobileLinkClass = (path: string) =>
    `flex flex-col items-center justify-center gap-0.5 flex-1 py-2 text-xs transition-colors ${
      isActive(path)
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-slate-500 dark:text-slate-400"
    }`;

  return (
    <>
      {/* SIDEBAR DE ESCRITORIO */}
      <aside className="w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-lg">
            <span className="text-2xl">🐙</span>
            <span>UniApp</span>
          </div>
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              {theme === "dark" ? "O_O" : "X_X"}
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 ml-1">
            Menú Principal
          </p>
          <Link href="/" className={linkClass("/")}>
            <span>💬</span> Chat Asistente
          </Link>
          <Link href="/subjects" className={linkClass("/subjects")}>
            <span>📚</span> Materias
          </Link>
          <Link href="/tasks" className={linkClass("/tasks")}>
            <span>📝</span> Tareas
          </Link>
          <Link href="/documents" className={linkClass("/documents")}>
            <span>📁</span> Documentos
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => signOut()}
            className="w-full text-center text-sm font-medium text-slate-500 hover:text-red-500 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            ಥ_ಥ - Cerrar sesión
          </button>
        </div>
      </aside>

      {/* BARRA INFERIOR M\u00d3VIL */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-stretch">
        <Link href="/" className={mobileLinkClass("/")}>
          <span className="text-lg">💬</span>
          Chat
        </Link>
        <Link href="/subjects" className={mobileLinkClass("/subjects")}>
          <span className="text-lg">📚</span>
          Materias
        </Link>
        <Link href="/tasks" className={mobileLinkClass("/tasks")}>
          <span className="text-lg">📝</span>
          Tareas
        </Link>
        <Link href="/documents" className={mobileLinkClass("/documents")}>
          <span className="text-lg">📁</span>
          Docs
        </Link>
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 text-xs text-slate-500 dark:text-slate-400"
          >
            <span className="text-lg">{theme === "dark" ? "O_O" : "X_X"}</span>
            Tema
          </button>
        )}
        <button
          onClick={() => signOut()}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 text-xs text-slate-500 hover:text-red-500"
        >
          <span className="text-lg">ಥ_ಥ</span>
          Salir
        </button>
      </nav>
    </>
  );
}