"use client";

import React from "react";
import { IconSpectrum } from "@/components/spectrum/IconSpectrum";
import { DEFAULT_SEND_CONFIG } from "./Send.config";
import type { SendProps } from "./Send.types";

export type { SendProps } from "./Send.types";

/**
 * Child Component: Tombol Kirim / Send (ArrowUp dengan Background Putih & Icon Hitam)
 */
export function Send({
  onClick,
  disabled = false,
  className = "",
  "aria-label": ariaLabel = DEFAULT_SEND_CONFIG.ariaLabel,
}: SendProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition-all outline-none focus-visible:ring-2 focus-visible:ring-white/40 [&_svg]:text-black [&_svg]:fill-black [&_svg]:stroke-black ${
        !disabled
          ? "cursor-pointer hover:bg-white/90 active:scale-95 shadow-md opacity-100"
          : "opacity-40 cursor-not-allowed"
      } ${className}`.trim()}
    >
      <IconSpectrum name={DEFAULT_SEND_CONFIG.iconName} />
    </button>
  );
}

export default Send;
