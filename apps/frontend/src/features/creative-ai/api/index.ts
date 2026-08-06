import { apiFetch, type ApiRequestOptions } from "@/core/api/client";

export interface CreativeAiReply {
  content: string;
  image_url?: string | null;
}

export const creativeAiApi = {
  chat: async (payload: unknown, options?: ApiRequestOptions): Promise<CreativeAiReply> => {
    return apiFetch<CreativeAiReply>("/cai/chat", {
      ...options,
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
} as const;
