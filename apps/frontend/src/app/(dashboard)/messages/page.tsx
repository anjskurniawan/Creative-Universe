"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { getEchoClient } from "@/lib/echo";
import { apiFetch } from "@/lib/api";
import Image from "next/image";

export default function MessagesPage() {
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [conversations, setConversations] = useState<Record<string, unknown>[]>([]);
  const [activeConversation, setActiveConversation] = useState<Record<string, unknown> | null>(null);
  const [messages, setMessages] = useState<Record<string, unknown>[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [contacts, setContacts] = useState<Record<string, unknown>[]>([]);
  const [showContacts, setShowContacts] = useState(false);
  const [conversationFilter, setConversationFilter] = useState<"active" | "history">("active");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchUser = useCallback(async () => {
    try {
      const data = await apiFetch<Record<string, unknown>>("/auth/me");
      setUser(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await apiFetch<{data: Record<string, unknown>[]}>("/chat/conversations");
      if (res?.data) {
        setConversations(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchContacts = useCallback(async () => {
    try {
      const res = await apiFetch<{data: Record<string, unknown>[]}>("/chat/contacts");
      if (res?.data) {
        setContacts(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchMessages = useCallback(async (id: number) => {
    try {
      const res = await apiFetch<{data: Record<string, unknown>[]}>(`/chat/conversations/${id}/messages`);
      if (res?.data) {
        setMessages(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const updateConversationLastMessage = useCallback((convId: number, message: Record<string, unknown>) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              last_message: {
                body: message.body,
                created_at: message.created_at,
                is_read: false,
                sender_id: message.sender_id,
              },
            }
          : c
      ).sort((a, b) => {
        const aMsg = a.last_message as Record<string, unknown>;
        const bMsg = b.last_message as Record<string, unknown>;
        const dateA = new Date((aMsg?.created_at as string) || 0).getTime();
        const dateB = new Date((bMsg?.created_at as string) || 0).getTime();
        return dateB - dateA;
      })
    );
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => {
      fetchUser();
      fetchConversations();
      fetchContacts();
    });
  }, [fetchContacts, fetchConversations, fetchUser]);

  useEffect(() => {
    if (activeConversation) {
      void Promise.resolve().then(() => {
        fetchMessages(activeConversation.id as number);
      });
      
      const echo = getEchoClient();
      if (echo) {
        const channel = echo.private(`conversation.${activeConversation.id}`);
        channel.listen("MessageSent", (e: { message: Record<string, unknown> }) => {
          // If message is from someone else, add to list
          if (e.message.sender_id !== user?.id) {
            setMessages((prev) => [...prev, e.message]);
            // Also update last message in conversation list
            updateConversationLastMessage(activeConversation.id as number, e.message);
          }
        });
        return () => {
          channel.stopListening("MessageSent");
          echo.leave(`conversation.${activeConversation.id}`);
        };
      }
    }
  }, [activeConversation, fetchMessages, updateConversationLastMessage, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;
    if (activeConversation.can_send === false || activeConversation.status === "closed") return;

    const tempMessage = {
      id: Date.now(),
      body: newMessage,
      sender_id: user?.id,
      created_at: new Date().toISOString(),
      sender: {
        id: user?.id,
        name: user?.name,
        avatar_path: user?.avatar_path,
      }
    };
    
    // Optimistic UI update
    setMessages((prev) => [...prev, tempMessage]);
    updateConversationLastMessage(activeConversation.id as number, tempMessage);
    const bodyToSend = newMessage;
    setNewMessage("");

    try {
      const partner = activeConversation.partner as Record<string, unknown>;
      const payload = typeof activeConversation.id === "number"
        ? { conversation_id: activeConversation.id, body: bodyToSend }
        : { receiver_id: partner?.id, body: bodyToSend };

      await apiFetch("/chat/messages", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      // the real message might not need to be refetched if we just wait for echo or rely on optimistic UI
    } catch (error) {
      console.error("Gagal mengirim pesan", error);
      alert("Gagal mengirim pesan");
    }
  };

  const startNewConversation = async (contact: Record<string, unknown>) => {
    setShowContacts(false);
    // Check if conversation already exists
    const existing = conversations.find((c) => {
        const p = c.partner as Record<string, unknown>;
        return p?.id === contact.id;
    });
    if (existing) {
      setActiveConversation(existing);
    } else {
      // Create a temporary conversation object
      const tempConv = {
        id: "temp_" + contact.id, // Will be replaced upon first message or fetching
        partner: contact,
        last_message: null,
        context_type: "direct",
        status: "open",
        can_send: true,
      };
      setActiveConversation(tempConv);
      setMessages([]);
    }
  };

  const visibleConversations = conversations.filter((conversation) => {
    const isHistory = conversation.status === "closed";
    return conversationFilter === "history" ? isHistory : !isHistory;
  });
  const activeCount = conversations.filter((conversation) => conversation.status !== "closed").length;
  const historyCount = conversations.filter((conversation) => conversation.status === "closed").length;
  const activeTask = activeConversation?.task as Record<string, unknown> | null | undefined;
  const activeIsTaskRoom = activeConversation?.context_type === "odds_task";
  const activeCanSend = activeConversation ? activeConversation.can_send !== false && activeConversation.status !== "closed" : false;

  return (
    <div className="flex h-[calc(100vh-5rem)] w-full overflow-hidden rounded-2xl border border-cu-line bg-cu shadow-sm">
      {/* Sidebar: Daftar Obrolan */}
      <div className="flex w-1/3 min-w-[300px] flex-col border-r border-cu-line bg-[#f8f9fc] dark:bg-[#151618]">
        <div className="flex items-center justify-between border-b border-cu-line px-5 py-4">
          <h2 className="text-lg font-bold text-cu-ink">Pesan</h2>
          <button
            onClick={() => setShowContacts(!showContacts)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0088FF]/10 text-[#0088FF] hover:bg-[#0088FF]/20"
            title="Mulai Pesan Baru"
          >
            <MaterialIcon name="add" size="sm" />
          </button>
        </div>

        {!showContacts && (
          <div className="grid grid-cols-2 gap-2 border-b border-cu-line px-4 py-3">
            <button
              type="button"
              onClick={() => setConversationFilter("active")}
              className={`h-9 rounded-lg text-sm font-semibold transition ${
                conversationFilter === "active"
                  ? "bg-cu-info text-white"
                  : "border border-cu-line bg-white text-cu-muted hover:text-cu-ink"
              }`}
            >
              Aktif ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setConversationFilter("history")}
              className={`h-9 rounded-lg text-sm font-semibold transition ${
                conversationFilter === "history"
                  ? "bg-cu-info text-white"
                  : "border border-cu-line bg-white text-cu-muted hover:text-cu-ink"
              }`}
            >
              Riwayat ({historyCount})
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto cu-popup-scrollbar-light">
          {showContacts ? (
            <div>
              <div className="px-5 py-3 text-xs font-semibold uppercase text-cu-muted">
                Daftar Kontak
              </div>
              {contacts.map((contact) => (
                <button
                  key={contact.id as React.Key}
                  onClick={() => startNewConversation(contact)}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-cu-panel-soft">
                    {contact.avatar_path ? (
                      <Image src={contact.avatar_path as string} alt={contact.name as string} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-bold text-cu-muted">
                        {(contact.name as string).charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-cu-ink">{contact.name as string}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div>
              {visibleConversations.map((conv) => {
                const partner = conv.partner as Record<string, unknown>;
                const lastMessage = conv.last_message as Record<string, unknown>;
                const task = conv.task as Record<string, unknown> | null | undefined;
                const isTaskRoom = conv.context_type === "odds_task";
                const isClosed = conv.status === "closed";
                const title = isTaskRoom
                  ? `${task?.task_number ?? "Task ODDS"}`
                  : partner?.name as string;
                const subtitle = isTaskRoom
                  ? task?.design_purpose as string
                  : lastMessage?.body as string;
                return (
                  <button
                    key={conv.id as React.Key}
                    onClick={() => setActiveConversation(conv)}
                    className={`flex w-full items-center gap-3 border-l-4 px-4 py-3 text-left transition-colors ${
                      activeConversation?.id === conv.id
                        ? "border-[#0088FF] bg-black/5 dark:bg-white/5"
                        : "border-transparent hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                  >
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-cu-panel-soft shadow-sm">
                      {isTaskRoom ? (
                        <div className="flex h-full w-full items-center justify-center text-cu-info">
                          <MaterialIcon name="assignment" size="md" />
                        </div>
                      ) : partner?.avatar ? (
                        <Image src={partner.avatar as string} alt={partner.name as string} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg font-bold text-cu-muted">
                          {(partner?.name as string)?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate font-medium text-cu-ink">{title}</p>
                        {lastMessage && (
                          <span className="text-xs text-cu-muted">
                            {new Date(lastMessage.created_at as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-sm text-cu-muted">
                        {isClosed ? "Riwayat - " : ""}
                        {lastMessage
                          ? `${lastMessage.sender_id === user?.id ? "Anda: " : ""}${lastMessage.body as string}`
                          : subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
              {visibleConversations.length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-cu-muted">
                  {conversationFilter === "history"
                    ? "Belum ada riwayat chat task."
                    : "Belum ada percakapan aktif. Klik ikon + untuk memulai obrolan."}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Area: Area Obrolan */}
      <div className="flex flex-1 flex-col bg-white dark:bg-[#0c0d0f]">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 border-b border-cu-line px-6 py-4 shadow-sm">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-cu-panel-soft">
                {activeIsTaskRoom ? (
                  <div className="flex h-full w-full items-center justify-center text-cu-info">
                    <MaterialIcon name="assignment" size="sm" />
                  </div>
                ) : (activeConversation.partner as Record<string, unknown>)?.avatar ? (
                  <Image src={(activeConversation.partner as Record<string, unknown>).avatar as string} alt={(activeConversation.partner as Record<string, unknown>).name as string} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-bold text-cu-muted">
                    {((activeConversation.partner as Record<string, unknown>)?.name as string)?.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-cu-ink">
                  {activeIsTaskRoom
                    ? `${activeTask?.task_number ?? "Task ODDS"}`
                    : (activeConversation.partner as Record<string, unknown>)?.name as string}
                </h3>
                {activeIsTaskRoom ? (
                  <p className="text-xs text-cu-muted">
                    {activeTask?.design_purpose as string}
                    {activeConversation.status === "closed" ? " - Riwayat" : ""}
                  </p>
                ) : ((activeConversation.partner as Record<string, unknown>)?.roles as string[])?.length > 0 && (
                  <p className="text-xs text-cu-muted">{((activeConversation.partner as Record<string, unknown>).roles as string[]).join(", ")}</p>
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 cu-popup-scrollbar-light">
              <div className="flex flex-col space-y-4">
                {messages.map((msg) => {
                  const isMine = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id as React.Key} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`relative max-w-[70%] rounded-2xl px-5 py-2.5 text-sm shadow-sm ${
                          isMine
                            ? "bg-[#0088FF] text-white rounded-br-sm"
                            : "bg-[#f1f3f8] dark:bg-[#1a1b1e] text-cu-ink rounded-bl-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.body as string}</p>
                        <span
                          className={`mt-1 block text-right text-[10px] ${
                            isMine ? "text-blue-100" : "text-cu-muted"
                          }`}
                        >
                          {new Date(msg.created_at as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Chat Input */}
            <div className="border-t border-cu-line bg-white p-4 dark:bg-[#0c0d0f]">
              {activeCanSend ? (
                <form onSubmit={sendMessage} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ketik pesan Anda..."
                    className="flex-1 rounded-full border border-cu-line bg-[#f8f9fc] px-6 py-3 text-sm text-cu-ink focus:border-[#0088FF] focus:outline-none focus:ring-1 focus:ring-[#0088FF] dark:bg-[#151618]"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0088FF] text-white transition-transform hover:scale-105 hover:bg-[#0070d6] disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <MaterialIcon name="send" size="sm" />
                  </button>
                </form>
              ) : (
                <p className="rounded-xl border border-cu-line bg-[#f8f9fc] px-4 py-3 text-sm text-cu-muted">
                  Room ini hanya dapat dilihat sebagai riwayat.
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#f1f3f8] dark:bg-[#1a1b1e]">
              <MaterialIcon name="chat_bubble_outline" size="xl" className="text-cu-muted" />
            </div>
            <h2 className="text-xl font-bold text-cu-ink">Pesan Anda</h2>
            <p className="mt-2 text-sm text-cu-muted max-w-xs">
              Pilih percakapan dari daftar atau mulai obrolan baru dengan kontak Anda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
