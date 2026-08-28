import type { ComponentPropsWithoutRef } from "react";
import type { OddsTask } from "@/features/odds/api";
import { DetailTimerTile } from "@/features/odds/components/OddsTaskDetail/DetailUi/DetailUi";

type TimerTotals = { work: number; revision: number; spv_review: number; client_review: number };

type OddsTaskAuditPanelProps = Omit<ComponentPropsWithoutRef<"section">, "children"> & { task: OddsTask; timerTotals: TimerTotals; isSlaOverdue: boolean; slaMinutes: number; formatDuration: (seconds: number) => string };

export function OddsTaskAuditPanel({ task, timerTotals, isSlaOverdue, slaMinutes, formatDuration, className = "", ...props }: OddsTaskAuditPanelProps) {
  const totalWorkDuration = timerTotals.work + timerTotals.revision;
  const totalDuration = totalWorkDuration + timerTotals.spv_review + timerTotals.client_review;
  const hasAuditData = totalDuration > 0 || isSlaOverdue || Boolean(task.quality_issue_flag) || task.status === "in_progress";

  if (!hasAuditData) {
    return <section {...props} className={`${className} flex h-full min-h-0 w-full`}>
      <div className="flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-cu-border bg-cu-panel-soft/30 px-4 py-6 text-center">
        <span className="text-3xl" role="img" aria-label="Menunggu pengerjaan">⌛</span>
        <p className="mt-2 text-sm font-medium text-cu-muted">Belum ada data, karena tugas belum dikerjakan</p>
      </div>
    </section>;
  }

  return <section {...props} className={`${className} overflow-y-auto`}>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <DetailTimerTile label="WAKTU DESAINER" value={formatDuration(timerTotals.work)} />
      <DetailTimerTile label="PENGECEKAN LEADER" value={formatDuration(timerTotals.spv_review)} />
      <DetailTimerTile label="PENGECEKAN CLIENT" value={formatDuration(timerTotals.client_review)} />
      <DetailTimerTile label="WAKTU PERBAIKAN" value={formatDuration(timerTotals.revision)} />
      <DetailTimerTile label="TOTAL WAKTU PENGERJAAN" value={formatDuration(totalWorkDuration)} />
      <DetailTimerTile label="TOTAL WAKTU TASK" value={formatDuration(totalDuration)} />
    </div>
    {isSlaOverdue && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">⚠️ Waktu pengerjaan melebihi batas kategori: {formatDuration(timerTotals.work)} dari batas {slaMinutes} menit.</p>}
    {task.quality_issue_flag && <p className="mt-3 rounded-lg border border-cu-warning/20 bg-cu-warning/10 px-3 py-2 text-sm text-cu-warning">Quality issue: {task.quality_issue_note ?? "Revisi Leader melewati batas wajar."}</p>}
  </section>;
}
