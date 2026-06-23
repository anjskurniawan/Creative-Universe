"use client";

import Link from "next/link";
import { MaterialIcon } from "./material-icon";

interface MessageBellProps {
  userId: number;
  variant?: "light" | "dark" | "transparent-dark";
}

export function MessageBell({ variant = "light" }: MessageBellProps) {
  // Unread count logic could go here later
  const unreadCount = 0;

  const buttonClass =
    variant === "dark"
      ? "text-white hover:bg-white/10 focus:ring-white/30"
      : variant === "transparent-dark"
      ? "text-cu-ink hover:bg-white/45 hover:backdrop-blur-md focus:ring-white/30 transition-all duration-200"
      : "text-cu-ink hover:bg-cu-panel-soft focus:ring-cu-focus/25";

  return (
    <Link
      href="/messages"
      className={`relative inline-flex size-9 sm:size-10 items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 cursor-pointer ${buttonClass}`}
      aria-label="Pesan Masuk"
    >
      <MaterialIcon name="chat" size="md" />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
          <span className="sr-only">{unreadCount} pesan belum dibaca</span>
        </span>
      )}
    </Link>
  );
}
