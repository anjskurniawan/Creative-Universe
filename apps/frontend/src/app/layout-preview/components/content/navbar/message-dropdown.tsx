"use client";

import React, { useEffect, useRef } from "react";
import { MaterialIcon } from "@/components/material-icon";

export type MessageItem = {
  id: string;
  sender: string;
  avatarUrl?: string | null;
  preview: string;
  time: string;
  unread?: boolean;
};

export type MessageDropdownProps = {
  isOpen: boolean;
  onClose: () => void;
  messages?: MessageItem[];
};

export default function MessageDropdown({
  isOpen,
  onClose,
  messages = [],
}: MessageDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="absolute left-2 right-2 top-[calc(100%+8px)] z-50 flex w-auto flex-col overflow-hidden rounded-2xl p-1.5 border border-[#bdeaff] bg-[#f3fbff]/95 shadow-[0_10px_24px_rgba(0,4,117,0.18)] backdrop-blur-md"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#bdeaff]/30">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#04044A]">Pesan</h3>
        {messages.some((m) => m.unread) && (
          <span className="h-2 w-2 rounded-full bg-[#ec4899]" />
        )}
      </div>

      <ul className="m-0 flex max-h-[240px] list-none flex-col gap-1 overflow-y-auto p-1">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <li key={msg.id}>
              <button
                type="button"
                onClick={onClose}
                className={`flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors focus:outline-none hover:bg-[#dff6ff] ${
                  msg.unread ? "bg-[#dff6ff]/40" : ""
                }`}
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#04044A] text-[10px] font-semibold text-white">
                  {msg.sender.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate text-xs font-bold text-[#04044A]">{msg.sender}</p>
                    <span className="shrink-0 text-[10px] text-[#5b7190]">{msg.time}</span>
                  </div>
                  <p className="truncate text-[11px] text-[#5b7190]">{msg.preview}</p>
                </div>
              </button>
            </li>
          ))
        ) : (
          <li className="px-3 py-4 text-center text-xs text-[#5b7190]">Tidak ada pesan masuk</li>
        )}
      </ul>
    </div>
  );
}
