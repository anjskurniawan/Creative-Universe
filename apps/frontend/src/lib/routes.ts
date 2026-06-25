export const GUEST_PATHS = ["/login", "/forgot-password"] as const;
export const PUBLIC_PATHS = ["/", ...GUEST_PATHS] as const;

export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") return "/";

  const normalized = pathname.replace(/\/+$/, "");
  return normalized || "/";
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
