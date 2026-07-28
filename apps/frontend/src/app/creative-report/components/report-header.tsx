"use client";

import { MaterialIcon } from "@/components/material-icon";

export function CreativeReportHeader({
  month,
  monthLabel,
  theme,
  onMonthChange,
}: {
  month: string;
  monthLabel: string;
  theme: "light" | "dark" | "retro";
  onMonthChange: (month: string) => void;
}) {
  return (
    <header className="mb-4 flex min-h-[45px] flex-col items-stretch justify-between gap-4 pb-0 sm:flex-row sm:items-center sm:gap-6">
      <h1 className={`text-4xl font-medium leading-none tracking-[-0.72px] ${theme === "dark" ? "text-white" : "text-[#24252b]"}`}>Creative Report</h1>
      <div className="flex w-full gap-2 sm:w-auto">
        <button type="button" onClick={(event) => (event.currentTarget.querySelector('input[type="month"]') as HTMLInputElement | null)?.showPicker()} className={`relative flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg border p-2 text-sm font-medium leading-4 sm:flex-none ${theme === "dark" ? "border-[#b0ff5e]/30 bg-[#121916] text-[#f1f1f1]" : theme === "retro" ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b] shadow-[0_2px_0_#24252b]" : "border-[#bdeaff] bg-[#f3fbff] text-[#04044a]"}`}>
          <MaterialIcon name="calendar_month" size="auto" className="text-xl" />
          <span className="capitalize">{monthLabel}</span>
          <MaterialIcon name="keyboard_arrow_down" size="auto" className="text-xl" />
          <input aria-label="Ganti bulan" type="month" value={month} onChange={(event) => onMonthChange(event.target.value)} className="pointer-events-none absolute inset-0 z-10 size-full opacity-0" tabIndex={-1} />
        </button>
        <button type="button" onClick={() => window.print()} className={`flex flex-1 items-center justify-center gap-1 rounded-lg border p-2 text-sm font-medium leading-4 sm:flex-none ${theme === "dark" ? "border-[rgba(123,123,123,0.25)] bg-[#b0ff5e] text-[#181818]" : theme === "retro" ? "border-2 border-[#24252b] bg-[#ba0dcb] text-white shadow-[0_2px_0_#24252b]" : "border-[rgba(123,123,123,0.25)] bg-[#00a4ff] text-white"}`}>
          <MaterialIcon name="picture_as_pdf" size="auto" className="text-xl" /> Export PDF
        </button>
      </div>
    </header>
  );
}
