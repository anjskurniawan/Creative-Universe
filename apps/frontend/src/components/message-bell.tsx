"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import { MaterialIcon } from "./material-icon";

interface MessageBellProps {
  userId: number;
  variant?: "light" | "dark";
}

type ChatUser = {
  id?: number;
  name?: string;
  avatar?: string | null;
  avatar_path?: string | null;
};

type LastMessage = {
  body?: string | null;
  is_read?: boolean;
  sender_id?: number | null;
};

type ConversationPreview = {
  id: number | string;
  partner?: ChatUser | null;
  task?: {
    task_number?: string | null;
    design_purpose?: string | null;
  } | null;
  context_type?: string | null;
  last_message?: LastMessage | null;
  status?: string | null;
};

type ConversationsResponse = {
  data?: ConversationPreview[];
};

async function requestConversations(): Promise<ConversationPreview[]> {
  const response = await apiFetch<ConversationsResponse>("/chat/conversations", {
    _skipAuthRedirect: true,
  });
  return Array.isArray(response?.data) ? response.data : [];
}

export function MessageBell({ userId, variant = "light" }: MessageBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const isDark = variant === "dark";

  useEffect(() => {
    let active = true;

    const loadInitialConversations = async () => {
      try {
        setError(null);
        const nextConversations = await requestConversations();
        if (active) setConversations(nextConversations);
      } catch {
        if (active) setError("Pesan belum dapat dimuat.");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadInitialConversations();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;

    const refreshConversations = async () => {
      try {
        setError(null);
        const nextConversations = await requestConversations();
        if (active) setConversations(nextConversations);
      } catch {
        if (active) setError("Pesan belum dapat dimuat.");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void refreshConversations();
    return () => {
      active = false;
    };
  }, [isOpen]);

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

  const visibleConversations = conversations.slice(0, 5);
  const unreadCount = conversations.filter((conversation) => {
    const lastMessage = conversation.last_message;
    return lastMessage && lastMessage.is_read === false && lastMessage.sender_id !== userId;
  }).length;

  const buttonClass = isDark
    ? "text-white hover:bg-white/10 focus:ring-white/30"
    : "text-cu-ink hover:bg-cu-panel-soft focus:ring-cu-focus/25";

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`relative inline-flex size-9 cursor-pointer items-center justify-center rounded-full p-1 transition-colors focus:outline-none focus:ring-2 ${buttonClass}`}
        aria-label="Pesan Masuk"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <MaterialIcon name="chat" size="md" />
        {unreadCount > 0 && (
          <span className={`absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 bg-cu-danger px-1 ${isDark ? "border-black" : "border-white"}`}>
            <span className="text-xs font-bold leading-none text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className={dropdownPanelClass(isDark)}>
          <DropdownHeader
            title="Messages"
            subtitle={`${unreadCount} unread ${unreadCount === 1 ? "message" : "messages"}`}
            isDark={isDark}
          />

          <div role="menu" aria-label="Message list" className="flex max-h-[394px] w-full flex-col gap-2 overflow-y-auto py-2">
            {error && <div className={`px-4 py-8 text-center text-xs ${isDark ? "text-red-300" : "text-cu-danger"}`}>{error}</div>}
            {!error && isLoading && (
              <div className={`px-4 py-8 text-center text-xs ${isDark ? "text-[#9ca3af]" : "text-[#9ca3af]"}`}>
                Loading messages...
              </div>
            )}
            {!error && !isLoading && visibleConversations.length === 0 && (
              <div className={`px-4 py-8 text-center text-sm ${isDark ? "text-[#6b7280]" : "text-[#898787]"}`}>
                No messages yet.
              </div>
            )}
            {!error && visibleConversations.map((conversation, index) => (
              <MessagePreviewItem
                key={conversation.id}
                conversation={conversation}
                userId={userId}
                isDark={isDark}
                highlighted={index === 0}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </div>

          {conversations.length > 0 && (
            <Link
              href="/messages"
              onClick={() => setIsOpen(false)}
              className={footerActionClass(isDark)}
              role="menuitem"
            >
              <StatusDot unread isDark={isDark} />
              <span>View all messages</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function MessagePreviewItem({
  conversation,
  userId,
  isDark,
  highlighted,
  onClick,
}: {
  conversation: ConversationPreview;
  userId: number;
  isDark: boolean;
  highlighted: boolean;
  onClick: () => void;
}) {
  const isTaskRoom = conversation.context_type === "odds_task";
  const title = isTaskRoom
    ? conversation.task?.task_number || "Task ODDS"
    : conversation.partner?.name || "Unknown User";
  const body = isTaskRoom
    ? conversation.task?.design_purpose || conversation.last_message?.body || "ODDS task conversation"
    : conversation.last_message?.body || "No message preview.";
  const unread = conversation.last_message?.is_read === false && conversation.last_message.sender_id !== userId;

  return (
    <Link
      href="/messages"
      onClick={onClick}
      className={previewItemClass(isDark, highlighted)}
      role="menuitem"
    >
      <StatusDot unread={unread} isDark={isDark} />
      <div className={`flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden ${unread ? "" : isDark ? "text-[#6b7280]" : "text-[#898787]"}`}>
        <p className={`w-full truncate text-sm font-semibold leading-[19px] ${unread ? (isDark ? "text-[#f9fafb]" : "text-[#121212]") : ""}`}>
          {title}
        </p>
        <p className={`line-clamp-2 w-full text-xs leading-4 ${unread ? (isDark ? "text-[#9ca3af]" : "text-[#898787]") : ""}`}>
          {body}
        </p>
      </div>
      <Avatar initials={getInitials(title)} isDark={isDark} muted={!unread} />
    </Link>
  );
}

function DropdownHeader({ title, subtitle, isDark }: { title: string; subtitle: string; isDark: boolean }) {
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

function StatusDot({ unread, isDark }: { unread: boolean; isDark: boolean }) {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center">
      <span className={`size-2 rounded-full ${unread ? (isDark ? "bg-white" : "bg-[#121212]") : isDark ? "bg-[#1f2937]" : "bg-[#d1d5db]"}`} />
    </span>
  );
}

function Avatar({ initials, isDark, muted = false }: { initials: string; isDark: boolean; muted?: boolean }) {
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

function dropdownPanelClass(isDark: boolean) {
  return `fixed left-4 right-4 top-[4.75rem] z-[110] mt-2 flex max-h-[calc(100dvh-5.5rem)] w-auto flex-col items-start overflow-hidden rounded-2xl p-1.5 sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:w-[280px] ${
    isDark ? "bg-black text-[#f9fafb]" : "border-[0.5px] border-[#f2f2f2] bg-white text-[#121212]"
  }`;
}

function previewItemClass(isDark: boolean, highlighted: boolean) {
  return `flex min-h-14 w-full shrink-0 items-center gap-2.5 overflow-hidden rounded-xl px-2.5 py-2 transition-colors focus:outline-none ${
    highlighted
      ? isDark
        ? "bg-[#0a0d12]"
        : "bg-[#f2f2f2]"
      : isDark
        ? "hover:bg-[#0a0d12]"
        : "hover:bg-[#f2f2f2]"
  }`;
}

function footerActionClass(isDark: boolean) {
  return `flex h-10 w-full shrink-0 items-center gap-2.5 overflow-hidden rounded-xl px-2.5 text-sm font-medium leading-5 transition-colors focus:outline-none ${
    isDark ? "text-[#f9fafb] hover:bg-[#0a0d12]" : "text-[#121212] hover:bg-[#f2f2f2]"
  }`;
}

function getInitials(name?: string | null) {
  if (!name) return "UN";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
