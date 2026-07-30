"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { creativeReportApi } from "@/features/creative-report/api";
import type { CreativeReportIndex } from "@/features/creative-report/types";
import { useAuth } from "@/providers/auth-provider";
import { useCreativeReportTheme } from "./theme-context";
import { CreativeReportHeader } from "@/components/creative-report/report-header";
import { CreativeReportToolbar, type ReportMetric } from "@/components/creative-report/report-toolbar";
import { GroupAccordion } from "@/components/creative-report/group-accordion";
import { AssessmentTable } from "@/components/creative-report/assessment-table";
import { AssessmentMobileCards } from "@/components/creative-report/assessment-mobile-cards";
import { HrdRulesFooter } from "./components/hrd-rules-footer";

const JOBDESKS = ["Semua jobdesk", "SPV", "Videographer", "Designer"];

export default function CreativeReportPage() {
  const { theme } = useCreativeReportTheme();
  const { hasPermission } = useAuth();
  const canEdit = hasPermission("creative-report.assessments.update");

  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [jobdesk, setJobdesk] = useState(JOBDESKS[0]);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [openGroups, setOpenGroups] = useState<number[]>([]);
  const [report, setReport] = useState<CreativeReportIndex | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasInitializedGroups = useRef(false);

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      setError(null);
      const nextReport = await creativeReportApi.assessments.list({
        month,
        jobdesk: jobdesk !== JOBDESKS[0] ? jobdesk : undefined,
        search: appliedSearch || undefined,
      }, { signal });
      setReport(nextReport);
      if (!hasInitializedGroups.current && window.innerWidth >= 1024) {
        setOpenGroups(nextReport.groups.map((group) => group.id));
        hasInitializedGroups.current = true;
      }
    } catch (cause) {
      if (signal?.aborted) return;
      setError(
        cause instanceof Error ? cause.message : "Gagal memuat laporan.",
      );
    }
  }, [month, jobdesk, appliedSearch]);

  useEffect(() => {
    const timer = window.setTimeout(() => setAppliedSearch(search.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => void load(controller.signal), 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [load]);

  const assessments = useMemo(
    () => report?.groups.flatMap((group) => group.assessments) ?? [],
    [report],
  );

  const metrics = useMemo<ReportMetric[]>(() => {
    const values = assessments
      .map((item) => item.totals.final)
      .sort((a, b) => b - a);
    const average = (items: number[]) =>
      items.length
        ? (items.reduce((a, b) => a + b, 0) / items.length)
            .toFixed(1)
            .replace(".", ",")
        : "—";
    return [
      {
        label: "10 peringkat terbaik",
        value: average(values.slice(0, 10)),
        icon: "emoji_events",
        tone: "bg-[#fff5e8] text-[#f18728]",
        accent: "bg-[#f18728]",
      },
      {
        label: "Rata-rata skor",
        value: average(values),
        icon: "monitoring",
        tone: "bg-[#f0efff] text-[#6d46eb]",
        accent: "bg-[#6d46eb]",
      },
      {
        label: "5 peringkat terbawah",
        value: average(values.slice(-5)),
        icon: "trending_down",
        tone: "bg-[#ffedf1] text-[#ea4c89]",
        accent: "bg-[#ea4c89]",
      },
    ];
  }, [assessments]);

  const monthLabel = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${month}-01T00:00:00`));

  const toggle = (id: number) =>
    setOpenGroups((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );

  return (
    <main className="w-full min-w-0 flex-1">
      <div className="flex min-h-full w-full flex-col">
        <CreativeReportHeader month={month} monthLabel={monthLabel} theme={theme} onMonthChange={setMonth} />
        
        <CreativeReportToolbar
          search={search}
          onSearchChange={setSearch}
          jobdesk={jobdesk}
          onJobdeskChange={setJobdesk}
          jobdesks={JOBDESKS}
          metrics={metrics}
          showMetrics={false}
        />

        {error && (
          <p className="mt-4 rounded-lg bg-[#ffedf1] p-3 text-sm text-[#b4234d]">
            {error}
          </p>
        )}

        <p className="mt-3 text-xs text-[#7b868a]">
          Menampilkan ringkasan {monthLabel} · {assessments.length} staff
        </p>

        <section className="mt-6 mb-4 space-y-3">
          {report?.groups.map((group, index) => (
            <GroupAccordion
              key={group.id}
              group={group}
              index={index}
              isOpen={openGroups.includes(group.id)}
              onToggle={toggle}
            >
              <AssessmentTable
                group={group}
                onChanged={() => load()}
                canEdit={canEdit}
                month={month}
              />
              <AssessmentMobileCards
                group={group}
                onChanged={() => load()}
                canEdit={canEdit}
              />
            </GroupAccordion>
          ))}
        </section>

        <HrdRulesFooter theme={theme} />
      </div>
    </main>
  );
}
