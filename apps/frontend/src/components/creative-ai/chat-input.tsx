"use client";

import React from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export type CreativeAiChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: (text?: string) => void;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  isTyping?: boolean;
  className?: string;
};

export function CreativeAiChatInput({
  value,
  onChange,
  onSend,
  isFocused,
  onFocus,
  onBlur,
  isTyping = false,
  className = "",
}: CreativeAiChatInputProps) {
  const suggestions = [
    "Buatkan ide konten Instagram",
    "Bagaimana statistik performa tim?",
    "Buat draf caption promosi produk",
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={`w-full flex flex-col items-center gap-3 ${className}`}>
      {/* Input Box */}
      <div
        className={`relative flex items-center w-full rounded-full border transition-all duration-300 ${
          isFocused
            ? "border-[#6d46eb] bg-[#18181b] shadow-[0_0_20px_rgba(109,70,235,0.3)]"
            : "border-slate-300 bg-white/90 backdrop-blur-md shadow-lg hover:border-slate-400"
        }`}
      >
        <div className="pl-4 text-slate-400 flex items-center justify-center">
          <MaterialIcon name="auto_awesome" size="auto" className="text-lg text-[#6d46eb]" />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Tanyakan sesuatu pada Creative AI..."
          className={`w-full py-3.5 px-3 text-xs bg-transparent outline-none ${
            isFocused ? "text-white placeholder-slate-500" : "text-slate-800 placeholder-slate-400"
          }`}
        />

        <button
          type="button"
          disabled={!value.trim() || isTyping}
          onClick={() => onSend()}
          className="mr-2 flex size-8 items-center justify-center rounded-full bg-[#6d46eb] text-white transition hover:bg-[#5d35d9] disabled:opacity-40 disabled:hover:bg-[#6d46eb] cursor-pointer"
        >
          <MaterialIcon name="arrow_upward" size="auto" className="text-base font-bold" />
        </button>
      </div>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {suggestions.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSend(chip)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition cursor-pointer border ${
              isFocused
                ? "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
