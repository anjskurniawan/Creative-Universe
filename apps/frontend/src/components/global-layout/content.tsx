"use client";

import type { ReactNode } from "react";

export type ContentProps = { className?: string; heading?: string; subheading?: string; viewport?: "Mobile" | "Desktop"; children?: ReactNode };

export default function Content({ className, children }: ContentProps) {
  return <div className={className ?? "relative flex h-[374px] w-full flex-col items-start p-4"} data-name="Content / Main">{children}</div>;
}
