"use client";

export interface ReportSummaryInfoProps {
  monthLabel: string;
  count: number;
}

export function ReportSummaryInfo({ monthLabel, count }: ReportSummaryInfoProps) {
  return (
    <p className="cu-style py-2 text-xs text-[#7b868a]">
      Menampilkan ringkasan {monthLabel} · {count} staff
    </p>
  );
}
