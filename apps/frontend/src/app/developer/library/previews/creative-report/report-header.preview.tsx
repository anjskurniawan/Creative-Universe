"use client";

import { useState } from "react";
import { ReportHeader } from "@/components/creative-report/report-header";
import { PreviewWrapper } from "../preview-wrapper";

export function ReportHeaderPreview() {
  const [month, setMonth] = useState("2026-08");

  return (
    <PreviewWrapper width="full">
      <div className="w-full rounded-xl border border-slate-100 bg-white p-5">
        <ReportHeader month={month} monthLabel="Agustus 2026" onMonthChange={setMonth} onExportPdf={() => {}} />
      </div>
    </PreviewWrapper>
  );
}
