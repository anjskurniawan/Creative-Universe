"use client";

import React, { useState } from "react";
import { Tooltip, TooltipTrigger } from "@react-spectrum/s2/Tooltip";
import { Button as AriaButton } from "react-aria-components";
import { IconSpectrum } from "@/components/spectrum/IconSpectrum";
import { DEFAULT_SEND_CONFIG } from "./Send.config";
import type { SendBubbleProps } from "./Send.types";

export type { SendBubbleProps } from "./Send.types";

/**
 * Child Component: Send (Bubble Chat Pesan yang Dikirim oleh Pengguna)
 * Menampilkan bubble pesan di sebelah kanan (kotak dengan sedikit round: rounded-xl).
 * Tombol aksi (Edit & Copy) berpenampilan kotak sedikit round (rounded-lg) dan hanya muncul saat hover (group-hover).
 */
export function Send({
  content,
  avatarUrl,
  onEdit,
  onCopy,
  className = "",
  children,
}: SendBubbleProps) {
  const [copied, setCopied] = useState(false);

  const messageText = typeof content === "string" ? content : typeof children === "string" ? children : "";

  const handleCopy = () => {
    if (onCopy) {
      onCopy();
    } else if (messageText && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`group flex w-full justify-end gap-3 my-3 ${className}`.trim()}>
      <div className="flex flex-col items-end max-w-[85%] md:max-w-[75%]">
        {/* Bubble Box Pesan Terkirim: Kotak dengan sedikit round (rounded-xl) */}
        <div className="rounded-xl rounded-tr-xs bg-white/15 px-4 py-2.5 text-sm leading-relaxed text-white border border-white/10 shadow-sm backdrop-blur-sm">
          {content || children}
        </div>

        {/* Tombol Aksi di Bawah Bubble: Edit & Copy dengan tombol kotak sedikit round (rounded-lg) */}
        <div className="mt-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {/* Tombol Edit dengan Tooltip */}
          <TooltipTrigger delay={200}>
            <AriaButton
              onPress={onEdit}
              aria-label={DEFAULT_SEND_CONFIG.editLabel}
              className="flex size-7 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              <IconSpectrum name="Edit" />
            </AriaButton>
            <Tooltip>{DEFAULT_SEND_CONFIG.editLabel}</Tooltip>
          </TooltipTrigger>

          {/* Tombol Copy dengan Tooltip */}
          <TooltipTrigger delay={200}>
            <AriaButton
              onPress={handleCopy}
              aria-label={copied ? "Tersalin!" : DEFAULT_SEND_CONFIG.copyLabel}
              className="flex size-7 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              <IconSpectrum name={copied ? "Checkmark" : "Copy"} />
            </AriaButton>
            <Tooltip>{copied ? "Tersalin!" : DEFAULT_SEND_CONFIG.copyLabel}</Tooltip>
          </TooltipTrigger>
        </div>
      </div>

      {/* User Avatar (Opsional) */}
      {avatarUrl && (
        <div className="flex size-8 shrink-0 select-none items-center justify-center rounded-lg bg-white/20 text-white text-xs border border-white/15">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatarUrl} alt="User Avatar" className="size-full rounded-lg object-cover" />
        </div>
      )}
    </div>
  );
}

export default Send;
