"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { type OddsTask, statusLabel } from "@/features/odds/api";
import { TaskCardActionBar } from "./task-card-action-bar";
import { TaskCardMobileDate, TaskCardWideDate } from "./task-card-date";
import { TaskCardPeople, TaskCardPerson, TaskCardWidePeople } from "./task-card-people";
import { TaskCardStatusBlock, TaskCardWideStatusPanel } from "./task-card-status-panel";
import { TaskCardMobileLayout, TaskCardWideLayout } from "./task-card-layouts";

export type OddsTaskCardAction = "pause" | "chat" | "brief" | "file" | "check" | "delete" | "start" | "done";

type OddsTaskCardProps = {
  task: OddsTask;
  theme: "light" | "dark" | "retro";
  viewerRole?: "leader" | "client" | "designer";
  nowMs: number;
  timerSeconds?: number;
  chatOpen?: boolean;
  canCheckRole?: boolean;
  onAction: (action: OddsTaskCardAction) => void;
  hideDelete?: boolean;
  showStart?: boolean;
  showDone?: boolean;
  showPause?: boolean;
  startDisabled?: boolean;
  /** Menampilkan seluruh kemungkinan aksi untuk halaman QA, tanpa mengubah aturan aksi runtime. */
  showAllActions?: boolean;
  /** Aksi yang tetap ditampilkan untuk QA namun tidak tersedia pada tahap task saat ini. */
  disabledActions?: OddsTaskCardAction[];
  disableOpen?: boolean;
  wideHighlightLabel?: string;
  wideHighlightValue?: string;
  wideRating?: number;
  feedbackHref?: string;
  /** Override aksi Detail Brief, misalnya untuk membuka modal dari parent tanpa panel inline. */
  onBriefAction?: () => void;
  outputOpen?: boolean;
  fileOpen?: boolean;
  checkOpen?: boolean;
  actionOverlayOpen?: boolean;
  actionOverlay?: ReactNode;
  children?: ReactNode | ((activeTab: OddsTaskCardAction | null, closePanel: () => void) => ReactNode);
};

function taskStatusLabel(task: Pick<OddsTask, "status" | "task_type">) {
  if (task.status === "submitted") return "Menunggu Pengecekan";
  if (task.status === "ready_to_start") return "Proses Terjeda";
  if (task.status === "in_progress") return "Sedang Dikerjakan";
  if (task.status === "done") return "Selesai";
  if (task.task_type === "leader_revision") return task.status === "in_progress" ? "Pengerjaan Revisi Leader" : "Revisi Leader";
  if (task.task_type === "client_revision") return task.status === "in_progress" ? "Pengerjaan Revisi Client" : "Revisi Client";
  return statusLabel(task.status);
}

export function OddsTaskCard({
  task,
  theme,
  viewerRole,
  nowMs,
  timerSeconds = 0,
  chatOpen = false,
  canCheckRole = false,
  onAction,
  hideDelete = false,
  showStart = false,
  showDone = false,
  showPause = false,
  startDisabled = false,
  showAllActions = false,
  disabledActions = [],
  disableOpen = false,
  wideHighlightLabel,
  wideHighlightValue,
  wideRating,
  feedbackHref,
  onBriefAction,
  outputOpen,
  fileOpen,
  checkOpen,
  actionOverlayOpen,
  actionOverlay,
  children,
}: OddsTaskCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<OddsTaskCardAction | null>(null);
  const [showDeadlineCountdown, setShowDeadlineCountdown] = useState(false);
  const isDone = task.status === "done";
  const dark = theme === "dark";
  const isReview = task.status === "spv_review" || task.status === "client_review";
  const clientRatingReview = [...(task.reviews ?? [])].reverse().find((review) => review.review_type === "client" && review.rating != null);
  const doneRating = wideRating ?? task.rating ?? clientRatingReview?.rating ?? undefined;
  const canCheck = isReview && canCheckRole;
  const resultAssets = (task.results ?? []).flatMap((result) => result.asset_links ?? []);
  const designerReviewOutput = viewerRole === "designer" && isReview;
  const leaderClientReviewOutput = viewerRole === "leader" && task.status === "client_review";
  const fileEnabled = isDone || resultAssets.length > 0 || canCheck || designerReviewOutput || leaderClientReviewOutput;
  const outputAction: OddsTaskCardAction = isDone || designerReviewOutput || leaderClientReviewOutput ? "file" : "check";
  const outputLabel = isDone || designerReviewOutput || leaderClientReviewOutput ? "File output" : "Cek output";
  const outputIcon = isDone || designerReviewOutput || leaderClientReviewOutput ? "folder" : "fact_check";
  const assignedDesigner = task.assigned_designer ?? task.assignedDesigner;
  const requester = task.requester;
  const rawQuadrant = (task.important_matrix || task.category?.important_matrix || "Q4").toUpperCase();
  const quadrant = rawQuadrant.replace(/^Q\s*(\d)$/, "QUADRAN $1");
  const isOverdue = Boolean(task.deadline && new Date(task.deadline).getTime() < nowMs && !isDone);
  const createdAt = task.created_at ? new Date(task.created_at) : null;
  const deadlineAt = task.deadline ? new Date(task.deadline) : null;
  const createdValid = Boolean(createdAt && !Number.isNaN(createdAt.getTime()));
  const deadlineValid = Boolean(deadlineAt && !Number.isNaN(deadlineAt.getTime()));
  const day = createdValid ? new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(createdAt!) : "-";
  const date = createdValid ? new Intl.DateTimeFormat("id-ID", { day: "2-digit" }).format(createdAt!) : "-";
  const monthYear = createdValid ? new Intl.DateTimeFormat("id-ID", { month: "short", year: "numeric" }).format(createdAt!).toUpperCase() : "-";
  const time = createdValid ? new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }).format(createdAt!).replace(".", ":") : "-";
  const deadlineText = deadlineValid ? new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }).format(deadlineAt!) : "-";
  const hours = String(Math.floor(Math.max(0, timerSeconds) / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((Math.max(0, timerSeconds) % 3600) / 60)).padStart(2, "0");
  const seconds = String(Math.max(0, timerSeconds) % 60).padStart(2, "0");
  const timerText = (viewerRole === "client" || viewerRole === "leader") && task.status === "queued" ? "--:--:--" : `${hours}:${minutes}:${seconds}`;
  const status = (viewerRole === "client" || viewerRole === "leader") && task.status === "queued"
    ? "Dalam Antrian"
    : viewerRole === "client" && task.status === "in_progress"
      ? "Sedang dikerjakan"
      : taskStatusLabel(task);
  const isBriefCheck = task.status === "submitted";
  const chatAvailable = !isBriefCheck;
  const showTimer = task.status !== "submitted" && !isDone;
  const remainingSeconds = Math.max(0, timerSeconds);
  const overdueSeconds = isOverdue && deadlineValid
    ? Math.max(0, Math.floor((nowMs - deadlineAt!.getTime()) / 1000))
    : 0;
  const countdownSeconds = isOverdue ? overdueSeconds : remainingSeconds;
  const countdownDays = Math.ceil(countdownSeconds / 86400);
  const countdownHours = Math.floor(countdownSeconds / 3600);
  const countdownMinutes = String(Math.floor((countdownSeconds % 3600) / 60)).padStart(2, "0");
  const deadlineCountdownLabel = isOverdue
    ? countdownSeconds >= 86400
      ? `${countdownDays} HARI`
      : countdownSeconds >= 3600
        ? `${countdownHours} JAM ${countdownMinutes} MENIT`
        : `${countdownMinutes} MENIT`
    : remainingSeconds >= 86400
      ? `${Math.ceil(remainingSeconds / 86400)} HARI`
      : remainingSeconds >= 3600
        ? `${Math.floor(remainingSeconds / 3600)} JAM ${minutes} MENIT`
        : `${minutes} MENIT`;
  const statusDescription = isBriefCheck
    ? "Brief baru perlu ditinjau"
    : viewerRole === "client" && task.status === "queued"
      ? "Akan segera dikerjakan"
    : viewerRole === "leader" && task.status === "queued"
      ? `(${assignedDesigner?.name ?? "Designer"})`
    : task.status === "queued"
      ? "Segera kerjakan"
    : viewerRole === "client" && task.status === "in_progress"
      ? `Oleh ${assignedDesigner?.name ?? "Designer"}`
    : task.status === "in_progress"
      ? showDeadlineCountdown ? "Timer Count SLA" : "Sisa waktu pengerjaan"
    : task.status === "done"
      ? "Feedback"
    : canCheck
      ? "Tinjau output"
      : isReview
        ? "Menunggu review"
        : isDone
          ? "Tugas selesai"
          : isOverdue
            ? "Melewati deadline"
            : "Sisa waktu";
  const isOpen = expanded || (chatOpen && chatAvailable) || Boolean(outputOpen) || Boolean(fileOpen) || Boolean(checkOpen);

  const palette = theme === "dark"
    ? { shell: "border-white/10 bg-[#171717]", surface: "bg-[#171717]", primary: "text-[#f1f1f1]", secondary: "text-slate-400", line: "border-white/10", accent: "text-[#b0ff5e]", soft: "bg-white/5", button: "bg-[#b0ff5e]/10 text-[#b0ff5e]", active: "bg-[#b0ff5e] text-[#181818]" }
    : theme === "retro"
    ? { shell: "rounded-none border-2 border-[#24252b] bg-[#eceee6] shadow-[3px_3px_0_#24252b]", surface: "bg-[#eceee6]", primary: "text-[#24252b]", secondary: "text-[#24252b]/65", line: "border-[#24252b]/25", accent: "text-[#ba0dcb]", soft: "bg-white", button: "border border-[#24252b] bg-white text-[#24252b]", active: "bg-[#24252b] text-white" }
    : { shell: "border-[#e6edf2] bg-white shadow-sm", surface: "bg-white", primary: "text-[#3b4446]", secondary: "text-[#7d7c7c]", line: "border-[#e6edf2]", accent: isDone ? "text-[#238653]" : "text-[#0077bf]", soft: isDone ? "bg-[#e9f7ef]" : "bg-[#edf9ff]", button: isDone ? "bg-[#e9f7ef] text-[#238653]" : "bg-[#edf9ff] text-[#0077bf]", active: isDone ? "bg-[#238653] text-white" : "bg-[#00a4ff] text-white" };

  useEffect(() => {
    const intervalId = window.setInterval(() => setShowDeadlineCountdown((current) => !current), 4000);
    return () => window.clearInterval(intervalId);
  }, []);

  const toggle = (action: OddsTaskCardAction) => {
    if ((action === "check" && checkOpen !== undefined) || (action === "file" && fileOpen !== undefined) || ((action === "delete" || action === "pause") && actionOverlayOpen !== undefined)) {
      onAction(action);
      setActiveTab(null);
      setExpanded(false);
      return;
    }
    const next = activeTab === action && expanded ? null : action;
    setActiveTab(next);
    setExpanded(Boolean(next));
    if (next) onAction(action);
  };
  const run = (action: OddsTaskCardAction) => {
    onAction(action);
    if (action === "chat") {
      setActiveTab(null);
      setExpanded(false);
    }
  };
  const openBrief = () => {
    if (onBriefAction) {
      onBriefAction();
      onAction("brief");
      return;
    }
    toggle("brief");
  };
  const handleWideRecommendation = () => {
    if (wideHighlightLabel === "Review") {
      toggle("check");
      return;
    }
    if (wideHighlightLabel === "Check") {
      openBrief();
      return;
    }
    if (wideHighlightLabel === "Proses") {
      run("start");
      return;
    }
    if (wideHighlightLabel === "Done") run("done");
  };
  const buttonClass = (active = false, danger = false) => danger
    ? theme === "dark" ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-600"
    : active ? palette.active : palette.button;
  const isActionDisabled = (action: OddsTaskCardAction) => disabledActions.includes(action);
  const closePanel = () => {
    setActiveTab(null);
    setExpanded(false);
  };
  const panel = typeof children === "function" ? children(activeTab, closePanel) : children;

  const getShortLabel = (action: OddsTaskCardAction | "open_in_new"): string => {
    switch (action) {
      case "brief": return "Brief";
      case "chat": return "Diskusi";
      case "start": return "Mulai";
      case "pause": return "Jeda";
      case "done": return "Selesai";
      case "file": return "File";
      case "check": return "Cek";
      case "delete": return "Batal";
      case "open_in_new": return "Detail";
      default: return "";
    }
  };

  const renderIconButton = ({ action, icon, label, active = false, danger = false, disabled = false }: { action: OddsTaskCardAction; icon: string; label: string; active?: boolean; danger?: boolean; disabled?: boolean }) => disabled ? null : (
    <div className="flex flex-col items-center gap-1 select-none">
      <button type="button" title={label} aria-label={label} onClick={() => action === "brief" ? openBrief() : ["file", "check", "delete"].includes(action) ? toggle(action) : run(action)} className={`flex size-11 shrink-0 items-center justify-center rounded-lg transition ${buttonClass(active, danger)} hover:brightness-95 active:scale-95`}>
        <MaterialIcon name={icon} size="sm" />
      </button>
      <span className={`text-[9px] font-bold tracking-wider uppercase ${dark ? "text-slate-500" : "text-[#7d7c7c]/80"}`}>
        {getShortLabel(action)}
      </span>
    </div>
  );

  const workAction = showPause ? "pause" : showDone ? "done" : "start";
  const workActionIcon = workAction === "pause" ? "pause_circle" : workAction === "done" ? "check_circle" : "play_circle";
  const workActionLabel = workAction === "pause" ? "Jeda task" : workAction === "done" ? "Selesaikan task" : "Mulai task";

  const renderPeople = (compact = false) => (
    viewerRole === "client"
      ? <TaskCardPerson name={assignedDesigner?.name ?? "Belum Ada"} role="Designer" accent compact={compact} />
      : viewerRole === "designer"
        ? <TaskCardPerson name={requester?.name ?? "Client"} role={requester?.roles?.[0] ?? "Client"} accent compact={compact} />
        : <TaskCardPeople requesterName={requester?.name ?? "Client"} requesterRole={requester?.roles?.[0] ?? "Client"} designerName={assignedDesigner?.name ?? "Belum Ada"} compact={compact} />
  );

  const renderWidePeople = () => (
    viewerRole === "client"
      ? <div className={`flex w-[180px] shrink-0 min-w-0 items-center px-4 py-2 ${palette.line}`}><TaskCardPerson name={assignedDesigner?.name ?? "Belum Ada"} role="Designer" accent compact /></div>
      : viewerRole === "designer"
        ? <div className={`flex w-[180px] shrink-0 min-w-0 items-center px-4 py-2 ${palette.line}`}><TaskCardPerson name={requester?.name ?? "Client"} role={requester?.roles?.[0] ?? "Client"} accent compact /></div>
        : <TaskCardWidePeople requesterName={requester?.name ?? "Client"} requesterRole={requester?.roles?.[0] ?? "Client"} designerName={assignedDesigner?.name ?? "Belum Ada"} lineClass={palette.line} />
  );

  const renderStatusBlock = (compact = false) => (
    <TaskCardStatusBlock compact={compact} isDone={isDone} isOverdue={isOverdue} isReview={isReview} palette={palette} status={status} statusDescription={statusDescription} feedbackHref={feedbackHref} />
  );

  const renderActions = (mobile = false, fillHeight = false) => (
    <TaskCardActionBar mobile={mobile} fillHeight={fillHeight} minButtonWidth={mobile ? 60 : 250} overlay={actionOverlayOpen ? actionOverlay : undefined}>
      <div className="flex min-w-[250px] shrink-0 gap-2">
        {renderIconButton({ action: "brief", icon: "description", label: "Detail brief", active: activeTab === "brief", disabled: isActionDisabled("brief") })}
        {chatAvailable && renderIconButton({ action: "chat", icon: "chat", label: "Diskusi task", active: chatOpen, disabled: isActionDisabled("chat") })}
      <div className="flex flex-col items-center gap-1 select-none">
        <Link href={`/odds/detail?id=${task.id}`} title="Buka detail task" aria-label="Buka detail task" aria-disabled={disableOpen} tabIndex={disableOpen ? -1 : undefined} className={`flex size-11 shrink-0 items-center justify-center rounded-lg transition ${disableOpen ? "pointer-events-none bg-slate-100 text-slate-400 opacity-40" : buttonClass()} ${disableOpen ? "" : "hover:brightness-95 active:scale-95"}`}><MaterialIcon name="open_in_new" size="sm" /></Link>
        <span className={`text-[9px] font-bold tracking-wider uppercase ${dark ? "text-slate-500" : "text-[#7d7c7c]/80"}`}>
          {getShortLabel("open_in_new")}
        </span>
      </div>
      {(showStart || showPause || showDone || showAllActions) && renderIconButton({
        action: workAction,
        icon: workActionIcon,
        label: workActionLabel,
        active: workAction === "done" && outputOpen,
        disabled: workAction === "pause" ? isActionDisabled("pause") : workAction === "done" ? isActionDisabled("done") : startDisabled || isActionDisabled("start"),
      })}
      {showDone && !showAllActions && workAction !== "done" && renderIconButton({ action: "done", icon: "check_circle", label: "Selesaikan task", disabled: isActionDisabled("done") })}
      {fileEnabled && renderIconButton({ action: outputAction, icon: outputIcon, label: outputLabel, active: (outputAction === "file" ? fileOpen : outputAction === "check" ? checkOpen : outputOpen) || activeTab === outputAction, disabled: isActionDisabled(outputAction) })}
      {(!hideDelete && !isDone) && renderIconButton({ action: "delete", icon: "delete", label: "Hapus atau batalkan task", active: activeTab === "delete", danger: true, disabled: isActionDisabled("delete") })}
      </div>
    </TaskCardActionBar>
  );

  return (
    <article className={`overflow-hidden rounded-lg border transition-shadow hover:shadow-md ${palette.shell}`}>
      <TaskCardMobileLayout surfaceClass={palette.surface} lineClass={palette.line} isOpen={false} onToggle={() => router.push(`/odds/detail?id=${task.id}`)} dateBlock={<TaskCardMobileDate quadrant={rawQuadrant} date={date} monthYear={monthYear} isDone={isDone} />} heading={<div className="flex items-start justify-between gap-2"><div className="min-w-0"><h3 className={`line-clamp-2 text-[15px] font-semibold leading-snug ${palette.primary}`}>{task.design_purpose}</h3><p className={`mt-0.5 truncate text-[11px] ${palette.secondary}`}>{task.category?.name ?? task.category_snapshot?.name ?? "Tanpa kategori"}</p><span className={`mt-1 block text-[11px] ${palette.accent}`}>{status}</span></div><MaterialIcon name="open_in_new" size="xs" className={palette.secondary} /></div>} people={renderPeople(true)} meta={<><span className={`truncate ${palette.secondary}`}>Deadline: {deadlineText}</span>{showTimer && <span className={`shrink-0 font-mono font-semibold ${isOverdue ? "text-rose-500" : palette.accent}`}>{isReview ? "--:--:--" : timerText}</span>}</>} actions={renderActions(true)} />
      <TaskCardWideLayout surfaceClass={palette.surface} dateBlock={<TaskCardWideDate quadrant={quadrant} date={date} day={day} monthYear={monthYear} time={time} isDone={isDone} />} taskInfo={<div className="flex w-[240px] shrink-0 flex-col justify-center px-5"><h3 className={`truncate text-xl font-medium ${palette.primary}`}>{task.design_purpose}</h3><p className={`mt-0.5 truncate text-xs ${palette.secondary}`}>{task.category?.name ?? task.category_snapshot?.name ?? "Tanpa kategori"}</p></div>} people={<div className={`flex w-[180px] shrink-0 items-center border-l ${palette.line}`}>{renderWidePeople()}</div>} deadline={<div className={`flex w-[130px] shrink-0 items-center px-4 text-white ${isDone ? "bg-[#238653]" : isOverdue ? "bg-rose-600" : "bg-[#00a4ff]"}`}><div className="w-full"><p key={isDone ? "done" : showDeadlineCountdown ? deadlineCountdownLabel : "deadline"} className="min-h-4 animate-fade-in text-[10px] font-medium leading-tight">{isDone ? "SELESAI" : showDeadlineCountdown ? deadlineCountdownLabel : "DEADLINE"}</p><p className="mt-1 text-sm">{deadlineText}</p></div></div>} actions={<div className="box-border flex min-w-0 flex-1 items-center justify-start overflow-hidden px-2">{renderActions(false, true)}</div>} status={<TaskCardWideStatusPanel isDone={isDone} isReview={isReview} status={status} statusDescription={statusDescription} feedbackHref={feedbackHref} highlightLabel={wideHighlightLabel} highlightValue={wideHighlightValue} rating={isDone ? doneRating : wideRating} timerText={isReview || isBriefCheck ? "--:--:--" : timerText} onRecommendation={handleWideRecommendation} recommendationDisabled={wideHighlightLabel === "Proses" && startDisabled} />} />
      {isOpen && <div className={`border-t p-3 lg:p-4 ${palette.line} ${palette.surface}`}>{panel}</div>}
    </article>
  );
}
