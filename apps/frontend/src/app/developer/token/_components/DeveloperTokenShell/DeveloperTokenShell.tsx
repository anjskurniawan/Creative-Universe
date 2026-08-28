"use client";

import type { ReactNode } from "react";
import Container from "@/components/layout/Container/Container";

export default function DeveloperTokenLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)]">
      <Container
        viewport="Desktop"
        menuTitle="Design Token"
        breadcrumbItems={["Developer", "Token"]}
        contentProps={{
          className: "w-full h-full flex flex-col overflow-y-auto rounded-none bg-[#f3fbff] text-cu-ink shadow-[0px_14px_42px_0px_rgba(44,42,39,0.16)] lg:rounded-[16px]",
          hideSidebar: true,
        }}
      >
        {children}
      </Container>
    </div>
  );
}
