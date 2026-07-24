"use client";

import React, { useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import AppsDropdown, { type ApplicationItem } from "./apps-dropdown";
import ProfileDropdown, { type UserProfile, type ProfileMenuItem } from "./profile-dropdown";
import MessageDropdown, { type MessageItem } from "./message-dropdown";
import NotificationDropdown, { type NotificationItem } from "./notification-dropdown";
import Avatar from "./avatar";
import ButtonMenu from "./button-menu";

export type NavbarProps = {
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
  const [appsOpen, setAppsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const closeAllDropdownsExcept = (active: string) => {
    setAppsOpen(active === "apps");
    setProfileOpen(active === "profile");
    setMessagesOpen(active === "messages");
    setNotificationsOpen(active === "notifications");
  };

  return (
    <div
      className={
        className ||
        "flex h-12 w-full items-center justify-between bg-white/55 pl-2 pr-4 backdrop-blur-md border-b border-slate-100 relative z-20"
      }
      data-node-id="112:402"
      data-name="Navbar"
    >
      {/* Leading Actions - Menu Icon */}
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

      {/* Trailing Actions */}
      <div className="flex h-full items-center gap-1" data-node-id="112:502" data-name="Trailing Actions">
        {/* Action Items */}
        <div className="flex h-full items-center" data-node-id="112:589" data-name="Action Items">
          {/* Terminal */}
          <button
            type="button"
            onClick={onTerminalClick}
            className="flex h-full w-10 items-center justify-center focus:outline-none"
            data-node-id="112:488"
            aria-label="Terminal"
          >
            <ButtonMenu icon="code" />
          </button>

          {/* Notifications */}
          <div className="flex h-full items-center">
            <button
              type="button"
              onClick={() => {
                closeAllDropdownsExcept(notificationsOpen ? "" : "notifications");
                if (onNotificationClick) onNotificationClick();
              }}
              className="flex h-full w-10 items-center justify-center focus:outline-none"
              data-node-id="112:701"
              aria-label="Notifications"
            >
              <ButtonMenu icon="notifications" state={notificationsOpen ? "Focus" : "Default"} />
            </button>
            <NotificationDropdown
              isOpen={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
              notifications={notifications}
            />
          </div>

          {/* Chat */}
          <div className="flex h-full items-center">
            <button
              type="button"
              onClick={() => {
                closeAllDropdownsExcept(messagesOpen ? "" : "messages");
                if (onChatClick) onChatClick();
              }}
              className="flex h-full w-10 items-center justify-center focus:outline-none"
              data-node-id="112:542"
              aria-label="Chat"
            >
              <ButtonMenu icon="chat_bubble" state={messagesOpen ? "Focus" : "Default"} />
            </button>
            <MessageDropdown
              isOpen={messagesOpen}
              onClose={() => setMessagesOpen(false)}
              messages={messages}
            />
          </div>

          {/* Apps */}
          <div className="flex h-full items-center">
            <button
              type="button"
              onClick={() => {
                closeAllDropdownsExcept(appsOpen ? "" : "apps");
                if (onAppsClick) onAppsClick();
              }}
              className="flex h-full w-10 items-center justify-center focus:outline-none"
              data-node-id="112:529"
              aria-label="Apps"
            >
              <ButtonMenu icon="apps" state={appsOpen ? "Focus" : "Default"} />
            </button>
            <AppsDropdown
              isOpen={appsOpen}
              onClose={() => setAppsOpen(false)}
              applications={applications}
            />
          </div>
        </div>

        {/* User Avatar */}
        <div className="flex h-full items-center">
          <button
            type="button"
            onClick={() => {
              closeAllDropdownsExcept(profileOpen ? "" : "profile");
              if (onAvatarClick) onAvatarClick();
            }}
            className="flex h-full w-10 items-center justify-center p-1 hover:bg-slate-100/50 rounded-lg transition-colors focus:outline-none"
            data-node-id="112:572"
            aria-label="User profile"
          >
            <Avatar
              initials={initials}
              avatarUrl={avatarUrl}
              state={profileOpen ? "Focus" : "Default"}
            />
          </button>
          <ProfileDropdown
            isOpen={profileOpen}
            onClose={() => setProfileOpen(false)}
            user={
              userProfile || {
                name: initials === "AK" ? "Alex Kurniadi" : "User Name",
                role: "User",
                avatarUrl: avatarUrl,
                initials: initials,
              }
            }
            menuItems={profileMenuItems}
            onSignOut={onSignOut}
          />
        </div>
      </div>
    </div>
  );
}
