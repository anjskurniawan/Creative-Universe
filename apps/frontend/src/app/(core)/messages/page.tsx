"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { MaterialIcon } from "@/components/material-icon";
import {
  chatApi,
  subscribeToConversationMessages,
  type ChatContact,
  type ChatConversation,
  type ChatMessage,
  type ChatUser,
  type ChatAttachment,
} from "@/core/chat";
import { resolveStorageUrl } from "@/core/api/client";
import { useAuth } from "@/providers/auth-provider";

function avatarFor(user?: ChatUser | ChatContact | null): string | null {
  if (!user) return null;

  return ("avatar" in user ? user.avatar : null) ?? user.avatar_path ?? null;
}

function initialFor(name?: string | null): string {
  return name?.trim().charAt(0).toUpperCase() || "?";
}

function formatMessageTime(value?: string | null): string {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function isPersistedConversation(conversation: ChatConversation | null): conversation is ChatConversation & { id: number } {
  return typeof conversation?.id === "number";
}

function conversationTitle(conversation: ChatConversation): string {
  if (conversation.context_type === "odds_task") {
    return conversation.task?.task_number ?? "Task ODDS";
  }

  return conversation.partner?.name ?? "Percakapan";
}

function conversationSubtitle(conversation: ChatConversation, userId?: number): string {
  const lastMessage = conversation.last_message;
  if (lastMessage) {
    const prefix = Number(lastMessage.sender_id) === Number(userId) ? "Anda: " : "";
    return `${conversation.status === "closed" ? "Riwayat - " : ""}${prefix}${lastMessage.body}`;
  }

  if (conversation.context_type === "odds_task") {
    return conversation.task?.design_purpose ?? "Diskusi task ODDS";
  }

  return "Belum ada pesan.";
}

function ConversationAvatar({ conversation }: { conversation: ChatConversation }) {
  if (conversation.context_type === "odds_task") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-cu-info-soft text-cu-info">
        <MaterialIcon name="assignment" size="md" />
      </div>
    );
  }

  const partner = conversation.partner;
  const avatar = avatarFor(partner);

  if (avatar && partner?.name) {
    return <Image src={avatar} alt={partner.name} fill className="object-cover" />;
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-cu-panel-soft text-sm font-semibold text-cu-muted">
      {initialFor(partner?.name)}
    </div>
  );
}

function ContactAvatar({ contact }: { contact: ChatContact }) {
  const avatar = avatarFor(contact);

  if (avatar) {
    return <Image src={avatar} alt={contact.name} fill className="object-cover" />;
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-cu-panel-soft text-sm font-semibold text-cu-muted">
      {initialFor(contact.name)}
    </div>
  );
}

function MessagesContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [mentionOpen, setMentionOpen] = useState(false);
  const [messagePage, setMessagePage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [loadingEarlier, setLoadingEarlier] = useState(false);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [showContacts, setShowContacts] = useState(false);
  const [conversationFilter, setConversationFilter] = useState<"active" | "history">("active");
  const [conversationTypeFilter, setConversationTypeFilter] = useState<"all" | "unread" | "direct" | "odds_task">("all");
  const [conversationSearch, setConversationSearch] = useState("");
  const [chatError, setChatError] = useState<string | null>(null);
  const pendingConversationIdRef = useRef<number | null>(null);
  const activeConversationIdRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const fetchConversations = useCallback(async () => {
    try {
      const nextConversations = await chatApi.conversations();
      setConversations(nextConversations);
      setActiveConversation((currentConversation) => {
        if (!isPersistedConversation(currentConversation)) return currentConversation;

        return nextConversations.find((conversation) => conversation.id === currentConversation.id) ?? currentConversation;
      });

      return nextConversations;
    } catch (error) {
      console.error(error);
      return [];
    }
  }, []);

  const fetchContacts = useCallback(async () => {
    try {
      const contacts = await chatApi.contacts();
      setContacts(contacts);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchMessages = useCallback(async (id: number, page = 1, appendEarlier = false) => {
    setChatError(null);
    try {
      const response = await chatApi.messages(id, page);
      setMessages((previous) => appendEarlier ? [...response.data, ...previous] : response.data);
      setMessagePage(page);
      setHasMoreMessages(Boolean(response.meta.has_more));
      setConversations((items) => items.map((conversation) => conversation.id === id && conversation.last_message
        ? { ...conversation, last_message: { ...conversation.last_message, is_read: true } }
        : conversation));
    } catch (error) {
      console.error(error);
      setChatError("Gagal memuat pesan.");
    }
  }, []);

  const updateConversationLastMessage = useCallback((conversationId: number, message: ChatMessage) => {
    setConversations((prev) =>
      prev
        .map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                last_message: {
                  body: message.body,
                  created_at: message.created_at,
                  is_read: false,
                  sender_id: Number(message.sender_id),
                },
                updated_at: message.created_at,
              }
            : conversation
        )
        .sort((a, b) => {
          const dateA = new Date(a.last_message?.created_at ?? a.updated_at ?? 0).getTime();
          const dateB = new Date(b.last_message?.created_at ?? b.updated_at ?? 0).getTime();

          return dateB - dateA;
        })
    );
  }, []);
  const conversationIdsKey = conversations
    .map((conversation) => (typeof conversation.id === "number" ? conversation.id : null))
    .filter((id): id is number => id !== null)
    .join(",");

  useEffect(() => {
    const parsedConversationId = Number(searchParams.get("conversation"));

    if (Number.isInteger(parsedConversationId) && parsedConversationId > 0) {
      pendingConversationIdRef.current = parsedConversationId;
    }
  }, [searchParams]);

  useEffect(() => {
    void Promise.resolve().then(() => {
      fetchConversations();
      fetchContacts();
    });
  }, [fetchContacts, fetchConversations]);

  useEffect(() => {
    const pendingConversationId = pendingConversationIdRef.current;
    if (!pendingConversationId) return;

    const matchedConversation = conversations.find((conversation) => Number(conversation.id) === pendingConversationId);
    if (!matchedConversation) return;

    pendingConversationIdRef.current = null;
    setConversationFilter(matchedConversation.status === "closed" ? "history" : "active");
    setShowContacts(false);
    setActiveConversation(matchedConversation);
  }, [conversations]);

  useEffect(() => {
    activeConversationIdRef.current = isPersistedConversation(activeConversation)
      ? activeConversation.id
      : null;
  }, [activeConversation]);

  useEffect(() => {
    if (!isPersistedConversation(activeConversation)) {
      return;
    }

    const timer = window.setTimeout(() => {
      fetchMessages(activeConversation.id);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activeConversation, fetchMessages]);

  useEffect(() => {
    const conversationIds = conversationIdsKey
      .split(",")
      .map((id) => Number(id))
      .filter((id) => Number.isInteger(id) && id > 0);

    if (conversationIds.length === 0) return;

    return subscribeToConversationMessages(conversationIds, (messageConversationId, message) => {
        updateConversationLastMessage(messageConversationId, message);

        if (activeConversationIdRef.current === messageConversationId) {
          setMessages((prev) => {
            const alreadyExists = prev.some((item) => String(item.id) === String(message.id));

            return alreadyExists ? prev : [...prev, message];
          });
        }
    });
  }, [conversationIdsKey, updateConversationLastMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const uploadAttachments = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    try {
      const uploaded = await Promise.all(files.slice(0, 8 - pendingAttachments.length).map((file) => chatApi.uploadAttachment(file)));
      setPendingAttachments((items) => [...items, ...uploaded]);
    } catch (error) {
      console.error(error);
      setChatError("Lampiran gagal diunggah. Maksimal 10 MB per file.");
    }
  };

  const insertMention = (participant: ChatUser) => {
    const token = `@${participant.username ?? participant.name.replaceAll(" ", ".").toLowerCase()} `;
    setNewMessage((value) => `${value}${token}`);
    setMentionOpen(false);
  };

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if ((!newMessage.trim() && pendingAttachments.length === 0) || !activeConversation) return;
    if (activeConversation.can_send === false || activeConversation.status === "closed") return;

    const bodyToSend = newMessage.trim();
    const tempId = `temp-${Date.now()}`;
    const tempMessage: ChatMessage = {
      id: tempId,
      body: bodyToSend,
      attachments: pendingAttachments,
      reply_to_id: typeof replyTo?.id === "number" ? replyTo.id : null,
      reply_to: replyTo ? { id: Number(replyTo.id), body: replyTo.body, sender: replyTo.sender } : null,
      read_state: "sending",
      sender_id: user?.id,
      created_at: new Date().toISOString(),
      sender: user ? { ...user, email: user.email ?? undefined } : undefined,
    };

    setChatError(null);
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");
    setPendingAttachments([]);
    setReplyTo(null);

    if (isPersistedConversation(activeConversation)) {
      updateConversationLastMessage(activeConversation.id, tempMessage);
    }

    try {
      const receiverId = activeConversation.partner?.id;
      if (!isPersistedConversation(activeConversation) && !receiverId) {
        throw new Error("Penerima pesan tidak ditemukan.");
      }
      const payload = isPersistedConversation(activeConversation)
        ? { conversation_id: activeConversation.id, body: bodyToSend, reply_to_id: typeof replyTo?.id === "number" ? replyTo.id : undefined, attachment_ids: pendingAttachments.map((item) => item.id) } as const
        : { receiver_id: receiverId as number, body: bodyToSend, reply_to_id: typeof replyTo?.id === "number" ? replyTo.id : undefined, attachment_ids: pendingAttachments.map((item) => item.id) } as const;

      const persistedMessage = await chatApi.send(payload);

      setMessages((prev) => prev.map((message) => (message.id === tempId ? persistedMessage : message)));

      if (persistedMessage.conversation_id) {
        updateConversationLastMessage(persistedMessage.conversation_id, persistedMessage);

        if (!isPersistedConversation(activeConversation)) {
          const nextConversations = await fetchConversations();
          const nextActiveConversation = nextConversations.find((conversation) => conversation.id === persistedMessage.conversation_id);

          if (nextActiveConversation) {
            setActiveConversation(nextActiveConversation);
          }
        }
      }
    } catch (error) {
      console.error("Gagal mengirim pesan", error);
      setMessages((prev) => prev.map((message) => message.id === tempId ? { ...message, read_state: "failed" } : message));
      setNewMessage(bodyToSend);
      setPendingAttachments(pendingAttachments);
      setReplyTo(replyTo);
      setChatError("Gagal mengirim pesan. Coba kirim ulang.");
    }
  };

  const retryMessage = (message: ChatMessage) => {
    setNewMessage(message.body);
    setPendingAttachments(message.attachments ?? []);
    setReplyTo(message.reply_to ? { ...message.reply_to, sender_id: message.reply_to.sender?.id, created_at: "" } : null);
    setMessages((items) => items.filter((item) => item.id !== message.id));
  };

  const startNewConversation = (contact: ChatContact) => {
    setShowContacts(false);
    setChatError(null);

    const existingConversation = conversations.find((conversation) => {
      return conversation.context_type === "direct" && Number(conversation.partner?.id) === Number(contact.id);
    });

    if (existingConversation) {
      setActiveConversation(existingConversation);
      setConversationFilter(existingConversation.status === "closed" ? "history" : "active");
      return;
    }

    setActiveConversation({
      id: `temp-${contact.id}`,
      partner: contact,
      last_message: null,
      context_type: "direct",
      status: "open",
      can_send: true,
    });
    setMessages([]);
  };

  const isUnreadConversation = (conversation: ChatConversation) => Boolean(
    conversation.last_message && conversation.last_message.is_read === false && Number(conversation.last_message.sender_id) !== Number(user?.id)
  );
  const visibleConversations = conversations.filter((conversation) => {
    const isHistory = conversation.status === "closed";
    if (conversationFilter === "history" ? !isHistory : isHistory) return false;
    if (conversationTypeFilter === "unread" && !isUnreadConversation(conversation)) return false;
    if (conversationTypeFilter !== "all" && conversationTypeFilter !== "unread" && conversation.context_type !== conversationTypeFilter) return false;
    const query = conversationSearch.trim().toLowerCase();
    return !query || `${conversationTitle(conversation)} ${conversationSubtitle(conversation, user?.id)}`.toLowerCase().includes(query);
  });
  const activeCount = conversations.filter((conversation) => conversation.status !== "closed").length;
  const historyCount = conversations.filter((conversation) => conversation.status === "closed").length;
  const unreadCount = conversations.filter(isUnreadConversation).length;
  const activeIsTaskRoom = activeConversation?.context_type === "odds_task";
  const activeTask = activeConversation?.task;
  const activeCanSend = activeConversation
    ? activeConversation.can_send !== false && activeConversation.status !== "closed"
    : false;

  return (
    <div className="flex h-full w-full overflow-hidden rounded-lg border border-cu-line bg-cu-surface text-cu-ink shadow-sm">
      <aside className="flex w-[360px] shrink-0 flex-col border-r border-cu-line bg-cu-surface-soft xl:w-[380px]">
        <div className="flex items-center justify-between border-b border-cu-line bg-white px-5 py-4">
          <div>
            <h1 className="text-lg font-semibold text-cu-ink">Pesan</h1>
            <p className="mt-0.5 text-xs text-cu-muted">Chat langsung dan diskusi task ODDS.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowContacts((value) => !value)}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-cu-line bg-white text-cu-ink transition hover:bg-cu-panel-soft"
            title="Mulai pesan baru"
          >
            <MaterialIcon name={showContacts ? "close" : "add"} size="sm" />
          </button>
        </div>

        {!showContacts && (
          <div className="space-y-3 border-b border-cu-line bg-white px-4 py-3">
            <label className="relative block"><MaterialIcon name="search" size="sm" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cu-muted" /><input value={conversationSearch} onChange={(event) => setConversationSearch(event.target.value)} placeholder="Cari pesan atau task..." className="h-10 w-full rounded-lg border border-cu-line bg-cu-surface-soft pl-10 pr-3 text-sm outline-none focus:border-cu-info" /></label>
            <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setConversationFilter("active")}
              className={`h-9 rounded-lg text-sm font-semibold transition ${
                conversationFilter === "active"
                  ? "bg-cu-ink text-white"
                  : "border border-cu-line bg-white text-cu-muted hover:bg-cu-panel-soft hover:text-cu-ink"
              }`}
            >
              Aktif ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setConversationFilter("history")}
              className={`h-9 rounded-lg text-sm font-semibold transition ${
                conversationFilter === "history"
                  ? "bg-cu-ink text-white"
                  : "border border-cu-line bg-white text-cu-muted hover:bg-cu-panel-soft hover:text-cu-ink"
              }`}
            >
              Riwayat ({historyCount})
            </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-0.5">
              {([['all', 'Semua'], ['unread', `Belum dibaca (${unreadCount})`], ['direct', 'Direct'], ['odds_task', 'Task ODDS']] as const).map(([value, label]) => <button key={value} type="button" onClick={() => setConversationTypeFilter(value)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${conversationTypeFilter === value ? "border-cu-ink bg-cu-ink text-white" : "border-cu-line bg-white text-cu-muted hover:bg-cu-panel-soft"}`}>{label}</button>)}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto cu-popup-scrollbar-light">
          {showContacts ? (
            <div>
              <div className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-cu-muted">
                Daftar Kontak
              </div>
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => startNewConversation(contact)}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-white"
                >
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-cu-line bg-white">
                    <ContactAvatar contact={contact} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-cu-ink">{contact.name}</p>
                  </div>
                </button>
              ))}
              {contacts.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-cu-muted">Kontak belum tersedia.</p>
              )}
            </div>
          ) : (
            <div className="py-2">
              {visibleConversations.map((conversation) => {
                const isSelected = activeConversation?.id === conversation.id;
                const lastMessage = conversation.last_message;
                const isUnread = isUnreadConversation(conversation);

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => setActiveConversation(conversation)}
                    className={`flex w-full items-center gap-3 border-l-4 px-4 py-3 text-left transition ${
                      isSelected
                        ? "border-cu-info bg-white"
                        : "border-transparent hover:bg-white"
                    }`}
                  >
                    <div className="relative size-11 shrink-0 overflow-hidden rounded-full border border-cu-line bg-white shadow-sm">
                      <ConversationAvatar conversation={conversation} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className={`truncate text-sm ${isUnread ? "font-bold text-cu-ink" : "font-semibold text-cu-ink"}`}>{conversationTitle(conversation)}</p>
                        {lastMessage && (
                          <span className="shrink-0 text-[11px] text-cu-muted">
                            {formatMessageTime(lastMessage.created_at)}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-sm text-cu-muted">
                        {conversationSubtitle(conversation, user?.id)}
                      </p>
                    </div>
                    {isUnread && <span className="size-2 shrink-0 rounded-full bg-cu-info" aria-label="Belum dibaca" />}
                  </button>
                );
              })}
              {visibleConversations.length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-cu-muted">
                  {conversationFilter === "history"
                    ? "Belum ada riwayat chat task."
                    : "Belum ada percakapan aktif. Klik tombol tambah untuk memulai."}
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col bg-white">
        {activeConversation ? (
          <>
            <header className="flex items-center justify-between gap-4 border-b border-cu-line bg-white px-6 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-cu-line bg-cu-surface-soft">
                  <ConversationAvatar conversation={activeConversation} />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-cu-ink">{conversationTitle(activeConversation)}</h2>
                  {activeIsTaskRoom ? (
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-cu-muted"><span className="truncate">{activeTask?.design_purpose ?? "Diskusi task ODDS"}</span><span className="rounded-full bg-cu-panel-soft px-2 py-0.5 font-medium">{activeTask?.status ?? "Task ODDS"}</span>{activeTask?.deadline && <span>Tenggat {new Date(activeTask.deadline).toLocaleDateString("id-ID")}</span>}</div>
                  ) : (
                    <p className="truncate text-xs text-cu-muted">
                      {activeConversation.partner?.roles?.join(", ") || "Direct message"}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {activeIsTaskRoom && activeTask?.id && (
                  <Link
                    href={`/odds/detail?id=${activeTask.id}`}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-cu-line bg-white px-3 text-sm font-semibold text-cu-ink transition hover:bg-cu-panel-soft"
                  >
                    <MaterialIcon name="open_in_new" size="sm" />
                    Detail Task
                  </Link>
                )}
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                  activeConversation.status === "closed"
                    ? "border-cu-line bg-cu-panel-soft text-cu-muted"
                    : "border-cu-success/20 bg-cu-success/10 text-cu-success"
                }`}>
                  {activeConversation.status === "closed" ? "Riwayat" : "Aktif"}
                </span>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto bg-[#f7f8fa] p-6 cu-popup-scrollbar-light">
              <div className="flex flex-col space-y-4">
                {hasMoreMessages && (
                  <button
                    type="button"
                    disabled={loadingEarlier}
                    onClick={async () => { if (!isPersistedConversation(activeConversation)) return; setLoadingEarlier(true); await fetchMessages(activeConversation.id, messagePage + 1, true); setLoadingEarlier(false); }}
                    className="mx-auto rounded-full border border-cu-line bg-white px-3 py-1.5 text-xs font-semibold text-cu-muted hover:bg-cu-panel-soft disabled:opacity-60"
                  >
                    {loadingEarlier ? "Memuat pesan sebelumnya..." : "Muat pesan sebelumnya"}
                  </button>
                )}
                {messages.map((message) => {
                  const isMine = Number(message.sender_id) === Number(user?.id);

                  return (
                    <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] rounded-lg border px-4 py-2.5 text-sm shadow-sm ${
                          isMine
                            ? "border-cu-info bg-cu-info text-white"
                            : "border-cu-line bg-white text-cu-ink"
                        }`}
                      >
                        {!isMine && message.sender?.name && (
                          <p className="mb-1 text-[11px] font-semibold text-cu-muted">{message.sender.name}</p>
                        )}
                        {message.reply_to && <div className={`mb-2 rounded border-l-2 px-2 py-1 text-xs ${isMine ? "border-white/70 bg-white/15 text-white/85" : "border-cu-info bg-cu-panel-soft text-cu-muted"}`}><p className="font-semibold">{message.reply_to.sender?.name ?? "Pesan"}</p><p className="truncate">{message.reply_to.body}</p></div>}
                        {message.body && <p className="whitespace-pre-wrap leading-6">{message.body}</p>}
                        {(message.attachments ?? []).map((attachment) => <a key={attachment.id} href={resolveStorageUrl(attachment.path) ?? "#"} target="_blank" rel="noreferrer" className={`mt-2 flex items-center gap-2 rounded border px-2 py-1.5 text-xs font-semibold ${isMine ? "border-white/25 bg-white/15 text-white" : "border-cu-line bg-cu-surface-soft text-cu-ink"}`}><MaterialIcon name="attach_file" size="sm" /><span className="truncate">{attachment.name}</span></a>)}
                        <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isMine ? "text-white/75" : "text-cu-muted"}`}>
                          <span>{formatMessageTime(message.created_at)}</span>
                          {isMine && <MaterialIcon name={message.read_state === "read" ? "done_all" : message.read_state === "failed" ? "error" : "done"} size="sm" />}
                          {message.read_state === "failed" && <button type="button" onClick={() => retryMessage(message)} className="ml-1 underline">Coba lagi</button>}
                        </div>
                        {activeCanSend && message.read_state !== "failed" && <button type="button" onClick={() => setReplyTo(message)} className={`mt-1 text-[10px] font-semibold ${isMine ? "text-white/80" : "text-cu-info"}`}>Balas</button>}
                      </div>
                    </div>
                  );
                })}
                {messages.length === 0 && (
                  <p className="py-12 text-center text-sm text-cu-muted">Belum ada pesan di percakapan ini.</p>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <footer className="border-t border-cu-line bg-white px-5 py-4">
              {chatError && (
                <p className="mb-3 rounded-lg border border-cu-danger/20 bg-cu-danger/10 px-3 py-2 text-sm text-cu-danger">
                  {chatError}
                </p>
              )}
              {activeCanSend ? (
                <form onSubmit={sendMessage} className="space-y-2">
                  {replyTo && <div className="flex items-center justify-between rounded-lg border border-cu-line bg-cu-surface-soft px-3 py-2 text-xs"><div className="min-w-0"><p className="font-semibold text-cu-ink">Membalas {replyTo.sender?.name ?? "pesan"}</p><p className="truncate text-cu-muted">{replyTo.body}</p></div><button type="button" onClick={() => setReplyTo(null)} className="text-cu-muted hover:text-cu-ink"><MaterialIcon name="close" size="sm" /></button></div>}
                  {pendingAttachments.length > 0 && <div className="flex flex-wrap gap-2">{pendingAttachments.map((attachment) => <span key={attachment.id} className="inline-flex max-w-full items-center gap-1 rounded-full border border-cu-line bg-cu-surface-soft px-2 py-1 text-xs text-cu-ink"><MaterialIcon name="attach_file" size="sm" /><span className="max-w-48 truncate">{attachment.name}</span><button type="button" onClick={() => setPendingAttachments((items) => items.filter((item) => item.id !== attachment.id))}><MaterialIcon name="close" size="sm" /></button></span>)}</div>}
                <div className="flex items-end gap-3">
                  <input ref={attachmentInputRef} type="file" multiple className="hidden" onChange={uploadAttachments} />
                  <button type="button" onClick={() => attachmentInputRef.current?.click()} className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-cu-line text-cu-muted hover:bg-cu-panel-soft" title="Tambah lampiran"><MaterialIcon name="attach_file" size="sm" /></button>
                  <div className="relative min-w-0 flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    onKeyDown={(event) => { if (event.key === "@") setMentionOpen(true); if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }}
                    placeholder="Ketik pesan... (Enter untuk kirim, Shift+Enter untuk baris baru)"
                    rows={1}
                    className="block min-h-11 max-h-32 w-full resize-y rounded-lg border border-cu-line bg-cu-surface-soft px-4 py-3 text-sm text-cu-ink outline-none transition placeholder:text-cu-muted focus:border-cu-info focus:bg-white"
                  />
                  {mentionOpen && (activeConversation.participants ?? []).filter((participant) => participant.id !== user?.id).length > 0 && <div className="absolute bottom-full left-0 z-10 mb-2 w-64 overflow-hidden rounded-lg border border-cu-line bg-white shadow-lg">{(activeConversation.participants ?? []).filter((participant) => participant.id !== user?.id).map((participant) => <button key={participant.id} type="button" onClick={() => insertMention(participant)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-cu-panel-soft"><span className="font-semibold text-cu-ink">{participant.name}</span><span className="text-xs text-cu-muted">@{participant.username ?? participant.name.replaceAll(" ", ".").toLowerCase()}</span></button>)}</div>}
                  </div>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() && pendingAttachments.length === 0}
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-cu-info text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Kirim pesan"
                  >
                    <MaterialIcon name="send" size="sm" />
                  </button>
                </div>
                </form>
              ) : (
                <p className="rounded-lg border border-cu-line bg-cu-surface-soft px-4 py-3 text-sm text-cu-muted">
                  Room ini hanya bisa dilihat sebagai riwayat.
                </p>
              )}
            </footer>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-lg border border-cu-line bg-cu-surface-soft text-cu-muted">
              <MaterialIcon name="chat_bubble_outline" size="xl" />
            </div>
            <h2 className="text-xl font-semibold text-cu-ink">Pilih percakapan</h2>
            <p className="mt-2 max-w-xs text-sm leading-6 text-cu-muted">
              Buka pesan aktif, riwayat task ODDS, atau mulai obrolan baru dari daftar kontak.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="rounded-lg border border-cu-line bg-white p-6 text-sm text-cu-muted">Memuat pesan...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
