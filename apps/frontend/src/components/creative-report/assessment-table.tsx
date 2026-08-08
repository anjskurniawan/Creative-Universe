"use client";

import { useMemo, useState } from "react";
import { ValidationError } from "@/core/api/client";
import { creativeReportApi } from "@/features/creative-report/api";
import { useCreativeReportSettings } from "@/app/creative-report/settings";
import type { CreativeReportSettings } from "@/app/creative-report/settings";
import { HrdDateModal, type HrdDateKey, type ActiveDateAction } from "./hrd-date-modal";
import type { AssessmentTableProps, Draft } from "./assessment-table.types";
import { formatDateShort } from "./assessment-table.utils";
import { AssessmentTableHeader } from "./assessment-table-header";
import { AssessmentTableActions } from "./assessment-table-actions";
import { AssessmentTableRow } from "./assessment-table-row";

export type { Draft } from "./assessment-table.types";
export { calculateHrdScore } from "./assessment-table.utils";

export function AssessmentTable({
  group,
  onChanged,
  canEdit,
  month,
  settingsOverride,
}: AssessmentTableProps & { settingsOverride?: CreativeReportSettings }) {
  const [inputMode, setInputMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [activeDateAction, setActiveDateAction] = useState<ActiveDateAction | null>(null);
  const [hoveredAssessmentId, setHoveredAssessmentId] = useState<number | null>(null);

  const { settings } = useCreativeReportSettings({ initialSettings: settingsOverride, skipLoad: Boolean(settingsOverride) });
  const collabAspects = useMemo(() => settings.collabAspects, [settings.collabAspects]);
  const perfAspects = useMemo(() => settings.perfAspects, [settings.perfAspects]);
  const groupTitles = useMemo(() => settings.groupTitles, [settings.groupTitles]);
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
            <col className="w-[42px]" />
            <col className="w-[42px]" />
            <col className="w-[42px]" />
            <col className="w-[42px]" />
            <col className="w-[42px]" />
            <col className="w-11" />
            <col className="w-[42px]" />
            <col className="w-[42px]" />
            <col className="w-[42px]" />
            <col className="w-[42px]" />
            <col className="w-[42px]" />
            <col className="w-11" />
            <col className="w-[42px]" />
            <col className="w-[42px]" />
            <col className="w-[42px]" />
            <col className="w-[42px]" />
            <col className="w-11" />
            <col className="w-12" />
          </colgroup>
          <AssessmentTableHeader groupTitles={groupTitles} headers={headers} />
          <tbody className="text-xs text-[#3b4446]">
            {group.assessments.map((item, rowIndex) => {
              const draft = drafts[item.id] ?? { creative_scores: item.creative_scores, leave: item.hrd_review.leave, appPermission: item.hrd_review.app_permission, absence: item.hrd_review.absence, late: item.hrd_review.late };
              return <AssessmentTableRow key={item.id} item={item} rowIndex={rowIndex} month={month} draft={draft} inputMode={inputMode} scoreMaxima={scoreMaxima} headers={headers} hovered={hoveredAssessmentId === item.id} onHover={setHoveredAssessmentId} updateDraft={updateDraft} addDate={addDate} setActiveDateAction={setActiveDateAction} />;
            })}
          </tbody>
          {canEdit && <AssessmentTableActions group={group} inputMode={inputMode} saving={saving} saveError={saveError} onBeginInput={beginInput} onSave={save} />}
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
