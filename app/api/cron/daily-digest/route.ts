// app/api/cron/daily-digest/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  // Protegemos la ruta: solo Vercel Cron (con este header) o alguien con el secreto puede llamarla
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const in3Days = new Date();
  in3Days.setDate(in3Days.getDate() + 3);

  const users = await prisma.user.findMany({
    include: {
      subjects: {
        include: {
          tasks: {
            where: {
              completed: false,
              dueDate: { lte: in3Days },
            },
            orderBy: { dueDate: "asc" },
          },
        },
      },
    },
  });

  let sentCount = 0;

  for (const user of users) {
    const pendingTasks = user.subjects.flatMap((s) =>
      s.tasks.map((t) => ({ ...t, subjectName: s.name }))
    );

    if (pendingTasks.length === 0 || !user.email) continue;

    const taskListHtml = pendingTasks
      .map((t) => {
        const isOverdue = new Date(t.dueDate) < new Date();
        const emoji = isOverdue ? "🔴" : "🟡";
        return `<li>${emoji} <strong>${t.title}</strong> — ${t.subjectName} (${new Date(
          t.dueDate
        ).toLocaleDateString("es-MX")})</li>`;
      })
      .join("");

    try {
      await resend.emails.send({
        from: "Asistente Universitario <onboarding@resend.dev>",
        to: user.email,
        subject: "🎓 Tu resumen de tareas de hoy",
        html: `<h2>Buenos días${user.name ? `, ${user.name}` : ""}</h2>
               <p>Tienes ${pendingTasks.length} tarea(s) pendiente(s) próximas a vencer:</p>
               <ul>${taskListHtml}</ul>`,
      });
      sentCount++;
    } catch (err) {
      console.error(`Error enviando correo a ${user.email}:`, err);
    }
  }

  return NextResponse.json({ success: true, sentCount });
}