"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/material-icon";
import { Navbar } from "@/components/navbar";
import { creativeReportApi } from "@/features/creative-report/api";
import type {
  CreativeReportGroup,
  CreativeReportIndex,
} from "@/features/creative-report/types";
import { useAuth } from "@/providers/auth-provider";
import {
  SideMenu,
  type SideMenuItem,
  type SideMenuVariant,
} from "@/components/side-menu";

const PRIMARY_MENU: SideMenuItem[] = [
  {
    label: "Report",
    icon: "monitoring",
    href: "/creative-report",
    status: "Active",
  },
];
const JOBDESKS = ["Semua jobdesk", "SPV", "Videographer", "Designer"];
const SCORE_MAXIMA = [6, 6, 6, 6, 6, 10, 10, 10, 10, 10];
const HEADERS = [
  "Aspek 1 (6)",
  "Aspek 2 (6)",
  "Aspek 3 (6)",
  "Aspek 4 (6)",
  "Aspek 5 (6)",
  "Total nilai",
  "Aspek 1 (10)",
  "Aspek 2 (10)",
  "Aspek 3 (10)",
  "Aspek 4 (10)",
  "Aspek 5 (10)",
  "Total nilai",
  "Cuti",
  "Bolos",
  "Telat",
  "Total nilai",
];

type Draft = {
  creative_scores: number[];
  leave: number;
  absence: number;
  late: number;
};

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#ede9fe] text-[10px] font-bold text-[#6d46eb]">
      {initials}
    </span>
  );
}

function AssessmentTable({
  group,
  onChanged,
  canEdit,
  month,
}: {
  group: CreativeReportGroup;
  onChanged: () => Promise<void>;
  canEdit: boolean;
  month: string;
}) {
  const [inputMode, setInputMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const beginInput = () => {
    setDrafts(
      Object.fromEntries(
        group.assessments.map((item) => [
          item.id,
          {
            creative_scores: [...item.creative_scores],
            leave: item.hrd_review.leave,
            absence: item.hrd_review.absence,
            late: item.hrd_review.late,
          },
        ]),
      ),
    );
    setInputMode(true);
  };
  const updateDraft = (
    id: number,
    field: keyof Omit<Draft, "creative_scores"> | "score",
    value: string,
    scoreIndex?: number,
  ) => {
    const parsed = Math.max(0, Number.parseInt(value || "0", 10) || 0);
    setDrafts((current) => {
      const next = { ...current[id] };
      if (field === "score" && scoreIndex !== undefined)
        next.creative_scores = next.creative_scores.map((score, index) =>
          index === scoreIndex ? Math.min(SCORE_MAXIMA[index], parsed) : score,
        );
      else if (field === "leave" || field === "absence" || field === "late")
        next[field] = parsed;
      return { ...current, [id]: next };
    });
  };
  const save = async (complete = false) => {
    setSaving(true);
    setSaveError(null);
    try {
      await Promise.all(group.assessments.map(async (item) => {
        const draft = drafts[item.id];
        await creativeReportApi.assessments.update(item.id, {
          creative_scores: draft.creative_scores,
          leave_count: draft.leave,
          absence_count: draft.absence,
          late_count: draft.late,
        });
        if (complete) await creativeReportApi.assessments.complete(item.id);
      }));
      setInputMode(false);
      await onChanged();
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : "Gagal menyimpan penilaian.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-b-xl border border-t-0 border-[#c9bbfc] bg-white">
      <table className="w-full table-fixed border-collapse text-left">
        <thead>
          <tr className="bg-[#f7f5ff] text-xs font-semibold text-[#3b4446]">
            <th
              rowSpan={2}
              className="w-10 border-b border-r border-[#ded7fb] px-1 py-3 text-center"
            >
              No
            </th>
            <th
              rowSpan={2}
              className="w-72 border-b border-r border-[#ded7fb] px-3 py-3 text-center"
            >
              Nama
            </th>
            <th
              colSpan={6}
              className="border-b border-r border-[#ded7fb] px-2 py-3 text-center"
            >
              Aspek penilaian 30%
            </th>
            <th
              colSpan={6}
              className="border-b border-r border-[#f6c88d] bg-[#fff1df] px-2 py-3 text-center text-[#b65d08]"
            >
              Aspek penilaian 50%
            </th>
            <th
              colSpan={4}
              className="border-b border-r border-[#a9dcb0] bg-[#e8f7ea] px-2 py-3 text-center text-[#248235]"
            >
              HRD Review (20%)
            </th>
            <th
              rowSpan={2}
              className="w-14 border-b border-[#ded7fb] px-1 py-3 text-center"
            >
              Nilai akhir
            </th>
          </tr>
          <tr className="text-[11px] font-medium">
            {HEADERS.map((aspect, index) => {
              const [, label, maximum] = aspect.match(/^(.*) \((\d+)\)$/) ?? [
                "",
                aspect,
                "",
              ];
              return (
                <th
                  key={`${aspect}-${index}`}
                  className={`border-b px-1 py-2 text-center text-[10px] leading-3 break-words ${index < 6 ? "border-[#ece8fb] bg-[#fcfbff] text-[#6d46eb]" : index < 12 ? "border-[#fde2c1] bg-[#fff9f1] text-[#b65d08]" : "border-[#cfead3] bg-[#f4fbf5] text-[#248235]"} ${aspect === "Total nilai" ? "border-r font-semibold" : ""}`}
                >
                  <span className="block">{label}</span>
                  {maximum && (
                    <span className="mt-0.5 block text-[9px] font-semibold opacity-75">
                      ({maximum})
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="text-xs text-[#3b4446]">
          {group.assessments.map((item, rowIndex) => {
            const draft = drafts[item.id] ?? {
              creative_scores: item.creative_scores,
              leave: item.hrd_review.leave,
              absence: item.hrd_review.absence,
              late: item.hrd_review.late,
            };
            const score30 = draft.creative_scores
              .slice(0, 5)
              .reduce((a, b) => a + b, 0);
            const score50 = draft.creative_scores
              .slice(5, 10)
              .reduce((a, b) => a + b, 0);
            const hrd = Math.max(
              0,
              20 -
                (draft.late >= 2 ? 2 : draft.late ? 1 : 0) -
                (draft.absence >= 2 ? 5 : draft.absence ? 3 : 0),
            );
            const cells = [
              ...draft.creative_scores.slice(0, 5),
              score30,
              ...draft.creative_scores.slice(5),
              score50,
              draft.leave,
              draft.absence,
              draft.late,
              hrd,
            ];
            return (
              <tr key={item.id} className="bg-white hover:bg-[#fbfcfd]">
                <td className="border-r border-[#e5edf0] px-1 py-3 text-center text-[#7b868a]">
                  {rowIndex + 1}
                </td>
                    <td className="border-r border-[#e5edf0] px-3 py-3">
                      <Link
                        href={`/creative-report/detail?user=${item.user.id}&month=${month}`}
                        className="flex min-w-0 items-center gap-2 rounded-md outline-none hover:text-[#6d46eb] focus-visible:ring-2 focus-visible:ring-[#6d46eb]"
                      >
                        <Avatar name={item.user.name} />
                        <span className="truncate font-semibold">
                          {item.user.name}
                        </span>
                      </Link>
                    </td>
                {cells.map((value, index) => {
                  const editableScore = index < 5 || (index >= 6 && index < 11);
                  const editableHrd = index >= 12 && index < 15;
                  const scoreIndex = index < 5 ? index : index - 1;
                  const hrdKey = (["leave", "absence", "late"] as const)[
                    index - 12
                  ];
                  return (
                    <td
                      key={index}
                      className={`border-b border-[#edf1f3] px-1 py-3 text-center ${index >= 6 && index < 12 ? "bg-[#fffaf4]" : index >= 12 ? "bg-[#f6fcf7]" : ""} ${index === 5 || index === 11 || index === 15 ? "border-r border-[#d8e1e5] font-semibold" : ""}`}
                    >
                      {inputMode && editableScore ? (
                        <input
                          type="number"
                          min={0}
                          max={SCORE_MAXIMA[scoreIndex]}
                          value={value}
                          onChange={(event) =>
                            updateDraft(
                              item.id,
                              "score",
                              event.target.value,
                              scoreIndex,
                            )
                          }
                          className="h-7 w-9 [appearance:textfield] rounded-md border border-[#bdb0f5] bg-white text-center text-xs font-semibold outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                      ) : inputMode && editableHrd ? (
                        <input
                          type="number"
                          min={0}
                          value={value}
                          onChange={(event) =>
                            updateDraft(item.id, hrdKey, event.target.value)
                          }
                          className="h-7 w-9 [appearance:textfield] rounded-md border border-[#9ed5a7] bg-white text-center text-xs font-semibold outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                      ) : (
                        value
                      )}
                    </td>
                  );
                })}
                <td className="border-b border-[#edf1f3] bg-[#f4f1ff] px-1 py-3 text-center font-bold text-[#5d35d9]">
                  {score30 + score50 + hrd}
                </td>
              </tr>
            );
          })}
        </tbody>
        {canEdit && <tfoot>
          <tr className="bg-[#fbfcfd]">
            <td colSpan={19} className="border-t border-[#dbe4e8] px-4 py-3">
              <div className="flex items-center justify-end gap-2">
                {inputMode ? (
                  <>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => save(false)}
                      className="h-9 rounded-lg border border-[#dbe4e8] bg-white px-3 text-xs font-semibold text-[#525e61] disabled:opacity-50"
                    >
                      Simpan draft
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => save(true)}
                      className="h-9 rounded-lg bg-[#6d46eb] px-3 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      Selesaikan penilaian
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={beginInput}
                    className="h-9 rounded-lg bg-[#6d46eb] px-3 text-xs font-semibold text-white"
                  >
                    {group.assessments.every(
                      (item) => item.status === "completed",
                    )
                      ? "Edit penilaian"
                      : "Input nilai"}
                  </button>
                )}
              </div>
            </td>
          </tr>
              {saveError && (
                <tr>
                  <td colSpan={19} className="bg-[#ffedf1] px-4 py-3 text-right text-xs text-[#b4234d]">
                    {saveError}
                  </td>
                </tr>
              )}
        </tfoot>}
      </table>
    </div>
  );
}

export default function CreativeReportPage() {
  const { hasPermission } = useAuth();
  const canEdit = hasPermission("creative-report.assessments.update");
  const [sidebarVariant, setSidebarVariant] =
    useState<SideMenuVariant>("Collaps");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [jobdesk, setJobdesk] = useState(JOBDESKS[0]);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [openGroups, setOpenGroups] = useState<number[]>([]);
  const [report, setReport] = useState<CreativeReportIndex | null>(null);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      setError(null);
      setReport(await creativeReportApi.assessments.list({
        month,
        jobdesk: jobdesk !== JOBDESKS[0] ? jobdesk : undefined,
        search: appliedSearch || undefined,
      }, { signal }));
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
  const metrics = useMemo(() => {
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
  const content = (
    <main className="min-w-0 flex-1 px-4 pb-8 pt-3 sm:px-8 lg:px-0 lg:pb-12 lg:pt-8">
      <div className="w-full">
        <header className="flex flex-col gap-5 border-b border-[#e8eef1] pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold leading-tight text-[#222] sm:text-[40px]">
              Creative Report
            </h1>
            <p className="mt-2 text-sm text-[#7b868a] sm:text-base">
              Laporan performa tim kreatif.
            </p>
          </div>
          <div className="flex gap-3">
            <label className="relative flex h-11 items-center gap-2 rounded-xl border border-[#e2e6e9] bg-white px-3 text-sm font-medium text-[#3b4446]">
              <MaterialIcon name="calendar_month" size="sm" />
              <span className="capitalize">{monthLabel}</span>
              <input
                aria-label="Ganti bulan"
                type="month"
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex h-11 items-center gap-2 rounded-xl bg-[#6d46eb] px-4 text-sm font-semibold text-white"
            >
              <MaterialIcon name="picture_as_pdf" size="sm" />
              Export PDF
            </button>
          </div>
        </header>
        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1.2fr)_180px_repeat(3,minmax(170px,1fr))]">
          <label className="flex h-12 min-w-0 items-center gap-3 rounded-xl border border-[#e2e6e9] bg-white px-4">
            <MaterialIcon name="search" size="sm" className="text-[#7b868a]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama creative..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </label>
          <label className="flex h-12 min-w-0 items-center gap-2 rounded-xl border border-[#e2e6e9] bg-white px-3">
            <MaterialIcon
              name="filter_list"
              size="sm"
              className="text-[#6d46eb]"
            />
            <select
              value={jobdesk}
              onChange={(event) => setJobdesk(event.target.value)}
              className="min-w-0 flex-1 appearance-none bg-transparent text-sm font-medium outline-none"
            >
              {JOBDESKS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="relative flex h-12 min-w-0 items-center gap-2 overflow-hidden rounded-xl border border-[#ced9de] bg-[#fbfcfd] px-3"
            >
              <span
                className={`absolute inset-y-0 left-0 w-1 ${metric.accent}`}
              />
              <span
                className={`ml-1 flex size-7 items-center justify-center rounded-lg ${metric.tone}`}
              >
                <MaterialIcon name={metric.icon} size="xs" />
              </span>
              <div>
                <p className="text-[11px] font-medium text-[#525e61]">
                  {metric.label}
                </p>
                <p className="mt-1 text-lg font-semibold leading-none text-[#222]">
                  {metric.value}
                </p>
              </div>
            </article>
          ))}
        </section>
        {error && (
          <p className="mt-4 rounded-lg bg-[#ffedf1] p-3 text-sm text-[#b4234d]">
            {error}
          </p>
        )}
        <p className="mt-3 text-xs text-[#7b868a]">
          Menampilkan ringkasan {monthLabel} · {assessments.length} staff
        </p>
        <section className="mt-6 space-y-3">
          {report?.groups.map((group, index) => (
            <div key={group.id}>
              <button
                type="button"
                aria-expanded={openGroups.includes(group.id)}
                onClick={() => toggle(group.id)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left ${openGroups.includes(group.id) ? "rounded-b-none border-[#c9bbfc] bg-[#f7f5ff]" : "border-[#dbe4e8] bg-white"}`}
              >
                <span className="flex size-7 items-center justify-center rounded-lg bg-[#ede9fe] text-sm font-semibold text-[#6d46eb]">
                  {index + 1}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-[#3b4446]">
                    {group.name}
                  </span>
                  <span className="text-xs text-[#7b868a]">
                    {group.staff_count} staff
                  </span>
                </span>
                <MaterialIcon
                  name={
                    openGroups.includes(group.id)
                      ? "keyboard_arrow_up"
                      : "keyboard_arrow_down"
                  }
                  size="md"
                  className="text-[#6d46eb]"
                />
              </button>
              {openGroups.includes(group.id) && (
                <AssessmentTable group={group} onChanged={() => load()} canEdit={canEdit} month={month} />
              )}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
  return (
    <>
      <div className="lg:hidden">
        <Navbar />
      </div>
      <div className="min-h-[calc(100dvh-72px)] bg-[#f6faff] lg:hidden">
        {content}
      </div>
      <div className="hidden min-h-screen grid-cols-[auto_minmax(0,1fr)] bg-[#f6faff] text-[#222] lg:grid">
        <SideMenu
          variant={sidebarVariant}
          primaryItems={PRIMARY_MENU}
          onVariantChange={setSidebarVariant}
        />
        <div className="flex min-w-0 flex-col overflow-y-auto px-4 py-8 sm:px-8 lg:pl-12 lg:pr-16">
          {content}
        </div>
      </div>
    </>
  );
}
