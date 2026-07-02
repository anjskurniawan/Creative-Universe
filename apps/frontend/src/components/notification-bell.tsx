"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useRef } from "react";
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
  variant?: "light" | "dark";
}

const TOAST_VISIBLE_MS = 6000;
const TOAST_EXIT_MS = 280;
const NOTIFICATION_POLL_MS = 2000;

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
  const [toastNotification, setToastNotification] = useState<NotificationItem | null>(null);
  const [isToastLeaving, setIsToastLeaving] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const toastExitTimeoutRef = useRef<number | null>(null);
  const knownNotificationIdsRef = useRef<Set<string>>(new Set());
  const didHydrateNotificationsRef = useRef(false);

  const applyPayload = useCallback((payload: NotificationPayload) => {
    const mergedNotifications = mergeNotifications(payload.notifications, userId);
    const nextIds = new Set(mergedNotifications.map((item) => item.id));
    const newestUnread = mergedNotifications.find(
      (item) => !item.is_read && !knownNotificationIdsRef.current.has(item.id)
    );

    if (didHydrateNotificationsRef.current && newestUnread) {
      setIsToastLeaving(false);
      setToastNotification(newestUnread);
    }

    knownNotificationIdsRef.current = nextIds;
    didHydrateNotificationsRef.current = true;
    setNotifications(mergedNotifications);
    setUnreadCount(mergedNotifications.filter((item) => !item.is_read).length);
  }, [userId]);

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
    const interval = window.setInterval(loadNotifications, NOTIFICATION_POLL_MS);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [applyPayload]);

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
  }, [userId, applyPayload]);

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
  }, [userId, applyPayload]);

  useEffect(() => {
    if (!toastNotification) return;

    const timeout = window.setTimeout(() => {
      setIsToastLeaving(true);
      toastExitTimeoutRef.current = window.setTimeout(() => {
        setToastNotification(null);
        setIsToastLeaving(false);
      }, TOAST_EXIT_MS);
    }, TOAST_VISIBLE_MS);

    return () => {
      window.clearTimeout(timeout);
      if (toastExitTimeoutRef.current) {
        window.clearTimeout(toastExitTimeoutRef.current);
        toastExitTimeoutRef.current = null;
      }
    };
  }, [toastNotification]);

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

  const isDark = variant === "dark";
  const buttonClass = isDark
    ? "text-white hover:bg-white/10 focus:ring-white/30"
    : "text-cu-ink hover:bg-cu-panel-soft focus:ring-cu-focus/25";

  const badgeBorderClass = isDark ? "border-black" : "border-white";

  const dismissToast = () => {
    setIsToastLeaving(true);
    if (toastExitTimeoutRef.current) window.clearTimeout(toastExitTimeoutRef.current);
    toastExitTimeoutRef.current = window.setTimeout(() => {
      setToastNotification(null);
      setIsToastLeaving(false);
      toastExitTimeoutRef.current = null;
    }, TOAST_EXIT_MS);
  };

  const getNotificationIcon = (notification: NotificationItem) => {
    const message = notification.message.toLowerCase();
    if (notification.url?.includes("/pricetag") || message.includes("pricetag") || message.includes("label")) return "sell";
    if (message.includes("gagal") || message.includes("error")) return "error";
    if (message.includes("berhasil") || message.includes("selesai")) return "check_circle";
    return "notifications";
  };

  return (
    <div className="relative" ref={containerRef}>
      {toastNotification && (
        <div
          role="status"
          className={`fixed left-4 right-4 top-[4.75rem] z-[140] rounded-[20px] border p-3 shadow-2xl sm:left-auto sm:right-6 sm:w-80 ${
            isToastLeaving ? "cu-toast-exit" : "cu-toast-enter"
          } ${
            isDark
              ? "border-white/15 bg-[#111214]/95 text-white backdrop-blur-xl"
              : "border-cu-line bg-white text-cu-ink"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${isDark ? "bg-white/10 text-white" : "bg-cu-info-soft text-cu-info"}`}>
              <MaterialIcon name={getNotificationIcon(toastNotification)} size="sm" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-bold uppercase tracking-wide opacity-70">Notifikasi Baru</p>
              <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug">{toastNotification.message}</p>
              <p className={`mt-1 text-[11px] ${isDark ? "text-white/55" : "text-cu-muted"}`}>Baru saja</p>
            </div>
            <button
              type="button"
              onClick={dismissToast}
              className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full transition ${
                isDark ? "hover:bg-white/10" : "hover:bg-cu-panel-soft"
              }`}
              aria-label="Tutup notifikasi"
            >
              <MaterialIcon name="close" size="xs" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={`relative inline-flex size-9 items-center justify-center rounded-full p-1 transition-colors focus:outline-none focus:ring-2 cursor-pointer ${buttonClass}`}
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
        <div className={notificationDropdownPanelClass(isDark)}>
          <NotificationDropdownHeader
            title="Notifications"
            subtitle={`${unreadCount} unread ${unreadCount === 1 ? "notification" : "notifications"}`}
            isDark={isDark}
          />

          <div role="menu" aria-label="Daftar notifikasi" className="flex max-h-[394px] w-full flex-col gap-2 overflow-y-auto py-2">
            {error && <div className="p-3 text-xs text-cu-danger text-center">{error}</div>}
            
            {isLoading ? (
              <div className="px-4 py-8 text-center text-xs text-[#9ca3af]">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <MaterialIcon
                  size="lg"
                  className={`cu-icon-notifications-off mx-auto mb-2 ${isDark ? "text-white/35" : "text-cu-soft"}`}
                />
                <p className={`text-sm ${isDark ? "text-[#6b7280]" : "text-[#898787]"}`}>
                  No notifications yet.
                </p>
              </div>
            ) : (
              notifications.slice(0, 5).map((notification, index) => {
                const isUnread = !notification.is_read;
                const relativeTime = getRelativeTime(notification.created_at);

                const content = (
                  <div className={notificationItemClass(isDark, index === 0)}>
                    <NotificationStatusDot unread={isUnread} isDark={isDark} />
                    <div className={`flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden ${isUnread ? "" : isDark ? "text-[#6b7280]" : "text-[#898787]"}`}>
                      <p
                        className={`line-clamp-2 w-full text-left text-sm font-semibold leading-[19px] ${
                          isUnread ? (isDark ? "text-[#f9fafb]" : "text-[#121212]") : ""
                        }`}
                      >
                        {notification.message}
                      </p>
                      <p
                        className={`w-full truncate text-left text-xs leading-4 ${
                          isUnread ? (isDark ? "text-[#9ca3af]" : "text-[#898787]") : ""
                        }`}
                      >
                        {relativeTime}
                      </p>
                    </div>
                    <NotificationAvatar initials={getNotificationInitials(notification)} isDark={isDark} muted={!isUnread} />
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
                      className="block focus:outline-none"
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
                      className="block w-full border-0 bg-transparent text-left cursor-pointer focus:outline-none"
                      role="menuitem"
                    >
                      {content}
                    </button>
                  );
                }
              })
            )}
          </div>

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (unreadCount > 0) void markAllAsRead();
                setIsOpen(false);
              }}
              className={notificationFooterActionClass(isDark)}
              role="menuitem"
            >
              <NotificationStatusDot unread isDark={isDark} />
              <span>View all notifications</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function NotificationDropdownHeader({ title, subtitle, isDark }: { title: string; subtitle: string; isDark: boolean }) {
  return (
    <div className={`flex h-16 w-full shrink-0 items-center overflow-hidden rounded-xl border px-3 py-2.5 ${isDark ? "border-[#1f2937]" : "border-[#f2f2f2]"}`}>
      <div className="flex min-w-0 flex-1 flex-col gap-1 overflow-hidden">
        <p className={`w-full truncate text-sm font-semibold leading-5 ${isDark ? "text-[#f9fafb]" : "text-[#121212]"}`}>
          {title}
        </p>
        <p className="w-full truncate text-xs leading-4 text-[#9ca3af]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function NotificationStatusDot({ unread, isDark }: { unread: boolean; isDark: boolean }) {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center">
      <span className={`size-2 rounded-full ${unread ? (isDark ? "bg-white" : "bg-[#121212]") : isDark ? "bg-[#1f2937]" : "bg-[#d1d5db]"}`} />
    </span>
  );
}

function NotificationAvatar({ initials, isDark, muted = false }: { initials: string; isDark: boolean; muted?: boolean }) {
  const className = muted
    ? isDark
      ? "bg-[#0a0d12] text-[#6b7280]"
      : "bg-[#f2f2f2] text-[#121212]"
    : isDark
      ? "bg-white text-black"
      : "bg-[#121212] text-white";

  return (
    <span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-medium leading-4 ${className}`}>
      {initials}
    </span>
  );
}

function notificationDropdownPanelClass(isDark: boolean) {
  return `fixed left-4 right-4 top-[4.75rem] z-[110] mt-2 flex max-h-[calc(100dvh-5.5rem)] w-auto flex-col items-start overflow-hidden rounded-2xl p-1.5 sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:w-[280px] ${
    isDark ? "bg-black text-[#f9fafb]" : "border-[0.5px] border-[#f2f2f2] bg-white text-[#121212]"
  }`;
}

function notificationItemClass(isDark: boolean, highlighted: boolean) {
  return `flex min-h-14 w-full shrink-0 items-center gap-2.5 overflow-hidden rounded-xl px-2.5 py-2 transition-colors ${
    highlighted
      ? isDark
        ? "bg-[#0a0d12]"
        : "bg-[#f2f2f2]"
      : isDark
        ? "hover:bg-[#0a0d12]"
        : "hover:bg-[#f2f2f2]"
  }`;
}

function notificationFooterActionClass(isDark: boolean) {
  return `flex h-10 w-full shrink-0 cursor-pointer items-center gap-2.5 overflow-hidden rounded-xl border-0 bg-transparent px-2.5 text-left text-sm font-medium leading-5 transition-colors focus:outline-none ${
    isDark ? "text-[#f9fafb] hover:bg-[#0a0d12]" : "text-[#121212] hover:bg-[#f2f2f2]"
  }`;
}

function getNotificationInitials(notification: NotificationItem) {
  const message = notification.message.toLowerCase();
  if (message.includes("kevin")) return "KD";
  if (message.includes("mark")) return "MK";
  if (message.includes("bot") || message.includes("report")) return "CB";
  if (message.includes("creative")) return "CU";
  return "UN";
}
