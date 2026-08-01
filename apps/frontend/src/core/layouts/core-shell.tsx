"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Navbar } from "@/components/archive/old-navbar";
import Container from "@/components/layout/container";

const CORE_CONTENT_GUTTER = "px-4 md:px-16";

export function CoreShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMessagesPage = pathname.startsWith("/messages");
  const isSettingsPage = pathname.startsWith("/settings");
  const isUsersPage = pathname.startsWith("/users");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const mainClass = isMessagesPage
    ? `w-full ${CORE_CONTENT_GUTTER} py-4 h-[calc(100vh-72px)] overflow-hidden relative z-10 flex flex-col`
    : isSettingsPage
      ? `${CORE_CONTENT_GUTTER} pt-4 pb-6 md:pt-6`
      : isUsersPage
        ? `min-w-0 ${CORE_CONTENT_GUTTER} py-6`
        : `${CORE_CONTENT_GUTTER} py-6`;

  return (
    isUsersPage ? (
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
          activeMenuHref="/users"
          menuItems={[
            { label: "Pengguna", href: "/users", icon: "group" },
          ]}
        >
          {children}
        </Container>
      </div>
    ) : (
    <div className={`${isMessagesPage ? "h-screen overflow-hidden" : "min-h-screen"} flex flex-col bg-white font-sans text-cu-ink antialiased`}>
      <Navbar />
      <main className={`flex flex-1 flex-col ${mainClass}`}>{children}</main>
    </div>
    )
  );
}
