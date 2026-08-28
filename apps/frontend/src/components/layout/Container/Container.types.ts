import type { ReactNode } from "react";
import type { WorkspaceProps } from "../Workspace/Workspace";
import type { MenuOverlayItem } from "@/components/layout/Workspace/MenuOverlay/MenuOverlay";

export type ContainerProps = {
  className?: string;
  responsiveNavigation?: boolean;
  viewport?: "Mobile" | "Desktop";
  contentProps?: WorkspaceProps;
  menuItems?: MenuOverlayItem[];
  activeMenuHref?: string;
  menuTitle?: string;
  children?: ReactNode;
  breadcrumbItems?: string[];
};
