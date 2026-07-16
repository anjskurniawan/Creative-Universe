"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Navbar } from "@/components/navbar";

const CORE_CONTENT_GUTTER = "px-4 md:px-16";

export function CoreShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMessagesPage = pathname.startsWith("/messages");
  const isSettingsPage = pathname.startsWith("/settings");
  const isUsersPage = pathname.startsWith("/users");

  const mainClass = isMessagesPage
    ? `w-full ${CORE_CONTENT_GUTTER} py-4 h-[calc(100vh-72px)] overflow-hidden relative z-10 flex flex-col`
    : isSettingsPage
      ? `${CORE_CONTENT_GUTTER} pt-4 pb-6 md:pt-6`
      : isUsersPage
        ? `min-w-0 ${CORE_CONTENT_GUTTER} py-6`
        : `${CORE_CONTENT_GUTTER} py-6`;

  return (
    <div className={`${isMessagesPage ? "h-screen overflow-hidden" : "min-h-screen"} flex flex-col bg-white font-sans text-cu-ink antialiased`}>
      <Navbar />
      <main className={`flex flex-1 flex-col ${mainClass}`}>{children}</main>
    </div>
  );
}
