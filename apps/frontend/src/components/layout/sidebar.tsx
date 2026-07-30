"use client";

import { Fragment } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";

export type SidebarItem = { label: string; icon: string; href?: string; badge?: number | string; group?: string; isActive?: boolean; isHighlighted?: boolean };
export type SidebarProps = { theme?: "dark" | "light" | "retro"; onToggleTheme?: () => void; onToggleRetro?: () => void; expanded?: boolean; onToggleExpanded?: () => void; activeHref?: string; ariaLabel?: string; className?: string; primaryItems?: SidebarItem[]; settingsHref?: string };

export default function Sidebar({ theme = "light", expanded = false, onToggleExpanded, activeHref = "", ariaLabel = "Sidebar", className = "", primaryItems = [], settingsHref }: SidebarProps) {
  const light = theme !== "dark";
  const retro = theme === "retro";
  const divider = retro ? "border-[#24252b]" : light ? "border-[#e5e5e5]" : "border-white/15";
  const itemClass = (active: boolean, highlighted: boolean) => active
    ? theme === "dark" ? "bg-[#b0ff5e] text-[#181818]" : retro ? "bg-[#ba0dcb] text-white" : "bg-[#00a4ff] text-white"
    : highlighted
    ? theme === "dark" ? "border-[#b0ff5e] text-[#b0ff5e]" : retro ? "border-[#ba0dcb] text-[#ba0dcb]" : "border-[#00a4ff] text-[#00a4ff]"
    : light ? "text-[#3b4446] hover:bg-black/5" : "text-[#e3e3e3] hover:bg-white/10";
  const renderItem = (item: SidebarItem) => {
    const active = item.isActive ?? item.href === activeHref;
    return <Link href={item.href ?? "#"} aria-current={active ? "page" : undefined} className={`flex h-8 items-center rounded-lg border-2 border-transparent transition ${expanded ? "w-full gap-3 px-2" : "w-8 justify-center"} ${itemClass(active, Boolean(item.isHighlighted))}`}><span className="relative flex items-center justify-center"><MaterialIcon name={item.icon} size="auto" className="shrink-0 text-xl" />{!expanded && item.badge !== undefined && <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ec4899] px-1 text-[9px] font-semibold text-white">{item.badge}</span>}</span>{expanded && <span className="flex-1 truncate text-sm font-medium">{item.label}</span>}</Link>;
  };
  const bottomButton = `flex h-8 items-center rounded-lg transition focus-visible:outline-none ${expanded ? "w-full gap-3 px-2" : "w-8 justify-center"} ${light ? "text-[#3b4446] hover:bg-black/5" : "text-[#e3e3e3] hover:bg-white/10"}`;
  return <aside className={`flex shrink-0 flex-col justify-between py-5 transition-[width] duration-200 ${expanded ? "w-56 px-3" : "w-16 items-center px-4"} ${retro ? "border-r-[3px] border-[#24252b] bg-[#eceee6]" : theme === "light" ? "border-r border-black/[0.045] bg-white/40" : "border-r border-white/[0.06] bg-[#111413]/45"} ${className}`} aria-label={`Navigasi ${ariaLabel}`}><div className={`flex flex-col gap-2 ${expanded ? "w-full" : "w-8"}`}><div className="flex flex-col gap-1">{primaryItems.map((item, index) => <Fragment key={item.label}>{index > 0 && item.group && item.group !== primaryItems[index - 1]?.group && <span className={`my-2 h-px w-full border-t ${divider}`} />}{renderItem(item)}</Fragment>)}</div>{settingsHref && <div className={`border-t pt-2 ${divider}`}>{renderItem({ label: "Setting", icon: "settings", href: settingsHref })}</div>}</div><div className={`flex flex-col gap-1 border-t pt-2 ${expanded ? "w-full" : "w-8"} ${divider}`}><button type="button" onClick={onToggleExpanded} className={bottomButton}><MaterialIcon name="vertical_split" size="auto" className="text-xl" />{expanded && <span className="text-sm font-medium">Ciutkan</span>}</button><Link href="/docs" className={bottomButton}><MaterialIcon name="help_outline" size="auto" className="text-xl" />{expanded && <span className="text-sm font-medium">Bantuan</span>}</Link></div></aside>;
}
