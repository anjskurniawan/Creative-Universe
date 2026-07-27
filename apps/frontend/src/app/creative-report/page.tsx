"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/material-icon";
import PopupPerson from "@/components/global-layout/profile/popup-person";
import { resolveStorageUrl } from "@/core/api/client";
import { creativeReportApi } from "@/features/creative-report/api";
import type {
  CreativeReportGroup,
  CreativeReportIndex,
} from "@/features/creative-report/types";
import { useAuth } from "@/providers/auth-provider";
import { useCreativeReportTheme } from "./theme-context";
import { getCollabAspects, getPerfAspects } from "./settings";
import { CreativeReportHeader } from "@/components/creative-report/report-header";
import { CreativeReportToolbar, type ReportMetric } from "@/components/creative-report/report-toolbar";

const JOBDESKS = ["Semua jobdesk", "SPV", "Videographer", "Designer"];


type Draft = {
  creative_scores: number[];
  leave: number;
  absence: number;
  late: number;
  hrd_review_history?: {
    leave_dates?: string[];
    absence_dates?: string[];
    late_dates?: string[];
  };
};

function Avatar({ name, imagePath }: { name: string; imagePath?: string | null }) {
  const imageUrl = resolveStorageUrl(imagePath);
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#ede9fe] text-[10px] font-bold text-[#6d46eb]">
      {imageUrl ? <img src={imageUrl} alt="" className="size-full object-cover" /> : initials}
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
  const [activeDateAction, setActiveDateAction] = useState<{
    assessmentId: number;
    key: "leave" | "absence" | "late";
    index: number;
    dateStr: string;
  } | null>(null);
  const [expandedMobileAssessments, setExpandedMobileAssessments] = useState<number[]>([]);
  const [hoveredAssessmentId, setHoveredAssessmentId] = useState<number | null>(null);
  
  const collabAspects = useMemo(() => getCollabAspects(), []);
  const perfAspects = useMemo(() => getPerfAspects(), []);
  const scoreAspects = useMemo(() => [...collabAspects, ...perfAspects], [collabAspects, perfAspects]);
  
  const scoreMaxima = useMemo(() => [
    ...scoreAspects.map((a) => a.maxPoints),
  ], [scoreAspects]);

  const headers = useMemo(() => [
    ...collabAspects.map((a) => `${a.name} (${a.maxPoints})`),
    "Total nilai",
    ...perfAspects.map((a) => `${a.name} (${a.maxPoints})`),
    "Total nilai",
    "Cuti",
    "Bolos",
    "Telat",
    "Total nilai",
  ], [collabAspects, perfAspects]);
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
            hrd_review_history: {
              leave_dates: item.hrd_review.history?.leave_dates ?? [],
              absence_dates: item.hrd_review.history?.absence_dates ?? [],
              late_dates: item.hrd_review.history?.late_dates ?? [],
            },
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
          index === scoreIndex ? Math.min(scoreMaxima[index], parsed) : score,
        );
      else if (field === "leave" || field === "absence" || field === "late")
        next[field] = parsed;
      return { ...current, [id]: next };
    });
  };
  const addDate = (id: number, key: "leave" | "absence" | "late", dateStr: string) => {
    if (!dateStr) return;
    setDrafts((current) => {
      const next = { ...current[id] };
      const history = { ...next.hrd_review_history };
      const dateKey = `${key}_dates` as const;
      const list = [...(history[dateKey] ?? [])];
      list.push(dateStr);
      list.sort();
      history[dateKey] = list;
      next.hrd_review_history = history;
      next[key] = list.length;
      return { ...current, [id]: next };
    });
  };

  const updateDate = (id: number, key: "leave" | "absence" | "late", index: number, newDateStr: string) => {
    if (!newDateStr) return;
    setDrafts((current) => {
      const next = { ...current[id] };
      const history = { ...next.hrd_review_history };
      const dateKey = `${key}_dates` as const;
      const list = [...(history[dateKey] ?? [])];
      list[index] = newDateStr;
      list.sort();
      history[dateKey] = list;
      next.hrd_review_history = history;
      next[key] = list.length;
      return { ...current, [id]: next };
    });
  };

  const deleteDate = (id: number, key: "leave" | "absence" | "late", index: number) => {
    setDrafts((current) => {
      const next = { ...current[id] };
      const history = { ...next.hrd_review_history };
      const dateKey = `${key}_dates` as const;
      const list = [...(history[dateKey] ?? [])];
      list.splice(index, 1);
      history[dateKey] = list;
      next.hrd_review_history = history;
      next[key] = list.length;
      return { ...current, [id]: next };
    });
  };

  const formatDateShort = (dateStr: string) => {
    const parts = dateStr.split("-");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
    return dateStr;
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
          hrd_review_history: draft.hrd_review_history,
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
    <>
      <div className="hidden overflow-hidden rounded-b-xl border border-t-0 border-[#c9bbfc] bg-white lg:block">
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
              className="w-52 border-b border-r border-[#ded7fb] px-3 py-3 text-center"
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
            {headers.map((aspect, index) => {
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
                      <div className="relative" onMouseEnter={() => setHoveredAssessmentId(item.id)} onMouseLeave={() => setHoveredAssessmentId(null)}>
                      <Link
                        href={`/creative-report/detail?user=${item.user.id}&month=${month}`}
                        className="flex min-w-0 items-center gap-2 rounded-md outline-none hover:text-[#6d46eb] focus-visible:ring-2 focus-visible:ring-[#6d46eb]"
                      >
                        <Avatar name={item.user.name} imagePath={item.user.avatar_path} />
                        <span className="truncate font-semibold">
                          {item.user.name}
                        </span>
                      </Link>
                      {hoveredAssessmentId === item.id && <div className="absolute bottom-full left-0 z-50 mb-2 hidden w-[300px] lg:block">
                        <PopupPerson
                          name={item.user.name}
                          role={item.user.position ?? "Creative"}
                          division={item.user.division}
                          avatarPath={item.user.avatar_path}
                        />
                      </div>}
                      </div>
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
                          max={scoreMaxima[scoreIndex]}
                          title={`Maksimal nilai: ${scoreMaxima[scoreIndex]}`}
                          aria-label={`Nilai ${headers[index]}, maksimal ${scoreMaxima[scoreIndex]}`}
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
                      ) : inputMode && editableHrd ? (() => {
                        const history = draft.hrd_review_history ?? {};
                        const dateKey = `${hrdKey}_dates` as const;
                        const dates = history[dateKey] ?? [];

                        return (
                          <div className="flex flex-col items-center gap-1.5 py-1">
                            <span className="text-xs font-bold text-slate-700">{value}</span>

                            {dates.length > 0 && (
                              <div className="flex flex-col gap-1 w-full max-w-[70px] max-h-[80px] overflow-y-auto">
                                {dates.map((dateStr, dIdx) => {
                                  return (
                                    <div key={dIdx} className="relative">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setActiveDateAction({
                                            assessmentId: item.id,
                                            key: hrdKey,
                                            index: dIdx,
                                            dateStr,
                                          })
                                        }
                                        className="w-full text-[10px] py-0.5 px-1 bg-[#ede9fe] text-[#6d46eb] rounded border border-[#c9bbfc] hover:bg-[#6d46eb] hover:text-white transition font-medium"
                                      >
                                        {formatDateShort(dateStr)}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={(e) => {
                                const el = e.currentTarget.querySelector('input[type="date"]') as HTMLInputElement | null;
                                el?.showPicker();
                              }}
                              className="relative size-5 rounded-full border border-dashed border-[#9ed5a7] text-[#248235] hover:bg-[#e8f7ea] transition flex items-center justify-center cursor-pointer"
                            >
                              <MaterialIcon name="add" size="auto" className="text-xs font-bold" />
                              <input
                                type="date"
                                onChange={(e) => addDate(item.id, hrdKey, e.target.value)}
                                className="absolute inset-0 z-10 w-full h-full opacity-0 pointer-events-none"
                                tabIndex={-1}
                              />
                            </button>
                          </div>
                        );
                      })() : (
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
      <div className="space-y-3 rounded-b-xl border border-t-0 border-[#c9bbfc] bg-[#f7f5ff] p-3 lg:hidden">
        {group.assessments.map((item, rowIndex) => {
          const draft = drafts[item.id] ?? {
            creative_scores: item.creative_scores,
            leave: item.hrd_review.leave,
            absence: item.hrd_review.absence,
            late: item.hrd_review.late,
          };
          const score30 = draft.creative_scores.slice(0, 5).reduce((total, value) => total + value, 0);
          const score50 = draft.creative_scores.slice(5, 10).reduce((total, value) => total + value, 0);
          const hrd = Math.max(0, 20 - (draft.late >= 2 ? 2 : draft.late ? 1 : 0) - (draft.absence >= 2 ? 5 : draft.absence ? 3 : 0));
          const mobileExpanded = expandedMobileAssessments.includes(item.id);
          return (
            <article key={item.id} className="overflow-hidden rounded-xl border border-[#ded7fb] bg-white shadow-[0_2px_8px_rgba(73,55,145,0.06)]">
              <button type="button" aria-expanded={mobileExpanded} onClick={() => setExpandedMobileAssessments((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])} className="flex w-full items-center gap-3 border-b border-[#eeeafd] px-3 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#6d46eb]">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#f0edff] text-xs font-bold text-[#6d46eb]">{rowIndex + 1}</span>
                <Avatar name={item.user.name} imagePath={item.user.avatar_path} />
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#3b4446]">{item.user.name}</span>
                <MaterialIcon name={mobileExpanded ? "keyboard_arrow_up" : "keyboard_arrow_down"} size="sm" className="text-[#6d46eb]" />
              </button>
              <div className="grid grid-cols-3 divide-x divide-[#eeeafd] border-b border-[#eeeafd]">
                <div className="px-2 py-2 text-center"><p className="text-[10px] text-[#7b868a]">Aspek 30%</p><b className="text-sm text-[#6d46eb]">{score30}</b></div>
                <div className="px-2 py-2 text-center"><p className="text-[10px] text-[#7b868a]">Aspek 50%</p><b className="text-sm text-[#b65d08]">{score50}</b></div>
                <div className="px-2 py-2 text-center"><p className="text-[10px] text-[#7b868a]">Nilai akhir</p><b className="text-sm text-[#5d35d9]">{score30 + score50 + hrd}</b></div>
              </div>
              {mobileExpanded && <div className="space-y-3 border-t border-[#eeeafd] p-3">
                <section>
                  <p className="mb-2 text-[11px] font-semibold text-[#6d46eb]">Aspek penilaian</p>
                  <div className="grid grid-cols-2 gap-2">
                    {scoreAspects.map((aspect, scoreIndex) => {
                      const value = draft.creative_scores[scoreIndex] ?? 0;
                      return <label key={aspect.name} className="flex min-w-0 items-center justify-between gap-2 rounded-lg bg-[#faf9ff] px-2 py-1.5 text-[10px] text-[#525e61]"><span className="min-w-0 truncate">{aspect.name}</span>{inputMode ? <span className="flex shrink-0 flex-col items-center"><input type="number" min={0} max={aspect.maxPoints} title={`Maksimal nilai: ${aspect.maxPoints}`} aria-label={`Nilai ${aspect.name}, maksimal ${aspect.maxPoints}`} value={value} onChange={(event) => updateDraft(item.id, "score", event.target.value, scoreIndex)} className="h-7 w-9 rounded border border-[#bdb0f5] bg-white text-center text-xs font-semibold outline-none" /><small className="mt-0.5 whitespace-nowrap text-[8px] leading-none text-[#6d46eb]">maks. {aspect.maxPoints}</small></span> : <b className="shrink-0 text-xs text-[#3b4446]">{value}/{aspect.maxPoints}</b>}</label>;
                    })}
                  </div>
                </section>
                <section>
                  <p className="mb-2 text-[11px] font-semibold text-[#248235]">HRD Review</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(["leave", "absence", "late"] as const).map((key) => {
                      const label = key === "leave" ? "Cuti" : key === "absence" ? "Bolos" : "Telat";
                      const value = draft[key];
                      return <label key={key} className="rounded-lg bg-[#f4fbf5] px-2 py-2 text-center text-[10px] text-[#52755a]"><span className="block">{label}</span>{inputMode ? <input type="number" min={0} value={value} onChange={(event) => updateDraft(item.id, key, event.target.value)} className="mx-auto mt-1 h-7 w-10 rounded border border-[#a9dcb0] bg-white text-center text-xs font-semibold text-[#248235] outline-none" /> : <b className="mt-1 block text-sm text-[#248235]">{value}</b>}</label>;
                    })}
                  </div>
                </section>
              </div>}
            </article>
          );
        })}
        {canEdit && <div className="flex flex-wrap justify-end gap-2 border-t border-[#ded7fb] pt-3">
          {inputMode ? <><button type="button" disabled={saving} onClick={() => save(false)} className="h-9 rounded-lg border border-[#dbe4e8] bg-white px-3 text-xs font-semibold text-[#525e61] disabled:opacity-50">Simpan draft</button><button type="button" disabled={saving} onClick={() => save(true)} className="h-9 rounded-lg bg-[#6d46eb] px-3 text-xs font-semibold text-white disabled:opacity-50">Selesaikan</button></> : <button type="button" onClick={beginInput} className="h-9 rounded-lg bg-[#6d46eb] px-3 text-xs font-semibold text-white">{group.assessments.every((item) => item.status === "completed") ? "Edit penilaian" : "Input nilai"}</button>}
        </div>}
        {saveError && <p className="rounded-lg bg-[#ffedf1] px-3 py-2 text-xs text-[#b4234d]">{saveError}</p>}
      </div>

      {/* Date action modal */}
      {activeDateAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-80 rounded-2xl bg-white p-5 shadow-xl border border-slate-100 text-slate-800">
            <h3 className="text-sm font-bold text-slate-800 mb-2">Kelola Riwayat Tanggal</h3>
            <p className="text-xs text-slate-500 mb-4">
              Tanggal terpilih: <b className="text-slate-700">{formatDateShort(activeDateAction.dateStr)}</b>
            </p>
            
            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-slate-600">Ganti Tanggal:</label>
              <input
                type="date"
                value={activeDateAction.dateStr}
                onChange={(e) => {
                  if (e.target.value) {
                    updateDate(activeDateAction.assessmentId, activeDateAction.key, activeDateAction.index, e.target.value);
                    setActiveDateAction(null);
                  }
                }}
                className="w-full h-9 px-3 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:border-[#00a4ff] outline-none"
              />
            </div>

            <div className="mt-5 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  deleteDate(activeDateAction.assessmentId, activeDateAction.key, activeDateAction.index);
                  setActiveDateAction(null);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition"
              >
                <MaterialIcon name="delete" size="auto" className="text-sm" />
                Hapus
              </button>
              <button
                type="button"
                onClick={() => setActiveDateAction(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

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
  const content = (
    <main className="w-full min-w-0 flex-1">
      <div className="w-full">
        <CreativeReportHeader month={month} monthLabel={monthLabel} theme={theme} onMonthChange={setMonth} />
        <header className="hidden">
          <div>
            <h1 className={`text-4xl font-medium leading-none tracking-[-0.72px] ${theme === "dark" ? "text-white" : theme === "retro" ? "text-[#24252b]" : "text-[#24252b]"}`}>
              Creative Report
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                const el = e.currentTarget.querySelector('input[type="month"]') as HTMLInputElement | null;
                el?.showPicker();
              }}
              className={`relative flex items-center gap-2 rounded-lg border p-2 text-sm font-medium leading-4 cursor-pointer ${theme === "dark" ? "border border-[#b0ff5e]/30 bg-[#121916] text-[#f1f1f1]" : theme === "retro" ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b] shadow-[0_2px_0_#24252b]" : "border border-[#bdeaff] bg-[#f3fbff] text-[#04044A]"}`}
            >
              <MaterialIcon name="calendar_month" size="auto" className="text-xl" />
              <span className="capitalize">{monthLabel}</span>
              <MaterialIcon name="keyboard_arrow_down" size="auto" className="text-xl" />
              <input
                aria-label="Ganti bulan"
                type="month"
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                className="absolute inset-0 z-10 w-full h-full opacity-0 pointer-events-none"
                tabIndex={-1}
              />
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className={`flex items-center gap-1 rounded-lg border p-2 text-sm font-medium leading-4 ${theme === "dark" ? "border-[rgba(123,123,123,0.25)] bg-[#b0ff5e] text-[#181818]" : theme === "retro" ? "border-2 border-[#24252b] bg-[#ba0dcb] text-white shadow-[0_2px_0_#24252b]" : "border-[rgba(123,123,123,0.25)] bg-[#00a4ff] text-white"}`}
            >
              <MaterialIcon name="picture_as_pdf" size="auto" className="text-xl" />
              Export PDF
            </button>
          </div>
        </header>

        <CreativeReportToolbar search={search} onSearchChange={setSearch} jobdesk={jobdesk} onJobdeskChange={setJobdesk} jobdesks={JOBDESKS} metrics={metrics} />
        <section className="hidden">
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
  return content;
}
