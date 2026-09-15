import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { toolDefinitions } from "@/lib/tools/definitions";
import { executeTool } from "@/lib/tools/execute";
import { getMessages, saveMessage } from "@/lib/services/conversations";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function buildSystemPrompt(): string {
  const today = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `Eres un asistente universitario que ayuda a estudiantes con sus materias, tareas, documentos y dudas académicas. Responde siempre en español, de forma clara y concisa.

La fecha de hoy es: ${today}. Úsala como referencia para interpretar fechas relativas como "mañana", "el viernes", "este año", etc.

Tienes herramientas para consultar y modificar materias y tareas, y para buscar en los documentos del estudiante. Úsalas cuando la pregunta lo requiera en vez de inventar información. Si vas a crear o eliminar algo, hazlo directamente sin pedir confirmación extra, salvo que la instrucción sea ambigua.

Cuando el estudiante te pida crear, modificar o eliminar algo (una tarea, por ejemplo), SIEMPRE debes llamar a la herramienta correspondiente en el mismo turno — nunca respondas solo con texto sugiriendo que lo haga el estudiante manualmente.

Cuando uses información de search_documents, cita la fuente al final entre paréntesis, ej: (Fuente: Integrales.pdf, página 12).`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    const userId = session.user.id;

    const { conversationId, message }: { conversationId: string; message: string } =
      await req.json();

    await saveMessage(conversationId, "user", message);

    const history = await getMessages(conversationId);
    const conversation: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: buildSystemPrompt() },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const MAX_TOOL_ROUNDS = 5;
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: conversation,
        tools: toolDefinitions,
      });

      const choice = completion.choices[0];
      const toolCalls = choice.message.tool_calls;

      if (!toolCalls || toolCalls.length === 0) {
        const reply = choice.message.content ?? "";
        await saveMessage(conversationId, "assistant", reply);
        return NextResponse.json({ reply });
      }

      conversation.push(choice.message);

      for (const call of toolCalls) {
        if (call.type !== "function") continue;
        const args = JSON.parse(call.function.arguments || "{}");
        const result = await executeTool(userId, call.function.name, args);
        conversation.push({ role: "tool", tool_call_id: call.id, content: result });
      }
    }

    return NextResponse.json({ reply: "No pude completar la solicitud después de varios intentos." });
  } catch (error) {
    console.error("Error en /api/chat:", error);
    return NextResponse.json(
      { error: "Hubo un problema al generar la respuesta." },
      { status: 500 }
    );
  }
}