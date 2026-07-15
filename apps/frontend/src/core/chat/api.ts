import { apiFetch, type ApiRequestOptions } from "@/core/api/client";
import type {
  ChatContact,
  ChatConversation,
  ChatMessage,
  SendChatMessageInput,
} from "@/core/chat/types";

export const chatApi = {
  contacts: (options?: ApiRequestOptions) =>
    apiFetch<ChatContact[]>("/chat/contacts", options),
  conversations: (options?: ApiRequestOptions) =>
    apiFetch<ChatConversation[]>("/chat/conversations", options),
  messages: (conversationId: number | string, options?: ApiRequestOptions) =>
    apiFetch<ChatMessage[]>(`/chat/conversations/${conversationId}/messages`, options),
  send: (input: SendChatMessageInput) =>
    apiFetch<ChatMessage>("/chat/messages", {
      method: "POST",
      body: JSON.stringify(input),
    }),
} as const;
