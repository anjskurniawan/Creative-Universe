"use client";

import { ReportTitle } from "@/components/creative-report/report-title";
import { MonthPickerButton } from "@/components/creative-report/month-picker-button";
import { ExportPdfButton } from "@/components/creative-report/export-pdf-button";

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
    <header className="mb-4 flex min-h-[45px] flex-col items-stretch justify-between gap-4 pb-0 sm:flex-row sm:items-center sm:gap-6">
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
