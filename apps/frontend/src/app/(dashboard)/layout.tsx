"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isFullWidthPage =
    pathname?.startsWith("/pricetag") ||
    pathname?.startsWith("/odds") ||
    pathname?.startsWith("/ai-agent") ||
    pathname?.startsWith("/assets-design");

  const isDarkPage = pathname?.startsWith("/pricetag");

  // Halaman pengaturan: mobile pakai px-6 (sejajar navbar), desktop tetap card
  const isSettingsPage =
    pathname?.startsWith("/settings") ||
    pathname?.startsWith("/profile");
  const isUsersPage = pathname?.startsWith("/users");

  const isAIAgentPage = pathname?.startsWith("/ai-agent");
  const isMessagesPage = pathname?.startsWith("/messages");

  // Track if AI Agent page is in dark mode
  const [isAiAgentDark, setIsAiAgentDark] = React.useState(() => {
    if (typeof window !== "undefined") {
      return document.body.classList.contains("ai-agent-dark-active");
    }
    return false;
  });

  React.useEffect(() => {
    if (!isAIAgentPage) return;

    // Observe body class changes
    const observer = new MutationObserver(() => {
      setIsAiAgentDark(document.body.classList.contains("ai-agent-dark-active"));
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, [isAIAgentPage]);

  const mainClass = (() => {
    if (isAIAgentPage) {
      return "w-full flex-1 flex flex-col relative z-10 pt-0 pb-0 px-0";
    }
    if (isMessagesPage) {
      return "w-full mx-auto px-6 md:px-16 py-4 h-[calc(100vh-72px)] overflow-hidden relative z-10 flex flex-col";
    }
    if (isFullWidthPage) {
      return `w-full mx-auto ${isDarkPage ? "pt-16" : "pt-0"} pb-8 px-6 md:px-16 relative z-10`;
    }
    if (isSettingsPage) {
      // Mobile: full-width dengan px-6 (sejajar navbar), dengan jarak dari navbar.
      // Desktop (md+): card dengan margin dan rounding
      return "px-6 pt-4 md:px-0 md:mx-32 xl:mx-64 md:mt-2 md:mb-6 md:pb-6 md:rounded-2xl md:bg-cu-surface md:pt-0 md:px-6";
    }
    if (isUsersPage) {
      return "w-full px-0 md:mx-32 xl:mx-64 md:mt-2 md:mb-6 md:px-6 md:pb-6 md:rounded-2xl md:bg-cu-surface";
    }
    return "mx-6 md:mx-32 xl:mx-64 mt-2 mb-6 pt-0 px-6 pb-6 rounded-2xl bg-cu-surface";
  })();

  return (
    <div
      className={`${
        isMessagesPage ? "h-screen overflow-hidden" : "min-h-screen"
      } antialiased font-sans flex flex-col transition-colors duration-300 ${
        isDarkPage ? "bg-[#0a0a0a]" : "bg-white text-cu-ink"
      }`}
    >
      {/* Navbar mengikuti dua tema UI utama: light dan dark. */}
      {isAIAgentPage ? (
        <div className="absolute top-0 left-0 w-full z-[100]">
          <Navbar variant={isAiAgentDark ? "dark" : "light"} sticky={false} />
        </div>
      ) : (
        <Navbar variant={isDarkPage ? "dark" : "light"} sticky={!isDarkPage} />
      )}

      {/* Main Page Content */}
      <main className={`flex-1 flex flex-col ${mainClass}`}>
        {children}
      </main>
    </div>
  );
}
