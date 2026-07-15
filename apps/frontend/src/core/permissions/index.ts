export * from "./types";

export function hasPermissionKey(permissions: string[], permission: string): boolean {
  return permissions.includes(permission);
}
