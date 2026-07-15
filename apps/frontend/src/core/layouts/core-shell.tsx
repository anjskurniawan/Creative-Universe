"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Navbar } from "@/components/navbar";

export function CoreShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMessagesPage = pathname.startsWith("/messages");
  const isSettingsPage = pathname.startsWith("/settings") || pathname.startsWith("/profile");
  const isUsersPage = pathname.startsWith("/users");

  const mainClass = isMessagesPage
    ? "w-full mx-auto px-6 md:px-16 py-4 h-[calc(100vh-72px)] overflow-hidden relative z-10 flex flex-col"
    : isSettingsPage
      ? "px-6 pt-4 md:px-0 md:mx-32 xl:mx-64 md:mt-2 md:mb-6 md:pb-6 md:rounded-2xl md:bg-cu-surface md:pt-0 md:px-6"
      : isUsersPage
        ? "w-full px-0 md:mx-32 xl:mx-64 md:mt-2 md:mb-6 md:px-6 md:pb-6 md:rounded-2xl md:bg-cu-surface"
        : "mx-6 md:mx-32 xl:mx-64 mt-2 mb-6 pt-0 px-6 pb-6 rounded-2xl bg-cu-surface";

  return (
    <div className={`${isMessagesPage ? "h-screen overflow-hidden" : "min-h-screen"} flex flex-col bg-white font-sans text-cu-ink antialiased`}>
      <Navbar />
      <main className={`flex flex-1 flex-col ${mainClass}`}>{children}</main>
    </div>
  );
}
