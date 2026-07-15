import { getCookie, refreshCsrfCookie, resolveApiUrl } from "@/core/api/client";

export interface UploadProgressOptions<T> {
  path: string;
  file: File;
  fieldName?: string;
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
  mapResponse: (payload: unknown) => T;
}

/** Cookie-authenticated multipart upload with progress, shared by every domain. */
export async function uploadFileWithProgress<T>(
  options: UploadProgressOptions<T>,
  retryAfterCsrf = true,
): Promise<T> {
  try {
    return await executeUpload(options);
  } catch (error) {
    if (retryAfterCsrf && error instanceof UploadHttpError && error.status === 419) {
      await refreshCsrfCookie();
      return uploadFileWithProgress(options, false);
    }
    throw error;
  }
}

class UploadHttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

function executeUpload<T>(options: UploadProgressOptions<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append(options.fieldName ?? "file", options.file);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) options.onProgress?.(Math.round((event.loaded * 100) / event.total));
    });
    xhr.addEventListener("load", () => {
      let payload: unknown = null;
      try { payload = JSON.parse(xhr.responseText); } catch { /* non-JSON failure */ }
      if (xhr.status >= 200 && xhr.status < 300) {
        try { resolve(options.mapResponse(payload)); } catch (error) { reject(error); }
        return;
      }
      const message = typeof payload === "object" && payload && "message" in payload
        ? String((payload as { message: unknown }).message)
        : `Upload gagal (${xhr.status}).`;
      reject(new UploadHttpError(xhr.status, message));
    });
    xhr.addEventListener("error", () => reject(new Error("Terjadi kesalahan jaringan saat mengunggah file.")));
    xhr.addEventListener("abort", () => reject(new DOMException("Upload dibatalkan.", "AbortError")));

    options.signal?.addEventListener("abort", () => xhr.abort(), { once: true });
    xhr.open("POST", resolveApiUrl(options.path));
    xhr.withCredentials = true;
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    const csrfToken = getCookie("XSRF-TOKEN");
    if (csrfToken) xhr.setRequestHeader("X-XSRF-TOKEN", csrfToken);
    xhr.send(formData);
  });
}
