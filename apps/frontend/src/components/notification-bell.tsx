"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { apiFetch } from "@/lib/api";
import { getEchoClient } from "@/lib/echo";
import { MaterialIcon } from "./material-icon";

interface NotificationItem {
  id: string;
  type: string;
  message: string;
  url: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string | null;
}

interface NotificationPayload {
  notifications: NotificationItem[];
  unread_count: number;
}

interface NotificationBellProps {
  userId: number;
  variant?: "light" | "dark";
}

async function requestNotifications(): Promise<NotificationPayload> {
  return apiFetch<NotificationPayload>("/notifications");
}

export function NotificationBell({ userId, variant = "light" }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const applyPayload = (payload: NotificationPayload) => {
    setNotifications(payload.notifications);
    setUnreadCount(payload.unread_count);
  };

  useEffect(() => {
    let active = true;

    const loadNotifications = async () => {
      try {
        const payload = await requestNotifications();
        if (active) applyPayload(payload);
      } catch {
        if (active) setError("Notifikasi belum dapat dimuat.");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadNotifications();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const echo = getEchoClient();
    if (!echo) return;

    const channelName = `App.Models.Core.User.${userId}`;
    const channel = echo.private(channelName);
    const refresh = () => {
      void requestNotifications().then(applyPayload).catch(() => undefined);
    };

    channel.notification(refresh);

    return () => {
      channel.stopListeningForNotification(refresh);
      echo.leave(channelName);
    };
  }, [userId]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const markAsRead = async (notification: NotificationItem) => {
    if (notification.is_read) return;

    try {
      const updated = await apiFetch<NotificationItem>(
        `/notifications/${notification.id}/read`,
        { method: "PATCH" }
      );
      setNotifications((items) =>
        items.map((item) => (item.id === updated.id ? updated : item))
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch {
      setError("Notifikasi gagal ditandai sudah dibaca.");
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiFetch("/notifications/read-all", { method: "PATCH" });
      setNotifications((items) =>
        items.map((item) => ({ ...item, is_read: true }))
      );
      setUnreadCount(0);
    } catch {
      setError("Semua notifikasi belum dapat ditandai sudah dibaca.");
    }
  };

  // Helper function to format date dynamically client-side
  const getRelativeTime = (dateStr: string | null) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
      if (seconds < 60) return "Baru saja";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} menit yang lalu`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} jam yang lalu`;
      const days = Math.floor(hours / 24);
      if (days < 30) return `${days} hari yang lalu`;
      return date.toLocaleDateString("id-ID");
    } catch {
      return "";
    }
  };

  const buttonClass =
    variant === "dark"
      ? "text-white hover:border-white/20 hover:bg-white/10 focus:ring-white/30"
      : "text-cu-ink hover:border-cu-border hover:bg-cu-panel-soft focus:ring-cu-border-hover";

  const badgeBorderClass = variant === "dark" ? "border-[#0a0a0a]" : "border-cu-surface";

  const dropdownClass =
    variant === "dark"
      ? "border-white/10 bg-[#0d0d0d]/90 backdrop-blur-md shadow-2xl text-white"
      : "border-cu-line bg-cu-panel shadow-xl text-cu-ink";

  const headerClass =
    variant === "dark"
      ? "border-white/10 bg-black/40 text-white"
      : "border-cu-line bg-cu-panel-soft";

  const itemHoverClass = variant === "dark" ? "hover:bg-white/5" : "hover:bg-cu-panel-soft";

  const unreadItemClass =
    variant === "dark" ? "bg-blue-500/10" : "bg-cu-info-soft";

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={`relative inline-flex size-9 sm:size-10 items-center justify-center rounded-full border border-transparent transition-colors focus:outline-none focus:ring-1 cursor-pointer ${buttonClass}`}
      >
        <span className="sr-only">Lihat notifikasi</span>
        <MaterialIcon name="notifications" size="md" />

        {unreadCount > 0 && (
          <div
            className={`pointer-events-none absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 bg-cu-danger px-1 ${badgeBorderClass}`}
          >
            <span className="text-xs font-bold leading-none text-cu-surface">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </div>
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute right-[-80px] sm:right-0 z-50 mt-2 w-[calc(100vw-2rem)] sm:w-80 overflow-hidden rounded-xl border ${dropdownClass} animate-slide-up`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between border-b px-4 py-3 ${headerClass}`}>
            <h3 className="text-sm font-semibold">Notifikasi</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-medium text-cu-info transition-colors hover:text-cu-info-hover border-0 bg-transparent cursor-pointer"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          {/* List content */}
          <div className="max-h-80 divide-y divide-cu-line overflow-y-auto">
            {error && <div className="p-3 text-xs text-cu-danger text-center">{error}</div>}
            
            {isLoading ? (
              <div className="px-4 py-8 text-center text-xs text-cu-muted">
                Memuat notifikasi...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <MaterialIcon
                  size="lg"
                  className="cu-icon-notifications-off mx-auto mb-2 text-cu-soft"
                />
                <p className={`text-sm ${variant === "dark" ? "text-white/40" : "text-cu-muted"}`}>
                  Belum ada notifikasi
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const isUnread = !notification.is_read;
                const relativeTime = getRelativeTime(notification.created_at);

                const content = (
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm text-left ${
                          variant === "dark" ? "text-white/95" : "text-cu-ink"
                        } ${isUnread ? "font-medium" : ""}`}
                      >
                        {notification.message}
                      </p>
                      <p
                        className={`mt-1 text-xs text-left ${
                          variant === "dark" ? "text-white/40" : "text-cu-muted"
                        }`}
                      >
                        {relativeTime}
                      </p>
                    </div>
                    {isUnread && (
                      <span
                        className="mt-1.5 size-3 shrink-0 rounded-full bg-cu-info animate-pulse"
                        title="Belum dibaca"
                      />
                    )}
                  </div>
                );

                if (notification.url) {
                  return (
                    <Link
                      key={notification.id}
                      href={notification.url}
                      onClick={() => {
                        void markAsRead(notification);
                        setIsOpen(false);
                      }}
                      className={`block px-4 py-3 transition-colors ${itemHoverClass} ${
                        isUnread ? unreadItemClass : ""
                      }`}
                    >
                      {content}
                    </Link>
                  );
                } else {
                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => void markAsRead(notification)}
                      className={`w-full block px-4 py-3 transition-colors text-left border-0 bg-transparent cursor-pointer ${itemHoverClass} ${
                        isUnread ? unreadItemClass : ""
                      }`}
                    >
                      {content}
                    </button>
                  );
                }
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
