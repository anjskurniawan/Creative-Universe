"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { apiFetch } from "@/lib/api";
import { getEchoClient } from "@/lib/echo";
import {
  LOCAL_NOTIFICATIONS_UPDATED_EVENT,
  markAllLocalNotificationsRead,
  markLocalNotificationRead,
  readLocalNotifications,
} from "@/lib/local-notifications";
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
  variant?: "light" | "dark" | "transparent-dark";
}

async function requestNotifications(): Promise<NotificationPayload> {
  return apiFetch<NotificationPayload>("/notifications");
}

function mergeNotifications(serverItems: NotificationItem[], userId: number): NotificationItem[] {
  const localItems = readLocalNotifications(userId);
  return [...localItems, ...serverItems].sort((left, right) => {
    const leftTime = left.created_at ? new Date(left.created_at).getTime() : 0;
    const rightTime = right.created_at ? new Date(right.created_at).getTime() : 0;
    return rightTime - leftTime;
  });
}

export function NotificationBell({ userId, variant = "light" }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const applyPayload = (payload: NotificationPayload) => {
    const mergedNotifications = mergeNotifications(payload.notifications, userId);
    setNotifications(mergedNotifications);
    setUnreadCount(mergedNotifications.filter((item) => !item.is_read).length);
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

  useEffect(() => {
    const refreshLocalNotifications = async () => {
      try {
        const payload = await requestNotifications();
        applyPayload(payload);
      } catch {
        const mergedNotifications = mergeNotifications([], userId);
        setNotifications(mergedNotifications);
        setUnreadCount(mergedNotifications.filter((item) => !item.is_read).length);
      }
    };

    window.addEventListener(LOCAL_NOTIFICATIONS_UPDATED_EVENT, refreshLocalNotifications);

    return () => {
      window.removeEventListener(LOCAL_NOTIFICATIONS_UPDATED_EVENT, refreshLocalNotifications);
    };
  }, [userId]);

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

  const markAsRead = async (notification: NotificationItem) => {
    if (notification.is_read) return;

    if (notification.type === "local") {
      const updated = markLocalNotificationRead(notification.id, userId);
      if (!updated) return;

      setNotifications((items) =>
        items.map((item) => (item.id === updated.id ? updated : item))
      );
      setUnreadCount((count) => Math.max(0, count - 1));
      return;
    }

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
    const hasLocalUnread = notifications.some(
      (item) => item.type === "local" && !item.is_read
    );

    if (hasLocalUnread) {
      markAllLocalNotificationsRead(userId);
    }

    try {
      await apiFetch("/notifications/read-all", { method: "PATCH" });
      setNotifications((items) => items.map((item) => ({
        ...item,
        is_read: true,
        read_at: item.read_at ?? new Date().toISOString(),
      })));
      setUnreadCount(0);
    } catch {
      if (notifications.some((item) => item.type !== "local")) {
        setError("Semua notifikasi belum dapat ditandai sudah dibaca.");
      } else {
        setNotifications((items) => items.map((item) => ({
          ...item,
          is_read: true,
          read_at: item.read_at ?? new Date().toISOString(),
        })));
        setUnreadCount(0);
      }
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
      ? "text-white hover:bg-white/10 focus:ring-white/30"
      : variant === "transparent-dark"
      ? `text-cu-ink hover:bg-white/45 hover:backdrop-blur-md focus:ring-white/30 transition-all duration-200 ${isOpen ? "bg-white/45 backdrop-blur-md" : ""}`
      : "text-cu-ink hover:bg-cu-panel-soft focus:ring-cu-focus/25";

  const badgeBorderClass = variant === "dark" ? "border-[#0a0a0a]" : "border-cu-surface";

  const dropdownClass =
    variant === "dark"
      ? "border-white/15 bg-[#111214]/98 backdrop-blur-xl shadow-2xl text-white"
      : "border-cu-line bg-cu-surface shadow-xl text-cu-ink";

  const dividerClass = variant === "dark" ? "border-white/10" : "border-cu-line";
  const titleClass = variant === "dark" ? "text-white" : "text-cu-ink";
  const mutedClass = variant === "dark" ? "text-white/65" : "text-cu-muted";
  const scrollbarClass = variant === "dark" ? "cu-popup-scrollbar-dark" : "cu-popup-scrollbar-light";

  const itemHoverClass = variant === "dark" ? "hover:bg-white/5" : "hover:bg-cu-panel-soft";

  const unreadItemClass =
    variant === "dark" ? "bg-blue-400/15" : "bg-cu-info-soft";

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={`relative inline-flex size-9 sm:size-10 items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 cursor-pointer ${buttonClass}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
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
          className={`fixed left-4 right-4 top-[4.5rem] sm:absolute sm:left-auto sm:right-0 sm:top-auto z-50 mt-2 sm:w-80 overflow-hidden rounded-xl border p-2 ${dropdownClass} animate-slide-up`}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-2 py-2.5">
            <div className="flex min-w-0 items-center gap-3">
              <MaterialIcon name="notifications" size="sm" className={mutedClass} />
              <div className="min-w-0">
                <h3 className={`text-sm font-semibold ${titleClass}`}>Notifikasi</h3>
                <p className={`mt-0.5 truncate text-xs ${mutedClass}`}>
                  {unreadCount > 0 ? `${unreadCount} belum dibaca` : "Semua sudah dibaca"}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className={`shrink-0 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors cursor-pointer ${variant === "dark" ? "text-blue-300 hover:bg-white/10 hover:text-blue-200" : "text-cu-info hover:bg-cu-panel-soft hover:text-cu-info-hover"}`}
              >
                Tandai semua
              </button>
            )}
          </div>

          <div className={`mx-2 border-t ${dividerClass}`} />

          {/* List content */}
          <div role="menu" aria-label="Daftar notifikasi" className={`max-h-80 space-y-0.5 overflow-y-scroll p-2 ${scrollbarClass}`}>
            {error && <div className="p-3 text-xs text-cu-danger text-center">{error}</div>}
            
            {isLoading ? (
              <div className={`px-4 py-8 text-center text-xs ${mutedClass}`}>
                Memuat notifikasi...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <MaterialIcon
                  size="lg"
                  className={`cu-icon-notifications-off mx-auto mb-2 ${variant === "dark" ? "text-white/35" : "text-cu-soft"}`}
                />
                <p className={`text-sm ${mutedClass}`}>
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
                          variant === "dark" ? "text-white/60" : "text-cu-muted"
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
                      className={`block rounded-lg px-3 py-2.5 transition-colors focus:outline-none ${itemHoverClass} ${
                        isUnread ? unreadItemClass : ""
                      }`}
                      role="menuitem"
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
                      className={`block w-full rounded-lg border-0 bg-transparent px-3 py-2.5 text-left transition-colors cursor-pointer focus:outline-none ${itemHoverClass} ${
                        isUnread ? unreadItemClass : ""
                      }`}
                      role="menuitem"
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
