"use client";

import { useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import GlobalLayoutNavbar from "./navbar";
import Sidebar, { type SidebarItem } from "./sidebar";
import Content, { type ContentProps } from "./content";
import Menu, { type MenuItem } from "./menu";

export type WorkspaceProps = { className?: string; viewport?: "Mobile" | "Desktop"; contentProps?: ContentProps; menuTitle?: string; menuItems?: MenuItem[]; activeMenuHref?: string; onMenuItemClick?: (item: MenuItem, index: number) => void; children?: ReactNode; sidebarTheme?: "light" | "dark" | "retro"; sidebarExpanded?: boolean; onToggleSidebarTheme?: () => void; onToggleSidebarRetro?: () => void; onToggleSidebarExpanded?: () => void };

export default function Workspace({ className, viewport = "Mobile", contentProps, menuTitle, menuItems = [], activeMenuHref = "", onMenuItemClick, children, sidebarTheme = "light", sidebarExpanded = true, onToggleSidebarTheme, onToggleSidebarRetro, onToggleSidebarExpanded }: WorkspaceProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const desktop = viewport === "Desktop";
  const resolvedActiveHref = menuItems.find((item) => item.href === pathname)?.href ?? menuItems.filter((item) => item.href && pathname.startsWith(`${item.href}/`)).sort((left, right) => (right.href?.length ?? 0) - (left.href?.length ?? 0))[0]?.href ?? activeMenuHref;
  const sidebarItems = useMemo<SidebarItem[]>(() => menuItems.map((item) => ({ ...item, icon: item.icon ?? "folder", isActive: resolvedActiveHref ? item.href === resolvedActiveHref : false })), [menuItems, resolvedActiveHref]);
  const activeMenuLabel = menuItems.find((item) => item.href === resolvedActiveHref)?.label ?? "Menu";
  const handleMenuItemClick = (item: MenuItem, index: number) => {
    setMenuOpen(false);
    if (onMenuItemClick) {
      onMenuItemClick(item, index);
      return;
    }
    if (item.href && item.href !== pathname) router.push(item.href);
  };
  return <div className={className ?? "flex size-full flex-col overflow-hidden"}><GlobalLayoutNavbar viewport={viewport} theme={sidebarTheme} onMenuClick={() => setMenuOpen(true)} breadcrumbItems={[menuTitle ?? "Sub App", activeMenuLabel]} /><div className="relative flex min-h-0 flex-1 overflow-hidden">{desktop && <Sidebar className="h-full" theme={sidebarTheme} expanded={sidebarExpanded} primaryItems={sidebarItems} activeHref={resolvedActiveHref} onToggleTheme={onToggleSidebarTheme} onToggleRetro={onToggleSidebarRetro} onToggleExpanded={onToggleSidebarExpanded} />}<Content {...contentProps} viewport={viewport} className="flex h-full min-h-0 flex-1 flex-col items-start overflow-y-auto p-4 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">{children}</Content></div><Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} menuItems={menuItems} onItemClick={handleMenuItemClick} activeHref={resolvedActiveHref} title={menuTitle} /></div>;
}
