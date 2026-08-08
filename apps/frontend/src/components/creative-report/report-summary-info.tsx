"use client";

import React from "react";

export interface ReportSummaryInfoProps {
  monthLabel: string;
  count: number;
}

export function ReportSummaryInfo({ monthLabel, count }: ReportSummaryInfoProps) {
  return (
    <p className="py-2 text-xs text-[#7b868a]">
      Menampilkan ringkasan {monthLabel} · {count} staff
    </p>
  );
}
