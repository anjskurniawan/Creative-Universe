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
  const isPricetag = pathname?.startsWith("/pricetag");

  return (
    <div
      className={`min-h-screen antialiased font-sans flex flex-col transition-colors duration-300 ${
        isPricetag ? "bg-[#0a0a0a]" : "bg-white text-cu-ink"
      }`}
    >
      {/* Horizontal Sticky Navbar */}
      <Navbar variant={isPricetag ? "dark-glass" : "solid"} />

      {/* Main Page Content */}
      <main
        className={`flex-1 flex flex-col ${
          isPricetag
            ? "w-full mx-auto py-8 px-4 relative z-10"
            : "mx-6 md:mx-32 xl:mx-64 my-6 p-6 rounded-2xl bg-cu-surface border border-cu-line"
        }`}
      >
        {children}
      </main>
    </div>
  );
}

