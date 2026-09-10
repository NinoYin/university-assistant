"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "./components/Sidebar"; // Ajusta la ruta según donde lo guardes

type Message = { role: "user" | "assistant"; content: string };

export default function ChatClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim()) return;
    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "( >_< ) Hubo un error..." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans overflow-hidden transition-colors">
        
        {/* USAMOS EL SIDEBAR REUTILIZABLE */}
        <Sidebar currentPath="/" isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

        {/* ================= ÁREA DEL CHAT ================= */}
        <main className="flex-1 flex flex-col h-full relative">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="max-w-3xl mx-auto space-y-8">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-slate-500 space-y-4 mt-10">
                  <div className="text-5xl font-mono text-slate-300 dark:text-slate-700">\( ﾟヮﾟ)/</div>
                  <h2 className="text-xl font-medium text-slate-700 dark:text-slate-300">¡Hola! Soy tu Asistente Universitario</h2>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-full text-sm font-bold ${m.role === "user" ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xl"}`}>
                    {m.role === "user" ? "U" : "🎓"}
                  </div>
                  <div className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"} max-w-[80%]`}>
                    <div className={`px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${m.role === "user" ? "bg-emerald-600 text-white rounded-2xl rounded-tr-sm" : "bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-sm"}`}>
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-4 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md">
            <div className="max-w-3xl mx-auto relative">
              <input
                className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-full pl-5 pr-14 py-3.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="Escribe tu consulta... ( ･_･)ﾉ"
              />
              <button onClick={sendMessage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-full transition-all shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" /></svg>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}