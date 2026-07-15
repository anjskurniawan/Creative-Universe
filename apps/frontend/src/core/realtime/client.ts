import Echo from "laravel-echo";
import Pusher from "pusher-js";
import type { AuthorizerCallback } from "pusher-js";

import { API_HOST, getCookie } from "@/core/api/client";

declare global {
  interface Window { Pusher: typeof Pusher }
}

let echoClient: Echo<"pusher"> | null = null;

export function getEchoClient(): Echo<"pusher"> | null {
  if (typeof window === "undefined") return null;
  if (echoClient) return echoClient;

  const key = process.env.NEXT_PUBLIC_PUSHER_KEY?.trim();
  if (!key) {
    if (process.env.NODE_ENV === "development") console.info("Realtime dinonaktifkan: NEXT_PUBLIC_PUSHER_KEY belum diatur.");
    return null;
  }

  window.Pusher = Pusher;
  const authEndpoint = `${API_HOST}/broadcasting/auth`;

  echoClient = new Echo<"pusher">({
    broadcaster: "pusher",
    key,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER?.trim() || "ap1",
    forceTLS: true,
    authorizer: (channel: { name: string }) => ({
      authorize: (socketId: string, callback: AuthorizerCallback) => {
        void (async () => {
          try {
          const csrfToken = getCookie("XSRF-TOKEN");
          const response = await fetch(authEndpoint, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json", Accept: "application/json",
              "X-Requested-With": "XMLHttpRequest",
              ...(csrfToken ? { "X-XSRF-TOKEN": csrfToken } : {}),
            },
            body: JSON.stringify({ socket_id: socketId, channel_name: channel.name }),
          });
          const payload = await response.json().catch(() => null);
          if (!response.ok) throw new Error(`Otorisasi realtime gagal (${response.status}).`);
            callback(null, payload as Parameters<AuthorizerCallback>[1]);
          } catch (error) {
            callback(error instanceof Error ? error : new Error("Otorisasi realtime gagal."), null);
          }
        })();
      },
    }),
  });

  return echoClient;
}

export function disconnectEchoClient(): void {
  echoClient?.disconnect();
  echoClient = null;
}
