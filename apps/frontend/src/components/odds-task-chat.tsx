"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { TaskFeedbackToast } from "@/components/odds/TaskCard/task-feedback-toast";
import {
  chatApi,
  subscribeToConversationMessages,
  type ChatMessage,
} from "@/core/chat";
import { appRoute } from "@/core/navigation/routes";
import {
  OddsTaskConversation,
  getOddsTaskConversation,
} from "@/features/odds/api";

function formatChatTime(value: string | null | undefined): string {
  if (!value) return "";

  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function participantNames(conversation: OddsTaskConversation): string {
  const names = conversation.participants.map((participant) => participant.name).filter(Boolean);

  return names.length > 0 ? names.join(", ") : "Belum ada peserta";
}

function userInitial(name: string | null | undefined): string {
  const initials = (name ?? "?").trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("");
  return initials || "?";
}

function userAvatarUrl(user: ChatMessage["sender"]): string | null {
  return user?.avatar ?? user?.avatar_path ?? null;
}

function isDesignerSender(message: ChatMessage): boolean {
  const roles = (message.sender?.roles ?? []).map((role) => String(role).toLowerCase());
  const identity = `${message.sender?.name ?? ""} ${message.sender?.username ?? ""}`.toLowerCase();
  return roles.some((role) => role.includes("designer") || role.includes("videographer") || role.includes("content creator") || role.includes("content_creator")) || identity.includes("designer");
}

function ChatAvatar({ sender, align, compact = false }: { sender: ChatMessage["sender"]; align: "left" | "right"; compact?: boolean }) {
  const avatarUrl = userAvatarUrl(sender);
  const avatarClass = compact
    ? "bg-slate-200 text-[#3b4446]"
    : align === "right"
      ? "border border-[#bdeaff] bg-[#e5f6fd] text-[#00a4ff]"
      : "border border-white bg-white text-[#806272] shadow-[0_1px_2px_rgba(44,42,39,0.08)]";

  return (
    <span
      className={`flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full ${compact ? "text-[10px]" : "text-[11px]"} font-bold leading-none ${avatarClass}`}
      aria-hidden="true"
    >
      {avatarUrl ? <img src={avatarUrl} alt="" className="size-full object-cover" /> : userInitial(sender?.name)}
    </span>
  );
}

function MessageActionSkeleton() {
  return <div className="animate-pulse space-y-4" aria-label="Memuat diskusi task" aria-busy="true">
    {["first", "second"].map((key, index) => <div key={key} className="flex items-start gap-2">
      <span className="size-8 shrink-0 rounded-full bg-slate-200" />
      <div className={`min-w-0 flex-1 rounded-lg p-2 ${index === 0 ? "bg-[#f3fbff]" : "bg-[#f3fff3]"}`}>
        <span className="block h-3 w-20 rounded bg-slate-200/80" />
        <span className="mt-2 block h-3 w-3/4 rounded bg-slate-200/70" />
        <span className="mt-2 ml-auto block h-2 w-8 rounded bg-slate-200/60" />
      </div>
    </div>)}
    <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-[0_5px_14px_rgba(44,42,39,0.06)]">
      <span className="size-9 shrink-0 rounded-full bg-slate-100" />
      <span className="size-9 shrink-0 rounded-full bg-slate-100" />
      <span className="h-4 flex-1 rounded bg-slate-100" />
      <span className="size-9 shrink-0 rounded-full bg-sky-100" />
    </div>
  </div>;
}

export function OddsTaskChat({
  taskId,
  userId,
  taskStatus,
  compact = false,
}: {
  taskId: string | number;
  userId?: number | null;
  taskStatus?: string | null;
  compact?: boolean;
}) {
  const [conversation, setConversation] = useState<OddsTaskConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesPanelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadConversation = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const nextConversation = await getOddsTaskConversation(taskId);
      setConversation(nextConversation);
      if (nextConversation) {
        const response = await chatApi.messages(nextConversation.id);
        setMessages(response.data);
      } else {
        setMessages([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat chat task.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadConversation();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadConversation, taskStatus]);

  useEffect(() => {
    if (!conversation?.id) return;

    return subscribeToConversationMessages([conversation.id], (_conversationId, message) => {
      if (Number(message.sender_id) !== Number(userId)) {
        setMessages((prev) => prev.some((item) => String(item.id) === String(message.id)) ? prev : [...prev, message]);
      }
    });
  }, [conversation?.id, userId]);

  useEffect(() => {
    const panel = messagesPanelRef.current;
    if (!panel) return;
    panel.scrollTop = panel.scrollHeight;
  }, [messages]);

  const submitMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!conversation?.can_send || !draft.trim() || sending) return;

    const body = draft.trim();
    const optimisticId = `optimistic-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const optimisticMessage: ChatMessage = {
      id: optimisticId,
      conversation_id: Number(conversation.id),
      sender_id: userId ?? undefined,
      body,
      created_at: new Date().toISOString(),
      read_state: "sending",
      sender: conversation.participants?.find((participant) => Number(participant.id) === Number(userId)) ?? {
        id: Number(userId ?? 0),
        name: "Anda",
      },
    };
    setDraft("");
    setSending(true);
    setError(null);
    setMessages((prev) => [...prev, optimisticMessage]);
    try {
      const message = await chatApi.send({ conversation_id: conversation.id, body });
      setMessages((prev) => prev.map((item) => item.id === optimisticId ? message : item));
    } catch (err) {
      setDraft(body);
      setMessages((prev) => prev.map((item) => item.id === optimisticId ? { ...item, read_state: "failed" } : item));
      setError(err instanceof Error ? err.message : "Gagal mengirim pesan.");
    } finally {
      setSending(false);
      window.requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    }
  };

  return (
    <section className={compact ? "bg-transparent px-2 pb-1" : "rounded-lg border border-cu-border bg-white p-5"}>
      <TaskFeedbackToast toast={error ? { status: "error", message: error } : null} onClose={() => setError(null)} />
      {!compact && (
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MaterialIcon name="forum" size="sm" className="text-cu-info" />
            <h2 className="text-lg font-semibold text-cu-ink">Diskusi Task</h2>
          </div>
          {conversation && (
            <p className="mt-1 text-xs text-cu-muted">{participantNames(conversation)}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {conversation && (
            <Link
              href={appRoute.messagesConversation(conversation.id)}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-cu-border text-cu-ink transition hover:bg-cu-panel-soft"
              aria-label="Buka chat penuh"
              title="Buka chat penuh"
            >
              <MaterialIcon name="open_in_new" size="sm" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => void loadConversation()}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-cu-border text-cu-ink transition hover:bg-cu-panel-soft"
            aria-label="Refresh chat task"
            title="Refresh chat task"
          >
            <MaterialIcon name="refresh" size="sm" />
          </button>
          {conversation && (
            <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
              conversation.status === "closed"
                ? "border-cu-border bg-cu-panel-soft text-cu-muted"
                : "border-cu-success/20 bg-cu-success/10 text-cu-success"
            }`}>
              {conversation.status === "closed" ? "Riwayat" : "Aktif"}
            </span>
          )}
        </div>
      </div>
      )}

      {loading ? (
        compact ? <MessageActionSkeleton /> : <p className="rounded-lg border border-dashed border-cu-border px-3 py-4 text-sm text-cu-muted">Memuat chat task...</p>
      ) : !conversation ? (
        <div className={`${compact ? "px-3 py-4" : "rounded-lg border border-dashed border-cu-border px-3 py-4"}`}>
          {error ? (
            <p className="text-sm text-cu-danger">{error}</p>
          ) : (
            <p className="text-sm text-cu-muted">
              Room chat dibuat otomatis setelah brief diterima dan task masuk antrean.
            </p>
          )}
          {!compact && (
            <button
              type="button"
              onClick={() => void loadConversation()}
              className="mt-3 inline-flex h-9 items-center gap-2 rounded-lg border border-cu-border bg-white px-3 text-sm font-semibold text-cu-ink transition hover:bg-cu-panel-soft"
            >
              <MaterialIcon name="sync" size="sm" />
              Cek Room Chat
            </button>
          )}
        </div>
      ) : (
        <>
          {conversation.status === "closed" && (
            <p className="mb-3 rounded-lg border border-cu-border bg-cu-panel-soft px-3 py-2 text-xs text-cu-muted">
              Room sudah tertutup. Riwayat tetap tersimpan pada task ini.
            </p>
          )}

          <div ref={messagesPanelRef} className={`${compact ? "max-h-72 min-h-40 bg-transparent" : "max-h-80 min-h-48 rounded-lg border border-cu-border bg-cu-panel-soft p-3"} overflow-y-auto`}>
            <div className="space-y-4">
              {messages.map((message) => {
                const isLeaderView = Boolean(
                  conversation.task
                  && Number(userId) !== Number(conversation.task.requester_id)
                  && Number(userId) !== Number(conversation.task.assigned_designer_id),
                );
                const isCurrentUser = Number(message.sender_id) === Number(userId);
                const designerMessage = isDesignerSender(message);
                const greenBubble = isLeaderView ? designerMessage : isCurrentUser;
                const isRight = !isLeaderView && isCurrentUser;
                return (
                  <div key={message.id} className={`flex items-start gap-2 ${isRight ? "justify-end" : "justify-start"}`}>
                    {!isRight && <ChatAvatar sender={message.sender} align="left" compact={compact} />}
                    {compact ? (
                      <div className={`min-w-0 w-fit max-w-[calc(100%-2.5rem)] rounded-lg p-2 ${greenBubble ? "bg-[#f3fff3]" : "bg-[#f3fbff]"}`}>
                        <p className={`text-xs font-medium ${greenBubble ? "text-[#1caa00]" : "text-[#0077bf]"}`}>{message.sender?.name ?? (designerMessage ? "Designer" : "Client")}</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-black">{message.body}</p>
                        <p className={`mt-1 text-right text-xs ${message.read_state === "failed" ? "text-rose-500" : message.read_state === "sending" ? "text-[#7d7c7c]" : "text-[#7d7c7c]"}`}>{message.read_state === "failed" ? "Gagal dikirim" : message.read_state === "sending" ? "Mengirim..." : formatChatTime(message.created_at)}</p>
                      </div>
                    ) : (
                      <div className="flex max-w-[72%] flex-col items-start">
                        <div className="flex items-center gap-2 text-[11px] text-[#806272]">
                          <span className="font-semibold">{message.sender?.name ?? (designerMessage ? "Designer" : "Client")}</span>
                          <span className={message.read_state === "failed" ? "text-rose-500" : "text-[#9aa3ad]"}>{message.read_state === "failed" ? "Gagal dikirim" : message.read_state === "sending" ? "Mengirim..." : formatChatTime(message.created_at)}</span>
                        </div>
                        <div className={`rounded-2xl rounded-bl-md px-3.5 py-2.5 text-sm shadow-[0_2px_6px_rgba(44,42,39,0.06)] ${greenBubble ? "bg-[#f3fff3] text-[#303431]" : "border border-white/80 bg-[#f3fbff] text-[#303431]"}`}>
                          <p className="whitespace-pre-wrap leading-5">{message.body}</p>
                        </div>
                      </div>
                    )}
                    {isRight && <ChatAvatar sender={message.sender} align="right" compact={compact} />}
                  </div>
                );
              })}
              {messages.length === 0 && (
                <p className={`${compact ? "py-5" : "py-8"} text-center text-sm text-cu-muted`}>Belum ada pesan pada task ini.</p>
              )}
            </div>
          </div>

          {conversation.can_send ? (
            <form onSubmit={submitMessage} className={`${compact ? "mt-4 rounded-lg bg-white p-2 shadow-[0_5px_14px_rgba(44,42,39,0.06)]" : "mt-3"} flex items-center gap-2`}>
              {compact && <><button type="button" className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[#7d7c7c] transition hover:bg-[#f3fbff] hover:text-[#0077bf]" aria-label="Tambah lampiran"><MaterialIcon name="add" size="sm" /></button><button type="button" className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[#7d7c7c] transition hover:bg-[#f3fbff] hover:text-[#0077bf]" aria-label="Pilih stiker"><MaterialIcon name="mood" size="sm" /></button></>}
              <input
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={compact ? "Type a message" : "Tulis pesan task..."}
                className={`${compact ? "h-9 border-0 px-1" : "h-10 rounded-lg border border-cu-border px-3"} min-w-0 flex-1 text-sm outline-none focus:border-cu-info`}
              />
              <button
                type="submit"
                disabled={!draft.trim() || sending}
                className={`${compact ? "size-9 rounded-full" : "size-10 rounded-lg"} inline-flex shrink-0 items-center justify-center bg-[#00a4ff] text-white transition hover:bg-[#0077bf] disabled:opacity-50`}
                aria-label="Kirim pesan"
              >
                <MaterialIcon name="send" size="sm" />
              </button>
            </form>
          ) : compact ? (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-white p-2 shadow-[0_5px_14px_rgba(44,42,39,0.06)]" aria-label="Composer chat tidak aktif">
              <button type="button" disabled className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[#7d7c7c] opacity-40" aria-label="Tambah lampiran"><MaterialIcon name="add" size="sm" /></button>
              <button type="button" disabled className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[#7d7c7c] opacity-40" aria-label="Pilih stiker"><MaterialIcon name="mood" size="sm" /></button>
              <input disabled value="" placeholder="Anda hanya dapat melihat percakapan ini." className="h-9 min-w-0 flex-1 border-0 bg-transparent px-1 text-sm text-[#7d7c7c] outline-none placeholder:text-[#7d7c7c]" />
              <button type="button" disabled className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#00a4ff] text-white opacity-40" aria-label="Kirim pesan"><MaterialIcon name="send" size="sm" /></button>
            </div>
          ) : (
            <p className="mt-3 rounded-lg border border-dashed border-cu-border px-3 py-3 text-sm text-cu-muted">
              Anda hanya bisa melihat riwayat chat task ini.
            </p>
          )}
        </>
      )}
    </section>
  );
}
