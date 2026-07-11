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

  const apiHost = process.env.NEXT_PUBLIC_API_URL || "";
  const csrfToken = getCookie("XSRF-TOKEN");
  echoClient = new Echo<"pusher">({
    broadcaster: "pusher",
    key,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap1",
    forceTLS: true,
    authEndpoint: `${apiHost}/broadcasting/auth/`,
    auth: {
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        ...(csrfToken ? { "X-XSRF-TOKEN": csrfToken } : {}),
      },
    },
    authorizer: (channel: any) => ({
      authorize: (socketId: string, callback: any) => {
        const token = getCookie("XSRF-TOKEN");
        fetch(`${apiHost}/broadcasting/auth/`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
            ...(token ? { "X-XSRF-TOKEN": token } : {}),
          },
          body: JSON.stringify({
            socket_id: socketId,
            channel_name: channel.name,
          }),
        })
          .then((res) => res.json())
          .then((data) => callback(null, data))
          .catch((err) => callback(err, null));
      },
    }),
  });

  return echoClient;
}
