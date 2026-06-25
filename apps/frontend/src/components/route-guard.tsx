"use client";

import { useAuth } from "@/providers/auth-provider";
import {
  isGuestPath,
  isPublicPath,
  normalizePathname,
  safeInternalRedirect,
} from "@/lib/routes";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = normalizePathname(pathname);

  useEffect(() => {
    if (isLoading) return;

    const currentIsGuestPath = isGuestPath(currentPath);
    const currentIsPublicPath = isPublicPath(currentPath);

    if (isAuthenticated) {
      // User is logged in
      if (currentIsGuestPath) {
        let targetPath = "/";
        const configuredTarget = typeof user?.settings?.redirect_to === "string"
          ? safeInternalRedirect(user.settings.redirect_to)
          : null;

        if (
          configuredTarget &&
          !isGuestPath(configuredTarget)
        ) {
          targetPath = configuredTarget;
        } else if (
          user?.roles.includes("Root") || 
          user?.roles.includes("root")
        ) {
          targetPath = "/dashboard";
        }
        router.replace(targetPath);
      }
    } else {
      // User is not logged in
      if (!currentIsPublicPath) {
        router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
      }
    }
  }, [user, isLoading, isAuthenticated, currentPath, router]);

  if (isLoading) {
    return null;
  }

  const currentIsGuestPath = isGuestPath(currentPath);
  const currentIsPublicPath = isPublicPath(currentPath);

  // Prevent flashing of children components before redirect executes
  if (isAuthenticated) {
    if (currentIsGuestPath) {
      return null;
    }
  } else {
    if (!currentIsPublicPath) {
      return null;
    }
  }

  return <>{children}</>;
}
