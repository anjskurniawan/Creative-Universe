import { ApiError, ValidationError } from "@/core/api/client";

export function errorMessage(error: unknown): string {
  if (error instanceof ValidationError) {
    return Object.values(error.errors).flat()[0] || error.message;
  }

  return error instanceof ApiError
    ? error.message
    : "Terjadi kesalahan. Silakan coba lagi.";
}
