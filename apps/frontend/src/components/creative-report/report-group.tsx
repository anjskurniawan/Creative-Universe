"use client";

import type { ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export function CreativeReportGroup({ index, name, staffCount, open, onToggle, children }: { index: number; name: string; staffCount: number; open: boolean; onToggle: () => void; children?: ReactNode }) {
  return <div>
    <button type="button" aria-expanded={open} onClick={onToggle} className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left ${open ? "rounded-b-none border-[#c9bbfc] bg-[#f7f5ff]" : "border-[#dbe4e8] bg-white"}`}>
      <span className="flex size-7 items-center justify-center rounded-lg bg-[#ede9fe] text-sm font-semibold text-[#6d46eb]">{index}</span>
      <span className="flex-1"><span className="block text-sm font-semibold text-[#3b4446]">{name}</span><span className="text-xs text-[#7b868a]">{staffCount} staff</span></span>
      <MaterialIcon name={open ? "keyboard_arrow_up" : "keyboard_arrow_down"} size="md" className="text-[#6d46eb]" />
    </button>
    {open ? children : null}
  </div>;
}
