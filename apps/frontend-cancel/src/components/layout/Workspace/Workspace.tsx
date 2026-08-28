"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import Content from "../Content/Content";
import NavBar from "../NavBar/NavBar";
import SideBar from "../Sidebar/Sidebar";
import MenuOverlay, { type MenuOverlayItem } from "../MenuOverlay/MenuOverlay";

export type WorkspaceProps = {
  children: ReactNode;
  menuItems?: MenuOverlayItem[];
  menuTitle?: string;
  activeMenuHref?: string;
  onMenuItemClick?: (item: MenuOverlayItem, index: number) => void;
};

const defaultMenuItems: MenuOverlayItem[] = [
  { label: "Layout", href: "#layout" },
  { label: "Components", href: "#components" },
  { label: "Spacing", href: "#spacing" },
];

export default function Workspace({
  children,
  menuItems = defaultMenuItems,
  menuTitle = "Creative Universe",
  activeMenuHref,
  onMenuItemClick,
}: WorkspaceProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const resolvedActiveHref =
    activeMenuHref ?? menuItems.find((item) => item.href === pathname)?.href;
  const handleMenuItemClick = (item: MenuOverlayItem, index: number) => {
    setMenuOpen(false);
    onMenuItemClick?.(item, index);
    if (item.href?.startsWith("/") && item.href !== pathname)
      router.push(item.href);
  };

  return (
    <div className="flex size-full flex-col overflow-hidden rounded-none bg-workspace shadow-big lg:rounded-2xl">
      <NavBar onMenuClick={() => setMenuOpen(true)} />
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <SideBar />
        <Content>{children}</Content>
      </div>
      <MenuOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        menuItems={menuItems}
        title={menuTitle}
        activeHref={resolvedActiveHref}
        onItemClick={handleMenuItemClick}
      />
    </div>
  );
}
