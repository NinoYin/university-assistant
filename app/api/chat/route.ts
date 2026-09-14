import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { semanticSearch } from "@/lib/rag/search";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { messages }: { messages: ChatMessage[] } = await req.json();
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");

    let context = "";
    if (lastUserMessage) {
      const chunks = await semanticSearch(session.user.id, lastUserMessage.content, 5);
      if (chunks.length > 0) {
        context = chunks
          .map(
            (c, i) =>
              `[Fuente ${i + 1}: ${c.filename}${c.page ? `, página ${c.page}` : ""}]\n${c.content}`
          )
          .join("\n\n");
      }
    }

    const systemPrompt = `Eres un asistente universitario que ayuda a estudiantes con sus materias, tareas y dudas académicas. Responde en español, de forma clara y concisa.

${
  context
    ? `Usa la siguiente información de los documentos del estudiante para responder cuando sea relevante. Si la usas, cita la fuente al final entre paréntesis, ej: (Fuente: Integrales.pdf, página 12). Si la pregunta no se relaciona con estos fragmentos, ignóralos y responde con tu conocimiento general.\n\n${context}`
    : "El estudiante aún no tiene documentos relevantes subidos para esta pregunta. Responde con tu conocimiento general."
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    });

    const reply = completion.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error en /api/chat:", error);
    return NextResponse.json(
      { error: "Hubo un problema al generar la respuesta." },
      { status: 500 }
    );
  }
}