export const API_BASE_URL = `${(process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "")}/api/v1`;
export const AUTH_SESSION_EXPIRED_EVENT = "creative-universe:auth-session-expired";

export class ApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export class ValidationError extends ApiError {
  constructor(public readonly errors: Record<string, string[]>, data?: unknown) { super("Validasi gagal", 422, data); }
}

let csrfPromise: Promise<void> | null = null;
export function refreshCsrfCookie() {
  if (!csrfPromise) csrfPromise = fetch(`${(process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "")}/sanctum/csrf-cookie`, { credentials: "include" }).then(() => undefined).finally(() => { csrfPromise = null; });
  return csrfPromise;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD") await refreshCsrfCookie();
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  const xsrf = typeof document !== "undefined" ? document.cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith("XSRF-TOKEN="))?.slice(11) : undefined;
  if (xsrf) headers.set("X-XSRF-TOKEN", decodeURIComponent(xsrf));
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetch(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`, {
    ...options,
    headers,
    credentials: "include",
  });
  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
    if (response.status === 422 && payload?.errors && typeof payload.errors === "object") throw new ValidationError(payload.errors, payload);
    const message = typeof payload?.message === "string" ? payload.message : "Permintaan API gagal.";
    throw new ApiError(message, response.status, payload);
  }
  if (payload && typeof payload === "object" && "data" in payload) return payload.data as T;
  return payload as T;
}
