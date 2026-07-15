import { APP_ROUTES, isGuestPath, safeInternalRedirect } from "@/core/navigation/routes";
import type { AuthUser } from "./types";

export function resolveAuthenticatedRoute(
  user: AuthUser,
  requestedRedirect?: string | null
): string {
  if (!user.is_onboarded) return APP_ROUTES.onboarding;

  const requested = safeInternalRedirect(requestedRedirect);
  if (requested && !isGuestPath(requested) && requested !== APP_ROUTES.onboarding) {
    return requested;
  }

  const configured = typeof user.settings?.redirect_to === "string"
    ? safeInternalRedirect(user.settings.redirect_to)
    : null;
  if (configured && !isGuestPath(configured) && configured !== APP_ROUTES.onboarding) {
    return configured;
  }

  return user.roles.some((role) => role.toLowerCase() === "root")
    ? APP_ROUTES.dashboard
    : APP_ROUTES.home;
}
