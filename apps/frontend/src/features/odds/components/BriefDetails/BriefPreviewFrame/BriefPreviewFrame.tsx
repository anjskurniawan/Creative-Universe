"use client";

import { useState, type ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

export function BriefPreviewFrame({ children }: { children: ReactNode }) {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className={fullscreen ? "fixed inset-0 z-[100] flex h-dvh min-h-0 min-w-0 flex-col overflow-hidden bg-white p-4 shadow-2xl" : "relative flex h-full min-h-0 min-w-0 flex-1 flex-col"}>
      <button
        type="button"
        onClick={() => setFullscreen((value) => !value)}
        className="absolute right-2 top-2 z-30 flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white/95 text-slate-600 shadow-sm transition hover:bg-slate-50"
        aria-label={fullscreen ? "Keluar fullscreen" : "Buka fullscreen"}
        title={fullscreen ? "Keluar fullscreen" : "Buka fullscreen"}
      >
        <MaterialIcon name={fullscreen ? "close_fullscreen" : "open_in_full"} size="sm" />
      </button>
      <div className="h-full min-h-0 min-w-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
