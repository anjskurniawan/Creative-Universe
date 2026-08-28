"use client";

import { useState, type ReactNode } from "react";
import { SideNav } from "../Creative/SideNav";
import { MobileNav } from "../Creative/MobileNav";
import { ChatBox } from "../Creative/ChatBox";

interface CreativeLayoutProps {
  children: ReactNode;
}

export function CreativeLayout({ children }: CreativeLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    // Root container layar penuh sub-app Creative AI
    <div className="cu-style flex h-screen w-screen overflow-hidden bg-[#050505] flex-col md:flex-row">
      {/* Mobile Floating/Top Header Component */}
      <MobileNav onOpenSidebar={() => setSidebarExpanded(true)} />

      {/* Area Navigasi Sidebar */}
      <SideNav
        sidebarExpanded={sidebarExpanded}
        setSidebarExpanded={setSidebarExpanded}
      />

      {/* Area Konten Utama */}
      <main className="relative flex h-full flex-1 min-w-0 flex-col justify-between overflow-hidden bg-[#050505]">
        {/* Konten Halaman / Percakapan */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {children}
        </div>

        {/* Input ChatBox di bagian bawah main */}
        <div className="w-full flex justify-center p-4 md:p-6 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent">
          <ChatBox onSubmit={(msg) => console.log("Submitted:", msg)} />
        </div>
      </main>
    </div>
  );
}

export default CreativeLayout;
