"use client";
import { useEffect, useRef } from "react";
import { MaterialIcon } from "@/components/material-icon";
export type NotificationItem = {
  id: string;
  title: string;
  content: string;
  time: string;
  read?: boolean;
  icon?: string;
};
export default function NotificationDropdown({
  isOpen,
  onClose,
  notifications = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  notifications?: NotificationItem[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const close = (event: MouseEvent) => {
      if ((event.target as Element).closest("[data-dropdown-trigger]")) return;
      if (ref.current && !ref.current.contains(event.target as Node)) onClose();
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div
      ref={ref}
      className="absolute right-0 top-[calc(100%+8px)] z-50 flex w-[280px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-[#bdeaff] bg-[#f3fbff]/95 p-1.5 shadow-[0_10px_24px_rgba(0,4,117,0.18)] backdrop-blur-md max-lg:fixed max-lg:left-2 max-lg:right-2 max-lg:top-[72px] max-lg:w-auto max-lg:max-w-none"
    >
      <div className="flex items-center justify-between border-b border-[#bdeaff]/30 px-3 py-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#04044a]">
          Notifikasi
        </h3>
        {notifications.some((notification) => !notification.read) && (
          <span className="size-2 rounded-full bg-[#ec4899]" />
        )}
      </div>
      <ul className="m-0 flex max-h-[240px] list-none flex-col gap-1 overflow-y-auto p-1">
        {notifications.length ? (
          notifications.map((notification) => (
            <li key={notification.id}>
              <button
                type="button"
                onClick={onClose}
                className={`flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-[#dff6ff] ${!notification.read ? "bg-[#dff6ff]/40" : ""}`}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#dff6ff] text-[#04044a]">
                  <MaterialIcon
                    name={notification.icon ?? "notifications"}
                    size="sm"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-1">
                    <b className="truncate text-xs text-[#04044a]">
                      {notification.title}
                    </b>
                    <small className="text-[10px] text-[#5b7190]">
                      {notification.time}
                    </small>
                  </span>
                  <span className="line-clamp-2 block text-[10px] leading-normal text-[#5b7190]">
                    {notification.content}
                  </span>
                </span>
              </button>
            </li>
          ))
        ) : (
          <li className="px-3 py-4 text-center text-xs text-[#5b7190]">
            Tidak ada notifikasi baru
          </li>
        )}
      </ul>
    </div>
  );
}
