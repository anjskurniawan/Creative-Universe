"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { apiFetch } from "@/core/api/client";
import { markAllLocalNotificationsRead, readLocalNotifications } from "@/lib/local-notifications";
import { useAuth } from "@/providers/auth-provider";

type NotificationItem = {
  id: string;
  type: string;
  message: string;
  url: string | null;
  is_read: boolean;
  created_at: string | null;
};

type NotificationPayload = {
  notifications: NotificationItem[];
  unread_count: number;
};

function mergeNotifications(serverItems: NotificationItem[], userId: number): NotificationItem[] {
  return [...readLocalNotifications(userId), ...serverItems].sort((left, right) => {
    const leftTime = left.created_at ? new Date(left.created_at).getTime() : 0;
    const rightTime = right.created_at ? new Date(right.created_at).getTime() : 0;
    return rightTime - leftTime;
  });
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const payload = await apiFetch<NotificationPayload>("/notifications");
      setNotifications(mergeNotifications(payload.notifications, user.id));
    } catch {
      setNotifications(readLocalNotifications(user.id));
      setError("Notifikasi server belum dapat dimuat.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadNotifications();
  }, [user?.id]);

  const markAllAsRead = async () => {
    if (!user) return;
    markAllLocalNotificationsRead(user.id);
    try {
      await apiFetch("/notifications/read-all", { method: "PATCH" });
    } catch {
      // Local notifications remain readable even if the server request fails.
    }
    setNotifications((items) => items.map((item) => ({ ...item, is_read: true })));
  };

  return (
    <div className="mx-auto w-full max-w-4xl py-4 md:py-8">
      <header className="flex flex-col gap-4 border-b border-cu-line pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cu-muted">Pusat Aktivitas</p>
          <h1 className="mt-1 text-2xl font-semibold text-cu-ink">Notifikasi</h1>
        </div>
        <button type="button" onClick={() => void markAllAsRead()} disabled={notifications.every((item) => item.is_read)} className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-line bg-cu-surface px-4 text-sm font-medium text-cu-ink transition hover:border-cu-ink hover:bg-cu-panel-soft disabled:cursor-not-allowed disabled:opacity-50">
          <MaterialIcon name="done_all" size="sm" />
          Tandai semua dibaca
        </button>
      </header>

      <section className="mt-6 overflow-hidden rounded-2xl border border-cu-line bg-cu-surface shadow-sm">
        {isLoading ? <p className="p-8 text-center text-sm text-cu-muted">Memuat notifikasi...</p> : null}
        {!isLoading && error ? <p className="border-b border-cu-line px-5 py-3 text-sm text-cu-warning">{error}</p> : null}
        {!isLoading && notifications.length === 0 ? <p className="p-10 text-center text-sm text-cu-muted">Belum ada notifikasi.</p> : null}
        {!isLoading && notifications.map((notification) => {
          const content = <><span className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ${notification.is_read ? "bg-cu-panel-soft text-cu-muted" : "bg-cu-info-soft text-cu-info"}`}><MaterialIcon name="notifications" size="sm" /></span><span className="min-w-0 flex-1"><span className={`block text-sm ${notification.is_read ? "text-cu-muted" : "font-semibold text-cu-ink"}`}>{notification.message}</span><span className="mt-1 block text-xs text-cu-muted">{notification.created_at ? new Date(notification.created_at).toLocaleString("id-ID") : ""}</span></span></>;
          const className = "flex w-full items-start gap-3 border-b border-cu-line px-5 py-4 text-left transition last:border-b-0 hover:bg-cu-panel-soft/60";
          return notification.url ? <Link key={notification.id} href={notification.url} className={className}>{content}</Link> : <div key={notification.id} className={className}>{content}</div>;
        })}
      </section>
    </div>
  );
}
