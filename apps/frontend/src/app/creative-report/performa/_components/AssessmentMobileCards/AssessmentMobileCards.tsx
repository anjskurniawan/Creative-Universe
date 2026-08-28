"use client";

import React, { useState, useMemo, Fragment } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";
import { resolveStorageUrl, ValidationError } from "@/core/api/client";
import { creativeReportApi } from "@/features/creative-report/api";
import type { CreativeReportGroup } from "@/features/creative-report/types";
import { useCreativeReportSettings } from "@/features/creative-report/settings";
import { HrdDateModal, type HrdDateKey, type ActiveDateAction } from "../HrdDateModal/HrdDateModal";
import { calculateHrdScore, type Draft } from "../AssessmentTable/AssessmentTable";

function MobileSummaryLabel({ label }: { label: string }) {
  return (
    <p className="line-clamp-2 h-6 overflow-hidden text-[10px] leading-3 text-[#7b868a]">
      {label.split(/\s+/).map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          {index > 0 && <br />}
          {word}
        </Fragment>
      ))}
    </p>
  );
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

export type AssessmentMobileCardsProps = {
  group: CreativeReportGroup;
  onChanged: () => Promise<void>;
  canEdit: boolean;
  onReorder?: (groupId: number, memberIds: number[]) => Promise<void>;
};

export function AssessmentMobileCards({
  group,
  onChanged,
  canEdit,
  onReorder = async () => undefined,
}: AssessmentMobileCardsProps) {
  const [inputMode, setInputMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [expandedMobileAssessments, setExpandedMobileAssessments] = useState<number[]>([]);
  const [activeDateAction, setActiveDateAction] = useState<ActiveDateAction | null>(null);
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const { settings } = useCreativeReportSettings();
  const collabAspects = useMemo(() => settings.collabAspects, [settings.collabAspects]);
  const perfAspects = useMemo(() => settings.perfAspects, [settings.perfAspects]);
  const groupTitles = useMemo(() => settings.groupTitles, [settings.groupTitles]);
  const scoreAspects = useMemo(() => [...collabAspects, ...perfAspects], [collabAspects, perfAspects]);

  const scoreMaxima = useMemo(() => [
    ...scoreAspects.map((a) => a.maxPoints),
  ], [scoreAspects]);

  const beginInput = () => {
    setDrafts(
      Object.fromEntries(
        group.assessments.map((item) => [
          item.id,
          {
            creative_scores: [...item.creative_scores],
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

  const reorder = async (targetId: number) => {
    if (!canEdit || draggedId === null || draggedId === targetId) return;
    const ids = group.assessments.map((item) => item.user.id);
    const from = ids.indexOf(draggedId);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) return;
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    await onReorder(group.id, ids);
    setDraggedId(null);
  };

  return (
    <>
      <div className="cu-style space-y-3 rounded-b-xl border border-t-0 border-[#c9bbfc] bg-[#f7f5ff] p-3 lg:hidden">
        {group.assessments.map((item, rowIndex) => {
          const draft = drafts[item.id] ?? {
            creative_scores: item.creative_scores,
            leave: item.hrd_review.leave,
            appPermission: item.hrd_review.app_permission,
            absence: item.hrd_review.absence,
            late: item.hrd_review.late,
          };
          const score30 = draft.creative_scores.slice(0, 5).reduce((total, value) => total + value, 0);
          const score50 = draft.creative_scores.slice(5, 10).reduce((total, value) => total + value, 0);
          const hrd = calculateHrdScore(draft.absence, draft.late);
          const finalScore = score30 + score50 + hrd;
          const lowScore = finalScore < 75;
          const mobileExpanded = expandedMobileAssessments.includes(item.id);
          return (
            <article
              key={item.id}
              draggable={canEdit}
              onDragStart={() => setDraggedId(item.user.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => void reorder(item.user.id)}
              className={`overflow-hidden rounded-xl border shadow-[0_2px_8px_rgba(73,55,145,0.06)] ${
                finalScore < 75 ? "border-[#f2b8c7] bg-[#ffedf1]" : "border-[#ded7fb] bg-white"
              }`}
            >
              <button
                type="button"
                aria-expanded={mobileExpanded}
                onClick={() =>
                  setExpandedMobileAssessments((current) =>
                    current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id],
                  )
                }
                className={`flex w-full items-center gap-3 border-b px-3 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset ${
                  lowScore ? "border-[#f2cbd3] focus-visible:ring-[#b4234d]" : "border-[#eeeafd] focus-visible:ring-[#6d46eb]"
                }`}
              >
                {canEdit && <MaterialIcon name="drag_indicator" size="sm" className="shrink-0 text-[#a7afb2]" title="Geser untuk mengubah urutan" />}
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                    lowScore ? "bg-[#fbd5dc] text-[#b4234d]" : "bg-[#f0edff] text-[#6d46eb]"
                  }`}
                >
                  {rowIndex + 1}
                </span>
                <Avatar name={item.user.name} imagePath={item.user.avatar_path} />
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#3b4446]">
                  {item.user.name}
                </span>
                <MaterialIcon
                  name={mobileExpanded ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                  size="sm"
                  className={lowScore ? "text-[#b4234d]" : "text-[#6d46eb]"}
                />
              </button>
              <div
                className={`grid grid-cols-4 divide-x border-b ${
                  lowScore ? "divide-[#f2cbd3] border-[#f2cbd3]" : "divide-[#eeeafd] border-[#eeeafd]"
                }`}
              >
                <div className="px-2 py-2 text-center">
                  <MobileSummaryLabel label={groupTitles.collab} />
                  <b className={`text-sm ${lowScore ? "text-[#b4234d]" : "text-[#6d46eb]"}`}>{score30}</b>
                </div>
                <div className="px-2 py-2 text-center">
                  <MobileSummaryLabel label={groupTitles.perf} />
                  <b className={`text-sm ${lowScore ? "text-[#b4234d]" : "text-[#b65d08]"}`}>{score50}</b>
                </div>
                <div className="px-2 py-2 text-center">
                  <MobileSummaryLabel label="HRD Review" />
                  <b className={`text-sm ${lowScore ? "text-[#b4234d]" : "text-[#248235]"}`}>{hrd}</b>
                </div>
                <div className="px-2 py-2 text-center">
                  <MobileSummaryLabel label="Nilai Akhir" />
                  <b className="text-sm text-[#5d35d9]">{finalScore}</b>
                </div>
              </div>
              {mobileExpanded && (
                <div className={`space-y-3 border-t p-3 ${lowScore ? "border-[#f2cbd3]" : "border-[#eeeafd]"}`}>
                  <section>
                    <p className={`mb-2 text-[11px] font-semibold ${lowScore ? "text-[#b4234d]" : "text-[#6d46eb]"}`}>
                      Aspek penilaian
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {scoreAspects.map((aspect, scoreIndex) => {
                        const value = draft.creative_scores[scoreIndex] ?? 0;
                        return (
                          <label
                            key={aspect.name}
                            className={`flex min-w-0 items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[10px] text-[#525e61] ${
                              lowScore ? "bg-[#fff7f8]" : "bg-[#faf9ff]"
                            }`}
                          >
                            <span className="min-w-0 truncate">{aspect.name}</span>
                            {inputMode ? (
                              <span className="flex shrink-0 flex-col items-center">
                                <input
                                  type="number"
                                  min={0}
                                  max={aspect.maxPoints}
                                  title={`Maksimal nilai: ${aspect.maxPoints}`}
                                  aria-label={`Nilai ${aspect.name}, maksimal ${aspect.maxPoints}`}
                                  value={value}
                                  onChange={(event) => updateDraft(item.id, "score", event.target.value, scoreIndex)}
                                  className="h-7 w-9 rounded border border-[#bdb0f5] bg-white text-center text-xs font-semibold outline-none"
                                />
                                <small
                                  className={`mt-0.5 whitespace-nowrap text-[8px] leading-none ${
                                    lowScore ? "text-[#b4234d]" : "text-[#6d46eb]"
                                  }`}
                                >
                                  maks. {aspect.maxPoints}
                                </small>
                              </span>
                            ) : (
                              <b className="shrink-0 text-xs text-[#3b4446]">
                                {value}/{aspect.maxPoints}
                              </b>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </section>
                  <section>
                    <p className={`mb-2 text-[11px] font-semibold ${lowScore ? "text-[#b4234d]" : "text-[#248235]"}`}>
                      HRD Review
                    </p>
                    <div
                      className={`mb-2 flex items-center justify-between rounded-lg px-3 py-2 text-xs ${
                        lowScore ? "bg-[#fbd5dc] text-[#b4234d]" : "bg-[#e8f7ea] text-[#248235]"
                      }`}
                    >
                      <span className="font-medium">Total HRD Review</span>
                      <b>{hrd}/20</b>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {(["leave", "appPermission", "absence", "late"] as const).map((key) => {
                        const label =
                          key === "leave"
                            ? "Cuti"
                            : key === "appPermission"
                            ? "Izin App"
                            : key === "absence"
                            ? "Bolos"
                            : "Telat";
                        const value = draft[key];
                        const history = draft.hrd_review_history ?? {};
                        const dateKey = key === "appPermission" ? "app_permission_dates" : `${key}_dates` as const;
                        const dates = history[dateKey] ?? [];
                        return (
                          <div
                            key={key}
                            className={`rounded-lg px-2 py-2 text-[10px] ${
                              lowScore ? "bg-[#fff7f8] text-[#8f4b59]" : "bg-[#f4fbf5] text-[#52755a]"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium">{label}</span>
                              <b className={`text-sm ${lowScore ? "text-[#b4234d]" : "text-[#248235]"}`}>{value}</b>
                            </div>
                            {inputMode ? (
                              <div className="mt-2 flex min-h-7 flex-wrap items-center gap-1">
                                {dates.map((dateStr, index) => (
                                  <button
                                    key={`${dateStr}-${index}`}
                                    type="button"
                                    onClick={() =>
                                      setActiveDateAction({ assessmentId: item.id, key, index, dateStr })
                                    }
                                    className={`rounded border px-1.5 py-1 text-[10px] font-medium cursor-pointer ${
                                      lowScore
                                        ? "border-[#f2cbd3] bg-[#fbd5dc] text-[#b4234d]"
                                        : "border-[#c9bbfc] bg-[#ede9fe] text-[#6d46eb]"
                                    }`}
                                  >
                                    {formatDateShort(dateStr)}
                                  </button>
                                ))}
                                <button
                                  type="button"
                                  onClick={(event) =>
                                    (
                                      event.currentTarget.querySelector('input[type="date"]') as HTMLInputElement | null
                                    )?.showPicker()
                                  }
                                  className={`relative flex h-6 min-w-6 items-center justify-center rounded border border-dashed cursor-pointer ${
                                    lowScore ? "border-[#e6a5b2] text-[#b4234d]" : "border-[#9ed5a7] text-[#248235]"
                                  }`}
                                  aria-label={`Tambah tanggal ${label}`}
                                >
                                  <MaterialIcon name="add" size="auto" className="text-sm" />
                                  <input
                                    type="date"
                                    onChange={(event) => addDate(item.id, key, event.target.value)}
                                    className="pointer-events-none absolute inset-0 size-full opacity-0"
                                    tabIndex={-1}
                                  />
                                </button>
                                {dates.length === 0 && <span className="text-[10px] text-[#7b868a]">Pilih tanggal</span>}
                              </div>
                            ) : (
                              <p className="mt-1 text-[10px] text-[#7b868a]">
                                {value === 0 ? "Tidak ada catatan" : `${value} tanggal tercatat`}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>
              )}
            </article>
          );
        })}
        {canEdit && (
          <div className="flex flex-wrap justify-end gap-2 border-t border-[#ded7fb] pt-3">
            {inputMode ? (
              <>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => save(false)}
                  className="h-9 rounded-lg border border-[#dbe4e8] bg-white px-3 text-xs font-semibold text-[#525e61] disabled:opacity-50 cursor-pointer"
                >
                  Simpan draft
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => save(true)}
                  className="h-9 rounded-lg bg-[#6d46eb] px-3 text-xs font-semibold text-white disabled:opacity-50 cursor-pointer"
                >
                  Selesaikan
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={beginInput}
                className="h-9 rounded-lg bg-[#6d46eb] px-3 text-xs font-semibold text-white cursor-pointer"
              >
                {group.assessments.every((item) => item.status === "completed") ? "Edit penilaian" : "Input nilai"}
              </button>
            )}
          </div>
        )}
        {saveError && <p className="rounded-lg bg-[#ffedf1] px-3 py-2 text-xs text-[#b4234d]">{saveError}</p>}
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
