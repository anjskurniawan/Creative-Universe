"use client";

import type { ReactNode } from "react";
import Workspace, { type WorkspaceProps } from "./workspace";
import type { MenuItem } from "./menu";

export type ContainerProps = { className?: string; viewport?: "Mobile" | "Desktop"; contentProps?: WorkspaceProps; menuItems?: MenuItem[]; activeMenuHref?: string; menuTitle?: string; children?: ReactNode; breadcrumbItems?: string[] };

export default function Container({ className, viewport, contentProps, menuItems, activeMenuHref, menuTitle, children, breadcrumbItems }: ContainerProps) {
  const resolvedViewport = viewport ?? contentProps?.viewport ?? "Mobile";
  const desktop = resolvedViewport === "Desktop";
  return <div className={className ?? `relative flex h-dvh w-dvw flex-col items-stretch overflow-hidden ${desktop ? "p-6" : "p-2"}`}><Workspace {...contentProps} viewport={resolvedViewport} menuItems={menuItems} activeMenuHref={activeMenuHref} menuTitle={menuTitle} breadcrumbItems={breadcrumbItems} className={contentProps?.className ?? "flex h-full w-full flex-col overflow-hidden rounded-[16px] bg-[#f3fbff] shadow-[0px_14px_42px_0px_rgba(44,42,39,0.16)]"}>{children}</Workspace></div>;
}
