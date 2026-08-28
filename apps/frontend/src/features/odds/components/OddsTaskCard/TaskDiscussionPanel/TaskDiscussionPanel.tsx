"use client";

import type { ComponentPropsWithoutRef } from "react";
import { OddsTaskChat } from "@/features/odds/components/OddsTaskChat/OddsTaskChat";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

/** Panel diskusi task yang dipakai oleh action `Diskusi Task`. */
type TaskDiscussionPanelProps = Omit<ComponentPropsWithoutRef<"section">, "children"> & { taskId: string | number; userId?: number | null; taskStatus?: string | null; preview?: boolean; unavailable?: boolean; title?: string; onClose?: () => void };

export function TaskDiscussionPanel({ taskId, userId, taskStatus, preview = false, unavailable = false, title, onClose, className = "", ...props }: TaskDiscussionPanelProps) {
  if (unavailable) {
    return <section {...props} className={`flex h-full min-h-0 w-full ${className}`} aria-label="Diskusi task">
      <div className="flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-cu-border bg-cu-panel-soft/30 px-4 py-6 text-center">
        <span className="text-3xl" role="img" aria-label="Love">❤️</span>
        <p className="mt-2 text-sm font-medium text-cu-muted">Tunggu sampai brief di approve dulu ya</p>
      </div>
    </section>;
  }

  if (preview) {
    const messages = [
      { name: "Client Test", body: "Mohon pastikan visual dan copy sudah sesuai dengan brief sebelum dikirim untuk review.", time: "12:17", accent: "text-[#0077bf]", surface: "bg-[#f3fbff]", initials: "CT" },
      { name: "Designer Test", body: "Siap, saya sedang menyelesaikan revisi terakhir dan akan mengirim output sesegera mungkin.", time: "12:22", accent: "text-[#1caa00]", surface: "bg-[#f3fff3]", initials: "DT" },
    ];

    return <section className="flex w-full flex-col gap-4" aria-label="Diskusi task contoh">
      <div className="flex items-center justify-between gap-3"><h3 className="truncate text-base font-semibold leading-6 text-[#3b4446]">Diskusi Project{title ? ` - ${title}` : ""}</h3>{onClose && <button type="button" onClick={onClose} aria-label="Tutup diskusi" className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#d9e1e6] text-[#3b4446] transition hover:bg-[#f3fbff]"><MaterialIcon name="close" size="sm" /></button>}</div>
      <div className="flex flex-col gap-4">
        {messages.map((message) => <div key={message.name} className="flex items-start gap-2"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-[#3b4446]">{message.initials}</span><div className={`min-w-0 flex-1 rounded-lg p-2 ${message.surface}`}><p className={`text-xs font-medium ${message.accent}`}>{message.name}</p><p className="mt-1 text-sm leading-5 text-black">{message.body}</p><p className="mt-1 text-right text-xs text-[#7d7c7c]">{message.time}</p></div></div>)}
      </div>
      <form onSubmit={(event) => event.preventDefault()} className="flex items-center gap-1 rounded-lg bg-white p-2 shadow-[0_5px_14px_rgba(44,42,39,0.06)]">
        <button type="button" aria-label="Tambah lampiran" className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[#7d7c7c] transition hover:bg-[#f3fbff] hover:text-[#0077bf]"><MaterialIcon name="add" size="sm" /></button>
        <button type="button" aria-label="Pilih stiker" className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[#7d7c7c] transition hover:bg-[#f3fbff] hover:text-[#0077bf]"><MaterialIcon name="mood" size="sm" /></button>
        <input aria-label="Pesan contoh" placeholder="Type a message" className="h-9 min-w-0 flex-1 border-0 px-1 text-sm outline-none" />
        <button type="submit" aria-label="Kirim pesan" className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#00a4ff] text-white transition hover:bg-[#0077bf]"><MaterialIcon name="send" size="sm" /></button>
      </form>
    </section>;
  }

  return <section {...props} className={`flex w-full flex-col gap-4 ${className}`} aria-label="Diskusi task">
    <div className="flex items-center justify-between gap-3">
      <h3 className="truncate text-base font-semibold leading-6 text-[#3b4446]">Diskusi Project{title ? ` - ${title}` : ""}</h3>
      {onClose && <button type="button" onClick={onClose} aria-label="Tutup diskusi" className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#d9e1e6] text-[#3b4446] transition hover:bg-[#f3fbff]"><MaterialIcon name="close" size="sm" /></button>}
    </div>
    <OddsTaskChat taskId={taskId} userId={userId} taskStatus={taskStatus} compact />
  </section>;
}
