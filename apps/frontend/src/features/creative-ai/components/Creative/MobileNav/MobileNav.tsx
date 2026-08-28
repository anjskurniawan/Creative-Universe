"use client";

import React from "react";
import { IconSpectrum } from "@/components/spectrum/IconSpectrum";
import { DEFAULT_MOBILE_NAV_CONFIG } from "./MobileNav.config";
import type { MobileNavProps } from "./MobileNav.types";

export type { MobileNavProps } from "./MobileNav.types";

/**
 * Komponen Header Navigasi Mobile (MobileNav) untuk Creative Layout (Clean & borderless)
 */
export function MobileNav({ onOpenSidebar, className = "" }: MobileNavProps) {
  return (
    <header
      className={`flex h-14 w-full shrink-0 items-center px-4 bg-transparent border-0 md:hidden z-30 ${className}`.trim()}
    >
      <button
        type="button"
        aria-label={DEFAULT_MOBILE_NAV_CONFIG.ariaLabel}
        onClick={onOpenSidebar}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/20"
      >
        <IconSpectrum name={DEFAULT_MOBILE_NAV_CONFIG.iconName} />
      </button>
    </header>
  );
}

export default MobileNav;
