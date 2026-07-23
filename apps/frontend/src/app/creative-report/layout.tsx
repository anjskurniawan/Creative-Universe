"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { PerformanceNavbar } from "@/features/kv-retail/components/performance-navbar";
import { PerformanceSidebar, type PerformanceSidebarItem } from "@/features/kv-retail/components/performance-sidebar";
import { useKvRetailDesktopSidebar } from "@/features/kv-retail/hooks/use-kv-retail-desktop-sidebar";
import { CreativeReportThemeContext } from "./theme-context";

export default function CreativeReportLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark" | "retro">("light");
  const { expanded, toggleExpanded } = useKvRetailDesktopSidebar();

  const sidebarItems = useMemo<PerformanceSidebarItem[]>(() => [
    {
      label: "Performa",
      icon: "monitoring",
      href: "/creative-report",
      isActive: pathname === "/creative-report" || (pathname.startsWith("/creative-report/") && !pathname.startsWith("/creative-report/option")),
    },
  ], [pathname]);

  const activeHref = sidebarItems.find((item) => item.isActive)?.href ?? pathname;

  return (
    <CreativeReportThemeContext.Provider value={{ theme, setTheme }}>
    <div className={`flex h-screen flex-col overflow-hidden ${theme === "dark" ? "bg-[#111413]" : theme === "retro" ? "bg-[#dfe2d3]" : "bg-[#f6faff]"}`}>
      {/* Mobile view */}
      <div
        className={`h-dvh overflow-hidden p-3 lg:hidden ${theme === "dark" ? "bg-[radial-gradient(circle_at_8%_6%,#294c3b_0,transparent_28%),radial-gradient(circle_at_91%_4%,#242a27_0,transparent_38%),linear-gradient(135deg,#111513_0%,#0b0d0c_58%,#1a1e1c_100%)]" : theme === "retro" ? "bg-[#dfe2d3] font-mono" : "bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)]"}`}
      >
        <div className={`flex h-[calc(100dvh-24px)] flex-col overflow-hidden rounded-[22px] ${theme === "dark" ? "border border-white/10 bg-[#111413]/90 shadow-[0_12px_32px_rgba(0,0,0,0.34)]" : theme === "retro" ? "border-[3px] border-[#24252b] bg-[#c9ccc0] shadow-[0_6px_0_#24252b]" : "border border-white/80 bg-white/80 shadow-[0_12px_32px_rgba(0,4,117,0.2)] backdrop-blur-md"}`}>
          <PerformanceNavbar
            theme={theme}
            title="Creative Report"
            parentTitle="Creative Report"
            compact
            compactMenuItems={sidebarItems.map(({ label, href }) => ({ label, href: href ?? "" }))}
          />
          <main aria-label="Creative Report mobile" className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-6 pt-6">
            <div className="flex-1 min-h-0 overflow-y-auto text-slate-800">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Desktop view */}
      <div className={`hidden h-screen min-h-0 flex-col text-[#222] lg:flex ${theme === "dark" ? "bg-[radial-gradient(circle_at_8%_6%,#294c3b_0,transparent_28%),radial-gradient(circle_at_91%_4%,#242a27_0,transparent_38%),linear-gradient(135deg,#111513_0%,#0b0d0c_58%,#1a1e1c_100%)] p-6" : theme === "retro" ? "bg-[#dfe2d3] p-6" : "bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)] p-6"}`}>
        <div className={`flex min-h-0 flex-1 flex-col overflow-hidden ${theme === "light" ? "rounded-[26px] border border-white/80 bg-white/80 shadow-[0_14px_42px_rgba(44,42,39,0.16)] backdrop-blur-md" : theme === "dark" ? "rounded-[26px] border border-white/10 bg-[#111413]/90 shadow-[0_14px_42px_rgba(0,0,0,0.45)] backdrop-blur-md" : "rounded-[30px] border-[3px] border-[#24252b] bg-[#c9ccc0] font-mono shadow-[0_8px_0_#24252b]"}`}>
          <PerformanceNavbar theme={theme} title="Creative Report" parentTitle="Creative Report" />
          <div className="flex min-h-0 flex-1">
            <PerformanceSidebar
              theme={theme}
              primaryItems={sidebarItems}
              activeHref={activeHref}
              settingsHref="/creative-report/option"
              ariaLabel="Navigasi Creative Report"
              onToggleTheme={() => setTheme((t) => t === "dark" ? "light" : "dark")}
              onToggleRetro={() => setTheme((t) => t === "retro" ? "light" : "retro")}
              expanded={expanded}
              onToggleExpanded={toggleExpanded}
            />
            <main className="relative min-w-0 flex min-h-0 flex-1 flex-col overflow-y-auto p-8">
              <div className="min-h-full flex flex-col flex-1 w-full text-slate-800">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
    </CreativeReportThemeContext.Provider>
  );
}
