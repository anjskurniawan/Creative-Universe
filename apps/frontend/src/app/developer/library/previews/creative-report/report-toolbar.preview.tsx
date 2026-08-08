"use client";

import { useState } from "react";
import { ReportToolbar, type ReportMetric } from "@/components/creative-report/report-toolbar";
import { PreviewWrapper } from "../preview-wrapper";

const metrics: ReportMetric[] = [
  { label: "Total Staff", value: "24", icon: "groups", tone: "bg-[#ede9fe]", accent: "bg-[#6d46eb]" },
  { label: "Rata-rata", value: "86", icon: "trending_up", tone: "bg-[#e8f7ea]", accent: "bg-[#248235]" },
  { label: "Pending", value: "5", icon: "pending_actions", tone: "bg-[#fff3df]", accent: "bg-[#b65d08]" },
];

export function ReportToolbarPreview() {
  const [search, setSearch] = useState("");
  const [jobdesk, setJobdesk] = useState("Semua Jobdesk");

  return (
    <PreviewWrapper width="full">
      <div className="w-full rounded-xl border border-slate-100 bg-[#f7faff] p-4">
        <ReportToolbar
          search={search}
          onSearchChange={setSearch}
          jobdesk={jobdesk}
          onJobdeskChange={setJobdesk}
          jobdesks={["Semua Jobdesk", "Designer", "Frontend Engineer", "Copywriter"]}
          metrics={metrics}
        />
      </div>
    </PreviewWrapper>
  );
}
