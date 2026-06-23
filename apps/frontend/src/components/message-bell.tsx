"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { MaterialIcon } from "./material-icon";

interface MessageBellProps {
  userId: number;
  variant?: "light" | "dark" | "transparent-dark";
}

export function MessageBell({ userId, variant = "light" }: MessageBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const buttonClass =
    variant === "dark"
      ? "text-white hover:bg-white/10 focus:ring-white/30"
      : variant === "transparent-dark"
      ? `text-cu-ink hover:bg-white/45 hover:backdrop-blur-md focus:ring-white/30 transition-all duration-200 ${isOpen ? "bg-white/45 backdrop-blur-md" : ""}`
      : "text-cu-ink hover:bg-cu-panel-soft focus:ring-cu-focus/25";

  const dropdownClass =
    variant === "dark"
      ? "border-white/15 bg-[#111214]/98 backdrop-blur-xl shadow-2xl text-white"
      : "border-cu-line bg-cu-surface shadow-xl text-cu-ink";

  const dividerClass = variant === "dark" ? "border-white/10" : "border-cu-line";
  const titleClass = variant === "dark" ? "text-white" : "text-cu-ink";
  const mutedClass = variant === "dark" ? "text-white/65" : "text-cu-muted";
  const scrollbarClass = variant === "dark" ? "cu-popup-scrollbar-dark" : "cu-popup-scrollbar-light";

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={`relative inline-flex size-9 sm:size-10 items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 cursor-pointer ${buttonClass}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className="sr-only">Lihat pesan</span>
        <MaterialIcon name="chat" size="md" />
      </button>

      {isOpen && (
        <div
          className={`fixed left-4 right-4 top-[4.5rem] sm:absolute sm:left-auto sm:right-0 sm:top-auto z-50 mt-2 sm:w-80 overflow-hidden rounded-xl border p-2 ${dropdownClass} animate-slide-up`}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-2 py-2.5">
            <div className="flex min-w-0 items-center gap-3">
              <MaterialIcon name="chat" size="sm" className={mutedClass} />
              <div className="min-w-0">
                <h3 className={`text-sm font-semibold ${titleClass}`}>Pesan Masuk</h3>
                <p className={`mt-0.5 truncate text-xs ${mutedClass}`}>
                  Tidak ada pesan baru
                </p>
              </div>
            </div>
          </div>

          <div className={`mx-2 border-t ${dividerClass}`} />

          {/* List content */}
          <div role="menu" aria-label="Daftar pesan" className={`max-h-80 space-y-0.5 overflow-y-scroll p-2 ${scrollbarClass}`}>
            <div className="px-4 py-8 text-center">
              <MaterialIcon
                size="lg"
                name="chat_bubble_outline"
                className={`mx-auto mb-2 ${variant === "dark" ? "text-white/35" : "text-cu-soft"}`}
              />
              <p className={`text-sm ${mutedClass}`}>
                Belum ada pesan
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
