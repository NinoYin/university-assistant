//lib/services/conversations.ts
import { prisma } from "@/lib/prisma";

export async function getOrCreateConversation(userId: string) {
  let conversation = await prisma.conversation.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({ data: { userId } });
  }

  return conversation;
}

export async function getMessages(conversationId: string) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
}

export async function saveMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string
) {
  return prisma.message.create({ data: { conversationId, role, content } });
}