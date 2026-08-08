"use client";

import type { ReactNode } from "react";
import Container from "@/components/layout/container";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)]">
      <Container
        viewport="Desktop"
        menuTitle="Pengaturan"
        contentProps={{
          className: "flex h-full w-full flex-col overflow-hidden rounded-[16px] bg-[#f3fbff] text-cu-ink shadow-[0px_14px_42px_0px_rgba(44,42,39,0.16)]",
          hideSidebar: true,
          contentProps: { className: "flex h-full min-h-0 w-full flex-1 flex-col items-start overflow-y-auto p-4" },
        }}
      >
        {children}
      </Container>
    </div>
  );
}
