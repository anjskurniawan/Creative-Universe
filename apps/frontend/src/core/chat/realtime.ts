import type { ChatMessage } from "@/core/chat/types";
import { getEchoClient } from "@/core/realtime";

export function subscribeToConversationMessages(
  conversationIds: Array<number | string>,
  onMessage: (conversationId: number, message: ChatMessage) => void,
): () => void {
  const ids = Array.from(new Set(
    conversationIds.map(Number).filter((id) => Number.isInteger(id) && id > 0),
  ));
  const echo = getEchoClient();

  if (!echo || ids.length === 0) return () => undefined;

  ids.forEach((conversationId) => {
    echo.private(`conversation.${conversationId}`).listen(
      ".message.sent",
      (event: { message: ChatMessage }) => {
        onMessage(Number(event.message.conversation_id ?? conversationId), event.message);
      },
    );
  });

  return () => {
    ids.forEach((conversationId) => {
      const channelName = `conversation.${conversationId}`;
      echo.private(channelName).stopListening(".message.sent");
      echo.leave(channelName);
    });
  };
}
