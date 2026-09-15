"use client";

import { useCallback, useState, type ReactNode } from "react";
import { apiFetch, resolveStorageUrl } from "@/core/api/client";
import { chatApi } from "@/features/messages/api/chatApi";
import { MessageBell } from "@/features/messages/components/MessageBell/MessageBell";
import MessageDropdown, { type MessageItem } from "@/features/messages/components/MessageDropdown/MessageDropdown";
import { subscribeToConversationMessages } from "@/features/messages/realtime/subscribeToConversationMessages";
import { NotificationBell } from "@/features/notifications/components/NotificationBell/NotificationBell";
import NotificationDropdown, { type NotificationItem } from "@/features/notifications/components/NotificationDropdown/NotificationDropdown";
import { useAuth } from "@/hooks/auth";
import { APPLICATION_ICONS, applicationForPath } from "@/core/applications";
import {
  CommunicationActionsProvider,
  type CommunicationBellProps,
  type CommunicationNavDropdownProps,
} from "@/hooks/communication-actions";

function formatNotificationTitle(type: string, message: string): string {
  const normalized = `${type} ${message}`.toLowerCase();
  if (normalized.includes("odds")) return "Pembaruan ODDS";
  if (normalized.includes("pricetag") || normalized.includes("label")) return "Pembaruan Pricetag";
  if (normalized.includes("creative report")) return "Pembaruan Creative Report";
  if (normalized.includes("message") || normalized.includes("chat")) return "Pesan baru";
  return "Pemberitahuan Creative Universe";
}

function cleanNotificationMessage(message: string, type: string): string {
  return message
    .replace(new RegExp(type.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig"), "")
    .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s:–—-]+|[\s:–—-]+$/g, "")
    .trim() || "Ada pembaruan baru untuk Anda.";
}

function formatNotificationTime(value: string | null): string {
  if (!value) return "Baru saja";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Baru saja";
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "Baru saja";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function getNotificationIcon(type: string, message: string, url: string | null): string {
  if (url) return APPLICATION_ICONS[applicationForPath(url)] ?? "notifications";
  const normalized = `${type} ${message}`.toLowerCase();
  if (normalized.includes("odds")) return APPLICATION_ICONS.odds;
  if (normalized.includes("pricetag") || normalized.includes("label")) return APPLICATION_ICONS.generator;
  if (normalized.includes("creative report")) return APPLICATION_ICONS["creative-report"];
  if (normalized.includes("creative ai") || normalized.includes("cai")) return APPLICATION_ICONS.cai;
  if (normalized.includes("kv retail")) return APPLICATION_ICONS["kv-retail"];
  if (normalized.includes("design asset")) return APPLICATION_ICONS["design-assets"];
  return APPLICATION_ICONS.core;
}

export function CommunicationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const refreshNavDropdowns = useCallback(async () => {
    if (!user) return;

    const [conversations, notificationResult] = await Promise.allSettled([
      chatApi.conversations({ skipAuthRedirect: true }),
      apiFetch<{
        notifications: Array<{
          id: string;
          message: string;
          type: string;
          url: string | null;
          created_at: string | null;
          is_read: boolean;
        }>;
      }>("/notifications"),
    ]);

    if (conversations.status === "fulfilled") {
      setMessages(
        conversations.value.map((conversation) => ({
          id: String(conversation.id),
          sender: conversation.task?.task_number ?? conversation.partner?.name ?? "Conversation",
          preview: conversation.last_message?.body ?? "Belum ada pesan.",
          time: formatNotificationTime(conversation.last_message?.created_at ?? conversation.updated_at ?? null),
          unread: conversation.last_message?.is_read === false,
          avatarUrl: resolveStorageUrl(conversation.partner?.avatar_path ?? conversation.partner?.avatar) ?? undefined,
        })),
      );
    }

    if (notificationResult.status === "fulfilled") {
      setNotifications(
        notificationResult.value.notifications.map((notification) => ({
          id: String(notification.id),
          title: formatNotificationTitle(notification.type, notification.message),
          content: cleanNotificationMessage(notification.message, notification.type),
          time: formatNotificationTime(notification.created_at),
          read: notification.is_read,
          icon: getNotificationIcon(notification.type, notification.message, notification.url),
        })),
      );
    }
  }, [user]);

  return (
    <CommunicationActionsProvider
      renderMessageBell={(props: CommunicationBellProps) => <MessageBell {...props} />}
      renderNotificationBell={(props: CommunicationBellProps) => <NotificationBell {...props} />}
      refreshNavDropdowns={refreshNavDropdowns}
      notificationUnreadCount={notifications.filter((notification) => !notification.read).length}
      renderNavMessageDropdown={(props: CommunicationNavDropdownProps) => (
        <MessageDropdown {...props} messages={messages} />
      )}
      renderNavNotificationDropdown={(props: CommunicationNavDropdownProps) => (
        <NotificationDropdown {...props} notifications={notifications} />
      )}
      chatApi={chatApi}
      subscribeToConversationMessages={subscribeToConversationMessages}
    >
      {children}
    </CommunicationActionsProvider>
  );
}
