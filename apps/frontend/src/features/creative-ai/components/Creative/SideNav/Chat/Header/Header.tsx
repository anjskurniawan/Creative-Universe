"use client";

import { Button as AriaButton } from "react-aria-components";
import { Tooltip, TooltipTrigger } from "@react-spectrum/s2/Tooltip";
import { iconStyle } from "@react-spectrum/s2/style" with { type: "macro" };
import { IconSpectrum } from "@/components/spectrum/IconSpectrum";
import type { HeaderProps } from "./Header.types";

export function Header({ isOpen, isExpanded = true, onToggle }: HeaderProps) {
  // Render saat mode collapsed (Hanya icon Chat dengan Tooltip "Riwayat Percakapan")
  if (!isExpanded) {
    return (
      <TooltipTrigger placement="right">
        <AriaButton
          aria-label="Riwayat Percakapan"
          onPress={onToggle}
          className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/20"
        >
          <IconSpectrum name="Chat" styles={iconStyle({ size: "L" })} />
        </AriaButton>
        <Tooltip>Riwayat Percakapan</Tooltip>
      </TooltipTrigger>
    );
  }

  // Render saat mode expanded (Header seksi lengkap)
  return (
    <div className="flex items-center justify-between px-3 py-1.5 mt-2">
      {/* Tombol Collapsible dengan Label & Chevron (size S) */}
      <button
        type="button"
        onClick={onToggle}
        className="group flex items-center gap-2 text-left rounded-md hover:opacity-80 transition-opacity"
        aria-expanded={isOpen}
      >
        <span className="text-xs font-semibold text-white">
          Riwayat Percakapan
        </span>
        <span
          className={`text-white/40 transition-transform duration-200 group-hover:text-white/70 ${
            isOpen ? "rotate-90" : "rotate-0"
          }`}
        >
          <IconSpectrum
            name="ChevronRight"
            styles={iconStyle({ size: "S" })}
          />
        </span>
      </button>
    </div>
  );
}
