import { apiFetch, type ApiRequestOptions } from "@/core/api/client";

export interface CreativeAiReply {
  content: string;
}

export const creativeAiApi = {
  chat: (payload: unknown, options?: ApiRequestOptions) =>
    apiFetch<CreativeAiReply>("/cai/chat", {
      ...options,
      method: "POST",
      body: JSON.stringify(payload),
    }),
} as const;
