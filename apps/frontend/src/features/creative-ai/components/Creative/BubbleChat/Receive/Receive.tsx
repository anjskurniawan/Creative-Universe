"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button as AriaButton } from "react-aria-components";
import { Tooltip, TooltipTrigger } from "@react-spectrum/s2/Tooltip";
import {
  Menu,
  MenuTrigger,
  MenuItem,
  Text,
  MenuSection,
} from "@react-spectrum/s2/Menu";
import { IconSpectrum } from "@/components/spectrum/IconSpectrum";
import { DEFAULT_RECEIVE_CONFIG } from "./Receive.config";
import type { ReceiveBubbleProps } from "./Receive.types";

export type { ReceiveBubbleProps } from "./Receive.types";

/**
 * Child Component: Receive (Jawaban Balasan AI)
 * - Ditampilkan langsung tanpa bubble pill, tanpa avatar, dan tanpa label model/waktu.
 * - Mendukung format Markdown lengkap.
 * - Memiliki baris tombol aksi di bawah jawaban dengan bentuk kotak sedikit round (rounded-lg):
 *   1. Copy Respond
 *   2. Buat Link Berbagi
 *   3. Love this
 *   4. Need Improvement
 *   5. Regenerate
 *   6. More (Menu Spectrum text-only: Laporkan Masalah, Export PDF, Baca)
 */
export function Receive({
  content,
  onCopy,
  onShare,
  onLike,
  onDislike,
  onRegenerate,
  onMoreAction,
  className = "",
  children,
}: ReceiveBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const rawText =
    typeof content === "string"
      ? content
      : typeof children === "string"
      ? children
      : "";

  const handleCopy = () => {
    if (onCopy) {
      onCopy();
    } else if (rawText && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLike = () => {
    setLiked((prev) => !prev);
    if (!liked && disliked) setDisliked(false);
    onLike?.();
  };

  const handleDislike = () => {
    setDisliked((prev) => !prev);
    if (!disliked && liked) setLiked(false);
    onDislike?.();
  };

  return (
    <div className={`flex flex-col w-full items-start my-3 ${className}`.trim()}>
      {/* Konten Jawaban Berformat Markdown */}
      <div className="w-full max-w-full font-sans text-sm md:text-base leading-relaxed text-white/90">
        {rawText ? (
          <div className="space-y-3 [&_p]:leading-relaxed [&_p]:text-white/90 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_strong]:font-semibold [&_strong]:text-white [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-[#121214] [&_pre]:p-4 [&_a]:text-blue-400 [&_a]:underline">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {rawText}
            </ReactMarkdown>
          </div>
        ) : (
          content || children
        )}
      </div>

      {/* Baris Tombol Aksi di Bawah Jawaban (Kotak sedikit round: rounded-lg) */}
      <div className="mt-3 flex flex-wrap items-center gap-1">
        {/* 1. Copy Respond */}
        <TooltipTrigger delay={200}>
          <AriaButton
            onPress={handleCopy}
            aria-label={copied ? "Tersalin!" : DEFAULT_RECEIVE_CONFIG.copyLabel}
            className="flex size-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            <IconSpectrum name={copied ? "Checkmark" : "Copy"} />
          </AriaButton>
          <Tooltip>{copied ? "Tersalin!" : DEFAULT_RECEIVE_CONFIG.copyLabel}</Tooltip>
        </TooltipTrigger>

        {/* 2. Buat Link Berbagi */}
        <TooltipTrigger delay={200}>
          <AriaButton
            onPress={onShare}
            aria-label={DEFAULT_RECEIVE_CONFIG.shareLabel}
            className="flex size-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            <IconSpectrum name="Link" />
          </AriaButton>
          <Tooltip>{DEFAULT_RECEIVE_CONFIG.shareLabel}</Tooltip>
        </TooltipTrigger>

        {/* 3. Love this */}
        <TooltipTrigger delay={200}>
          <AriaButton
            onPress={handleLike}
            aria-label={DEFAULT_RECEIVE_CONFIG.likeLabel}
            className={`flex size-8 items-center justify-center rounded-lg transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${
              liked
                ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                : "text-white/50 hover:bg-white/10 hover:text-white"
            }`}
          >
            <IconSpectrum name="Heart" />
          </AriaButton>
          <Tooltip>{DEFAULT_RECEIVE_CONFIG.likeLabel}</Tooltip>
        </TooltipTrigger>

        {/* 4. Need Improvement */}
        <TooltipTrigger delay={200}>
          <AriaButton
            onPress={handleDislike}
            aria-label={DEFAULT_RECEIVE_CONFIG.dislikeLabel}
            className={`flex size-8 items-center justify-center rounded-lg transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${
              disliked
                ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                : "text-white/50 hover:bg-white/10 hover:text-white"
            }`}
          >
            <IconSpectrum name="ThumbDown" />
          </AriaButton>
          <Tooltip>{DEFAULT_RECEIVE_CONFIG.dislikeLabel}</Tooltip>
        </TooltipTrigger>

        {/* 5. Regenerate */}
        <TooltipTrigger delay={200}>
          <AriaButton
            onPress={onRegenerate}
            aria-label={DEFAULT_RECEIVE_CONFIG.regenerateLabel}
            className="flex size-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            <IconSpectrum name="Refresh" />
          </AriaButton>
          <Tooltip>{DEFAULT_RECEIVE_CONFIG.regenerateLabel}</Tooltip>
        </TooltipTrigger>

        {/* 6. More (Menu Spectrum Text-Only) */}
        <MenuTrigger direction="top" align="start">
          <AriaButton
            aria-label={DEFAULT_RECEIVE_CONFIG.moreLabel}
            className="flex size-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            <IconSpectrum name="More" />
          </AriaButton>
          <Menu
            aria-label="Pilihan Tambahan"
            onAction={(key) => onMoreAction?.(String(key))}
          >
            <MenuSection>
              <MenuItem id="report" textValue={DEFAULT_RECEIVE_CONFIG.moreMenu.report}>
                <Text slot="label">{DEFAULT_RECEIVE_CONFIG.moreMenu.report}</Text>
              </MenuItem>
              <MenuItem id="export-pdf" textValue={DEFAULT_RECEIVE_CONFIG.moreMenu.exportPdf}>
                <Text slot="label">{DEFAULT_RECEIVE_CONFIG.moreMenu.exportPdf}</Text>
              </MenuItem>
              <MenuItem id="read-aloud" textValue={DEFAULT_RECEIVE_CONFIG.moreMenu.readAloud}>
                <Text slot="label">{DEFAULT_RECEIVE_CONFIG.moreMenu.readAloud}</Text>
              </MenuItem>
            </MenuSection>
          </Menu>
        </MenuTrigger>
      </div>
    </div>
  );
}

export default Receive;
