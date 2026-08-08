"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/form/dropdown-menu";
import { SearchBar } from "@/components/ui/search-bar";
import { CreativeReportMetricCard, type CreativeReportMetric } from "@/components/creative-report/report-metric-card";

export type ReportMetric = CreativeReportMetric;

export function ReportToolbar({ search, onSearchChange, jobdesk, onJobdeskChange, jobdesks, metrics, showMetrics = true }: { search: string; onSearchChange: (value: string) => void; jobdesk: string; onJobdeskChange: (value: string) => void; jobdesks: string[]; metrics: ReportMetric[]; showMetrics?: boolean }) {
  const [open, setOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (!filterRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  return <section className={`mt-0 grid grid-cols-[minmax(0,1fr)_3rem] gap-3 sm:grid-cols-2 ${showMetrics ? "lg:grid-cols-[minmax(220px,1.2fr)_180px_repeat(3,minmax(170px,1fr))]" : "lg:grid-cols-[minmax(220px,1.2fr)_180px]"}`}>
    <SearchBar value={search} onChange={onSearchChange} onClear={() => onSearchChange("")} placeholder="Cari nama creative..." />
    <div ref={filterRef} className="relative min-w-0">
      <Button type="button" variant="filter" size="md" iconLeft="filter_list" iconRight="keyboard_arrow_down" aria-label="Filter Job Desk" aria-expanded={open} onClick={() => setOpen((current) => !current)}>{jobdesk}</Button>
      <DropdownMenu
        isOpen={open}
        items={jobdesks.map((item) => ({ value: item, label: item }))}
        searchable={false}
        onSelect={(item) => { onJobdeskChange(item); setOpen(false); }}
        onClose={() => setOpen(false)}
      />
    </div>
    {showMetrics && metrics.map((metric) => <CreativeReportMetricCard key={metric.label} metric={metric} />)}
  </section>;
}
