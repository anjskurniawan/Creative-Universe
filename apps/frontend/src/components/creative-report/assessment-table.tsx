"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";
import PopupPerson from "@/components/layout/profile/popup-person";
import { resolveStorageUrl } from "@/core/api/client";
import { ValidationError } from "@/core/api/client";
import { creativeReportApi } from "@/features/creative-report/api";
import type { CreativeReportGroup } from "@/features/creative-report/types";
import { getAspectGroupTitles, getCollabAspects, getPerfAspects } from "@/app/creative-report/settings";
import { HrdDateModal, type HrdDateKey, type ActiveDateAction } from "./hrd-date-modal";

export type Draft = {
  creative_scores: number[];
  leave: number;
  appPermission: number;
  absence: number;
  late: number;
  hrd_review_history?: {
    leave_dates?: string[];
    app_permission_dates?: string[];
    absence_dates?: string[];
    late_dates?: string[];
  };
};

export function calculateHrdScore(absence: number, late: number) {
  const absencePenalty = Math.min(absence, 2) * 3 + Math.max(absence - 2, 0) * 5;
  const latePenalty = Math.min(late, 2) + Math.max(late - 2, 0) * 2;
  return 20 - absencePenalty - latePenalty;
}

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

export type AssessmentTableProps = {
  group: CreativeReportGroup;
  onChanged: () => Promise<void>;
  canEdit: boolean;
  month: string;
};

export function AssessmentTable({
  group,
  onChanged,
  canEdit,
  month,
}: AssessmentTableProps) {
  const [inputMode, setInputMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [activeDateAction, setActiveDateAction] = useState<ActiveDateAction | null>(null);
  const [hoveredAssessmentId, setHoveredAssessmentId] = useState<number | null>(null);

  const collabAspects = useMemo(() => getCollabAspects().map((aspect) => ({ ...aspect, maxPoints: Math.min(6, aspect.maxPoints) })), []);
  const perfAspects = useMemo(() => getPerfAspects(), []);
  const groupTitles = useMemo(() => getAspectGroupTitles(), []);
  const scoreAspects = useMemo(() => [...collabAspects, ...perfAspects], [collabAspects, perfAspects]);

  const scoreMaxima = useMemo(() => [
    ...scoreAspects.map((a) => a.maxPoints),
  ], [scoreAspects]);

  const headers = useMemo(() => [
    ...collabAspects.map((a) => ({ name: a.name, max: a.maxPoints })),
    { name: "Total nilai", max: null },
    ...perfAspects.map((a) => ({ name: a.name, max: a.maxPoints })),
    { name: "Total nilai", max: null },
    { name: "Cuti", max: null },
    { name: "Izin App", max: null },
    { name: "Bolos", max: null },
    { name: "Telat", max: null },
    { name: "Total nilai", max: null },
  ], [collabAspects, perfAspects]);

  const beginInput = () => {
    setDrafts(
      Object.fromEntries(
        group.assessments.map((item) => [
          item.id,
          {
            creative_scores: item.creative_scores.map((score, index) => index < 5 ? Math.min(6, score) : score),
            leave: item.hrd_review.leave,
            appPermission: item.hrd_review.app_permission,
            absence: item.hrd_review.absence,
            late: item.hrd_review.late,
            hrd_review_history: {
              leave_dates: item.hrd_review.history?.leave_dates ?? [],
              app_permission_dates: item.hrd_review.history?.app_permission_dates ?? [],
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
    field: keyof Omit<Draft, "creative_scores" | "hrd_review_history"> | "score",
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
      else if (field === "leave" || field === "appPermission" || field === "absence" || field === "late")
        next[field] = parsed;
      return { ...current, [id]: next };
    });
  };

  const addDate = (id: number, key: HrdDateKey, dateStr: string) => {
    if (!dateStr) return;
    setDrafts((current) => {
      const next = { ...current[id] };
      const history = { ...next.hrd_review_history };
      const dateKey = key === "appPermission" ? "app_permission_dates" : `${key}_dates` as const;
      const list = [...(history[dateKey] ?? [])];
      list.push(dateStr);
      list.sort();
      history[dateKey] = list;
      next.hrd_review_history = history;
      next[key] = list.length;
      return { ...current, [id]: next };
    });
  };

  const updateDate = (id: number, key: HrdDateKey, index: number, newDateStr: string) => {
    if (!newDateStr) return;
    setDrafts((current) => {
      const next = { ...current[id] };
      const history = { ...next.hrd_review_history };
      const dateKey = key === "appPermission" ? "app_permission_dates" : `${key}_dates` as const;
      const list = [...(history[dateKey] ?? [])];
      list[index] = newDateStr;
      list.sort();
      history[dateKey] = list;
      next.hrd_review_history = history;
      next[key] = list.length;
      return { ...current, [id]: next };
    });
  };

  const deleteDate = (id: number, key: HrdDateKey, index: number) => {
    setDrafts((current) => {
      const next = { ...current[id] };
      const history = { ...next.hrd_review_history };
      const dateKey = key === "appPermission" ? "app_permission_dates" : `${key}_dates` as const;
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
      await Promise.all(
        group.assessments.map(async (item) => {
          const draft = drafts[item.id];
          await creativeReportApi.assessments.update(item.id, {
            creative_scores: draft.creative_scores,
            leave_count: draft.leave,
            app_permission_count: draft.appPermission,
            absence_count: draft.absence,
            late_count: draft.late,
            hrd_review_history: draft.hrd_review_history,
          });
          if (complete) await creativeReportApi.assessments.complete(item.id);
        }),
      );
      setInputMode(false);
      await onChanged();
    } catch (cause) {
      setSaveError(cause instanceof ValidationError
        ? Object.values(cause.errors).flat().join(" ") || cause.message
        : cause instanceof Error ? cause.message : "Gagal menyimpan penilaian.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="hidden w-full overflow-hidden rounded-b-xl border border-t-0 border-[#c9bbfc] bg-white lg:block">
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-7" />
            <col className="w-[140px]" />
            {/* Collab aspects */}
            <col className="w-[42px]" />
            <col className="w-[42px]" />
            <col className="w-[42px]" />
            <col className="w-[42px]" />
            <col className="w-[42px]" />
            <col className="w-11" />
            {/* Perf aspects */}
            <col className="w-[42px]" />
            <col className="w-[42px]" />
            <col className="w-[42px]" />
            <col className="w-[42px]" />
            <col className="w-[42px]" />
            <col className="w-11" />
            {/* HRD aspects */}
            <col className="w-[42px]" />
            <col className="w-[42px]" />
            <col className="w-[42px]" />
            <col className="w-[42px]" />
            <col className="w-11" />
            {/* Nilai akhir */}
            <col className="w-12" />
          </colgroup>
          <thead>
            <tr className="bg-[#f7f5ff] text-xs font-semibold text-[#3b4446]">
              <th rowSpan={2} className="border-b border-r border-[#ded7fb] px-0.5 py-2 text-center text-[10px]">
                No
              </th>
              <th rowSpan={2} className="border-b border-r border-[#ded7fb] px-1 py-2 text-center text-[10px]">
                Nama
              </th>
              <th colSpan={6} className="border-b border-r border-[#ded7fb] px-2 py-3 text-center">
                {groupTitles.collab}
              </th>
              <th colSpan={6} className="border-b border-r border-[#f6c88d] bg-[#fff1df] px-2 py-3 text-center text-[#b65d08]">
                {groupTitles.perf}
              </th>
              <th colSpan={5} className="border-b border-r border-[#a9dcb0] bg-[#e8f7ea] px-2 py-3 text-center text-[#248235]">
                HRD Review (20%)
              </th>
              <th rowSpan={2} className="border-b border-[#ded7fb] px-0.5 py-2 text-center text-[10px]">
                Nilai akhir
              </th>
            </tr>
            <tr className="text-[11px] font-medium">
              {headers.map((aspect, index) => {
                return (
                  <th
                    key={`${aspect.name}-${index}`}
                    className={`border-b px-0.5 py-1.5 text-center text-[9px] leading-tight break-words ${
                      index < 6
                        ? "border-[#ece8fb] bg-[#fcfbff] text-[#6d46eb]"
                        : index < 12
                        ? "border-[#fde2c1] bg-[#fff9f1] text-[#b65d08]"
                        : "border-[#cfead3] bg-[#f4fbf5] text-[#248235]"
                    } ${aspect.name === "Total nilai" ? "border-r font-bold" : ""}`}
                  >
                    <span className="block font-medium">{aspect.name}</span>
                    {aspect.max !== null && (
                      <span className="mt-0.5 block text-[9px] font-semibold opacity-75">({aspect.max})</span>
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
                appPermission: item.hrd_review.app_permission,
                absence: item.hrd_review.absence,
                late: item.hrd_review.late,
              };
              const score30 = draft.creative_scores.slice(0, 5).reduce((a, b) => a + b, 0);
              const score50 = draft.creative_scores.slice(5, 10).reduce((a, b) => a + b, 0);
              const hrd = calculateHrdScore(draft.absence, draft.late);
              const finalScore = score30 + score50 + hrd;
              const cells = [
                ...draft.creative_scores.slice(0, 5),
                score30,
                ...draft.creative_scores.slice(5),
                score50,
                draft.leave,
                draft.appPermission,
                draft.absence,
                draft.late,
                hrd,
              ];
              return (
                <tr key={item.id} className={finalScore < 75 ? "bg-[#ffedf1] hover:bg-[#fff0f3]" : "bg-white hover:bg-[#fbfcfd]"}>
                      <td className="border-r border-[#e5edf0] px-0.5 py-2 text-center text-[10px] text-[#7b868a]">
                    {rowIndex + 1}
                  </td>
                  <td className="border-r border-[#e5edf0] px-1 py-2">
                    <div className="relative" onMouseEnter={() => setHoveredAssessmentId(item.id)} onMouseLeave={() => setHoveredAssessmentId(null)}>
                      <Link
                        href={`/creative-report/detail?user=${item.user.id}&month=${month}`}
                        className="flex min-w-0 items-center gap-1 rounded-md outline-none hover:text-[#6d46eb] focus-visible:ring-2 focus-visible:ring-[#6d46eb]"
                      >
                        <Avatar name={item.user.name} imagePath={item.user.avatar_path} />
                        <span className="truncate font-semibold">{item.user.name}</span>
                      </Link>
                      {hoveredAssessmentId === item.id && (
                        <div className="absolute bottom-full left-0 z-50 mb-2 hidden w-[300px] lg:block">
                          <PopupPerson
                            name={item.user.name}
                            role={item.user.position ?? "Creative"}
                            division={item.user.division}
                            cardImagePath={item.user.card_image_path}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  {cells.map((value, index) => {
                    const editableScore = index < 5 || (index >= 6 && index < 11);
                    const editableHrd = index >= 12 && index < 16;
                    const scoreIndex = index < 5 ? index : index - 1;
                    const hrdKey = (["leave", "appPermission", "absence", "late"] as const)[index - 12];
                    return (
                      <td
                        key={index}
                        className={`border-b px-0.5 py-2 text-center text-[10px] ${
                          finalScore < 75
                            ? "border-[#f2cbd3] bg-[#ffedf1]"
                            : `border-[#edf1f3] ${index >= 6 && index < 12 ? "bg-[#fffaf4]" : index >= 12 ? "bg-[#f6fcf7]" : ""}`
                        } ${index === 5 || index === 11 || index === 16 ? "border-r border-[#d8e1e5] font-semibold" : ""}`}
                      >
                        {inputMode && editableScore ? (
                          <input
                            type="number"
                            min={0}
                            max={scoreMaxima[scoreIndex]}
                            title={`Maksimal nilai: ${scoreMaxima[scoreIndex]}`}
                            aria-label={`Nilai ${headers[index]?.name}, maksimal ${scoreMaxima[scoreIndex]}`}
                            value={value}
                            onChange={(event) =>
                              updateDraft(item.id, "score", event.target.value, scoreIndex)
                            }
                            className="h-7 w-9 [appearance:textfield] rounded-md border border-[#bdb0f5] bg-white text-center text-xs font-semibold outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                        ) : inputMode && editableHrd ? (
                          (() => {
                            const history = draft.hrd_review_history ?? {};
                            const dateKey = hrdKey === "appPermission" ? "app_permission_dates" : `${hrdKey}_dates` as const;
                            const dates = history[dateKey] ?? [];

                            return (
                              <div className="flex flex-col items-center gap-1.5 py-1">
                                <span className="text-xs font-bold text-slate-700">{value}</span>
                                {dates.length > 0 && (
                                  <div className="flex flex-col gap-1 w-full max-w-[70px] max-h-[80px] overflow-y-auto">
                                    {dates.map((dateStr, dIdx) => (
                                      <button
                                        key={dIdx}
                                        type="button"
                                        onClick={() =>
                                          setActiveDateAction({
                                            assessmentId: item.id,
                                            key: hrdKey,
                                            index: dIdx,
                                            dateStr,
                                          })
                                        }
                                        className="w-full text-[10px] py-0.5 px-1 bg-[#ede9fe] text-[#6d46eb] rounded border border-[#c9bbfc] hover:bg-[#6d46eb] hover:text-white transition font-medium cursor-pointer"
                                      >
                                        {formatDateShort(dateStr)}
                                      </button>
                                    ))}
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
                          })()
                        ) : (
                          value
                        )}
                      </td>
                    );
                  })}
                  <td className={`border-b px-0.5 py-2 text-center text-[10px] font-bold ${finalScore < 75 ? "border-[#f2cbd3] bg-[#fbd5dc] text-[#b4234d]" : "border-[#edf1f3] bg-[#f4f1ff] text-[#5d35d9]"}`}>
                    {finalScore}
                  </td>
                </tr>
              );
            })}
          </tbody>
          {canEdit && (
            <tfoot>
              <tr className="bg-[#fbfcfd]">
                <td colSpan={20} className="border-t border-[#dbe4e8] px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {inputMode ? (
                      <>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => save(false)}
                          className="h-9 rounded-lg border border-[#dbe4e8] bg-white px-3 text-xs font-semibold text-[#525e61] disabled:opacity-50 cursor-pointer hover:bg-slate-50 transition"
                        >
                          Simpan draft
                        </button>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => save(true)}
                          className="h-9 rounded-lg bg-[#6d46eb] px-3 text-xs font-semibold text-white disabled:opacity-50 cursor-pointer hover:bg-[#5b37d6] transition"
                        >
                          Selesaikan penilaian
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={beginInput}
                        className="h-9 rounded-lg bg-[#6d46eb] px-3 text-xs font-semibold text-white cursor-pointer hover:bg-[#5b37d6] transition"
                      >
                        {group.assessments.every((item) => item.status === "completed") ? "Edit penilaian" : "Input nilai"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              {saveError && (
                <tr>
                  <td colSpan={20} className="bg-[#ffedf1] px-4 py-3 text-right text-xs text-[#b4234d]">
                    {saveError}
                  </td>
                </tr>
              )}
            </tfoot>
          )}
        </table>
      </div>

      <HrdDateModal
        activeDateAction={activeDateAction}
        formatDateShort={formatDateShort}
        onUpdateDate={updateDate}
        onDeleteDate={deleteDate}
        onClose={() => setActiveDateAction(null)}
      />
    </>
  );
}
