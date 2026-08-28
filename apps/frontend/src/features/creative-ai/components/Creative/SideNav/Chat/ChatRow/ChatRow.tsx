"use client";

import { Link as AriaLink } from "react-aria-components";
import { Tooltip, TooltipTrigger } from "@react-spectrum/s2/Tooltip";
import { iconStyle } from "@react-spectrum/s2/style" with { type: "macro" };
import { IconSpectrum } from "@/components/spectrum/IconSpectrum";
import type { ChatRowProps } from "./ChatRow.types";

export function ChatRow({ item, isExpanded, isActive }: ChatRowProps) {
  const handleClick = () => {
    if (item.isDisabled) return;
    if (item.onPress) {
      item.onPress();
    } else if (item.href && item.href !== "#") {
      window.location.href = item.href;
    }
  };

  // Render mode collapsed
  if (!isExpanded) {
    return (
      <TooltipTrigger placement="right">
        <AriaLink
          href={item.isDisabled ? undefined : item.href || "#"}
          isDisabled={item.isDisabled}
          aria-label={item["aria-label"] || item.label}
          onPress={handleClick}
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
            item.isDisabled
              ? "opacity-40 cursor-not-allowed text-white/30"
              : isActive
                ? "bg-white/15 text-white shadow-sm"
                : "text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          <IconSpectrum name="Chat" styles={iconStyle({ size: "L" })} />
        </AriaLink>
        <Tooltip>{item.label}</Tooltip>
      </TooltipTrigger>
    );
  }

  // Render mode expanded (Murni teks tanpa icon dengan tipografi body-sm dan truncated)
  return (
    <AriaLink
      href={item.isDisabled ? undefined : item.href || "#"}
      isDisabled={item.isDisabled}
      aria-label={item["aria-label"] || item.label}
      onPress={handleClick}
      className={`flex h-9 w-full items-center rounded-xl px-3 transition-all ${
        item.isDisabled
          ? "opacity-40 cursor-not-allowed text-white/30"
          : isActive
            ? "bg-white/15 text-white font-medium shadow-sm"
            : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      {/* Tipografi body-sm Spectrum dengan truncated text tanpa icon */}
      <span className="truncate text-sm font-normal text-white/90">
        {item.label}
      </span>
    </AriaLink>
  );
}
