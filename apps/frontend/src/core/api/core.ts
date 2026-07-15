import { authApi } from "@/core/auth/api";
import { apiFetch, type ApiRequestOptions } from "./client";

const json = (method: string, body?: unknown): ApiRequestOptions => ({
  method,
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});

export const coreApi = {
  auth: authApi,
  dashboard: <T>() => apiFetch<T>("/dashboard"),
  settings: {
    get: <T>(keys?: string[]) => apiFetch<T>(`/settings${keys?.length ? `?keys=${keys.join(",")}` : ""}`),
    update: <T>(body: unknown) => apiFetch<T>("/settings", json("POST", body)),
  },
  users: {
    list: <T>(query = "") => apiFetch<T>(`/users${query}`),
    options: <T>() => apiFetch<T>("/users/options"),
    detail: <T>(id: number | string) => apiFetch<T>(`/users/${id}`),
    update: <T>(id: number | string, body: unknown) => apiFetch<T>(`/users/${id}`, json("PATCH", body)),
    revokeSession: (id: number | string, session: string) => apiFetch<null>(`/users/${id}/sessions/${session}`, json("DELETE")),
    managerWhitelist: {
      update: <T>(permissions: string[]) => apiFetch<T>("/users/whitelist-manager-permissions", json("POST", { permissions })),
    },
  },
  roles: {
    list: <T>() => apiFetch<T>("/roles"),
    create: <T>(body: unknown) => apiFetch<T>("/roles", json("POST", body)),
    update: <T>(id: number | string, body: unknown) => apiFetch<T>(`/roles/${id}`, json("PATCH", body)),
    remove: (id: number | string) => apiFetch<null>(`/roles/${id}`, json("DELETE")),
    permissions: <T>() => apiFetch<T>("/permissions"),
    permissionCatalog: <T>() => apiFetch<T>("/permission-catalog"),
  },
  request: apiFetch,
} as const;
