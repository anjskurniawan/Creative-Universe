"use client";

import React, { Fragment } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/material-icon";

export type SidebarItem = {
  label: string;
  icon: string;
  href?: string;
  badge?: number | string;
  group?: string;
  isActive?: boolean;
  isHighlighted?: boolean;
};

type SidebarLinkProps = {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
  highlight?: boolean;
  theme: "dark" | "light" | "retro";
  expanded: boolean;
  badge?: number | string;
};

function SidebarLink({
  href,
  icon,
  label,
  active = false,
  highlight = false,
  theme,
  expanded,
  badge,
}: SidebarLinkProps) {
  const light = theme !== "dark";
  const activeIconColor = active ? (theme === "dark" ? "text-[#181818]" : "text-white") : "";
  const activeTextColor = active && theme === "dark" ? "text-[#181818]" : "";

  let colorClasses = "";
  if (active) {
    colorClasses =
      theme === "dark"
        ? "bg-[#b0ff5e] text-[#181818]"
        : theme === "retro"
        ? "bg-[#ba0dcb] text-white"
        : "bg-[#00a4ff] text-white";
  } else if (highlight) {
    colorClasses =
      theme === "dark"
        ? "border-[#b0ff5e] text-[#b0ff5e]"
        : theme === "retro"
        ? "border-[#ba0dcb] text-[#ba0dcb]"
        : "border-[#00a4ff] text-[#00a4ff]";
  } else {
    colorClasses = light
      ? "text-[#3b4446] hover:bg-black/5 focus-visible:ring-black/30"
      : "text-[#e3e3e3] hover:bg-white/10 focus-visible:ring-white/70";
  }

  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`flex h-8 items-center rounded-lg border-2 border-transparent transition focus-visible:outline-none focus-visible:ring-2 ${
        expanded ? "w-full gap-3 px-2" : "w-8 justify-center"
      } ${colorClasses}`}
    >
      <div className="relative flex items-center justify-center">
        <MaterialIcon name={icon} size="auto" className={`shrink-0 text-xl ${activeIconColor}`} />
        {!expanded && badge !== undefined && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ec4899] px-1 text-[9px] font-semibold text-white">
            {badge}
          </span>
        )}
      </div>
      {expanded && <span className={`flex-1 truncate text-sm font-medium ${activeTextColor}`}>{label}</span>}
      {expanded && badge !== undefined && (
        <span className="rounded-full bg-[#ec4899] px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}

export type SidebarProps = {
  theme?: "dark" | "light" | "retro";
  onToggleTheme?: () => void;
  onToggleRetro?: () => void;
  expanded?: boolean;
  onToggleExpanded?: () => void;
  activeHref?: string;
  ariaLabel?: string;
  className?: string;
  primaryItems?: SidebarItem[];
  settingsHref?: string;
};

export default function Sidebar({
  theme = "light",
  onToggleTheme,
  onToggleRetro,
  expanded = false,
  onToggleExpanded,
  activeHref = "",
  ariaLabel = "Sidebar",
  className = "",
  primaryItems = [],
  settingsHref,
}: SidebarProps) {
  const light = theme !== "dark";
  const retro = theme === "retro";
  const divider = retro ? "border-[#24252b]" : light ? "border-[#e5e5e5]" : "border-white/15";

  return (
    <aside
      className={`flex shrink-0 flex-col justify-between py-5 transition-[width] duration-200 ${
        expanded ? "w-56 px-3" : "w-16 items-center px-4"
      } ${
        retro
          ? "border-r-[3px] border-[#24252b] bg-[#eceee6]"
          : theme === "light"
          ? "border-r border-black/[0.045] bg-white/40"
          : "border-r border-white/[0.06] bg-[#111413]/45"
      } ${className}`}
      aria-label={`Navigasi ${ariaLabel}`}
    >
      <div className={`flex flex-col gap-2 ${expanded ? "w-full" : "w-8"}`}>
        <div className="flex flex-col gap-1">
          {primaryItems.map((item, index) => {
            const showDivider = index > 0 && item.group && item.group !== primaryItems[index - 1]?.group;
            return (
              <Fragment key={item.label}>
                {showDivider && (
                  <span className={`my-2 h-px w-full shrink-0 border-t ${divider}`} aria-hidden="true" />
                )}
                <SidebarLink
                  href={item.href ?? "#"}
                  icon={item.icon}
                  label={item.label}
                  active={item.isActive ?? (activeHref ? item.href === activeHref : false)}
                  highlight={item.isHighlighted}
                  theme={theme}
                  expanded={expanded}
                  badge={item.badge}
                />
              </Fragment>
            );
          })}
        </div>
        {settingsHref && (
          <div className={`border-t pt-2 ${divider}`}>
            <SidebarLink
              href={settingsHref}
              icon="settings"
              label="Setting"
              active={activeHref === settingsHref}
              theme={theme}
              expanded={expanded}
            />
          </div>
        )}
      </div>
      <div className={`flex flex-col gap-1 border-t pt-2 ${expanded ? "w-full" : "w-8"} ${divider}`}>
        <button
          type="button"
          aria-label={light ? "Gunakan tema gelap" : "Gunakan tema terang"}
          onClick={onToggleTheme}
          className={`flex h-8 items-center rounded-lg transition focus-visible:outline-none focus-visible:ring-2 ${
            expanded ? "w-full gap-3 px-2" : "w-8 justify-center"
          } ${light ? "text-[#3b4446] hover:bg-black/5 focus-visible:ring-black/30" : "text-[#e3e3e3] hover:bg-white/10 focus-visible:ring-white/70"}`}
        >
          <MaterialIcon name={light ? "dark_mode" : "light_mode"} size="auto" className="shrink-0 text-xl" />
          {expanded && <span className="text-sm font-medium">{light ? "Tema gelap" : "Tema terang"}</span>}
        </button>
        <button
          type="button"
          aria-label={retro ? "Matikan tema Retro" : "Gunakan tema Retro"}
          onClick={onToggleRetro}
          className={`flex h-8 items-center rounded-lg transition focus-visible:outline-none focus-visible:ring-2 ${
            expanded ? "w-full gap-3 px-2" : "w-8 justify-center"
          } ${
            retro
              ? "bg-[#ba0dcb] text-white"
              : light
              ? "text-[#3b4446] hover:bg-black/5 focus-visible:ring-black/30"
              : "text-[#e3e3e3] hover:bg-white/10 focus-visible:ring-white/70"
          }`}
        >
          <MaterialIcon name="videogame_asset" size="auto" className="shrink-0 text-xl" />
          {expanded && <span className="text-sm font-medium">Retro</span>}
        </button>
        <button
          type="button"
          aria-label={expanded ? "Ciutkan sidebar" : "Lebarkan sidebar"}
          onClick={onToggleExpanded}
          className={`flex h-8 items-center rounded-lg transition focus-visible:outline-none focus-visible:ring-2 ${
            expanded ? "w-full gap-3 px-2" : "w-8 justify-center"
          } ${light ? "text-[#3b4446] hover:bg-black/5 focus-visible:ring-black/30" : "text-[#e3e3e3] hover:bg-white/10 focus-visible:ring-white/70"}`}
        >
          <MaterialIcon name="vertical_split" size="auto" className="shrink-0 text-xl" />
          {expanded && <span className="text-sm font-medium">Ciutkan</span>}
        </button>
        <SidebarLink href="/docs" icon="help_outline" label="Bantuan" theme={theme} expanded={expanded} />
      </div>
    </aside>
  );
}
