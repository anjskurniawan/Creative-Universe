"use client";

import Workspace from "../Workspace/Workspace";
import type { ContainerProps } from "./Container.types";

export type { ContainerProps } from "./Container.types";

export default function Container({
  className,
  responsiveNavigation = false,
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
      className={`${
        className ??
        "relative box-border flex h-screen min-h-screen w-screen max-w-none flex-col items-stretch overflow-hidden p-0 lg:p-6"
      }`}
    >
      <Workspace
        {...contentProps}
        responsiveNavigation={responsiveNavigation}
        viewport={resolvedViewport}
        menuItems={menuItems}
        activeMenuHref={activeMenuHref}
        menuTitle={menuTitle}
        breadcrumbItems={breadcrumbItems}
        className={
          contentProps?.className ??
          "box-border flex h-full w-full flex-col overflow-hidden rounded-none bg-[#f3fbff] shadow-[0px_14px_42px_0px_rgba(44,42,39,0.16)] lg:rounded-[16px]"
        }
      >
        {children}
      </Workspace>
    </div>
  );
}
