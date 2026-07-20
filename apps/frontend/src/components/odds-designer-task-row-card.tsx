import Link from "next/link";
import { MaterialIcon } from "@/components/material-icon";
import { OddsTask, formatOddsDate, statusLabel } from "@/features/odds/api";

interface OddsDesignerTaskRowCardProps {
  task: OddsTask;
}

type Tone = "danger" | "warning" | "info" | "success" | "neutral";

const STATUS_LABELS: Record<string, string> = {
  submitted: "Brief baru",
  brief_revision_requested: "Update brief",
  queued: "Dalam antrean",
  ready_to_start: "Siap mulai",
  in_progress: "Sedang dikerjakan",
  spv_review: "Review SPV",
  client_review: "Review client",
  done: "Selesai",
  cancelled: "Dibatalkan",
  cancelled_by_spv: "Dibatalkan SPV",
};

const TASK_TYPE_LABELS: Record<string, string> = {
  new_task: "Task baru",
  leader_revision: "Revisi SPV",
  client_revision: "Revisi client",
  extra_revision: "Extra revision",
  urgent_revision: "Urgent final",
};

const TONE_CLASSES: Record<Tone, { accent: string; badge: string; icon: string }> = {
  danger: {
    accent: "border-l-cu-danger",
    badge: "border-cu-danger/20 bg-cu-danger/10 text-cu-danger",
    icon: "text-cu-danger",
  },
  warning: {
    accent: "border-l-cu-warning",
    badge: "border-cu-warning/30 bg-cu-warning/10 text-cu-warning",
    icon: "text-cu-warning",
  },
  info: {
    accent: "border-l-cu-info",
    badge: "border-cu-info/20 bg-cu-info/10 text-cu-info",
    icon: "text-cu-info",
  },
  success: {
    accent: "border-l-cu-success",
    badge: "border-cu-success/20 bg-cu-success/10 text-cu-success",
    icon: "text-cu-success",
  },
  neutral: {
    accent: "border-l-cu-border",
    badge: "border-cu-border bg-cu-panel-soft text-cu-muted",
    icon: "text-cu-muted",
  },
};

export function OddsDesignerTaskRowCard({ task }: OddsDesignerTaskRowCardProps) {
  const detailHref = `/odds/detail?id=${task.id}`;
  const deadline = deadlineMeta(task);
  const status = statusMeta(task.status);
  const action = actionMeta(task.status);
  const tone = deadline.tone === "neutral" ? status.tone : deadline.tone;
  const classes = TONE_CLASSES[tone];
  const assignedDesigner = task.assigned_designer ?? task.assignedDesigner;
  const queue = task.current_queue ?? task.currentQueue;
  const briefSummary = summarizeBrief(task.brief?.ai_summary ?? task.brief?.content ?? task.brief_text);
  const revisionCount = (task.normal_revision_count ?? 0) + (task.leader_revision_count ?? 0);
  const timeLogs = task.time_logs ?? task.timeLogs ?? [];
  const hasRunningTimer = timeLogs.some((log) => !log.stopped_at);
  const hasReference = Boolean(task.reference_visual || task.brief?.reference_visual);
  const taskTypeLabel = TASK_TYPE_LABELS[task.task_type] ?? statusLabel(task.task_type || "new_task");

  return (
    <article className={`rounded-lg border border-cu-border border-l-4 bg-white px-4 py-3 shadow-sm ${classes.accent}`}>
      <div className="grid gap-4 xl:grid-cols-[9rem_minmax(0,1fr)_15rem_12rem] xl:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <MaterialIcon name={deadline.icon} size="sm" className={TONE_CLASSES[deadline.tone].icon} />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-cu-muted">Deadline</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-cu-ink">{deadline.label}</p>
          <p className="mt-0.5 text-xs text-cu-muted">{formatOddsDate(task.deadline, true)}</p>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${TONE_CLASSES[status.tone].badge}`}>
              {status.label}
            </span>
            <span className="inline-flex rounded-full border border-cu-border bg-cu-panel-soft px-2.5 py-1 text-[11px] font-semibold text-cu-muted">
              {taskTypeLabel}
            </span>
            {hasReference && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-cu-muted">
                <MaterialIcon name="attach_file" size="xs" />
                Referensi
              </span>
            )}
          </div>
          <Link href={detailHref} className="mt-1 block truncate text-base font-semibold text-cu-ink hover:text-cu-info">
            {task.design_purpose}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-cu-muted">
            <span className="font-mono">{task.task_number}</span>
            <span>{task.requester?.name ?? "Client tidak tercatat"}</span>
            <span>{task.category?.name ?? "Tanpa kategori"}</span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-5 text-cu-muted">{briefSummary}</p>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-4 xl:grid-cols-2">
          <MetaItem label="Designer" value={assignedDesigner?.name ?? "-"} />
          <MetaItem label="Queue" value={queue?.queue_status ? statusLabel(queue.queue_status) : "-"} />
          <MetaItem label="SLA" value={`${task.category_snapshot?.sla_minutes ?? 0} mnt`} />
          <MetaItem label="Revisi" value={`${revisionCount}`} />
          <MetaItem label="Timer" value={hasRunningTimer ? "Berjalan" : "Idle"} />
          <MetaItem label="Priority" value={Number(task.priority_score ?? 0).toFixed(1)} />
        </dl>

        <div className="flex flex-row items-center gap-2 xl:flex-col xl:items-stretch">
          <Link
            href={detailHref}
            className={`inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition hover:bg-cu-panel-soft xl:flex-none ${classes.badge}`}
          >
            <MaterialIcon name={action.icon} size="sm" />
            <span className="truncate">{action.label}</span>
          </Link>
          <div className="flex gap-2">
            <Link
              href={detailHref}
              className="inline-flex size-10 items-center justify-center rounded-lg border border-cu-border text-cu-ink transition hover:bg-cu-panel-soft"
              aria-label="Buka chat task"
              title="Chat task"
            >
              <MaterialIcon name="forum" size="sm" />
            </Link>
            <Link
              href={detailHref}
              className="inline-flex size-10 items-center justify-center rounded-lg border border-cu-border text-cu-ink transition hover:bg-cu-panel-soft"
              aria-label="Buka detail task"
              title="Detail task"
            >
              <MaterialIcon name="open_in_new" size="sm" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-cu-muted">{label}</dt>
      <dd className="mt-0.5 truncate font-semibold text-cu-ink">{value}</dd>
    </div>
  );
}

function deadlineMeta(task: OddsTask): { label: string; icon: string; tone: Tone } {
  if (["done", "cancelled", "cancelled_by_spv"].includes(task.status)) {
    return { label: "Selesai", icon: "task_alt", tone: "success" };
  }

  if (!task.deadline) return { label: "Tanpa deadline", icon: "event", tone: "neutral" };

  const deadline = new Date(task.deadline);
  if (Number.isNaN(deadline.getTime())) return { label: "Deadline invalid", icon: "event_busy", tone: "warning" };

  const today = startOfDay(new Date());
  const dueDay = startOfDay(deadline);
  const days = Math.round((dueDay.getTime() - today.getTime()) / 86_400_000);

  if (days < 0) return { label: `${Math.abs(days)} hari overdue`, icon: "warning", tone: "danger" };
  if (days === 0) return { label: "Hari ini", icon: "priority_high", tone: "warning" };
  if (days === 1) return { label: "Besok", icon: "event_upcoming", tone: "info" };
  if (days <= 3) return { label: `${days} hari lagi`, icon: "event_upcoming", tone: "info" };

  return { label: `${days} hari lagi`, icon: "event", tone: "neutral" };
}

function statusMeta(status: string): { label: string; tone: Tone } {
  if (["cancelled", "cancelled_by_spv", "revision_rejected_by_spv"].includes(status)) {
    return { label: STATUS_LABELS[status] ?? statusLabel(status), tone: "danger" };
  }

  if (status === "done") return { label: STATUS_LABELS[status], tone: "success" };
  if (["submitted", "queued", "ready_to_start", "in_progress"].includes(status)) {
    return { label: STATUS_LABELS[status] ?? statusLabel(status), tone: "info" };
  }
  if (["brief_revision_requested", "spv_review", "client_review"].includes(status)) {
    return { label: STATUS_LABELS[status] ?? statusLabel(status), tone: "warning" };
  }

  return { label: STATUS_LABELS[status] ?? statusLabel(status), tone: "neutral" };
}

function actionMeta(status: string): { label: string; icon: string } {
  if (status === "submitted") return { label: "Review brief", icon: "rule" };
  if (["queued", "ready_to_start"].includes(status)) return { label: "Mulai task", icon: "play_arrow" };
  if (status === "in_progress") return { label: "Upload output", icon: "upload" };
  if (status === "brief_revision_requested") return { label: "Cek brief", icon: "edit_note" };
  if (["spv_review", "client_review"].includes(status)) return { label: "Cek review", icon: "rate_review" };
  if (status === "done") return { label: "Lihat hasil", icon: "task_alt" };

  return { label: "Lihat detail", icon: "open_in_new" };
}

function summarizeBrief(value: string | null | undefined): string {
  const text = (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return "Brief belum memiliki ringkasan.";
  if (text.length <= 150) return text;

  return `${text.slice(0, 147).trim()}...`;
}

function startOfDay(value: Date): Date {
  const next = new Date(value);
  next.setHours(0, 0, 0, 0);
  return next;
}
