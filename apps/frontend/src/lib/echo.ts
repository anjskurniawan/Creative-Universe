import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

let echoClient: Echo<"pusher"> | null = null;

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2
    ? decodeURIComponent(parts.pop()?.split(";").shift() || "")
    : undefined;
}

export function getEchoClient(): Echo<"pusher"> | null {
  if (typeof window === "undefined") return null;
  if (echoClient) return echoClient;

  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  if (!key) return null;

  window.Pusher = Pusher;

  const csrfToken = getCookie("XSRF-TOKEN");
  echoClient = new Echo<"pusher">({
    broadcaster: "pusher",
    key,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap1",
    forceTLS: true,
    authEndpoint: "/broadcasting/auth",
    auth: {
      headers: csrfToken ? { "X-XSRF-TOKEN": csrfToken } : {},
    },
  });

  return echoClient;
}
