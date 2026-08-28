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
    { href: "/settings/account/profile", mobileHref: "/settings/account/profile", label: "Profil", icon: "person" },
    { href: "/settings/account/appearance", mobileHref: "/settings/account/appearance", label: "Tampilan", icon: "palette" },
    { href: "/settings/account/notifications", mobileHref: "/settings/account/notifications", label: "Notifikasi", icon: "notifications" },
    { href: "/settings/account/privacy", mobileHref: "/settings/account/privacy", label: "Privasi Profil", icon: "visibility" },
    { href: "/settings/account/applications", mobileHref: "/settings/account/applications", label: "Aplikasi Saya", icon: "apps" },
  ] },
  { title: "Security", items: [
    { href: "/settings/security/authentication", mobileHref: "/settings/security/authentication", label: "Authentication", icon: "lock" },
    { href: "/settings/security/session", mobileHref: "/settings/security/session", label: "Session", icon: "devices" },
    { href: "/settings/security/activity-log", mobileHref: "/settings/security/activity-log", label: "Log Aktivitas", icon: "history" },
  ] },
  { title: "Administrasi", items: [
    { href: "/settings/administration/system-configuration", mobileHref: "/settings/administration/system-configuration", label: "Konfigurasi Sistem", icon: "settings" },
    { href: "/settings/administration/workflow", mobileHref: "/settings/administration/workflow", label: "Alur Kerja", icon: "account_tree" },
    { href: "/settings/administration/generator-preferences", mobileHref: "/settings/administration/generator-preferences", label: "Preferensi Generator", icon: "auto_awesome" },
    { href: "/settings/administration/access-control", mobileHref: "/settings/administration/access-control", label: "Hak Akses", icon: "shield_person", permission: "manage-settings" },
  ] },
];

export function hrefMatches(href: string, pathname: string | null, searchParams: URLSearchParams | null): boolean {
  const [hrefPath, hrefQuery] = href.split("?");
  const normalizedPathname = (pathname ?? "").replace(/\/$/, "") || "/";
  const pathMatch = hrefPath === "/settings/account/profile"
    ? normalizedPathname === hrefPath
    : normalizedPathname === hrefPath || normalizedPathname.startsWith(hrefPath + "/");
  if (!pathMatch) return false;
  if (hrefQuery) return new URLSearchParams(hrefQuery).get("tab") === (searchParams?.get("tab") ?? null);
  if (hrefPath === "/settings/account/profile") return !searchParams?.get("tab");
  return true;
}

export function getActiveSettingsLabel(pathname: string | null, searchParams: URLSearchParams | null): string {
  return NAV_GROUPS.flatMap((group) => group.items.flatMap((item) => (isCollapsible(item) ? item.children : [item])))
    .find((item) => hrefMatches(item.href, pathname, searchParams) || item.mobileHref === pathname)?.label ?? "Pengaturan";
}
