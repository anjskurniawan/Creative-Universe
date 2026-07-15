import { ApiError, ValidationError } from "@/core/api/client";
import type { AccessibleApplication } from "@/core/applications";
import type { PermissionCatalogItem } from "@/core/permissions";

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ManagedUser {
  id: number;
  name: string;
  username: string;
  email: string;
  whatsapp_number: string | null;
  avatar_url: string | null;
  created_at: string | null;
  roles: string[];
  permissions: string[];
  all_permissions: string[];
  applications: AccessibleApplication[];
}

export interface UserManagementOptions {
  roles: string[];
  permissions: string[];
  all_permissions: string[];
  manager_whitelist: string[];
  is_root: boolean;
  permission_aliases: Record<string, string>;
  applications: Array<Pick<AccessibleApplication, "key" | "display_name" | "status" | "frontend_path">>;
}

export interface ManagedSession {
  id: string;
  ip_address: string | null;
  user_agent: string | null;
  last_activity: string;
}

export interface ManagedActivity {
  id: number;
  log_name: string | null;
  description: string;
  event: string | null;
  created_at: string | null;
}

export interface ManagedUserDetail {
  user: ManagedUser;
  sessions: ManagedSession[];
  activities: ManagedActivity[];
  can_view_audit: boolean;
}

export interface ManagedRole {
  id: number;
  name: string;
  guard_name: string;
  protected: boolean;
  users_count: number;
  active_users_count: number;
  permissions: string[];
}

export type ManagedPermission = PermissionCatalogItem;

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
