"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import { Header } from "./Header";
import { Menu } from "./Menu";
import { Project } from "./Project";
import { Chat } from "./Chat";
import { Footer } from "./Footer";
import { projectItems, historyItems } from "./SideNav.config";
import type { SideNavProps } from "./SideNav.types";

export function SideNav({ sidebarExpanded, setSidebarExpanded }: SideNavProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop overlay khusus mobile saat sidebar expanded */}
      <div
        onClick={() => setSidebarExpanded(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          sidebarExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Sidenav Container (Fixed on mobile, Relative on desktop) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-white/10 bg-black backdrop-blur-xl transition-all duration-300 md:static md:z-auto ${
          sidebarExpanded
            ? "w-64 translate-x-0"
            : "-translate-x-full md:translate-x-0 md:w-[68px]"
        }`}
      >
        {/* Header Branding & Collapse Control */}
        <Header
          isExpanded={sidebarExpanded}
          onCollapse={() => setSidebarExpanded(false)}
        />

        {/* Main Content Area dengan Menu, Project, dan Chat */}
        <div
          className={`flex flex-1 flex-col overflow-y-auto overflow-x-hidden p-3 ${
            sidebarExpanded ? "gap-4" : "gap-1 items-center"
          }`}
        >
          {/* Menu Navigasi Utama */}
          <Menu
            isExpanded={sidebarExpanded}
            setSidebarExpanded={setSidebarExpanded}
          />

          {/* Seksi Proyek Saya */}
          <Project
            items={projectItems}
            isExpanded={sidebarExpanded}
            activeHref={pathname}
          />

          {/* Seksi Riwayat Percakapan */}
          <Chat
            items={historyItems}
            isExpanded={sidebarExpanded}
            activeHref={pathname}
          />
        </div>

        {/* Footer Profile & Expand Button */}
        <Footer
          isExpanded={sidebarExpanded}
          user={user}
          onExpand={() => setSidebarExpanded(true)}
        />
      </aside>
    </>
  );
}
