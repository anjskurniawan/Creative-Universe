"use client";

import React from "react";
import { Send, type SendBubbleProps } from "./Send";
import { Receive, type ReceiveBubbleProps } from "./Receive";
import { DEFAULT_BUBBLE_CHAT_CONFIG } from "./BubbleChat.config";
import type { BubbleChatProps } from "./BubbleChat.types";

export type { BubbleChatProps, BubbleChatSender } from "./BubbleChat.types";
export type { SendBubbleProps } from "./Send";
export type { ReceiveBubbleProps } from "./Receive";

/**
 * Komponen Universe: BubbleChat
 * Mengomposisikan dua child component:
 * 1. Send (<BubbleChat.Send /> atau <Send />) - Pesan dari user (dengan tombol aksi Edit & Copy saat hover)
 * 2. Receive (<BubbleChat.Receive /> atau <Receive />) - Jawaban langsung dari AI dengan dukungan Markdown & tombol aksi di bawahnya
 */
export function BubbleChat({
  sender = DEFAULT_BUBBLE_CHAT_CONFIG.defaultSender,
  content,
  avatarUrl,
  onEdit,
  onCopy,
  onShare,
  onLike,
  onDislike,
  onRegenerate,
  onMoreAction,
  className = "",
  children,
}: BubbleChatProps) {
  if (sender === "user") {
    return (
      <Send
        content={content}
        avatarUrl={avatarUrl}
        onEdit={onEdit}
        onCopy={onCopy}
        className={className}
      >
        {children}
      </Send>
    );
  }

  if (sender === "system") {
    return (
      <div className={`flex w-full justify-center my-2 text-xs text-white/40 ${className}`.trim()}>
        <div className="rounded-full bg-white/5 px-3 py-1 border border-white/5">
          {content || children}
        </div>
      </div>
    );
  }

  // default: "ai" / receive (Langsung teks jawaban dengan markdown dan action buttons)
  return (
    <Receive
      content={content}
      onCopy={onCopy}
      onShare={onShare}
      onLike={onLike}
      onDislike={onDislike}
      onRegenerate={onRegenerate}
      onMoreAction={onMoreAction}
      className={className}
    >
      {children}
    </Receive>
  );
}

// Subcomponent composition
BubbleChat.Send = Send;
BubbleChat.Receive = Receive;

export { Send, Receive };
export default BubbleChat;
