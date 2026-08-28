"use client";

import { useState } from "react";
import { SIDEBAR_DEFAULT_ITEMS } from "./Sidebar.config";
import SidebarFooter from "./SidebarFooter/SidebarFooter";
import SidebarSection from "./SidebarSection/SidebarSection";
import type { SidebarProps } from "./Sidebar.types";

export type { SidebarItem, SidebarProps } from "./Sidebar.types";

export default function Sidebar({ items, expanded: controlledExpanded = true, onToggleExpanded, activeHref = "", ariaLabel = "Sidebar", className = "", primaryItems = [...SIDEBAR_DEFAULT_ITEMS] }: SidebarProps) {
  const [internalExpanded, setInternalExpanded] = useState(controlledExpanded);
  const expanded = onToggleExpanded ? controlledExpanded : internalExpanded;
  const toggleExpanded = onToggleExpanded ?? (() => setInternalExpanded((current) => !current));
  const resolvedItems = items ?? primaryItems;
  return <aside className={`cu-style hidden h-full min-h-0 shrink-0 self-stretch flex-col justify-between border-r border-black/[0.045] bg-white/40 py-5 transition-[width] duration-200 lg:flex ${expanded ? "w-56 px-3" : "w-16 items-center px-4"} ${className}`.trim()} aria-label={`Navigasi ${ariaLabel}`}><div className="mb-4 flex w-full flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"><SidebarSection items={resolvedItems} expanded={expanded} activeHref={activeHref} /></div><SidebarFooter expanded={expanded} onToggleExpanded={toggleExpanded} /></aside>;
}
