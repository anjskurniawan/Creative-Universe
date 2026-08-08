"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/providers/auth-provider";
import GlobalLayoutNavbar from "@/components/layout/navbar";
import Container from "@/components/layout/container";

const CORE_CONTENT_GUTTER = "px-4 md:px-16";

export function CoreShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { hasPermission } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const isMessagesPage = pathname.startsWith("/messages");
  const isSettingsPage = pathname.startsWith("/settings");

  if (isMessagesPage) {
    return <>{children}</>;
  }

  if (pathname.startsWith("/notifications")) {
    return <>{children}</>;
  }

  if (isSettingsPage) {
    return <>{children}</>;
  }
  
  if (pathname.startsWith("/panel")) {
    return <>{children}</>;
  }

  const isCoreContainerPage =
    pathname.startsWith("/users") ||
    pathname.startsWith("/roles") ||
    pathname.startsWith("/maintenance") ||
    pathname.startsWith("/profile");

  const mainClass = isSettingsPage
      ? `${CORE_CONTENT_GUTTER} pt-4 pb-6 md:pt-6`
      : `${CORE_CONTENT_GUTTER} py-6`;

  // Dynamically configure sidebar items based on user permissions
  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
    ...(hasPermission("manage-users") ? [{ label: "Pengguna", href: "/users", icon: "group" }] : []),
    ...(hasPermission("manage-roles") ? [{ label: "Role", href: "/roles", icon: "admin_panel_settings" }] : []),
    ...(hasPermission("run-artisan") ? [{ label: "Maintenance", href: "/maintenance", icon: "build" }] : []),
    { label: "Profil", href: "/profile", icon: "person" },
  ];

  return (
    isCoreContainerPage ? (
      <div className="h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)]">
        <Container
          viewport="Desktop"
          contentProps={{
            className: "flex h-full w-full flex-col overflow-hidden rounded-[16px] bg-[#f3fbff] text-cu-ink shadow-[0px_14px_42px_0px_rgba(44,42,39,0.16)]",
            sidebarExpanded,
            onToggleSidebarExpanded: () => setSidebarExpanded((current) => !current),
            contentProps: { className: "flex h-full min-h-0 w-full flex-1 flex-col items-start overflow-y-auto p-4 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden" },
          }}
          menuTitle="Core"
          activeMenuHref={pathname}
          menuItems={menuItems}
        >
          {children}
        </Container>
      </div>
    ) : (
    <div className="min-h-screen flex flex-col bg-white font-sans text-cu-ink antialiased">
      <GlobalLayoutNavbar viewport="Desktop" sticky={false} />
      <main className={`flex flex-1 flex-col ${mainClass}`}>{children}</main>
    </div>
    )
  );
}
