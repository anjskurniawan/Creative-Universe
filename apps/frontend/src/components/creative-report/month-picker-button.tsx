"use client";

import React from "react";
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
  return (
    <button
      type="button"
      onClick={(event) =>
        (
          event.currentTarget.querySelector('input[type="month"]') as HTMLInputElement | null
        )?.showPicker()
      }
      className={`relative flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg border p-2 text-sm font-medium leading-4 sm:flex-none cursor-pointer ${
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
      <input
        aria-label="Ganti bulan"
        type="month"
        value={month}
        onChange={(event) => onMonthChange(event.target.value)}
        className="pointer-events-none absolute inset-0 size-full opacity-0"
        tabIndex={-1}
      />
    </button>
  );
}
