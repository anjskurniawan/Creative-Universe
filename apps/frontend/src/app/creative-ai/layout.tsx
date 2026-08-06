"use client";

import { useState, type ReactNode } from "react";
import Container from "@/components/layout/container";

export default function CreativeAiLayout({ children }: { children: ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_8%_6%,rgba(255,107,0,0.85)_0,transparent_50%),radial-gradient(circle_at_95%_90%,rgba(255,140,0,0.8)_0,transparent_55%),linear-gradient(135deg,#0c0a09_0%,#020202_60%,#000000_100%)]">
      <Container
        viewport="Desktop"
        contentProps={{
          className: "w-full h-full flex flex-col overflow-hidden rounded-[16px] bg-[#0c0a09]/90 text-white shadow-[0px_14px_42px_0px_rgba(0,0,0,0.5)] border border-white/5",
          sidebarExpanded,
          onToggleSidebarExpanded: () => setSidebarExpanded((current) => !current),
          sidebarTheme: "dark",
        }}
        menuTitle="Creative AI"
      >
        {children}
      </Container>
    </div>
  );
}
