"use client";

import React from "react";
import Workspace, { type WorkspaceProps } from "../../content/workspace";
import type { MenuItem } from "../../content/menu";

export type ContainerProps = {
  className?: string;
  viewport?: "Mobile" | "Desktop";
  contentProps?: WorkspaceProps;
  menuItems?: MenuItem[];
  activeMenuHref?: string;
  menuTitle?: string;
  children?: React.ReactNode;
};

export default function Container({
  className,
  viewport,
  contentProps,
  menuItems,
  activeMenuHref,
  menuTitle,
  children,
}: ContainerProps) {
  const resolvedViewport = viewport || contentProps?.viewport || "Mobile";
  const isDesktop = resolvedViewport === "Desktop";

  return (
    <div
      className={
        className ||
        `flex h-dvh w-dvw flex-col items-stretch relative overflow-hidden ${
          isDesktop ? "p-6" : "p-2"
        }`
      }
    >
      {/* Sub App Content Component */}
      <Workspace
        viewport={resolvedViewport}
        {...contentProps}
        menuItems={menuItems}
        activeMenuHref={activeMenuHref}
        menuTitle={menuTitle}
        className={
          contentProps?.className ||
          "w-full h-full flex flex-col bg-[#f3fbff] rounded-[16px] shadow-[0px_14px_42px_0px_rgba(44,42,39,0.16)] overflow-hidden"
        }
      >
        {children}
      </Workspace>
    </div>
  );
}
