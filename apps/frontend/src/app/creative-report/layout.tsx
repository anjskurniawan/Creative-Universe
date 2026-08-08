"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Container from "@/components/layout/container";

const creativeReportMenu = [
  {
    label: "Performa",
    icon: "monitoring",
    href: "/creative-report/performa",
    group: "Creative Report",
  },
  {
    label: "Creative Agent",
    icon: "group",
    href: "/creative-report/creative-agent",
    group: "Creative Report",
  },
  {
    label: "Pengaturan",
    icon: "settings",
    href: "/creative-report/option",
    group: "Pengaturan",
  },
];

export default function CreativeReportLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [viewport, setViewport] = useState<"Mobile" | "Desktop">("Mobile");

  useEffect(() => {
    const updateViewport = () => setViewport(window.innerWidth >= 1024 ? "Desktop" : "Mobile");
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)]">
      <Container
        viewport={viewport}
        contentProps={{
          className: "w-full h-full flex flex-col overflow-hidden bg-[#f3fbff] rounded-[16px] shadow-[0px_14px_42px_0px_rgba(44,42,39,0.16)]",
          sidebarTheme: "light",
          sidebarExpanded,
          onToggleSidebarExpanded: () => setSidebarExpanded((current) => !current),
        }}
        menuItems={creativeReportMenu}
        activeMenuHref={
          pathname === "/creative-report/option"
            ? "/creative-report/option"
            : pathname.startsWith("/creative-report/creative-agent")
            ? "/creative-report/creative-agent"
            : pathname.startsWith("/creative-report/performa")
            ? "/creative-report/performa"
            : ""
        }
        menuTitle="Creative Report"
      >
        {children}
      </Container>
    </div>
  );
}

