"use client";

import React from "react";
import Link from "next/link";
import { IconMaterial } from "@/features/auth/components/IconMaterial/IconMaterial";
import { DEFAULT_CLICK_TO_ACTION_CONFIG } from "./ClickToAction.config";
import type { ClickToActionProps } from "./ClickToAction.types";

export type { ClickToActionProps } from "./ClickToAction.types";

/**
 * Komponen Tombol Aksi Masuk Portal Tamu (ClickToAction)
 */
export function ClickToAction({
  href,
  children,
  className = "",
  iconName = DEFAULT_CLICK_TO_ACTION_CONFIG.defaultIcon,
}: ClickToActionProps) {
  return (
    <Link
      href={href}
      className={`cu-style inline-flex h-12 items-center rounded-[36px] bg-white p-1 font-sans transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:h-14 ${className}`.trim()}
    >
      <span className="flex items-center justify-center py-2 pl-9 pr-4 text-center text-base font-medium leading-5 whitespace-nowrap text-brand md:py-2.5 md:pl-11 md:pr-5 md:text-lg md:leading-6">
        {children}
      </span>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-white md:size-12">
        <IconMaterial name={iconName} className="text-xl md:text-2xl" />
      </span>
    </Link>
  );
}

// Backward-compatible alias
export const ButtonAction = ClickToAction;

export default ClickToAction;
