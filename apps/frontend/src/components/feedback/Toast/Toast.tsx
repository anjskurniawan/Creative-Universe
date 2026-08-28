"use client";

import { createPortal } from "react-dom";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

export interface ToastProps {
  message: string;
  status?: "success" | "error";
  onClose: () => void;
}

/**
 * Komponen Toast Notification Portal Reusable (Toast)
 */
export function Toast({ message, status = "error", onClose }: ToastProps) {
  if (typeof document === "undefined") return null;

  const style =
    status === "error"
      ? { tone: "bg-rose-50 text-rose-600", title: "Gagal", icon: "error" }
      : { tone: "bg-emerald-50 text-emerald-600", title: "Berhasil", icon: "check_circle" };

  return createPortal(
    <div
      role="alert"
      aria-live="polite"
      className="cu-style cu-toast-enter fixed bottom-6 right-5 z-[9999] w-[min(360px,calc(100vw-2rem))] rounded-xl border border-[#d9e1e6] bg-white p-3 text-[#3b4446] shadow-xl"
    >
      <div className="flex items-start gap-3">
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${style.tone}`}>
          <MaterialIcon name={style.icon} size="sm" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#7d7c7c]">{style.title}</p>
          <p className="mt-0.5 text-sm font-semibold leading-snug">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-[#7d7c7c] transition hover:bg-[#f3fbff]"
          aria-label="Tutup notifikasi"
        >
          <MaterialIcon name="close" size="xs" />
        </button>
      </div>
    </div>,
    document.body
  );
}
