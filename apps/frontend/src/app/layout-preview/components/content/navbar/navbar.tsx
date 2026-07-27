"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { APP_ROUTES } from "@/core/navigation/routes";
import { APPLICATION_ICONS, visibleSubApplications } from "@/core/applications";
import { apiFetch, resolveStorageUrl } from "@/core/api/client";
import { chatApi } from "@/core/chat";
import AppsDropdown, { type ApplicationItem } from "./apps-dropdown";
import ProfileDropdown, { type UserProfile, type ProfileMenuItem } from "./profile-dropdown";
import MessageDropdown, { type MessageItem } from "./message-dropdown";
import NotificationDropdown, { type NotificationItem } from "./notification-dropdown";
import Avatar from "./avatar";
import ButtonMenu from "./button-menu";
import AppIcon from "./app-icon";
import Breadcrumb from "./breadcrumb";

export type NavbarProps = {
  viewport?: "Mobile" | "Desktop";
  className?: string;
  initials?: string;
  avatarUrl?: string | null;
  onMenuClick?: () => void;
  onTerminalClick?: () => void;
  onNotificationClick?: () => void;
  onChatClick?: () => void;
  onAppsClick?: () => void;
  onAvatarClick?: () => void;
  // Dropdown props
  applications?: ApplicationItem[];
  userProfile?: UserProfile;
  profileMenuItems?: ProfileMenuItem[];
  messages?: MessageItem[];
  notifications?: NotificationItem[];
  onSignOut?: () => void;
};

export default function Navbar({
  className,
  initials = "AK",
  avatarUrl,
  viewport = "Mobile",
  onMenuClick,
  onTerminalClick,
  onNotificationClick,
  onChatClick,
  onAppsClick,
  onAvatarClick,
  applications,
  userProfile,
  profileMenuItems,
  messages,
  notifications,
  onSignOut,
}: NavbarProps) {
  const auth = useAuth();
  const [appsOpen, setAppsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [liveMessages, setLiveMessages] = useState<MessageItem[]>([]);
  const [liveNotifications, setLiveNotifications] = useState<NotificationItem[]>([]);

  const closeAllDropdownsExcept = (active: string) => {
    setAppsOpen(active === "apps");
    setProfileOpen(active === "profile");
    setMessagesOpen(active === "messages");
    setNotificationsOpen(active === "notifications");
  };

  const isDesktop = viewport === "Desktop";
  const sessionUser = auth.user;
  const effectiveInitials = sessionUser?.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || initials;
  const effectiveApplications = sessionUser
    ? visibleSubApplications(sessionUser.applications).map((application) => ({
        key: application.key,
        display_name: application.display_name,
        href: application.frontend_path ?? "#",
        icon: APPLICATION_ICONS[application.key] ?? "apps",
      }))
    : applications;
  const effectiveProfile = sessionUser
    ? {
        name: sessionUser.name,
        role: sessionUser.roles[0] ?? "User",
        avatarUrl: sessionUser.avatar_url,
        initials: effectiveInitials,
      }
    : userProfile;
  const effectiveProfileMenuItems = useMemo<ProfileMenuItem[]>(
    () => profileMenuItems ?? [
      { label: "Profile", href: APP_ROUTES.profile, icon: "person" },
      { label: "Dashboard", href: APP_ROUTES.dashboard, icon: "dashboard" },
      { label: "Settings", href: APP_ROUTES.settings, icon: "settings" },
      { label: "Help Center", href: APP_ROUTES.documentation, icon: "help" },
    ],
    [profileMenuItems],
  );

  const refreshBackendDropdowns = useCallback(async () => {
    if (!sessionUser) return;

    const [conversationResult, notificationResult] = await Promise.allSettled([
      chatApi.conversations({ skipAuthRedirect: true }),
      apiFetch<{ notifications: Array<{ id: string; message: string; type: string; created_at: string | null; is_read: boolean }> }>("/notifications"),
    ]);

    if (conversationResult.status === "fulfilled") {
      setLiveMessages(conversationResult.value.map((conversation) => ({
        id: String(conversation.id),
        sender: conversation.task?.task_number ?? conversation.partner?.name ?? "Conversation",
        avatarUrl: resolveStorageUrl(conversation.partner?.avatar_path ?? conversation.partner?.avatar) ?? undefined,
        preview: conversation.last_message?.body ?? "No message preview.",
        time: conversation.last_message?.created_at ?? conversation.updated_at ?? "",
        unread: conversation.last_message?.is_read === false,
      })));
    }

    if (notificationResult.status === "fulfilled") {
      setLiveNotifications(notificationResult.value.notifications.map((notification) => ({
        id: String(notification.id),
        title: notification.type || "Notification",
        content: notification.message,
        time: notification.created_at ?? "",
        read: notification.is_read,
        icon: "notifications",
      })));
    }
  }, [sessionUser]);

  return (
    <div
      className={
        className ||
        `bg-[rgba(255,255,255,0.55)] content-stretch flex items-center justify-between backdrop-blur-md border-b border-slate-100 relative z-20 ${
          isDesktop ? "h-[64px] px-[16px] w-full" : "h-[56px] pl-[8px] pr-[16px] w-full"
        }`
      }
      id={isDesktop ? "node-119_72" : "node-112_402"}
      data-node-id={isDesktop ? "119:72" : "112:402"}
      data-name="Navbar"
    >
      {/* Leading Actions */}
      {isDesktop ? (
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-node-id="119:478">
          <AppIcon />
          <Breadcrumb />
        </div>
      ) : (
        <div className="flex h-full items-center justify-center w-10 shrink-0" data-node-id="112:621" data-name="Leading Actions">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex items-center justify-center size-10 focus:outline-none"
            aria-label="Menu"
          >
            <ButtonMenu icon="menu" />
          </button>
        </div>
      )}

      {/* Trailing Actions */}
      <div className="flex h-full items-center gap-1" data-node-id="112:502" data-name="Trailing Actions">
        {/* Action Items */}
        <div className="flex h-full items-center" data-node-id="112:589" data-name="Action Items">
          {/* Terminal */}
          {sessionUser?.roles.some((role) => role.toLowerCase() === "root") ? <Link
            href={APP_ROUTES.maintenance}
            className="flex h-full w-10 items-center justify-center focus:outline-none"
            aria-label="Developer Panel"
          >
            <ButtonMenu icon="code" />
          </Link> : <button
            type="button"
            onClick={onTerminalClick}
            className="flex h-full w-10 items-center justify-center focus:outline-none"
            data-node-id="112:488"
            aria-label="Terminal"
          >
            <ButtonMenu icon="code" />
          </button>}

          {/* Notifications */}
          <div className="relative flex h-full items-center">
            <button
              type="button"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={() => {
                closeAllDropdownsExcept(notificationsOpen ? "" : "notifications");
                void refreshBackendDropdowns();
                if (onNotificationClick) onNotificationClick();
              }}
              className="flex h-full w-10 items-center justify-center focus:outline-none"
              data-node-id="112:701"
              aria-label="Notifications"
              data-dropdown-trigger="notifications"
            >
              <ButtonMenu icon="notifications" state={notificationsOpen ? "Focus" : "Default"} />
            </button>
            <NotificationDropdown
              isOpen={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
              notifications={sessionUser ? liveNotifications : notifications}
            />
          </div>

          {/* Chat */}
          <div className="relative flex h-full items-center">
            <button
              type="button"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={() => {
                closeAllDropdownsExcept(messagesOpen ? "" : "messages");
                void refreshBackendDropdowns();
                if (onChatClick) onChatClick();
              }}
              className="flex h-full w-10 items-center justify-center focus:outline-none"
              data-node-id="112:542"
              aria-label="Chat"
              data-dropdown-trigger="messages"
            >
              <ButtonMenu icon="chat_bubble" state={messagesOpen ? "Focus" : "Default"} />
            </button>
            <MessageDropdown
              isOpen={messagesOpen}
              onClose={() => setMessagesOpen(false)}
              messages={sessionUser ? liveMessages : messages}
            />
          </div>

          {/* Apps */}
          <div className="relative flex h-full items-center">
            <button
              type="button"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={() => {
                closeAllDropdownsExcept(appsOpen ? "" : "apps");
                if (onAppsClick) onAppsClick();
              }}
              className="flex h-full w-10 items-center justify-center focus:outline-none"
              data-node-id="112:529"
              aria-label="Apps"
              data-dropdown-trigger="apps"
            >
              <ButtonMenu icon="apps" state={appsOpen ? "Focus" : "Default"} />
            </button>
            <AppsDropdown
              isOpen={appsOpen}
              onClose={() => setAppsOpen(false)}
              applications={effectiveApplications}
            />
          </div>
        </div>

        {/* User Avatar */}
        <div className="relative flex h-full items-center">
          <button
            type="button"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={() => {
              closeAllDropdownsExcept(profileOpen ? "" : "profile");
              if (onAvatarClick) onAvatarClick();
            }}
            className="flex h-full w-10 items-center justify-center p-1 hover:bg-slate-100/50 rounded-lg transition-colors focus:outline-none"
            data-node-id="112:572"
            aria-label="User profile"
            data-dropdown-trigger="profile"
          >
            <Avatar
              initials={effectiveInitials}
              avatarUrl={sessionUser?.avatar_url ?? avatarUrl}
              state={profileOpen ? "Focus" : "Default"}
            />
          </button>
          <ProfileDropdown
            isOpen={profileOpen}
            onClose={() => setProfileOpen(false)}
            user={
              effectiveProfile || {
                name: effectiveInitials === "AK" ? "Alex Kurniadi" : "User Name",
                role: "User",
                avatarUrl: avatarUrl,
                initials: effectiveInitials,
              }
            }
            menuItems={effectiveProfileMenuItems}
            onSignOut={onSignOut ?? (() => void auth.logout())}
          />
        </div>
      </div>
    </div>
  );
}
