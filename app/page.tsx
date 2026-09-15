import { auth, signIn } from "@/lib/auth";
import { getOrCreateConversation, getMessages } from "@/lib/services/conversations";
import ChatClient from "./chat-client";

export default async function Home() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        <div className="bg-white dark:bg-slate-950 p-8 rounded-2xl shadow-xl flex flex-col items-center gap-6 max-w-sm w-full border border-slate-200 dark:border-slate-800">
          <div className="text-5xl">🎓</div>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">UniChat</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Inicia sesión para continuar</p>
          </div>
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
            className="w-full"
          >
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl font-medium transition-colors shadow-sm">
              Iniciar sesión con Google
            </button>
          </form>
        </div>
      </div>
    );
  }

  const conversation = await getOrCreateConversation(session.user.id);
  const messages = await getMessages(conversation.id);

  return (
    <ChatClient
      conversationId={conversation.id}
      initialMessages={messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }))}
    />
  );
}