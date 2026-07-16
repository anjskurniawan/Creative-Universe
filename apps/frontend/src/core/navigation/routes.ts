export const APP_ROUTES = {
  home: "/",
  login: "/login",
  forgotPassword: "/forgot-password",
  onboarding: "/onboarding",
  forbidden: "/forbidden",
  dashboard: "/dashboard",
  profile: "/profile",
  settings: "/settings",
  users: "/users",
  roles: "/roles",
  messages: "/messages",
  notifications: "/notifications",
  maintenance: "/maintenance",
  documentation: "/docs",
  kvRetail: "/kv-retail",
  creativeReport: "/creative-report",
  odds: "/odds",
  generator: "/generator",
  generatorPricetag: "/generator/pricetag",
  creativeAi: "/creative-ai",
  designAssets: "/design-assets",
} as const;

export const GUEST_PATHS = [APP_ROUTES.login, APP_ROUTES.forgotPassword] as const;
export const PUBLIC_PATHS = [APP_ROUTES.home, ...GUEST_PATHS] as const;

export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === APP_ROUTES.home) return APP_ROUTES.home;

  const normalized = pathname.replace(/\/+$/, "");
  return normalized || APP_ROUTES.home;
}

export function pathnameFromTarget(value: string): string {
  try {
    return normalizePathname(new URL(value, "http://creativeuniverse.local").pathname);
  } catch {
    return normalizePathname(value);
  }
}

export function isGuestPath(pathname: string): boolean {
  return GUEST_PATHS.includes(
    pathnameFromTarget(pathname) as (typeof GUEST_PATHS)[number]
  );
}

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.includes(
    pathnameFromTarget(pathname) as (typeof PUBLIC_PATHS)[number]
  );
}

export function safeInternalRedirect(value: string | null | undefined): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;

  try {
    const url = new URL(value, "http://creativeuniverse.local");
    const pathname = normalizePathname(url.pathname);
    return `${pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

export const appRoute = {
  creativeReportDetail: (userId: number | string) =>
    `${APP_ROUTES.creativeReport}/detail?user=${encodeURIComponent(String(userId))}`,
  oddsDetail: (taskId: number | string) =>
    `${APP_ROUTES.odds}/detail?id=${encodeURIComponent(String(taskId))}`,
  messagesConversation: (conversationId: number | string) =>
    `${APP_ROUTES.messages}?conversation=${encodeURIComponent(String(conversationId))}`,
  generatorPricetag: {
    catalog: `${APP_ROUTES.generatorPricetag}/catalog`,
    history: `${APP_ROUTES.generatorPricetag}/history`,
    search: `${APP_ROUTES.generatorPricetag}/search`,
  },
} as const;
