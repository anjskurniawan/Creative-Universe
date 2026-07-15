"use client";

import { useAuth } from "@/providers/auth-provider";
import {
  APP_ROUTES,
  isGuestPath,
  isPublicPath,
  normalizePathname,
} from "@/core/navigation/routes";
import { resolveAuthenticatedRoute } from "@/core/auth";
import { applicationForPath } from "@/core/applications";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UniversalErrorView } from "@/design-system/templates/feedback/universal-error-view";
import { EMERGENCY_MAINTENANCE_EVENT } from "@/core/api/client";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const [emergencyForced, setEmergencyForced] = useState(false);
  const { user, isLoading, isAuthenticated, hasApplication } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = normalizePathname(pathname);

  useEffect(() => {
    const activateEmergencyView = () => setEmergencyForced(true);
    window.addEventListener(EMERGENCY_MAINTENANCE_EVENT, activateEmergencyView);
    return () => window.removeEventListener(EMERGENCY_MAINTENANCE_EVENT, activateEmergencyView);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const currentIsGuestPath = isGuestPath(currentPath);
    const currentIsPublicPath = isPublicPath(currentPath);

    if (isAuthenticated && user) {
      const requiredApplication = applicationForPath(currentPath);
      if (!hasApplication(requiredApplication)) {
        router.replace(`${APP_ROUTES.forbidden}?application=${encodeURIComponent(requiredApplication)}`);
        return;
      }
      // User is logged in
      const onboardingMismatch =
        (!user?.is_onboarded && currentPath !== APP_ROUTES.onboarding) ||
        (Boolean(user?.is_onboarded) && currentPath === APP_ROUTES.onboarding);
      if (currentIsGuestPath || onboardingMismatch) {
        // Skip redirect if universe transition is running
        if (typeof document !== "undefined" && document.body.classList.contains("transitioning-universe")) {
          return;
        }

        const requestedRedirect = currentIsGuestPath
          ? new URLSearchParams(window.location.search).get("redirect")
          : null;
        const targetPath = resolveAuthenticatedRoute(user, requestedRedirect);
        router.replace(targetPath);
      }
    } else {
      // User is not logged in
      if (!currentIsPublicPath) {
        router.replace(`${APP_ROUTES.login}?redirect=${encodeURIComponent(currentPath)}`);
      }
    }
  }, [user, isLoading, isAuthenticated, currentPath, router, hasApplication]);

  if (isLoading) {
    return null;
  }

  const isRoot = user?.roles.some((role) => role.toLowerCase() === "root") ?? false;
  if (isAuthenticated && (user?.emergency_maintenance || emergencyForced) && !isRoot) {
    return <UniversalErrorView showHomeAction={false} onRetry={() => window.location.reload()} />;
  }

  const currentIsGuestPath = isGuestPath(currentPath);
  const currentIsPublicPath = isPublicPath(currentPath);

  // Prevent flashing of children components before redirect executes
  if (isAuthenticated && user) {
    if (!hasApplication(applicationForPath(currentPath))) return null;
    const onboardingMismatch =
      (!user?.is_onboarded && currentPath !== APP_ROUTES.onboarding) ||
      (Boolean(user?.is_onboarded) && currentPath === APP_ROUTES.onboarding);
    if (currentIsGuestPath || onboardingMismatch) {
      // Keep rendering if transition is active
      if (typeof document !== "undefined" && document.body.classList.contains("transitioning-universe")) {
        return <>{children}</>;
      }
      return null;
    }
  } else {
    if (!currentIsPublicPath) {
      return null;
    }
  }

  return <>{children}</>;
}
