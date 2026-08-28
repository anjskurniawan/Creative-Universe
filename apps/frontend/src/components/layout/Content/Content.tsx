"use client";

import type { ContentProps } from "./Content.types";

export type { ContentProps } from "./Content.types";

export default function Content({ className, children }: ContentProps) {
  return (
    <div
      className={`cu-layout-content ${className ?? "relative flex h-[374px] w-full flex-col items-start p-4"}`}
      data-name="Content / Main"
    >
      {children}
    </div>
  );
}
