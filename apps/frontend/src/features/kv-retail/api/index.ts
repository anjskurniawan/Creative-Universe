import { apiFetch, type ApiRequestOptions } from "@/core/api/client";
import type { KvRetailTask, KvRetailTemporaryUpload } from "../types";

const PREFIX = "/kv-retail";
export const KV_RETAIL_API_PATHS = { temporaryUploads: `${PREFIX}/uploads` } as const;

export const kvRetailApi = {
  tasks: {
    list: (query = "", options?: ApiRequestOptions) =>
      apiFetch<KvRetailTask[]>(`${PREFIX}/tasks${query}`, options),
    latestPerformanceAiReport: () =>
      apiFetch<{ content: string; generated_at: string } | null>(`${PREFIX}/performance/creative-agent`),
    create: (body: FormData | Record<string, unknown>) => apiFetch<KvRetailTask>(`${PREFIX}/tasks`, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
    updateTitle: (taskId: number | string, taskName: string) =>
      apiFetch<KvRetailTask>(`${PREFIX}/tasks/${taskId}/title`, {
        method: "PATCH",
        body: JSON.stringify({ task_name: taskName }),
      }),
    updateStatus: (taskId: number | string, body: unknown) =>
      apiFetch<KvRetailTask>(`${PREFIX}/tasks/${taskId}/status`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    uploadFile: (taskId: number | string, body: FormData) =>
      apiFetch<KvRetailTask>(`${PREFIX}/tasks/${taskId}/files`, { method: "POST", body }),
    remove: (taskId: number | string) =>
      apiFetch<null>(`${PREFIX}/tasks/${taskId}`, { method: "DELETE" }),
  },
  assignees: <T>() => apiFetch<T>(`${PREFIX}/assignees`),
  temporaryUpload: (body: FormData, options?: ApiRequestOptions) =>
    apiFetch<KvRetailTemporaryUpload>(`${PREFIX}/uploads`, { ...options, method: "POST", body }),
} as const;

export type { KvRetailTask, KvRetailTaskEvent, KvRetailTemporaryUpload } from "../types";
