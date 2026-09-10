"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

type SidebarProps = {
  currentPath: string; // Para saber qué enlace marcar como activo
  isDarkMode?: boolean;
  setIsDarkMode?: (value: boolean) => void;
};

export default function Sidebar({ currentPath, isDarkMode, setIsDarkMode }: SidebarProps) {
  // Función auxiliar para saber qué enlace resaltar
  const isActive = (path: string) => currentPath === path;

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
      isActive(path)
        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;

  return (
    <aside className="w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col">
      {/* Cabecera del Sidebar */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-lg">
          <span className="text-2xl">🐙</span>
          <span>UniApp</span>
        </div>
        {/* Si se pasa la función de modo oscuro, mostramos el botón (útil para el chat o global) */}
        {setIsDarkMode && typeof isDarkMode === "boolean" && (
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            {isDarkMode ? "O_O" : "X_X"}
          </button>
        )}
      </div>

      {/* Navegación */}
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

      {/* Cerrar sesión */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => signOut()}
          className="w-full text-center text-sm font-medium text-slate-500 hover:text-red-500 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          ಥ_ಥ - Cerrar sesión
        </button>
      </div>
    </aside>
  );
}