export interface SettingsNavItem {
  label: string;
  icon?: string;
  permission?: string;
  href: string;
  mobileHref?: string;
  isChild?: boolean;
}

export interface SettingsNavCollapsible {
  label: string;
  icon?: string;
  permission?: string;
  children: SettingsNavItem[];
}

export interface SettingsNavGroup {
  title: string;
  items: (SettingsNavItem | SettingsNavCollapsible)[];
}

export function isCollapsible(item: SettingsNavItem | SettingsNavCollapsible): item is SettingsNavCollapsible {
  return "children" in item;
}

export const NAV_GROUPS: SettingsNavGroup[] = [
  { title: "Pengaturan Akun", items: [
    { href: "/settings/profile", mobileHref: "/settings/profile", label: "Profil & Tampilan", icon: "person" },
    { href: "/settings/profile?tab=notifications", mobileHref: "/settings/profile?tab=notifications", label: "Notifikasi", icon: "notifications" },
    { href: "/settings/profile?tab=privacy", mobileHref: "/settings/profile?tab=privacy", label: "Privasi Profil", icon: "visibility" },
    { href: "/settings/profile?tab=applications", mobileHref: "/settings/profile?tab=applications", label: "Aplikasi Saya", icon: "apps" },
  ] },
  { title: "Keamanan & Akses", items: [{ href: "/settings/profile?tab=security", mobileHref: "/settings/security", label: "Perangkat & Sesi", icon: "devices" }] },
  { title: "Hak Akses", items: [{ href: "/settings/profile?tab=role_settings", mobileHref: "/settings/role-settings", label: "Pengaturan Peran", icon: "admin_panel_settings", permission: "manage-settings" }] },
  { title: "Log Audit", items: [{ href: "/settings/profile?tab=activity_log", mobileHref: "/settings/activity-log", label: "Jejak Aktivitas", icon: "history" }] },
  { title: "Administrasi", items: [{ href: "/roles", mobileHref: "/settings/roles", label: "Kelola Role", icon: "shield_person", permission: "manage-roles" }] },
];

export function hrefMatches(href: string, pathname: string | null, searchParams: URLSearchParams | null): boolean {
  const [hrefPath, hrefQuery] = href.split("?");
  const pathMatch = pathname === hrefPath || (pathname?.startsWith(hrefPath + "/") ?? false);
  if (!pathMatch) return false;
  if (hrefQuery) return new URLSearchParams(hrefQuery).get("tab") === (searchParams?.get("tab") ?? null);
  if (hrefPath === "/settings/profile") return !searchParams?.get("tab");
  return true;
}

export function getActiveSettingsLabel(pathname: string | null, searchParams: URLSearchParams | null): string {
  return NAV_GROUPS.flatMap((group) => group.items.flatMap((item) => (isCollapsible(item) ? item.children : [item])))
    .find((item) => hrefMatches(item.href, pathname, searchParams) || item.mobileHref === pathname)?.label ?? "Pengaturan";
}
