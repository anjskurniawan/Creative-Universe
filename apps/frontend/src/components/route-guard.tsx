"use client";

import { useAuth } from "@/providers/auth-provider";
import {
  isGuestPath,
  isPublicPath,
  normalizePathname,
  pathnameFromTarget,
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
      if (!user?.is_active) {
        // Logged in but pending admin approval
        if (currentPath !== "/pending") {
          router.replace("/pending");
        }
      } else {
        // Logged in and active
        if (currentIsGuestPath || currentPath === "/pending") {
          let targetPath = "/";
          const configuredTarget = typeof user?.settings?.redirect_to === "string"
            ? safeInternalRedirect(user.settings.redirect_to)
            : null;

          if (
            configuredTarget &&
            !isGuestPath(configuredTarget) &&
            pathnameFromTarget(configuredTarget) !== "/pending"
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
      }
    } else {
      // User is not logged in
      if (!currentIsPublicPath && currentPath !== "/pending") {
        router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
      }
    }
  }, [user, isLoading, isAuthenticated, currentPath, router]);

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        backgroundColor: "hsl(var(--background))" 
      }}>
        <div className="spinner" style={{ 
          color: "hsl(var(--primary))", 
          width: "2.5rem", 
          height: "2.5rem", 
          borderWidth: "3px" 
        }}></div>
        <p style={{ marginTop: "1rem", color: "hsl(var(--muted-foreground))", fontWeight: 500, fontSize: "0.9rem" }}>
          Memuat sesi...
        </p>
      </div>
    );
  }

  const currentIsGuestPath = isGuestPath(currentPath);
  const currentIsPublicPath = isPublicPath(currentPath);

  // Prevent flashing of children components before redirect executes
  if (isAuthenticated) {
    if (!user?.is_active && currentPath !== "/pending") {
      return null;
    }
    if (user?.is_active && (currentIsGuestPath || currentPath === "/pending")) {
      return null;
    }
  } else {
    if (!currentIsPublicPath && currentPath !== "/pending") {
      return null;
    }
  }

  return <>{children}</>;
}
