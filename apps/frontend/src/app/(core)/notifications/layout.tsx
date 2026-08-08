"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Container from "@/components/layout/container";
import { useAuth } from "@/providers/auth-provider";

export default function NotificationsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { hasPermission } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
    ...(hasPermission("manage-users") ? [{ label: "Pengguna", href: "/users", icon: "group" }] : []),
    ...(hasPermission("manage-roles") ? [{ label: "Role", href: "/roles", icon: "admin_panel_settings" }] : []),
    ...(hasPermission("run-artisan") ? [{ label: "Maintenance", href: "/maintenance", icon: "build" }] : []),
    { label: "Profil", href: "/profile", icon: "person" },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)]">
      <Container
        viewport="Desktop"
        menuTitle="Core"
        activeMenuHref={pathname}
        menuItems={menuItems}
        contentProps={{
          className: "flex h-full w-full flex-col overflow-hidden rounded-[16px] bg-[#f3fbff] text-cu-ink shadow-[0px_14px_42px_0px_rgba(44,42,39,0.16)]",
          sidebarExpanded,
          onToggleSidebarExpanded: () => setSidebarExpanded((current) => !current),
          contentProps: { className: "flex h-full min-h-0 w-full flex-1 flex-col items-start overflow-y-auto p-4" },
        }}
      >
        {children}
      </Container>
    </div>
  );
}
