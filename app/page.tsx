"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Estado para el modo oscuro (inicia en true)
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
      setMessages([
        ...newMessages,
        { role: "assistant", content: "( >_< ) Hubo un error al conectar con la base de datos." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    // El contenedor padre aplica la clase "dark" si el estado es true
    <div className={isDarkMode ? "dark" : ""}>
      
      {/* Contenedor principal de la app */}
      <div className="flex h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans overflow-hidden transition-colors duration-300">
        
        {/* ================= BARRA LATERAL (SIDEBAR) ================= */}
        <aside className="w-72 bg-slate-50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col transition-colors duration-300">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="text-2xl">🎓</span>
              <span>UniChat</span>
            </div>
            
            {/* Botón de tema para Escritorio */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              title="Cambiar tema"
            >
              {/* Verificar cambio entre claro y oscuro */}
              {/*isDarkMode ? "☀️" : "🌙"*/}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 ml-1">
              Consultas frecuentes
            </p>
            <div className="space-y-1">
              {["Fechas de inscripción", "Requisitos para titulación", "Mapa curricular de Ingeniería"].map((text) => (
                <button 
                  key={text}
                  onClick={() => setInput(text)} 
                  className="w-full text-left px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors truncate"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 text-center space-y-2">
            <p>Sistema Académico v0.1</p>
            <p className="font-mono">( •_•)&gt;⌐■-■</p>
          </div>
        </aside>

        {/* ================= ÁREA PRINCIPAL DEL CHAT ================= */}
        <main className="flex-1 flex flex-col h-full relative">
          
          {/* Header móvil */}
          <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center">
              <span className="text-xl mr-2">🎓</span>
              <h1 className="font-bold">UniChat</h1>
            </div>
            {/* Botón de tema para Móvil */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </header>

          {/* Zona de mensajes */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="max-w-3xl mx-auto space-y-8">
              
              {/* Estado Vacío */}
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-slate-500 dark:text-slate-400 space-y-4 mt-10">
                  <div className="text-5xl font-mono text-slate-300 dark:text-slate-700">\( ﾟヮﾟ)/</div>
                  <h2 className="text-xl font-medium text-slate-700 dark:text-slate-300">¡Hola! Soy tu Asistente</h2>
                  <p className="text-center text-sm max-w-md">
                    Pregúntame sobre horarios, calificaciones, mapas curriculares o trámites administrativos.
                  </p>
                </div>
              )}

              {/* Mensajes */}
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  
                  {/* Avatares */}
                  <div className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-full text-sm font-bold ${
                    m.role === "user" 
                      ? "bg-indigo-600 text-white" 
                      : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xl"
                  }`}>
                    {m.role === "user" ? "U" : "🎓"}
                  </div>

                  {/* Burbuja */}
                  <div className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"} max-w-[80%]`}>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mb-1 mx-1 font-medium">
                      {m.role === "user" ? "Tú" : "Asistente"}
                    </div>
                    <div className={`px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${
                      m.role === "user" 
                        ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm" 
                        : "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-sm"
                    }`}>
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}

              {/* Animación Pensando */}
              {loading && (
                 <div className="flex gap-4 flex-row">
                  <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xl">
                    🎓
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="text-xs text-slate-400 dark:text-slate-500 mb-1 mx-1 font-medium">Asistente</div>
                    <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* ================= CAJA DE TEXTO (INPUT) ================= */}
          <div className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
            <div className="max-w-3xl mx-auto relative">
              <input
                className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 rounded-full pl-5 pr-14 py-3.5 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Escribe tu consulta... ( ･_･)ﾉ"
                disabled={loading}
                autoComplete="off"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-full transition-all disabled:opacity-50 disabled:scale-95 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
                  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
              </button>
            </div>
            <div className="text-center mt-3 text-xs text-slate-400 dark:text-slate-500 font-medium">
              El asistente académico puede cometer errores. Verifica con Control Escolar.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}