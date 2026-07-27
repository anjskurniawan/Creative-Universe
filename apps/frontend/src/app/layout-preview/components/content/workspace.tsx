"use client";

import React, { useMemo, useState } from "react";
import Navbar, { type NavbarProps } from "./navbar/navbar";
import Content, { type ContentProps } from "./content";
import Menu, { type MenuItem } from "./menu";
import Sidebar from "./sidebar";

export type WorkspaceProps = {
  className?: string;
  viewport?: "Mobile" | "Desktop";
  navbarProps?: NavbarProps;
  contentProps?: ContentProps;
  menuTitle?: string;
  menuItems?: MenuItem[];
  activeMenuHref?: string;
  sidebarTheme?: "light" | "dark" | "retro";
  sidebarExpanded?: boolean;
  onToggleSidebarTheme?: () => void;
  onToggleSidebarRetro?: () => void;
  onToggleSidebarExpanded?: () => void;
  onMenuItemClick?: (item: MenuItem, index: number) => void;
  children?: React.ReactNode;
};

export default function Workspace({
  className,
  viewport = "Mobile",
  navbarProps,
  contentProps,
  menuTitle,
  menuItems = [],
  activeMenuHref = "",
  sidebarTheme = "light",
  sidebarExpanded = true,
  onToggleSidebarTheme,
  onToggleSidebarRetro,
  onToggleSidebarExpanded,
  onMenuItemClick,
  children,
}: WorkspaceProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const subAppName = useMemo(() => {
    if (typeof document === "undefined") return "Sub App";
    const parts = document.title.split(" - ");
    return parts[1] || parts[0] || "Sub App";
  }, []);

  const handleMenuItemClick = (item: MenuItem, index: number) => {
    setMenuOpen(false);
    if (onMenuItemClick) {
      onMenuItemClick(item, index);
    } else {
      alert(`Navigating to ${item.label} (${item.href})`);
    }
  };

  const isDesktop = viewport === "Desktop";

  const sidebarItems = menuItems.map((item) => ({
    label: item.label,
    icon: item.icon || "folder",
    href: item.href,
    badge: item.badge,
    group: item.group,
    isActive: activeMenuHref ? item.href === activeMenuHref : false,
  }));

  return (
    <div
      className={className || "flex flex-col w-full h-full overflow-hidden"}
      id={isDesktop ? "node-121_530" : "node-112_400"}
      data-node-id={isDesktop ? "121:530" : "112:400"}
      data-name="Sub App Content"
    >
      {/* Navbar Component */}
      <Navbar
        {...navbarProps}
        viewport={viewport}
        onMenuClick={navbarProps?.onMenuClick || (() => setMenuOpen((open) => !open))}
      />

      {isDesktop ? (
        <div
          className="flex-1 flex w-full h-full min-h-0 relative overflow-hidden"
          data-node-id="121:706"
          data-name="View Desktop"
        >
          <Sidebar
            className="h-full"
            primaryItems={sidebarItems}
            theme={sidebarTheme}
            expanded={sidebarExpanded}
            onToggleTheme={onToggleSidebarTheme}
            onToggleRetro={onToggleSidebarRetro}
            onToggleExpanded={onToggleSidebarExpanded}
            activeHref={activeMenuHref}
          />
          <Content
            {...contentProps}
            viewport={viewport}
            className="layout-preview-shell-scroll flex-1 flex flex-col items-start p-4 h-full relative overflow-y-auto"
          >
            {children}
          </Content>
        </div>
      ) : (
        /* Content Main Component */

        <Content
          {...contentProps}
          viewport={viewport}
          className="flex-1 flex flex-col items-start p-4 w-full relative overflow-y-auto"
        >
          {children}
        </Content>
      )}

      {/* Fullscreen Snap-On-Scroll Hamburger Menu */}
      <Menu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        menuItems={menuItems}
        onItemClick={handleMenuItemClick}
        activeHref={activeMenuHref}
        title={menuTitle || subAppName}
      />
    </div>
  );
}
