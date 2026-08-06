"use client";

import { useEffect, useRef, useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export type ReportMetric = { label: string; value: string; icon: string; tone: string; accent: string };

export function CreativeReportToolbar({ search, onSearchChange, jobdesk, onJobdeskChange, jobdesks, metrics, showMetrics = true }: { search: string; onSearchChange: (value: string) => void; jobdesk: string; onJobdeskChange: (value: string) => void; jobdesks: string[]; metrics: ReportMetric[]; showMetrics?: boolean }) {
  const [open, setOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (!filterRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  return <section className={`mt-0 grid grid-cols-[minmax(0,1fr)_3rem] gap-3 sm:grid-cols-2 ${showMetrics ? "lg:grid-cols-[minmax(220px,1.2fr)_180px_repeat(3,minmax(170px,1fr))]" : "lg:grid-cols-[minmax(220px,1.2fr)_180px]"}`}>
    <label className="flex h-12 min-w-0 items-center gap-3 rounded-xl border border-[#e2e6e9] bg-white px-4"><MaterialIcon name="search" size="sm" className="text-[#7b868a]" /><input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Cari nama creative..." className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label>
    <div ref={filterRef} className="relative min-w-0">
      <button type="button" aria-label="Filter Job Desk" aria-expanded={open} onClick={() => setOpen((current) => !current)} className="flex h-12 w-full min-w-0 items-center justify-center gap-2 rounded-xl border border-[#e2e6e9] bg-white px-2 text-sm font-medium text-[#3b4446] hover:border-[#bdb0f5] sm:justify-start sm:px-3">
        <MaterialIcon name="filter_list" size="sm" className="shrink-0 text-[#6d46eb]" /><span className="min-w-0 flex-1 truncate text-left">{jobdesk}</span><MaterialIcon name="keyboard_arrow_down" size="sm" className="shrink-0 text-[#7b868a]" />
      </button>
      {open && <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-full min-w-[180px] rounded-xl border border-[#d9d0ff] bg-white p-1.5 shadow-[0_12px_28px_rgba(55,35,130,0.16)]">{jobdesks.map((item) => <button key={item} type="button" onClick={() => { onJobdeskChange(item); setOpen(false); }} className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-xs font-medium transition ${item === jobdesk ? "bg-[#f0edff] text-[#6d46eb]" : "text-[#525e61] hover:bg-[#f7f5ff] hover:text-[#6d46eb]"}`}>{item}</button>)}</div>}
    </div>
    {showMetrics && metrics.map((metric) => <article key={metric.label} className="relative flex h-12 min-w-0 items-center gap-2 overflow-hidden rounded-xl border border-[#ced9de] bg-[#fbfcfd] px-3"><span className={`absolute inset-y-0 left-0 w-1 ${metric.accent}`} /><span className={`ml-1 flex size-7 items-center justify-center rounded-lg ${metric.tone}`}><MaterialIcon name={metric.icon} size="xs" /></span><div><p className="text-[11px] font-medium text-[#525e61]">{metric.label}</p><p className="mt-1 text-lg font-semibold leading-none text-[#222]">{metric.value}</p></div></article>)}
  </section>;
}
