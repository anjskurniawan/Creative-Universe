"use client";

import NavBar from "@/components/layout/NavBar/NavBar";
import SideBar from "@/components/layout/SideBar";
import Content from "../Content/Content";
import MenuOverlay from "@/components/layout/Workspace/MenuOverlay/MenuOverlay";
import { useWorkspaceLogic } from "./Workspace.logic";
import type { WorkspaceProps } from "./Workspace.types";

export type { WorkspaceProps } from "./Workspace.types";

export default function Workspace({
  className,
  responsiveNavigation = false,
  viewport = "Mobile",
  contentProps,
  menuTitle,
  menuItems = [],
  activeMenuHref = "",
  onMenuItemClick,
  children,
  sidebarTheme = "light",
  sidebarExpanded = true,
  onToggleSidebarExpanded,
  hideSidebar = false,
  breadcrumbItems,
}: WorkspaceProps) {
  const {
    pathname,
    menuOpen,
    setMenuOpen,
    resolvedActiveHref,
    sidebarItems,
    activeMenuLabel,
    handleMenuItemClick,
  } = useWorkspaceLogic(menuItems, activeMenuHref, onMenuItemClick);
  const desktop = viewport === "Desktop";
  const isCreativeAi = pathname.startsWith("/creative-ai");
  const resolvedBreadcrumbs = breadcrumbItems ?? [
    menuTitle ?? "Sub App",
    activeMenuLabel,
  ];
  return (
    <div className={className ?? "flex size-full flex-col overflow-hidden"}>
      <NavBar
        viewport={viewport}
        responsiveNavigation={responsiveNavigation}
        theme={sidebarTheme}
        onMenuClick={() => setMenuOpen(true)}
        breadcrumbItems={resolvedBreadcrumbs}
      />
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {desktop && !isCreativeAi && !hideSidebar && (
          <SideBar
            className="hidden h-full lg:flex"
            expanded={sidebarExpanded}
            primaryItems={sidebarItems}
            activeHref={resolvedActiveHref}
            onToggleExpanded={onToggleSidebarExpanded}
          />
        )}
        <Content
          {...contentProps}
          viewport={viewport}
          className={
            contentProps?.className ??
            `flex h-full min-h-0 flex-1 flex-col items-start overflow-y-auto p-4 pb-6 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden`
          }
        >
          {children}
        </Content>
      </div>
      <MenuOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        menuItems={menuItems}
        onItemClick={handleMenuItemClick}
        activeHref={resolvedActiveHref}
        title={menuTitle}
      />
    </div>
  );
}
