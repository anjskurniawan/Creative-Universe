import type { PermissionCatalogItem } from "@/core/permissions";

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
