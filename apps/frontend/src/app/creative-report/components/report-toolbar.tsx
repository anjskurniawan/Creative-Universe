"use client";

import { MaterialIcon } from "@/components/material-icon";

export type ReportMetric = { label: string; value: string; icon: string; tone: string; accent: string };

export function CreativeReportToolbar({ search, onSearchChange, jobdesk, onJobdeskChange, jobdesks, metrics, showMetrics = true }: { search: string; onSearchChange: (value: string) => void; jobdesk: string; onJobdeskChange: (value: string) => void; jobdesks: string[]; metrics: ReportMetric[]; showMetrics?: boolean }) {
  return <section className={`mt-0 grid grid-cols-[minmax(0,1fr)_3rem] gap-3 sm:grid-cols-2 ${showMetrics ? "lg:grid-cols-[minmax(220px,1.2fr)_180px_repeat(3,minmax(170px,1fr))]" : "lg:grid-cols-[minmax(220px,1.2fr)_180px]"}`}>
    <label className="flex h-12 min-w-0 items-center gap-3 rounded-xl border border-[#e2e6e9] bg-white px-4"><MaterialIcon name="search" size="sm" className="text-[#7b868a]" /><input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Cari nama creative..." className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label>
    <label className="relative flex h-12 min-w-0 items-center justify-center gap-2 rounded-xl border border-[#e2e6e9] bg-white px-0 sm:justify-start sm:px-3"><MaterialIcon name="filter_list" size="sm" className="shrink-0 text-[#6d46eb]" /><select aria-label="Filter Job Desk" value={jobdesk} onChange={(event) => onJobdeskChange(event.target.value)} className="min-w-0 flex-1 appearance-none bg-transparent text-sm font-medium outline-none max-sm:absolute max-sm:inset-0 max-sm:cursor-pointer max-sm:opacity-0">{jobdesks.map((item) => <option key={item}>{item}</option>)}</select></label>
    {showMetrics && metrics.map((metric) => <article key={metric.label} className="relative flex h-12 min-w-0 items-center gap-2 overflow-hidden rounded-xl border border-[#ced9de] bg-[#fbfcfd] px-3"><span className={`absolute inset-y-0 left-0 w-1 ${metric.accent}`} /><span className={`ml-1 flex size-7 items-center justify-center rounded-lg ${metric.tone}`}><MaterialIcon name={metric.icon} size="xs" /></span><div><p className="text-[11px] font-medium text-[#525e61]">{metric.label}</p><p className="mt-1 text-lg font-semibold leading-none text-[#222]">{metric.value}</p></div></article>)}
  </section>;
}
