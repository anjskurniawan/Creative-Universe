"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Container from "@/components/layout/Container/Container";
import { useAuth } from "@/hooks/auth";
import { Toast } from "@/components/feedback/Toast/Toast";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const { hasPermission } = useAuth();
  const pathname = usePathname();
  const [toast, setToast] = useState<{ status: "success" | "error"; message: string } | null>(null);

  // Listen to custom toast events globally under the panel shell
  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<{ status: "success" | "error"; message: string }>;
      if (customEvent.detail) {
        setToast(customEvent.detail);
      }
    };
    window.addEventListener("show-toast", handleToast);
    return () => window.removeEventListener("show-toast", handleToast);
  }, []);

  // Auto-clear global toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Dynamically configure sidebar items based on user permissions under /panel/
  const menuItems = [
    { label: "Dashboard", href: "/panel/detail", icon: "dashboard" },
    ...(hasPermission("manage-users") ? [{ label: "Pengguna", href: "/panel/users", icon: "group" }] : []),
    ...(hasPermission("manage-roles") ? [{ label: "Role", href: "/panel/roles", icon: "admin_panel_settings" }] : []),
    ...(hasPermission("run-artisan") ? [{ label: "Maintenance", href: "/panel/maintenance", icon: "build" }] : []),
    { label: "Profil", href: "/panel/profile", icon: "person" },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)]">
      <Container
        viewport="Desktop"
        contentProps={{
          className: "flex h-full w-full flex-col overflow-hidden rounded-none bg-[#f3fbff] text-cu-ink shadow-[0px_14px_42px_0px_rgba(44,42,39,0.16)] lg:rounded-[16px]",
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

      {/* Global Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          status={toast.status}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
