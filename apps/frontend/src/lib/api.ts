const configuredApiHost = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "";
const API_HOST = configuredApiHost;
const API_BASE = `${API_HOST}/api/v1`;

type UnknownRecord = Record<string, unknown>;

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
  constructor(message = "Akses ditolak", status = 403) {
    super(message, status);
    this.name = "ForbiddenError";
  }
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()?.split(";").shift() || "");
  }
  return undefined;
}

interface CustomRequestInit extends RequestInit {
  _isCsrfRoute?: boolean;
  _skipAuthRedirect?: boolean;
}

let csrfRefreshPromise: Promise<void> | null = null;

export async function apiFetch<T = unknown>(
  path: string,
  options: CustomRequestInit = {}
): Promise<T> {
  const {
    _isCsrfRoute: isCsrfRoute = false,
    _skipAuthRedirect: skipAuthRedirect = false,
    ...requestOptions
  } = options;
  const url = isCsrfRoute ? `${API_HOST}${path}` : `${API_BASE}${path}`;
  const headers = new Headers(requestOptions.headers || {});

  const isFormData =
    typeof FormData !== "undefined" && requestOptions.body instanceof FormData;
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const method = (requestOptions.method || "GET").toUpperCase();
  const isMutatingRequest = method !== "GET" && method !== "HEAD";
  if (isMutatingRequest && !isCsrfRoute) {
    // Refresh first so a stale XSRF-TOKEN after an env/key change is not reused.
    await refreshCsrfCookie();

    const csrfToken = getCookie("XSRF-TOKEN");
    if (csrfToken) {
      headers.set("X-XSRF-TOKEN", csrfToken);
    }
    headers.set("X-Requested-With", "XMLHttpRequest");
  }

  const fetchOptions: RequestInit = {
    ...requestOptions,
    headers,
    credentials: "include",
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (response.status === 419 && !isCsrfRoute) {
      clearClientCsrfCookie();
      await refreshCsrfCookie();

      const retryHeaders = new Headers(fetchOptions.headers);
      const newCsrf = getCookie("XSRF-TOKEN");
      if (newCsrf) {
        retryHeaders.set("X-XSRF-TOKEN", newCsrf);
      }

      const retryResponse = await fetch(url, {
        ...fetchOptions,
        headers: retryHeaders,
      });

      return handleResponse<T>(retryResponse, skipAuthRedirect);
    }

    return handleResponse<T>(response, skipAuthRedirect);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Terjadi kesalahan jaringan.",
      0
    );
  }
}

async function handleResponse<T>(
  response: Response,
  skipAuthRedirect: boolean
): Promise<T> {
  const contentType = response.headers.get("content-type");
  const payload: unknown = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (response.ok) {
    if (isRecord(payload) && "success" in payload && "data" in payload) {
      if ("meta" in payload) {
        return { data: payload.data, meta: payload.meta } as T;
      }
      return payload.data as T;
    }
    return payload as T;
  }

  const message =
    isRecord(payload) && typeof payload.message === "string"
      ? payload.message
      : "Terjadi kesalahan sistem.";

  if (response.status === 401) {
    if (
      !skipAuthRedirect &&
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/login")
    ) {
      window.location.href = `/login?redirect=${encodeURIComponent(
        window.location.pathname + window.location.search
      )}`;
    }
    throw new ApiError("Sesi Anda telah berakhir. Silakan login kembali.", 401, payload);
  }

  if (response.status === 403) {
    throw new ForbiddenError(message);
  }

  if (response.status === 422) {
    const errors =
      isRecord(payload) && isRecord(payload.errors)
        ? normalizeValidationErrors(payload.errors)
        : {};
    throw new ValidationError(errors, 422, payload);
  }

  throw new ApiError(message, response.status, payload);
}

function normalizeValidationErrors(
  errors: UnknownRecord
): Record<string, string[]> {
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
    clearClientCsrfCookie();
    csrfRefreshPromise = apiFetch<unknown>("/sanctum/csrf-cookie", {
      method: "GET",
      _isCsrfRoute: true,
      _skipAuthRedirect: true,
    })
      .then(() => undefined)
      .finally(() => {
        csrfRefreshPromise = null;
      });
  }

  return csrfRefreshPromise;
}

function clearClientCsrfCookie(): void {
  if (typeof document === "undefined") return;

  const hostname = window.location.hostname;
  const cookieNames = [
    "XSRF-TOKEN",
    "creativeuniverse_session",
    "creativeuniverse_20260711_session",
  ];
  const domains = ["", hostname];

  if (hostname.includes(".")) {
    domains.push(`.${hostname}`);
  }

  cookieNames.forEach((name) => {
    domains.forEach((domain) => {
      const domainPart = domain ? `; domain=${domain}` : "";
      document.cookie = `${name}=; Max-Age=0; path=/${domainPart}`;
    });
  });
}
