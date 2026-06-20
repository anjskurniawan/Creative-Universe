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

  return (
    <div
      className={`min-h-screen antialiased font-sans flex flex-col transition-colors duration-300 ${
        isDarkPage ? "bg-[#0a0a0a]" : "bg-white text-cu-ink"
      }`}
    >
      {/* Horizontal Sticky Navbar */}
      <Navbar variant={isDarkPage ? "dark" : "light"} />

      {/* Main Page Content */}
      <main
        className={`flex-1 flex flex-col ${
          isFullWidthPage
            ? "w-full mx-auto pt-0 pb-8 px-4 relative z-10"
            : "mx-6 md:mx-32 xl:mx-64 mt-2 mb-6 pt-0 px-6 pb-6 rounded-2xl bg-cu-surface"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
