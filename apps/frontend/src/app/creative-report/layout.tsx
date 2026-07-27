"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Container from "@/components/global-layout/container";
import { CreativeReportThemeContext } from "./theme-context";

const creativeReportMenu = [
  {
    label: "Performa",
    icon: "monitoring",
    href: "/creative-report",
    group: "Creative Report",
  },
  {
    label: "Staff",
    icon: "group",
    href: "/creative-report/staff",
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
  const [theme, setTheme] = useState<"light" | "dark" | "retro">("light");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [viewport, setViewport] = useState<"Mobile" | "Desktop">("Mobile");

  useEffect(() => {
    const updateViewport = () => setViewport(window.innerWidth >= 1024 ? "Desktop" : "Mobile");
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return (
    <CreativeReportThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`h-screen w-screen overflow-hidden ${theme === "dark" ? "bg-[#111413]" : theme === "retro" ? "bg-[#dfe2d3]" : "bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)]"}`}>
        <Container
          viewport={viewport}
          contentProps={{
            className: `w-full h-full flex flex-col overflow-hidden ${theme === "dark" ? "bg-[#111413] text-white" : theme === "retro" ? "bg-[#c9ccc0] font-mono" : "bg-[#f3fbff]"} rounded-[16px] shadow-[0px_14px_42px_0px_rgba(44,42,39,0.16)]`,
            sidebarTheme: theme,
            sidebarExpanded,
            onToggleSidebarExpanded: () => setSidebarExpanded((current) => !current),
            onToggleSidebarTheme: () => setTheme((current) => current === "dark" ? "light" : "dark"),
            onToggleSidebarRetro: () => setTheme((current) => current === "retro" ? "light" : "retro"),
          }}
          menuItems={creativeReportMenu}
          activeMenuHref={pathname === "/creative-report/option" ? "/creative-report/option" : pathname === "/creative-report/staff" ? "/creative-report/staff" : "/creative-report"}
          menuTitle="Creative Report"
        >
          {children}
        </Container>
      </div>
    </CreativeReportThemeContext.Provider>
  );
}
