"use client";

import Workspace from "../Workspace/Workspace";
import type { ContainerProps } from "./Container.types";

export type { ContainerProps } from "./Container.types";

export default function Container({
  className,
  viewport,
  contentProps,
  menuItems,
  activeMenuHref,
  menuTitle,
  children,
  breadcrumbItems,
}: ContainerProps) {
  const resolvedViewport = viewport ?? contentProps?.viewport ?? "Mobile";
  return (
    <div
      className={
        className ??
        "relative flex h-dvh w-dvw flex-col items-stretch overflow-hidden p-3 lg:p-6"
      }
    >
      <Workspace
        {...contentProps}
        viewport={resolvedViewport}
        menuItems={menuItems}
        activeMenuHref={activeMenuHref}
        menuTitle={menuTitle}
        breadcrumbItems={breadcrumbItems}
        className={
          contentProps?.className ??
          "flex h-full w-full flex-col overflow-hidden rounded-[16px] bg-[#f3fbff] shadow-[0px_14px_42px_0px_rgba(44,42,39,0.16)]"
        }
      >
        {children}
      </Workspace>
    </div>
  );
}
