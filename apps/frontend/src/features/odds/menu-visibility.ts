import type { User } from "@/providers/auth-provider";

const CONTROL_ROLES = new Set(["admin", "administrator", "root", "manajer", "manager", "spv"]);

export function shouldHideOddsCancelSkipMenus(user: User | null): boolean {
  return user?.roles.some((role) => CONTROL_ROLES.has(role.trim().toLowerCase())) ?? false;
}
