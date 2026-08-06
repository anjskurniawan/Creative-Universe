"use client";

import { useState } from "react";
import Container from "@/components/layout/container";

export default function DeveloperLayoutLayout({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)]">
      <Container
        viewport="Desktop"
        contentProps={{
          className: "w-full h-full flex flex-col overflow-hidden rounded-[16px] bg-[#f3fbff] text-cu-ink shadow-[0px_14px_42px_0px_rgba(44,42,39,0.16)]",
          sidebarExpanded,
          onToggleSidebarExpanded: () => setSidebarExpanded((current) => !current),
        }}
        menuTitle="Developer Layout"
      >
        {children}
      </Container>
    </div>
  );
}
