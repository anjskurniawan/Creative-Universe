"use client";

import React from "react";
import SubAppContent, { type SubAppContentProps } from "../../content/content";

export type SubAppLayoutProps = {
  className?: string;
  contentProps?: SubAppContentProps;
  children?: React.ReactNode;
};

export default function SubAppLayout({
  className,
  contentProps,
  children,
}: SubAppLayoutProps) {
  return (
    <div
      className={
        className ||
        "flex h-dvh w-dvw flex-col items-stretch p-2 relative"
      }
      data-node-id="112:743"
      data-name="Sub App Layout"
    >
      {/* Sub App Content Component */}
      <SubAppContent {...contentProps} className="w-full h-full flex flex-col bg-[#f3fbff] rounded-[16px] shadow-[0px_14px_42px_0px_rgba(44,42,39,0.16)] overflow-hidden">
        {children}
      </SubAppContent>
    </div>
  );
}
