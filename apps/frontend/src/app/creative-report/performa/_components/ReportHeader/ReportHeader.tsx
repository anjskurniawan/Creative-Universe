"use client";

import { ReportTitle } from "./ReportTitle/ReportTitle";
import { MonthPickerButton } from "./MonthPickerButton/MonthPickerButton";
import { ExportPdfButton } from "./ExportPdfButton/ExportPdfButton";

export type ReportHeaderProps = {
  month: string;
  monthLabel: string;
  theme?: "light" | "dark" | "retro";
  title?: string;
  onMonthChange: (month: string) => void;
  onExportPdf?: () => void;
};

export function ReportHeader({
  month,
  monthLabel,
  theme = "light",
  title = "Creative Report",
  onMonthChange,
  onExportPdf,
}: ReportHeaderProps) {
  return (
    <header className="cu-style mb-4 flex min-h-[45px] flex-col items-stretch justify-between gap-4 pb-0 sm:flex-row sm:items-center sm:gap-6">
      <ReportTitle title={title} theme={theme} />
      <div className="flex w-full gap-2 sm:w-auto">
        <MonthPickerButton
          month={month}
          monthLabel={monthLabel}
          theme={theme}
          onMonthChange={onMonthChange}
        />
        <ExportPdfButton theme={theme} onClick={onExportPdf} />
      </div>
    </header>
  );
}
