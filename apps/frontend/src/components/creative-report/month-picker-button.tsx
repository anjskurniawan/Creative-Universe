"use client";

import React, { useEffect, useRef, useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export type MonthPickerButtonProps = {
  month: string;
  monthLabel: string;
  theme?: "light" | "dark" | "retro";
  onMonthChange: (month: string) => void;
  className?: string;
};

export function MonthPickerButton({
  month,
  monthLabel,
  theme = "light",
  onMonthChange,
  className = "",
}: MonthPickerButtonProps) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const selectedYear = Number(month.slice(0, 4));
  const selectedMonth = Number(month.slice(5, 7)) - 1;
  const monthNames = Array.from({ length: 12 }, (_, index) =>
    new Intl.DateTimeFormat("id-ID", { month: "short" }).format(new Date(2020, index, 1)),
  );

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={pickerRef} className="relative min-w-0 flex-1 sm:flex-none">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full min-w-0 items-center justify-center gap-2 rounded-lg border p-2 text-sm font-medium leading-4 cursor-pointer ${
        theme === "dark"
          ? "border-[#b0ff5e]/30 bg-[#121916] text-[#f1f1f1]"
          : theme === "retro"
          ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b] shadow-[0_2px_0_#24252b]"
          : "border-[#bdeaff] bg-[#f3fbff] text-[#04044a]"
        } ${className}`}
      >
        <MaterialIcon name="calendar_month" size="auto" className="text-xl" />
        <span className="capitalize">{monthLabel}</span>
        <MaterialIcon name="keyboard_arrow_down" size="auto" className="text-xl" />
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[280px] rounded-2xl border border-[#d9d0ff] bg-white p-3 shadow-[0_14px_35px_rgba(55,35,130,0.18)]">
          <div className="mb-3 flex items-center justify-between">
            <button type="button" aria-label="Tahun sebelumnya" onClick={() => onMonthChange(`${selectedYear - 1}-${String(selectedMonth + 1).padStart(2, "0")}`)} className="flex size-8 items-center justify-center rounded-lg text-[#6d46eb] hover:bg-[#f0edff] cursor-pointer">
              <MaterialIcon name="chevron_left" size="sm" />
            </button>
            <span className="text-sm font-bold text-[#24252b]">{selectedYear}</span>
            <button type="button" aria-label="Tahun berikutnya" onClick={() => onMonthChange(`${selectedYear + 1}-${String(selectedMonth + 1).padStart(2, "0")}`)} className="flex size-8 items-center justify-center rounded-lg text-[#6d46eb] hover:bg-[#f0edff] cursor-pointer">
              <MaterialIcon name="chevron_right" size="sm" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {monthNames.map((name, index) => {
              const active = index === selectedMonth;
              return <button key={name} type="button" onClick={() => { onMonthChange(`${selectedYear}-${String(index + 1).padStart(2, "0")}`); setOpen(false); }} className={`rounded-lg px-2 py-2 text-xs font-semibold capitalize transition cursor-pointer ${active ? "bg-[#6d46eb] text-white shadow-sm" : "text-[#596267] hover:bg-[#f0edff] hover:text-[#6d46eb]"}`}>{name}</button>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
