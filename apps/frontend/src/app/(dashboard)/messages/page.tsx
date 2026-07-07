"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { apiFetch } from "@/lib/api";
import { getEchoClient } from "@/lib/echo";

type UserSummary = {
  id: number;
  name: string;
  avatar?: string | null;
  avatar_path?: string | null;
  roles?: string[];
};

type TaskSummary = {
  id: number;
  task_number: string;
  design_purpose: string;
  status: string;
  requester_id: number;
  assigned_designer_id: number | null;
};

type LastMessage = {
  body: string;
  created_at: string;
  is_read?: boolean;
  sender_id: number;
};

type ChatMessage = {
  id: number | string;
  conversation_id?: number;
  sender_id: number | string | undefined;
  body: string;
  created_at: string;
  sender?: UserSummary;
};

type Conversation = {
  id: number | string;
  context_type: "direct" | "odds_task" | string;
  status: "open" | "closed" | string;
  can_send?: boolean;
  partner?: UserSummary | null;
  participants?: UserSummary[];
  task?: TaskSummary | null;
  last_message?: LastMessage | null;
  updated_at?: string;
};

type Contact = {
  id: number;
  name: string;
  avatar_path?: string | null;
  roles?: string[];
};

function avatarFor(user?: UserSummary | Contact | null): string | null {
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

function isPersistedConversation(conversation: Conversation | null): conversation is Conversation & { id: number } {
  return typeof conversation?.id === "number";
}

function conversationTitle(conversation: Conversation): string {
  if (conversation.context_type === "odds_task") {
    return conversation.task?.task_number ?? "Task ODDS";
  }

  return conversation.partner?.name ?? "Percakapan";
}

function conversationSubtitle(conversation: Conversation, userId?: number): string {
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

function ConversationAvatar({ conversation }: { conversation: Conversation }) {
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

function ContactAvatar({ contact }: { contact: Contact }) {
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

export default function MessagesPage() {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showContacts, setShowContacts] = useState(false);
  const [conversationFilter, setConversationFilter] = useState<"active" | "history">("active");
  const [chatError, setChatError] = useState<string | null>(null);
  const pendingConversationIdRef = useRef<number | null>(null);
  const activeConversationIdRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchUser = useCallback(async () => {
    try {
      const data = await apiFetch<UserSummary>("/auth/me");
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await apiFetch<{ data: Conversation[] }>("/chat/conversations");
      const nextConversations = res?.data ?? [];
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
      const res = await apiFetch<{ data: Contact[] }>("/chat/contacts");
      setContacts(res?.data ?? []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchMessages = useCallback(async (id: number) => {
    setChatError(null);
    try {
      const res = await apiFetch<{ data: ChatMessage[] }>(`/chat/conversations/${id}/messages`);
      setMessages(res?.data ?? []);
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
    const rawConversationId = new URLSearchParams(window.location.search).get("conversation");
    const parsedConversationId = Number(rawConversationId);

    if (Number.isInteger(parsedConversationId) && parsedConversationId > 0) {
      pendingConversationIdRef.current = parsedConversationId;
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => {
      fetchUser();
      fetchConversations();
      fetchContacts();
    });
  }, [fetchContacts, fetchConversations, fetchUser]);

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

    const echo = getEchoClient();
    if (!echo) return;

    conversationIds.forEach((conversationId) => {
      const channel = echo.private(`conversation.${conversationId}`);
      channel.listen(".message.sent", (event: { message: ChatMessage }) => {
        const messageConversationId = Number(event.message.conversation_id ?? conversationId);
        updateConversationLastMessage(messageConversationId, event.message);

        if (activeConversationIdRef.current === messageConversationId) {
          setMessages((prev) => {
            const alreadyExists = prev.some((message) => String(message.id) === String(event.message.id));

            return alreadyExists ? prev : [...prev, event.message];
          });
        }
      });
    });

    return () => {
      conversationIds.forEach((conversationId) => {
        const channelName = `conversation.${conversationId}`;
        echo.private(channelName).stopListening(".message.sent");
        echo.leave(channelName);
      });
    };
  }, [conversationIdsKey, updateConversationLastMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;
    if (activeConversation.can_send === false || activeConversation.status === "closed") return;

    const bodyToSend = newMessage.trim();
    const tempId = `temp-${Date.now()}`;
    const tempMessage: ChatMessage = {
      id: tempId,
      body: bodyToSend,
      sender_id: user?.id,
      created_at: new Date().toISOString(),
      sender: user ?? undefined,
    };

    setChatError(null);
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    if (isPersistedConversation(activeConversation)) {
      updateConversationLastMessage(activeConversation.id, tempMessage);
    }

    try {
      const payload = isPersistedConversation(activeConversation)
        ? { conversation_id: activeConversation.id, body: bodyToSend }
        : { receiver_id: activeConversation.partner?.id, body: bodyToSend };

      const res = await apiFetch<{ data: ChatMessage }>("/chat/messages", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const persistedMessage = res.data;

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
      setMessages((prev) => prev.filter((message) => message.id !== tempId));
      setNewMessage(bodyToSend);
      setChatError("Gagal mengirim pesan. Coba kirim ulang.");
    }
  };

  const startNewConversation = (contact: Contact) => {
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

  const visibleConversations = conversations.filter((conversation) => {
    const isHistory = conversation.status === "closed";
    return conversationFilter === "history" ? isHistory : !isHistory;
  });
  const activeCount = conversations.filter((conversation) => conversation.status !== "closed").length;
  const historyCount = conversations.filter((conversation) => conversation.status === "closed").length;
  const activeIsTaskRoom = activeConversation?.context_type === "odds_task";
  const activeTask = activeConversation?.task;
  const activeCanSend = activeConversation
    ? activeConversation.can_send !== false && activeConversation.status !== "closed"
    : false;

  return (
    <div className="flex h-full w-full overflow-hidden rounded-lg border border-cu-line bg-cu-surface text-cu-ink shadow-sm">
      <aside className="flex w-1/3 min-w-[320px] flex-col border-r border-cu-line bg-cu-surface-soft">
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
          <div className="grid grid-cols-2 gap-2 border-b border-cu-line bg-white px-4 py-3">
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
                        <p className="truncate text-sm font-semibold text-cu-ink">{conversationTitle(conversation)}</p>
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
                    <p className="truncate text-xs text-cu-muted">
                      {activeTask?.design_purpose ?? "Diskusi task ODDS"}
                      {activeConversation.status === "closed" ? " - Riwayat" : ""}
                    </p>
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
                        <p className="whitespace-pre-wrap leading-6">{message.body}</p>
                        <span className={`mt-1 block text-right text-[10px] ${isMine ? "text-white/75" : "text-cu-muted"}`}>
                          {formatMessageTime(message.created_at)}
                        </span>
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

            <footer className="border-t border-cu-line bg-white p-4">
              {chatError && (
                <p className="mb-3 rounded-lg border border-cu-danger/20 bg-cu-danger/10 px-3 py-2 text-sm text-cu-danger">
                  {chatError}
                </p>
              )}
              {activeCanSend ? (
                <form onSubmit={sendMessage} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    placeholder="Ketik pesan..."
                    className="h-11 min-w-0 flex-1 rounded-lg border border-cu-line bg-cu-surface-soft px-4 text-sm text-cu-ink outline-none transition placeholder:text-cu-muted focus:border-cu-info focus:bg-white"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-cu-info text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Kirim pesan"
                  >
                    <MaterialIcon name="send" size="sm" />
                  </button>
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
