# 🎓 Asistente Universitario

Sistema de asistente académico con IA que permite a un estudiante consultar sus materias, tareas y documentos mediante lenguaje natural, con soporte de RAG (búsqueda semántica sobre apuntes propios) y un agente capaz de ejecutar acciones reales sobre la base de datos (crear, consultar, editar y eliminar materias y tareas) mediante tool calling.

> Proyecto de portafolio — desarrollado como forma de aplicar en un sistema real los temas vistos en las materias de Inteligencia Artificial y Sistemas de Información de la Licenciatura en Ingeniería en Sistemas Computacionales (Universidad de Guanajuato).

## 🔗 Demo en vivo

**[university-assistant-theta.vercel.app](https://university-assistant-theta.vercel.app)** — desplegado en Vercel, inicio de sesión con Google.

## ✨ Características

- **Chat conversacional** con historial persistente por usuario.
- **Autenticación** con Google (Auth.js).
- **Gestión completa de materias y tareas** (crear, consultar, editar, eliminar), tanto desde la interfaz como por lenguaje natural en el chat — el agente tiene acceso al mismo CRUD completo.
- **Subida de documentos** (PDF, DOCX, TXT) con extracción automática de texto, agrupados por materia, con vista/descarga desde un enlace firmado temporal.
- **RAG (Retrieval-Augmented Generation)**: los documentos se dividen en fragmentos, se generan embeddings, y el asistente responde citando la fuente exacta (archivo y página).
- **Tool calling / agente**: el modelo decide cuándo consultar materias, gestionar tareas o buscar en documentos, en vez de solo generar texto.
- **Resumen diario automático** por correo con las tareas próximas a vencer (Vercel Cron + Resend).
- **Modo claro/oscuro** persistente, y **navegación adaptada a móvil**.
- **Validación y manejo de errores** en todos los formularios (Zod + `useActionState`) — sin pantallas de error genéricas ante datos inválidos.

## 🏗️ Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend / Backend | Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 |
| Base de datos | PostgreSQL (Supabase) |
| ORM | Prisma 7 |
| Búsqueda vectorial | pgvector |
| IA | OpenAI API (`gpt-4o-mini` para chat/tools, `text-embedding-3-small` para embeddings) |
| Autenticación | Auth.js (NextAuth v5) con proveedor de Google |
| Almacenamiento de archivos | Supabase Storage |
| Extracción de texto | `pdf-parse`, `mammoth` |
| Validación | Zod |
| Tema claro/oscuro | next-themes |
| Correo | Resend |
| Automatización | Vercel Cron |
| Despliegue | Vercel |

## 🧠 Arquitectura

```
Usuario
  │
  ▼
Next.js (Frontend + API Routes + Server Actions)
  │
  ├──► PostgreSQL + pgvector (Supabase) ──► usuarios, materias, tareas, documentos, chunks+embeddings
  ├──► Supabase Storage ──► archivos originales (PDF/DOCX/TXT)
  └──► OpenAI API ──► chat, embeddings, tool calling
          │
          ▼
   ┌─────────────────────────────────────┐
   │           Tools del agente          │
   ├─────────────────────────────────────┤
   │ get_subjects / create_subject       │
   │ update_subject / delete_subject     │
   │ get_tasks / create_task             │
   │ update_task / toggle_task_completed │
   │ delete_task                         │
   │ search_documents (RAG)              │
   └─────────────────────────────────────┘
```

### Flujo de RAG

```
PDF/DOCX/TXT subido
  → extracción de texto por página
  → división en fragmentos (chunks, ~500 palabras con solapamiento)
  → embeddings (OpenAI, 1536 dimensiones)
  → almacenados en pgvector

Pregunta del usuario
  → embedding de la pregunta
  → búsqueda de similitud coseno (operador <=> de pgvector)
  → top 5 fragmentos más relevantes
  → inyectados como contexto para el LLM
  → respuesta con cita de fuente (archivo + página)
```

### Flujo del agente (tool calling)

```
Mensaje del usuario
  → LLM decide si necesita alguna herramienta
  → si sí: se ejecuta contra la base de datos (con verificación de que el
    recurso pertenece al usuario autenticado) y el resultado regresa al modelo
  → el ciclo se repite hasta 5 veces (límite de seguridad)
  → respuesta final en lenguaje natural
```

### Manejo de errores en formularios

```
Formulario (Client Component)
  → useActionState envía los datos a una Server Action
  → Server Action valida con Zod antes de tocar la base de datos
  → si falla: regresa { error, success: false } — el formulario muestra
    el mensaje inline, sin pantalla de error genérica de Next.js
  → si tiene éxito: { error: null, success: true } — el formulario se
    limpia o cierra su modo de edición automáticamente
```

## 🗄️ Modelo de datos

`User` · `Subject` · `Task` · `Document` · `DocumentChunk` (con `embedding vector(1536)`) · `Conversation` · `Message` · `Account` / `Session` / `VerificationToken` (Auth.js)

## 🔧 Decisiones técnicas y por qué

- **Next.js full-stack en vez de frontend/backend separados**: reduce infraestructura a administrar en las primeras versiones; permite escalar a servicios separados más adelante si fuera necesario.
- **pgvector sobre una base vectorial dedicada (Pinecone, etc.)**: al ya usar PostgreSQL para todo lo demás, evita una pieza de infraestructura adicional — los embeddings viven junto a los datos relacionales que describen.
- **Procesamiento de documentos síncrono (no en cola)**: para el alcance de este proyecto, la espera de unos segundos al subir un documento es aceptable; se documenta como mejora futura (mover a un job en segundo plano) en vez de sobre-construir desde el inicio.
- **Vercel Cron + Resend en vez de Redis/BullMQ para automatizaciones**: dado que el proyecto está desplegado en Vercel (serverless), un worker persistente de BullMQ requeriría un servicio adicional solo para esa función. Vercel Cron logra el mismo resultado sin infraestructura extra.
- **Tool calling con verificación de propiedad en cada acción**: ninguna herramienta confía en los IDs que llegan del modelo sin antes verificar que el recurso pertenezca al usuario autenticado — previene que un estudiante modifique datos de otro.
- **`useActionState` + Zod en vez de `throw` en los Server Actions**: los errores de validación o de negocio se devuelven como datos (`{ error, success }`) en lugar de lanzarse como excepciones, evitando pantallas de error genéricas y permitiendo mostrar el mensaje exacto junto al campo correspondiente.
- **Polyfill manual de `DOMMatrix` para `pdf-parse` en producción**: `pdfjs-dist` (usado internamente por `pdf-parse`) depende opcionalmente de un paquete con binarios nativos (`@napi-rs/canvas`) que no siempre carga en el entorno serverless de Vercel. Como el proyecto solo necesita extracción de texto (no renderizado), se sustituyó por un polyfill ligero en JavaScript puro, eliminando la dependencia de un binario nativo poco confiable en ese entorno.
- **`outputFileTracingIncludes` para el worker de `pdfjs-dist`**: al marcar `pdf-parse`/`pdfjs-dist` como paquetes externos (necesario para evitar un bug de Turbopack en desarrollo), el rastreador de archivos de Vercel dejaba fuera un archivo interno (`pdf.worker.mjs`) que la librería necesita en tiempo de ejecución; se declaró explícitamente para forzar su inclusión en el paquete desplegado.
- **Sanitización del nombre de archivo para las rutas de Supabase Storage**: Supabase Storage no acepta acentos ni ciertos caracteres en las rutas de objetos. Se normaliza el nombre solo para la ruta de almacenamiento, conservando el nombre original (con acentos y espacios) como metadato visible en la interfaz.

## 🚀 Cómo correrlo localmente

### Requisitos

- Node.js 22+
- Cuenta de [Supabase](https://supabase.com) (Postgres + Storage)
- Cuenta de [OpenAI](https://platform.openai.com) con crédito disponible
- Cuenta de [Google Cloud Console](https://console.cloud.google.com) (credenciales OAuth)
- Cuenta de [Resend](https://resend.com) (opcional, solo para el resumen diario)

### Instalación

```bash
git clone https://github.com/<tu-usuario>/asistente-universitario.git
cd asistente-universitario
npm install
```

### Variables de entorno

Crea un archivo `.env` en la raíz con:

```env
DATABASE_URL="postgresql://..."           # connection string de Supabase (pooler)
OPENAI_API_KEY="sk-..."
AUTH_SECRET="..."                          # genera con: npx auth secret
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
NEXT_PUBLIC_SUPABASE_URL="..."
SUPABASE_SERVICE_ROLE_KEY="..."
RESEND_API_KEY="..."
CRON_SECRET="..."                          # cualquier string aleatorio largo
```

### Base de datos

```bash
npx prisma generate
npx prisma migrate dev
```

### Ejecutar

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## 📌 Estado del proyecto

- [x] v0.1 — Chat básico
- [x] v0.2 — Autenticación (Google)
- [x] v0.3 — Materias y tareas
- [x] v0.4 — Subida de documentos
- [x] v0.5 — RAG (ingesta, embeddings, búsqueda semántica)
- [x] v0.6 — Tool calling
- [x] v0.7 — Agente completo (RAG + tools, CRUD completo de materias y tareas)
- [x] v0.8 — Automatización (resumen diario por correo)
- [x] Despliegue en producción (Vercel)
- [x] Navegación móvil
- [x] Validación y manejo de errores en formularios
- [ ] Testing automatizado (Vitest) — *pendiente, no bloqueante*
- [ ] Modo de estudio (quizzes, flashcards, plan de estudio generado) — *posible extensión futura*

## 👤 Autor

Ruben Isaac Barroso Paredes — Lic. Ingeniería en Sistemas Computacionales, División de Ingeniería Campus Irapuato-Salamanca (Antes FIMME), Universidad de Guanajuato
