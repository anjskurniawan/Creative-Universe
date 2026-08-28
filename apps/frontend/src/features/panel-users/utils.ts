import { ApiError, ValidationError } from "@/core/api/client";

export function errorMessage(error: unknown): string {
  if (error instanceof ValidationError) {
    return Object.values(error.errors).flat()[0] || error.message;
  }

  return error instanceof ApiError
    ? error.message
    : "Terjadi kesalahan. Silakan coba lagi.";
}

export function formatDate(value: string | null, includeTime = false): string {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(value));
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}
