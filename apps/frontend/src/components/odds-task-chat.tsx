"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { MaterialIcon } from "@/components/material-icon";
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
    setDraft("");
    setSending(true);
    setError(null);
    try {
      const message = await chatApi.send({ conversation_id: conversation.id, body });
      setMessages((prev) => [...prev, message]);
    } catch (err) {
      setDraft(body);
      setError(err instanceof Error ? err.message : "Gagal mengirim pesan.");
    } finally {
      setSending(false);
      window.requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    }
  };

  return (
    <section className={compact ? "bg-transparent" : "rounded-lg border border-cu-border bg-white p-5"}>
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
        <p className={`${compact ? "px-3 py-4" : "rounded-lg border border-dashed border-cu-border px-3 py-4"} text-sm text-cu-muted`}>Memuat chat task...</p>
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

          <div ref={messagesPanelRef} className={`${compact ? "max-h-56 min-h-28 bg-white px-3 py-2" : "max-h-80 min-h-48 rounded-lg border border-cu-border bg-cu-panel-soft p-3"} overflow-y-auto`}>
            <div className="space-y-3">
              {messages.map((message) => {
                const isMine = Number(message.sender_id) === Number(userId);
                return (
                  <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      isMine ? "bg-cu-info text-white" : "bg-white text-cu-ink"
                    }`}>
                      {!isMine && message.sender?.name && (
                        <p className="mb-1 text-[11px] font-semibold text-cu-muted">{message.sender.name}</p>
                      )}
                      <p className="whitespace-pre-wrap leading-5">{message.body}</p>
                      <p className={`mt-1 text-right text-[10px] ${isMine ? "text-white/70" : "text-cu-muted"}`}>
                        {formatChatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
              {messages.length === 0 && (
                <p className={`${compact ? "py-5" : "py-8"} text-center text-sm text-cu-muted`}>Belum ada pesan pada task ini.</p>
              )}
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-cu-danger">{error}</p>}

          {conversation.can_send ? (
            <form onSubmit={submitMessage} className={`${compact ? "border-t border-cu-border bg-white px-3 py-2" : "mt-3"} flex items-center gap-2`}>
              <input
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Tulis pesan task..."
                className={`${compact ? "h-9" : "h-10"} min-w-0 flex-1 rounded-lg border border-cu-border px-3 text-sm outline-none focus:border-cu-info`}
              />
              <button
                type="submit"
                disabled={!draft.trim() || sending}
                className={`${compact ? "size-9" : "size-10"} inline-flex shrink-0 items-center justify-center rounded-lg bg-cu-info text-white transition hover:bg-cu-info/90 disabled:opacity-50`}
                aria-label="Kirim pesan"
              >
                <MaterialIcon name="send" size="sm" />
              </button>
            </form>
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
