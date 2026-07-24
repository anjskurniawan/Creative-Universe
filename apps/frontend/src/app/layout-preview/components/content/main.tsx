"use client";

import React from "react";

export type ContentMainProps = {
  className?: string;
  heading?: string;
  subheading?: string;
  children?: React.ReactNode;
};

export default function ContentMain({
  className,
  heading = "Heading",
  subheading = "This is Main Content Area",
  children,
}: ContentMainProps) {
  return (
    <div
      className={className || "flex flex-col items-start p-4 w-full h-[374px] relative"}
      data-node-id="112:747"
      data-name="Content / Main"
    >
      <div className="flex flex-col gap-1 items-start w-full" data-node-id="112:767" data-name="Content Header">
        <h1
          className="font-sans font-medium text-[32px] tracking-[-0.64px] text-[#3b4446] leading-none"
          data-node-id="112:760"
        >
          {heading}
        </h1>
        <p
          className="font-sans font-normal text-sm tracking-[-0.28px] text-[#7d7c7c] leading-normal"
          data-node-id="112:763"
        >
          {subheading}
        </p>
      </div>
      {children}
    </div>
  );
}
