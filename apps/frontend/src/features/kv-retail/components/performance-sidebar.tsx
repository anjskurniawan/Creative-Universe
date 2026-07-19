"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/material-icon";
import { KV_RETAIL_PERFORMANCE_PAGE } from "@/features/kv-retail/performance-page-config";

const PRIMARY_ITEMS = [
  { href: "/kv-retail", icon: "calendar_today", label: "Hari ini" },
  { href: "/kv-retail/unfinished", icon: "priority_high", label: "Belum selesai" },
  { href: "/kv-retail/month", icon: "calendar_month", label: "Bulan ini" },
  { href: "/kv-retail/performance", icon: "analytics", label: KV_RETAIL_PERFORMANCE_PAGE.navLabel, active: true },
] as const;

function SidebarLink({ href, icon, label, active = false, theme, expanded }: { href: string; icon: string; label: string; active?: boolean; theme: "dark" | "light" | "retro"; expanded: boolean }) {
  const light = theme !== "dark";
  const activeIconColor = active ? theme === "dark" ? "text-[#181818]" : "text-white" : "";
  const activeTextColor = active && theme === "dark" ? "text-[#181818]" : "";
  return <Link href={href} aria-label={label} aria-current={active ? "page" : undefined} className={`flex h-8 items-center rounded-lg transition focus-visible:outline-none focus-visible:ring-2 ${expanded ? "w-full gap-3 px-2" : "w-8 justify-center"} ${light ? "text-[#3b4446] hover:bg-black/5 focus-visible:ring-black/30" : "text-[#e3e3e3] hover:bg-white/10 focus-visible:ring-white/70"} ${active ? theme === "dark" ? "bg-[#b0ff5e] text-[#181818]" : theme === "retro" ? "bg-[#ba0dcb] text-white" : "bg-[#00a4ff] text-white" : ""}`}><MaterialIcon name={icon} size="auto" className={`shrink-0 text-xl ${activeIconColor}`} />{expanded && <span className={`truncate text-sm font-medium ${activeTextColor}`}>{label}</span>}</Link>;
}

/** Figma node 27:328, isolated so it applies only to the performance route. */
export function PerformanceSidebar({ theme, onToggleTheme, onToggleRetro, expanded, onToggleExpanded, activeHref = "/kv-retail/performance", ariaLabel = KV_RETAIL_PERFORMANCE_PAGE.title, className = "" }: { theme: "dark" | "light" | "retro"; onToggleTheme: () => void; onToggleRetro: () => void; expanded: boolean; onToggleExpanded: () => void; activeHref?: string; ariaLabel?: string; className?: string }) {
  const light = theme !== "dark";
  const retro = theme === "retro";
  const divider = retro ? "border-[#24252b]" : light ? "border-[#e5e5e5]" : "border-white/15";
  return <aside className={`flex shrink-0 flex-col justify-between py-5 transition-[width] duration-200 ${expanded ? "w-56 px-3" : "w-16 items-center px-4"} ${retro ? "border-r-[3px] border-[#24252b] bg-[#eceee6]" : theme === "light" ? "border-r border-black/[0.045] bg-white/40" : "border-r border-white/[0.06] bg-[#111413]/45"} ${className}`} aria-label={`Navigasi ${ariaLabel}`}>
    <div className={`flex flex-col gap-2 ${expanded ? "w-full" : "w-8"}`}>
      <div className="flex flex-col gap-1">{PRIMARY_ITEMS.map((item) => <SidebarLink key={item.href} {...item} active={item.href === activeHref} theme={theme} expanded={expanded} />)}</div>
      <div className={`border-t pt-2 ${divider}`}><SidebarLink href="/kv-retail/option" icon="settings" label="Pengaturan" active={activeHref === "/kv-retail/option"} theme={theme} expanded={expanded} /></div>
    </div>
    <div className={`flex flex-col gap-1 border-t pt-2 ${expanded ? "w-full" : "w-8"} ${divider}`}>
      <button type="button" aria-label={light ? "Gunakan tema gelap" : "Gunakan tema terang"} onClick={onToggleTheme} className={`flex h-8 items-center rounded-lg transition focus-visible:outline-none focus-visible:ring-2 ${expanded ? "w-full gap-3 px-2" : "w-8 justify-center"} ${light ? "text-[#3b4446] hover:bg-black/5 focus-visible:ring-black/30" : "text-[#e3e3e3] hover:bg-white/10 focus-visible:ring-white/70"}`}><MaterialIcon name={light ? "dark_mode" : "light_mode"} size="auto" className="shrink-0 text-xl" />{expanded && <span className="text-sm font-medium">{light ? "Tema gelap" : "Tema terang"}</span>}</button>
      <button type="button" aria-label={retro ? "Matikan tema Retro" : "Gunakan tema Retro"} onClick={onToggleRetro} className={`flex h-8 items-center rounded-lg transition focus-visible:outline-none focus-visible:ring-2 ${expanded ? "w-full gap-3 px-2" : "w-8 justify-center"} ${retro ? "bg-[#ba0dcb] text-white" : light ? "text-[#3b4446] hover:bg-black/5 focus-visible:ring-black/30" : "text-[#e3e3e3] hover:bg-white/10 focus-visible:ring-white/70"}`}><MaterialIcon name="videogame_asset" size="auto" className="shrink-0 text-xl" />{expanded && <span className="text-sm font-medium">Retro</span>}</button>
      <button type="button" aria-label={expanded ? "Ciutkan sidebar" : "Lebarkan sidebar"} onClick={onToggleExpanded} className={`flex h-8 items-center rounded-lg transition focus-visible:outline-none focus-visible:ring-2 ${expanded ? "w-full gap-3 px-2" : "w-8 justify-center"} ${light ? "text-[#3b4446] hover:bg-black/5 focus-visible:ring-black/30" : "text-[#e3e3e3] hover:bg-white/10 focus-visible:ring-white/70"}`}><MaterialIcon name="vertical_split" size="auto" className="shrink-0 text-xl" />{expanded && <span className="text-sm font-medium">Ciutkan</span>}</button>
      <SidebarLink href="/docs" icon="help_outline" label="Bantuan" theme={theme} expanded={expanded} />
    </div>
  </aside>;
}
