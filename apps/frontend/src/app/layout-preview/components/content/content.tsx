"use client";

import React, { useState } from "react";
import Navbar, { type NavbarProps } from "./navbar/navbar";
import ContentMain, { type ContentMainProps } from "./main";
import SubAppMenu, { type MenuItem } from "./menu";

export type SubAppContentProps = {
  className?: string;
  navbarProps?: NavbarProps;
  contentProps?: ContentMainProps;
  menuTitle?: string;
  menuItems?: MenuItem[];
  activeMenuHref?: string;
  onMenuItemClick?: (item: MenuItem, index: number) => void;
  children?: React.ReactNode;
};

export default function SubAppContent({
  className,
  navbarProps,
  contentProps,
  menuTitle,
  menuItems = [],
  activeMenuHref = "",
  onMenuItemClick,
  children,
}: SubAppContentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [subAppName, setSubAppName] = useState("");

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      // Split "Global Layout - Creative Universe" by " - "
      const parts = document.title.split(" - ");
      // The second part is the Sub App Name (e.g. "Creative Universe"), first part is Page Title (e.g. "Global Layout")
      setSubAppName(parts[1] || parts[0] || "Sub App");
    }
  }, []);

  const handleMenuItemClick = (item: MenuItem, index: number) => {
    setMenuOpen(false);
    if (onMenuItemClick) {
      onMenuItemClick(item, index);
    } else {
      alert(`Navigating to ${item.label} (${item.href})`);
    }
  };

  return (
    <div
      className={
        className ||
        "flex flex-col h-[704px] w-[376px] overflow-hidden rounded-[16px] bg-[#f3fbff] shadow-[0px_14px_42px_0px_rgba(44,42,39,0.16)]"
      }
      data-node-id="112:400"
      data-name="Sub App Content"
    >
      {/* Navbar Component */}
      <Navbar
        {...navbarProps}
        onMenuClick={navbarProps?.onMenuClick || (() => setMenuOpen(true))}
      />

      {/* Content Main Component */}
      <ContentMain {...contentProps} className="flex-1 flex flex-col items-start p-4 w-full relative">
        {children}
      </ContentMain>

      {/* Fullscreen Snap-On-Scroll Hamburger Menu */}
      <SubAppMenu
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
