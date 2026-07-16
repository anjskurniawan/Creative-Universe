import { apiFetch, type ApiRequestOptions } from "@/core/api/client";
import type {
  ChatContact,
  ChatConversation,
  ChatMessage,
  SendChatMessageInput,
  ChatAttachment,
} from "@/core/chat/types";
import type { ApiPage } from "@/core/api/client";

export const chatApi = {
  contacts: (options?: ApiRequestOptions) =>
    apiFetch<ChatContact[]>("/chat/contacts", options),
  conversations: (options?: ApiRequestOptions) =>
    apiFetch<ChatConversation[]>("/chat/conversations", options),
  messages: (conversationId: number | string, page = 1, options?: ApiRequestOptions) =>
    apiFetch<ApiPage<ChatMessage>>(`/chat/conversations/${conversationId}/messages?page=${page}`, options),
  uploadAttachment: (file: File) => {
    const body = new FormData();
    body.append("file", file);
    return apiFetch<ChatAttachment>("/chat/attachments", { method: "POST", body });
  },
  send: (input: SendChatMessageInput) =>
    apiFetch<ChatMessage>("/chat/messages", {
      method: "POST",
      body: JSON.stringify(input),
    }),
} as const;
