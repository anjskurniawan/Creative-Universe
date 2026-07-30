"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export type TaskFeedbackToastStatus = "loading" | "success" | "error";

export type TaskFeedbackToastState = {
  status: TaskFeedbackToastStatus;
  message: string;
} | null;

const TASK_FEEDBACK_EVENT = "odds:task-feedback";

export function publishTaskFeedbackToast(toast: Exclude<TaskFeedbackToastState, null>): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<TaskFeedbackToastState>(TASK_FEEDBACK_EVENT, { detail: toast }));
}

const toastStyle = {
  loading: { icon: "progress_activity", tone: "bg-[#edf9ff] text-[#0077bf]", title: "Memproses" },
  success: { icon: "check_circle", tone: "bg-emerald-50 text-emerald-600", title: "Berhasil" },
  error: { icon: "error", tone: "bg-rose-50 text-rose-600", title: "Gagal" },
} as const;

export function TaskFeedbackToast({ toast, onClose }: { toast: TaskFeedbackToastState; onClose: () => void }) {
  if (!toast || typeof document === "undefined") return null;
  const style = toastStyle[toast.status];
  return createPortal(<div role={toast.status === "error" ? "alert" : "status"} aria-live="polite" className="cu-toast-enter fixed bottom-6 right-5 z-[160] w-[min(360px,calc(100vw-2rem))] rounded-xl border border-[#d9e1e6] bg-white p-3 text-[#3b4446] shadow-xl">
    <div className="flex items-start gap-3"><span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${style.tone}`}><MaterialIcon name={style.icon} size="sm" className={toast.status === "loading" ? "animate-spin" : ""} /></span><div className="min-w-0 flex-1"><p className="text-[11px] font-bold uppercase tracking-wide text-[#7d7c7c]">{style.title}</p><p className="mt-0.5 text-sm font-semibold leading-snug">{toast.message}</p></div>{toast.status !== "loading" && <button type="button" onClick={onClose} className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-[#7d7c7c] transition hover:bg-[#f3fbff]" aria-label="Tutup notifikasi"><MaterialIcon name="close" size="xs" /></button>}</div>
  </div>, document.body);
}

export function TaskFeedbackToastHost() {
  const [toast, setToast] = useState<TaskFeedbackToastState>(null);

  useEffect(() => {
    const handleToast = (event: Event) => {
      setToast((event as CustomEvent<TaskFeedbackToastState>).detail);
    };
    window.addEventListener(TASK_FEEDBACK_EVENT, handleToast);
    return () => window.removeEventListener(TASK_FEEDBACK_EVENT, handleToast);
  }, []);

  useEffect(() => {
    if (!toast || toast.status === "loading") return;
    const timeout = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  return <TaskFeedbackToast toast={toast} onClose={() => setToast(null)} />;
}
