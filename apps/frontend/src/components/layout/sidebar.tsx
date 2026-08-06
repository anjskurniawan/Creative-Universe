"use client";

import { useState } from "react";
import { SidebarFooter } from "./sidebar/sidebar-footer";
import { SidebarSection } from "./sidebar/sidebar-section";
import type { SidebarProps } from "./sidebar/sidebar.types";

// Main sidebar container: state and composition only.
export default function Sidebar({
  expanded: controlledExpanded = true,
  onToggleExpanded,
  activeHref = "",
  ariaLabel = "Sidebar",
  className = "",
  primaryItems = [],
  settingsHref,
}: SidebarProps) {
  const [internalExpanded, setInternalExpanded] = useState(controlledExpanded);
  const expanded = onToggleExpanded ? controlledExpanded : internalExpanded;
  const toggleExpanded = onToggleExpanded ?? (() => setInternalExpanded((current) => !current));

  return (
    <aside
      className={`flex h-full shrink-0 flex-col justify-between border-r border-black/[0.045] bg-white/40 py-5 transition-[width] duration-200 ${expanded ? "w-56 px-3" : "w-16 items-center px-4"} ${className}`}
      aria-label={`Navigasi ${ariaLabel}`}
    >
      <div className="flex-1 overflow-y-auto mb-4 w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <SidebarSection
          items={primaryItems}
          expanded={expanded}
          activeHref={activeHref}
          settingsHref={settingsHref}
        />
      </div>
      <SidebarFooter expanded={expanded} onToggleExpanded={toggleExpanded} />
    </aside>
  );
}

export type { SidebarItem, SidebarProps } from "./sidebar/sidebar.types";
