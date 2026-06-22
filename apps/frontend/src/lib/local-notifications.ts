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

function getStorageKey(userId?: number | null): string {
  return userId ? `${STORAGE_KEY}-${userId}` : STORAGE_KEY;
}

export function readLocalNotifications(userId?: number | null): LocalNotificationItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const key = getStorageKey(userId);
    const raw = window.localStorage.getItem(key);
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

function writeLocalNotifications(items: LocalNotificationItem[], userId?: number | null) {
  if (typeof window === "undefined") {
    return;
  }

  const key = getStorageKey(userId);
  window.localStorage.setItem(key, JSON.stringify(items.slice(0, 20)));
  emitUpdatedEvent();
}

export function pushLocalNotification(message: string, url: string | null = null, userId?: number | null) {
  const now = new Date().toISOString();
  const items = readLocalNotifications(userId);

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
  ], userId);
}

export function markLocalNotificationRead(notificationId: string, userId?: number | null): LocalNotificationItem | null {
  const items = readLocalNotifications(userId);
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

  writeLocalNotifications(updated, userId);
  return updatedItem;
}

export function markAllLocalNotificationsRead(userId?: number | null) {
  const updated = readLocalNotifications(userId).map((item) => ({
    ...item,
    is_read: true,
    read_at: item.read_at ?? new Date().toISOString(),
  }));

  writeLocalNotifications(updated, userId);
}
