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
import {
  CommunicationActionsProvider,
  type CommunicationBellProps,
  type CommunicationNavDropdownProps,
} from "@/hooks/communication-actions";

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
          preview: conversation.last_message?.body ?? "No message preview.",
          time: conversation.last_message?.created_at ?? conversation.updated_at ?? "",
          unread: conversation.last_message?.is_read === false,
          avatarUrl: resolveStorageUrl(conversation.partner?.avatar_path ?? conversation.partner?.avatar) ?? undefined,
        })),
      );
    }

    if (notificationResult.status === "fulfilled") {
      setNotifications(
        notificationResult.value.notifications.map((notification) => ({
          id: String(notification.id),
          title: notification.type || "Notification",
          content: notification.message,
          time: notification.created_at ?? "",
          read: notification.is_read,
          icon: "notifications",
        })),
      );
    }
  }, [user]);

  return (
    <CommunicationActionsProvider
      renderMessageBell={(props: CommunicationBellProps) => <MessageBell {...props} />}
      renderNotificationBell={(props: CommunicationBellProps) => <NotificationBell {...props} />}
      refreshNavDropdowns={refreshNavDropdowns}
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
