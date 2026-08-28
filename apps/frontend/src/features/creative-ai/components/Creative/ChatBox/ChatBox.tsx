"use client";

import React from "react";
import { Attachment } from "./Attachment";
import { Model, type ModelItem } from "./Model";
import { Send } from "./Send";
import { DEFAULT_CHAT_BOX_CONFIG } from "./ChatBox.config";
import { useChatBoxLogic } from "./ChatBox.logic";
import type { ChatBoxProps } from "./ChatBox.types";

export type { ChatBoxProps } from "./ChatBox.types";
export type { ModelItem } from "./Model";

/**
 * Komponen Input Field ChatBox Modular dengan Child Components:
 * - Attachment (tombol + dengan Spectrum S2 Menu terstruktur)
 * - Model (tombol Model dengan Spectrum S2 Menu)
 * - Send (tombol ArrowUp background putih)
 */
export function ChatBox({
  value,
  onChange,
  onSubmit,
  onSelectAttachment,
  onSelectModel,
  models,
  selectedModel = DEFAULT_CHAT_BOX_CONFIG.defaultModel,
  placeholder = DEFAULT_CHAT_BOX_CONFIG.placeholder,
  disabled = false,
  className = "",
}: ChatBoxProps) {
  const {
    value: currentValue,
    handleChange,
    handleKeyDown,
    handleSubmit,
    handleSend,
    canSubmit,
  } = useChatBoxLogic({
    value,
    onChange,
    onSubmit,
    disabled,
  });

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex w-full max-w-3xl items-center rounded-full border border-white/10 bg-white/5 p-2 backdrop-blur-xl transition-all focus-within:border-white/30 focus-within:bg-white/10 focus-within:ring-2 focus-within:ring-white/10 ${className}`.trim()}
    >
      {/* Child Component: Attachment (+) dengan Spectrum S2 Menu */}
      <Attachment
        onSelectAttachment={onSelectAttachment}
        disabled={disabled}
      />

      {/* Input Field Teks dengan jarak simetris ke Attachment */}
      <input
        type="text"
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full min-w-0 flex-1 bg-transparent pl-2 pr-2 py-2 font-sans text-base text-white placeholder-white/40 outline-none"
      />

      {/* Child Component: Model (Spectrum S2 Menu) & Send */}
      <div className="flex items-center gap-2 shrink-0">
        <Model
          selectedModel={selectedModel}
          onSelectModel={onSelectModel}
          models={models}
          disabled={disabled}
        />

        <Send onClick={handleSend} disabled={!canSubmit || disabled} />
      </div>
    </form>
  );
}

export default ChatBox;
