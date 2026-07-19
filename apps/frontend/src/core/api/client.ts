import { APP_ROUTES } from "@/core/navigation/routes";

const configuredApiHost = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "") || "";

export const API_HOST = configuredApiHost;
export const API_BASE_URL = `${API_HOST}/api/v1`;
export const AUTH_SESSION_EXPIRED_EVENT = "creative-universe:auth-session-expired";
export const EMERGENCY_MAINTENANCE_EVENT = "creative-universe:emergency-maintenance";

type UnknownRecord = Record<string, unknown>;
type ResponseType = "auto" | "json" | "text" | "blob" | "response";

export interface ApiPage<T> {
  data: T[];
  meta: Record<string, unknown>;
}

export interface ApiRequestOptions extends RequestInit {
  timeoutMs?: number;
  retry?: number;
  responseType?: ResponseType;
  skipAuthRedirect?: boolean;
  csrfRoute?: boolean;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export class ValidationError extends ApiError {
  errors: Record<string, string[]>;
  details: unknown;

  constructor(errors: Record<string, string[]>, status = 422, details: unknown = null) {
    super("Validasi gagal", status, details ?? { errors });
    this.name = "ValidationError";
    this.errors = errors;
    this.details = details;
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Akses ditolak", status = 403, data: unknown = null) {
    super(message, status, data);
    this.name = "ForbiddenError";
  }
}

export class RequestTimeoutError extends ApiError {
  constructor(timeoutMs: number) {
    super(`Permintaan melebihi batas waktu ${timeoutMs} ms.`, 0);
    this.name = "RequestTimeoutError";
  }
}

export class RequestAbortedError extends ApiError {
  constructor() {
    super("Permintaan dibatalkan.", 0);
    this.name = "RequestAbortedError";
  }
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function resolveApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export function resolveBackendUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^(https?:)?\/\//i.test(path) || path.startsWith("blob:") || path.startsWith("data:")) {
    return path;
  }
  return `${API_HOST}${path.startsWith("/") ? path : `/${path}`}`;
}

export function resolveStorageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^(https?:)?\/\//i.test(path) || path.startsWith("blob:") || path.startsWith("data:")) {
    return path;
  }
  return resolveBackendUrl(path.startsWith("/storage/") ? path : `/storage/${path.replace(/^\/+/, "")}`);
}

export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const encodedName = encodeURIComponent(name);
  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${encodedName}=`));
  return cookie ? decodeURIComponent(cookie.slice(encodedName.length + 1)) : undefined;
}

let csrfRefreshPromise: Promise<void> | null = null;

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    timeoutMs = 30_000,
    retry = 0,
    responseType = "auto",
    skipAuthRedirect = false,
    csrfRoute = false,
    ...requestOptions
  } = options;
  const method = (requestOptions.method || "GET").toUpperCase();
  const isSafeMethod = method === "GET" || method === "HEAD";
  const url = csrfRoute ? `${API_HOST}${path}` : resolveApiUrl(path);
  const headers = new Headers(requestOptions.headers || {});
  const isFormData = typeof FormData !== "undefined" && requestOptions.body instanceof FormData;

  if (requestOptions.body != null && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  if (!isSafeMethod && !csrfRoute) {
    if (!getCookie("XSRF-TOKEN")) await refreshCsrfCookie();
    applyCsrfHeaders(headers);
  }

  const fetchOptions: RequestInit = {
    ...requestOptions,
    method,
    headers,
    credentials: "include",
  };

  let csrfRetried = false;
  let attempt = 0;

  while (true) {
    const { signal, cleanup, didTimeout } = createRequestSignal(requestOptions.signal, timeoutMs);
    try {
      const response = await fetch(url, { ...fetchOptions, signal });

      if (response.status === 419 && !csrfRoute && !csrfRetried) {
        csrfRetried = true;
        clearClientCsrfCookie();
        await refreshCsrfCookie();
        applyCsrfHeaders(headers);
        continue;
      }

      if (isSafeMethod && attempt < retry && isRetryableStatus(response.status)) {
        attempt += 1;
        await delay(retryDelay(attempt), requestOptions.signal);
        continue;
      }

      return await handleResponse<T>(response, {
        responseType,
        skipAuthRedirect,
        isCanonicalSessionRequest: path === "/auth/me",
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (didTimeout()) throw new RequestTimeoutError(timeoutMs);
      if (requestOptions.signal?.aborted) throw new RequestAbortedError();
      if (isSafeMethod && attempt < retry) {
        attempt += 1;
        await delay(retryDelay(attempt), requestOptions.signal);
        continue;
      }
      throw new ApiError(
        error instanceof Error ? error.message : "Terjadi kesalahan jaringan.",
        0
      );
    } finally {
      cleanup();
    }
  }
}

export function apiBlob(path: string, options: ApiRequestOptions = {}): Promise<Blob> {
  return apiFetch<Blob>(path, { ...options, responseType: "blob" });
}

async function handleResponse<T>(
  response: Response,
  options: { responseType: ResponseType; skipAuthRedirect: boolean; isCanonicalSessionRequest: boolean }
): Promise<T> {
  if (options.responseType === "response") return response as T;

  const payload = await parseResponse(response, options.responseType);
  if (response.ok) {
    if (isRecord(payload) && "success" in payload && "data" in payload) {
      return ("meta" in payload ? { data: payload.data, meta: payload.meta } : payload.data) as T;
    }
    return payload as T;
  }

  const message = isRecord(payload) && typeof payload.message === "string"
    ? payload.message
    : "Terjadi kesalahan sistem.";

  if (response.status === 401) {
    // A single feature request can return 401 while the browser session is
    // still valid (for example during a reload or a transient proxy failure).
    // Only force a full-page logout after the canonical session endpoint also
    // confirms that the cookie session is no longer authenticated.
    // `skipAuthRedirect` means this request must not navigate to login by
    // itself. It does not mean its 401 is proof that the browser session has
    // expired (message, notification, and login requests use this option).
    const sessionExpired = options.isCanonicalSessionRequest
      || (!options.skipAuthRedirect && await isSessionExpired());
    if (sessionExpired) redirectToLogin(options.skipAuthRedirect);
    throw new ApiError("Sesi Anda telah berakhir. Silakan login kembali.", 401, payload);
  }
  if (response.status === 403) throw new ForbiddenError(message, 403, payload);
  if (response.status === 422) {
    const errors = isRecord(payload) && isRecord(payload.errors)
      ? normalizeValidationErrors(payload.errors)
      : {};
    throw new ValidationError(errors, 422, payload);
  }
  if (response.status === 503 && isRecord(payload) && payload.code === "EMERGENCY_MAINTENANCE") {
    if (typeof window !== "undefined") window.dispatchEvent(new Event(EMERGENCY_MAINTENANCE_EVENT));
    throw new ApiError(message, 503, payload);
  }
  throw new ApiError(message, response.status, payload);
}

async function parseResponse(response: Response, responseType: ResponseType): Promise<unknown> {
  if (response.status === 204 || response.status === 205) return null;
  if (responseType === "blob") return response.blob();
  if (responseType === "text") return response.text();

  const contentType = response.headers.get("content-type") || "";
  if (responseType === "json" || contentType.includes("application/json")) {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }
  return response.text();
}

function normalizeValidationErrors(errors: UnknownRecord): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [
      field,
      Array.isArray(messages)
        ? messages.filter((message): message is string => typeof message === "string")
        : [String(messages)],
    ])
  );
}

export function refreshCsrfCookie(): Promise<void> {
  if (!csrfRefreshPromise) {
    csrfRefreshPromise = apiFetch<unknown>("/sanctum/csrf-cookie", {
      method: "GET",
      csrfRoute: true,
      skipAuthRedirect: true,
      timeoutMs: 15_000,
    })
      .then(() => undefined)
      .finally(() => {
        csrfRefreshPromise = null;
      });
  }
  return csrfRefreshPromise;
}

function applyCsrfHeaders(headers: Headers): void {
  const token = getCookie("XSRF-TOKEN");
  if (token) headers.set("X-XSRF-TOKEN", token);
  headers.set("X-Requested-With", "XMLHttpRequest");
}

function clearClientCsrfCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = "XSRF-TOKEN=; Max-Age=0; path=/";
}

function redirectToLogin(skip: boolean): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
  if (skip || window.location.pathname.startsWith(APP_ROUTES.login)) return;
  const currentPath = window.location.pathname + window.location.search;
  window.location.href = `${APP_ROUTES.login}?redirect=${encodeURIComponent(currentPath)}`;
}

async function isSessionExpired(): Promise<boolean> {
  try {
    const response = await fetch(resolveApiUrl("/auth/me"), {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    return response.status === 401;
  } catch {
    // A network or proxy failure must not log a user out locally.
    return false;
  }
}

function createRequestSignal(parentSignal: AbortSignal | null | undefined, timeoutMs: number) {
  const controller = new AbortController();
  let timedOut = false;
  const abortFromParent = () => controller.abort(parentSignal?.reason);
  if (parentSignal?.aborted) abortFromParent();
  else parentSignal?.addEventListener("abort", abortFromParent, { once: true });

  const timer = timeoutMs > 0
    ? globalThis.setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, timeoutMs)
    : undefined;

  return {
    signal: controller.signal,
    didTimeout: () => timedOut,
    cleanup: () => {
      if (timer !== undefined) globalThis.clearTimeout(timer);
      parentSignal?.removeEventListener("abort", abortFromParent);
    },
  };
}

function isRetryableStatus(status: number): boolean {
  return [408, 425, 429, 502, 503, 504].includes(status);
}

function retryDelay(attempt: number): number {
  return Math.min(250 * 2 ** (attempt - 1), 2_000);
}

function delay(milliseconds: number, signal?: AbortSignal | null): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new RequestAbortedError());
      return;
    }
    const handleAbort = () => {
      globalThis.clearTimeout(timer);
      reject(new RequestAbortedError());
    };
    const timer = globalThis.setTimeout(() => {
      signal?.removeEventListener("abort", handleAbort);
      resolve();
    }, milliseconds);
    signal?.addEventListener("abort", handleAbort, { once: true });
  });
}
