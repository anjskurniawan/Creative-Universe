"use client";

export interface LocalNotificationItem {
  id: string;
  type: "local";
  message: string;
  url: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

const STORAGE_KEY = "cu-local-notifications";
export const LOCAL_NOTIFICATIONS_UPDATED_EVENT = "cu:local-notifications-updated";

function emitUpdatedEvent() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(LOCAL_NOTIFICATIONS_UPDATED_EVENT));
  }
}

export function readLocalNotifications(): LocalNotificationItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is LocalNotificationItem => {
      return (
        typeof item?.id === "string" &&
        typeof item?.message === "string" &&
        typeof item?.created_at === "string" &&
        typeof item?.is_read === "boolean"
      );
    });
  } catch {
    return [];
  }
}

function writeLocalNotifications(items: LocalNotificationItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 20)));
  emitUpdatedEvent();
}

export function pushLocalNotification(message: string, url: string | null = null) {
  const now = new Date().toISOString();
  const items = readLocalNotifications();

  writeLocalNotifications([
    {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: "local",
      message,
      url,
      is_read: false,
      read_at: null,
      created_at: now,
    },
    ...items,
  ]);
}

export function markLocalNotificationRead(notificationId: string): LocalNotificationItem | null {
  const items = readLocalNotifications();
  let updatedItem: LocalNotificationItem | null = null;

  const updated = items.map((item) => {
    if (item.id !== notificationId) return item;

    updatedItem = {
      ...item,
      is_read: true,
      read_at: item.read_at ?? new Date().toISOString(),
    };

    return updatedItem;
  });

  writeLocalNotifications(updated);
  return updatedItem;
}

export function markAllLocalNotificationsRead() {
  const updated = readLocalNotifications().map((item) => ({
    ...item,
    is_read: true,
    read_at: item.read_at ?? new Date().toISOString(),
  }));

  writeLocalNotifications(updated);
}
