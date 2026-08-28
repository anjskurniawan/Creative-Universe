"use client";

import { useState } from "react";
import { SideBarFooter } from "./SideBarFooter/SideBarFooter";
import { SideBarSection } from "./SideBarSection/SideBarSection";
import type { SideBarProps } from "./SideBar.types";

// Main sidebar container: state and composition only.
export default function SideBar({
  expanded: controlledExpanded = true,
  onToggleExpanded,
  activeHref = "",
  ariaLabel = "Sidebar",
  className = "",
  primaryItems = [],
  settingsHref,
}: SideBarProps) {
  const [internalExpanded, setInternalExpanded] = useState(controlledExpanded);
  const expanded = onToggleExpanded ? controlledExpanded : internalExpanded;
  const toggleExpanded = onToggleExpanded ?? (() => setInternalExpanded((current) => !current));

  return (
    <aside
      className={`cu-style flex h-full min-h-0 shrink-0 self-stretch flex-col justify-between border-r border-black/[0.045] bg-white/40 py-5 transition-[width] duration-200 ${expanded ? "w-56 px-3" : "w-16 items-center px-4"} ${className}`}
      aria-label={`Navigasi ${ariaLabel}`}
    >
      <div className="flex-1 overflow-y-auto mb-4 w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <SideBarSection
          items={primaryItems}
          expanded={expanded}
          activeHref={activeHref}
          settingsHref={settingsHref}
        />
      </div>
      <SideBarFooter expanded={expanded} onToggleExpanded={toggleExpanded} />
    </aside>
  );
}

export type { SideBarItem, SideBarProps } from "./SideBar.types";
