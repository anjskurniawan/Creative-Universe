import type { ReactNode } from "react";
import type { ContentProps } from "../Content/Content";
import type { MenuOverlayItem } from "@/components/layout/Workspace/MenuOverlay/MenuOverlay";

export type WorkspaceProps = {
  className?: string;
  responsiveNavigation?: boolean;
  viewport?: "Mobile" | "Desktop";
  contentProps?: ContentProps;
  menuTitle?: string;
  menuItems?: MenuOverlayItem[];
  activeMenuHref?: string;
  onMenuItemClick?: (item: MenuOverlayItem, index: number) => void;
  children?: ReactNode;
  sidebarTheme?: "light" | "dark" | "retro";
  sidebarExpanded?: boolean;
  onToggleSidebarTheme?: () => void;
  onToggleSidebarRetro?: () => void;
  onToggleSidebarExpanded?: () => void;
  hideSidebar?: boolean;
  breadcrumbItems?: string[];
};
