"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { MaterialIcon } from "@/components/ui/material-icon";
import { OddsRichTextEditor, RichTextViewer, stripRichText } from "@/components/odds-rich-text-editor";
import { TaskFeedbackToast, TaskDiscussionPanel } from "@/components/odds/TaskCard";
import { useAuth } from "@/providers/auth-provider";
import { useOddsTheme } from "@/app/odds/odds-theme-context";
import {
  OddsDesignerProfile,
  OddsTask,
  acceptOddsBrief,
  cancelOddsBrief,
  clientReviewOddsTask,
  extendOddsTaskDeadline,
  forceContinueOddsTask,
  getOddsDesignerProfiles,
  formatOddsDate,
  getOddsTask,
  oddsError,
  rateOddsTask,
  reassignOddsTask,
  requestOddsCancel,
  requestOddsQueuePriority,
  requestOddsQueueSkip,
  reviewOddsQueuePriority,
  returnOddsBrief,
  leaderReviewOddsTask,
  startOddsTask,
  statusLabel,
  submitOddsResult,
  updateOddsBrief,
} from "@/features/odds/api";

import { OddsBriefViewer, StandardBriefPreview, isTableBriefTask } from "@/features/odds/components/brief-details";
import { shouldHideOddsCancelSkipMenus } from "@/features/odds/menu-visibility";
import { DetailActionButton as ActionButton, DetailInfoRow as InfoRow, DetailShellMessage as ShellMessage, DetailSkeleton as TaskDetailSkeleton } from "@/features/odds/components/task-detail/detail-ui";
import { OddsTaskAuditPanel } from "@/features/odds/components/task-detail/odds-task-audit-panel";
import { OddsTaskOutputPanel } from "@/features/odds/components/task-detail/odds-task-output-panel";
import { OddsTaskHistoryPanel } from "@/features/odds/components/task-detail/odds-task-history-panel";
import { OddsTaskActionsPanel } from "@/features/odds/components/task-detail/odds-task-actions-panel";
import { OddsTaskRevisionPanel } from "@/features/odds/components/task-detail/odds-task-revision-panel";
import { GroupButton } from "@/features/odds/components/task-detail/group-button";
import { ClientTableBriefEditor as TaskDetailClientTableBriefEditor } from "@/features/odds/components/task-detail/client-table-brief-editor";
import { QaComponentBoundary } from "@/features/odds/components/task-detail/qa-component-boundary";
import { TaskHeader } from "@/features/odds/components/task-detail/task-header";
import { TaskTimer } from "@/features/odds/components/task-detail/task-timer";
import { RevisionBrief } from "@/features/odds/components/task-detail/revision-brief";
import { RevisionMessage } from "@/features/odds/components/task-detail/revision-message";
import { TaskDetailTabs, type TaskDetailTab } from "@/features/odds/components/task-detail/task-detail-tabs";
import { useOddsTaskDetailPreview } from "./odds-task-detail-preview-context";

function badgeClass(status: string) {
  if (["done", "client_review"].includes(status)) return "bg-cu-success/10 text-cu-success border-cu-success/20";
  if (["cancelled", "cancelled_by_spv", "revision_rejected_by_spv"].includes(status)) {
    return "bg-cu-danger/10 text-cu-danger border-cu-danger/20";
  }
  if (["in_progress", "spv_review", "queued"].includes(status)) return "bg-cu-info/10 text-cu-info border-cu-info/20";
  return "bg-cu-panel-soft text-cu-muted border-cu-border";
}

function parseDateMs(dateStr?: string | number | null): number {
  if (!dateStr) return NaN;
  if (typeof dateStr === "number") return dateStr;
  let str = String(dateStr).trim();
  if (!str) return NaN;
  if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/.test(str)) {
    str = str.replace(" ", "T");
  }
  return new Date(str).getTime();
}

function durationSeconds(log: { started_at: string; stopped_at: string | null; duration_seconds: number }, nowMs = Date.now()) {
  if (log.stopped_at) return log.duration_seconds;
  const started = parseDateMs(log.started_at);
  if (Number.isNaN(started)) return log.duration_seconds;
  return Math.max(0, Math.floor((nowMs - started) / 1000));
}

function formatDuration(totalSeconds: number) {
  const days = Math.floor(totalSeconds / 86400);
  const remainingSeconds = totalSeconds % 86400;
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  if (days > 0) return `${days}h ${hours}j`;
  if (hours > 0) return `${hours}j ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}d`;
  return `${seconds}d`;
}

function DetailContent() {
  const { theme } = useOddsTheme();
  const dark = theme === "dark";
  const retro = theme === "retro";

  const cardClass = retro
    ? "border-2 border-[#24252b] bg-[#eceee6] shadow-[4px_4px_0px_#24252b] p-4 md:p-5 rounded-none flex-grow flex flex-col min-h-0 overflow-hidden"
    : dark
    ? "border border-white/10 bg-[#171717]/85 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.3)] p-4 md:p-5 text-white rounded-[16px] flex-grow flex flex-col min-h-0 overflow-hidden"
    : "border border-[#BDEAFF]/60 bg-white shadow-[0_8px_30px_rgba(0,164,255,0.04)] p-4 md:p-5 text-[#04044A] rounded-[16px] flex-grow flex flex-col min-h-0 overflow-hidden";

  const textLabelClass = retro
    ? "block text-[9px] font-bold uppercase tracking-wider text-[#24252b]"
    : dark
    ? "block text-[9px] font-bold uppercase tracking-wider text-[#7d827f]"
    : "block text-[9px] font-bold uppercase tracking-wider text-[#04044A]/60";

  const textValueClass = retro
    ? "mt-1 block font-extrabold text-xs text-[#24252b]"
    : dark
    ? "mt-1 block font-semibold text-xs text-[#f1f1f1]"
    : "mt-1 block font-semibold text-xs text-[#04044A]";

  const navClass = retro
    ? "flex gap-2 overflow-x-auto rounded-none border-2 border-[#24252b] bg-[#eceee6] p-1 shadow-[2px_2px_0px_#24252b] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    : dark
    ? "flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-[#171717]/85 backdrop-blur-md p-1 shadow-lg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    : "flex gap-2 overflow-x-auto rounded-2xl border border-[#BDEAFF]/60 bg-white p-1 shadow-[0_8px_30px_rgba(0,164,255,0.03)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

  const tabButtonClass = (tab: string) => {
    const active = activeTab === tab;
    if (retro) {
      return active
        ? "text-[#ba0dcb]"
        : "text-[#24252b]/60 hover:text-[#24252b]";
    }
    if (dark) {
      return active
        ? "text-[#b0ff5e]"
        : "text-[#7d827f] hover:text-white";
    }
    return active
      ? "text-[#00A4FF]"
      : "text-[#04044A]/60 hover:text-[#00A4FF]";
  };

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const preview = useOddsTaskDetailPreview();
  const isPreview = preview !== null;
  const routeTaskId = preview?.task.id ?? id;
  const qaScenario = preview?.scenario ?? "leader_review";
  const qaPov = preview?.pov ?? "leader";
  const { user, hasPermission } = useAuth();
  const [task, setTask] = useState<OddsTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const busyRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
 
  const [briefText, setBriefText] = useState("");
  const [briefRevisionText, setBriefRevisionText] = useState("");
  const [note, setNote] = useState("");
  const [resultNotes, setResultNotes] = useState("");
  const [assetUrl, setAssetUrl] = useState("");
  const [rating, setRating] = useState("5");
  const [timerNow, setTimerNow] = useState(() => Date.now());
  const [designerProfiles, setDesignerProfiles] = useState<OddsDesignerProfile[]>([]);
  const [reassignDesignerId, setReassignDesignerId] = useState("");
  const [reassignDropdownOpen, setReassignDropdownOpen] = useState(false);
  const [extendedDeadline, setExtendedDeadline] = useState("");
  const [activeTab, setActiveTab] = useState<TaskDetailTab>(() => (typeof window !== "undefined" && window.innerWidth < 1024 ? "info" : "brief"));
  const [mobileTabOpen, setMobileTabOpen] = useState(false);
  const [selectedRevisionId, setSelectedRevisionId] = useState<number | null>(null);
  const [isBriefRevisionEditing, setIsBriefRevisionEditing] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  useEffect(() => {
    if (!preview) return;
    setTask(preview.task);
    setBriefText(preview.task.brief?.content ?? preview.task.brief_text ?? "");
    setSelectedRevisionId(null);
    setActiveTab(["leader_review", "client_review", "completed"].includes(qaScenario) ? "output" : ["leader_revision", "client_revision"].includes(qaScenario) ? "revision" : "brief");
    setLoading(false);
  }, [preview, qaScenario]);

  const canReviewBrief = hasPermission("review-odds-briefs");
  const canStart = hasPermission("start-odds-tasks");
  const canSubmit = hasPermission("submit-odds-results");
  const canSpvReview = hasPermission("review-odds-leader");
  const canClientReview = hasPermission("review-odds-client");
  const canManageEscalations = hasPermission("manage-odds-escalations");
  const canRequestQueueSkip = hasPermission("request-odds-queue-skip");
  const canRequestQueuePriority = hasPermission("request-odds-queue-priority");

  const latestResult = useMemo(() => {
    return [...(task?.results ?? [])].sort((a, b) => b.version_number - a.version_number)[0];
  }, [task]);

  const loadTask = useCallback(async (silent = false) => {
    if (!id || isPreview) return;
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await getOddsTask(id);
      setTask((prev) => {
        if (prev && JSON.stringify(prev) === JSON.stringify(data)) return prev;
        return data;
      });
      const newBrief = data.brief?.content ?? data.brief_text ?? "";
      setBriefText((current) => {
        if (current === newBrief) return current;
        return newBrief;
      });
    } catch (err) {
      setError(oddsError(err));
    } finally {
      if (!silent) setLoading(false);
    }
  }, [id, isPreview]);

  useEffect(() => {
    void loadTask();
  }, [loadTask]);

  useEffect(() => {
    const handleTaskUpdated = (event: Event) => {
      const updatedTask = (event as CustomEvent<OddsTask>).detail;
      if (updatedTask && String(updatedTask.id) === String(routeTaskId)) {
        void loadTask(true);
      }
    };
    const handleTaskDeleted = (event: Event) => {
      const deletedTaskId = (event as CustomEvent<number | string>).detail;
      if (String(deletedTaskId) === String(routeTaskId)) {
        setError("Tugas ini telah dihapus.");
        setTask(null);
      }
    };

    window.addEventListener("odds:task-updated", handleTaskUpdated);
    window.addEventListener("odds:task-deleted", handleTaskDeleted);
    return () => {
      window.removeEventListener("odds:task-updated", handleTaskUpdated);
      window.removeEventListener("odds:task-deleted", handleTaskDeleted);
    };
  }, [routeTaskId]);

  useEffect(() => {
    if (activeTab !== "audit") return;
    setTimerNow(Date.now());
    const interval = window.setInterval(() => {
      setTimerNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [activeTab]);

  useEffect(() => {
    if (!canManageEscalations) return;
    let active = true;

    void getOddsDesignerProfiles()
      .then((profiles) => {
        if (active) setDesignerProfiles(profiles);
      })
      .catch(() => {
        if (active) setDesignerProfiles([]);
      });

    return () => {
      active = false;
    };
  }, [canManageEscalations]);

  const run = async (label: string, action: () => Promise<unknown>, message: string) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(label);
    setError(null);
    setNotice(null);
    try {
      await action();
      setNotice(message);
      setNote("");
      setResultNotes("");
      setAssetUrl("");
      setReassignDesignerId("");
      setExtendedDeadline("");
      await loadTask();
    } catch (err) {
      setError(oddsError(err));
    } finally {
      busyRef.current = false;
      setBusy(null);
    }
  };

  if (routeTaskId === null || routeTaskId === undefined) {
    return <ShellMessage message="ID task tidak ditemukan." />;
  }

  if (loading && !task) {
    return <TaskDetailSkeleton />;
  }

  if (!task) {
    return <ShellMessage message={error ?? "Task tidak ditemukan."} />;
  }

  const assignedDesigner = task.assigned_designer ?? task.assignedDesigner;
  const queue = task.current_queue ?? task.currentQueue;
  const isRequester = task.requester?.id === user?.id;
  const isAssignedDesigner = assignedDesigner?.id === user?.id;
  const hideCancelSkipMenus = shouldHideOddsCancelSkipMenus(user);
  const isClientSideView = canClientReview && isRequester && !canReviewBrief && !canSpvReview;
  const isLeaderRevisionTask = task.task_type === "leader_revision";
  const isClientRevisionTask = ["client_revision", "extra_revision", "urgent_revision"].includes(task.task_type);
  const isVisibleLeaderRevisionTask = isLeaderRevisionTask && !isClientSideView;
  const visibleRevisions = isClientSideView
    ? (task.revisions ?? []).filter((revision) => revision.revision_type !== "leader")
    : (task.revisions ?? []);
  const visibleLatestRevision = [...visibleRevisions].sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())[0];
  const revisionChronological = [...visibleRevisions].sort((a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime());
  const activeRevision = isVisibleLeaderRevisionTask || isClientRevisionTask
    ? visibleRevisions.find((revision) => revision.id === selectedRevisionId) ?? visibleLatestRevision
    : null;
  const visibleLatestResult = isClientSideView && ["pending_spv", "revision_requested"].includes(latestResult?.status ?? "")
    ? undefined
    : latestResult;
  const timeLogs = task.time_logs ?? task.timeLogs ?? [];
  const designerTimeLogs = timeLogs.filter((log) => ["work", "revision", "spv_review", "client_review"].includes(log.log_type));
  const timerTotals = {
    work: timeLogs.filter((log) => log.log_type === "work").reduce((total, log) => total + durationSeconds(log, timerNow), 0),
    revision: timeLogs.filter((log) => log.log_type === "revision").reduce((total, log) => total + durationSeconds(log, timerNow), 0),
    spv_review: timeLogs.filter((log) => log.log_type === "spv_review").reduce((total, log) => total + durationSeconds(log, timerNow), 0),
    client_review: timeLogs.filter((log) => log.log_type === "client_review").reduce((total, log) => total + durationSeconds(log, timerNow), 0),
  };
  const slaMinutes = task.category?.sla_minutes ?? 0;
  const slaSeconds = slaMinutes * 60;
  const isSlaOverdue = slaSeconds > 0 && timerTotals.work > slaSeconds;
  const outputTitle = isVisibleLeaderRevisionTask ? "Output Revisi Leader Creative" : isClientRevisionTask ? "Output Revisi Client" : "Output";
  const submitButtonLabel = isVisibleLeaderRevisionTask || isClientRevisionTask ? "Submit Revisi" : "Submit";
  const submitResultMessage = isVisibleLeaderRevisionTask
    ? "Revisi dikirim ke Leader Creative."
    : isClientRevisionTask
      ? "Revisi dikirim ke client."
      : "Output dikirim ke Leader Creative.";
  const canEditBrief = canClientReview && isRequester && task.status === "brief_revision_requested";
  const isClientBriefRevision = isPreview
    ? qaPov === "client" && qaScenario === "brief_revision"
    : canEditBrief;
  const canReturnBrief = canReviewBrief && isAssignedDesigner && task.status === "submitted";
  const canAcceptBrief = canReviewBrief && isAssignedDesigner && task.status === "submitted";
  const canStartTask = canStart && isAssignedDesigner && ["queued", "ready_to_start"].includes(task.status);
  const canSubmitOutput = canSubmit && isAssignedDesigner && task.status === "in_progress";
  const canSpvBriefAction = canSpvReview && ["submitted", "brief_revision_requested"].includes(task.status);
  const canSpvResultReview = canSpvReview && task.status === "spv_review";
  const canClientResultReview = canClientReview && isRequester && task.status === "client_review";
  const canRichTextOutputReview = canSpvResultReview;
  const canRequestCancel = !hideCancelSkipMenus && canClientReview && isRequester && !["done", "cancelled", "cancelled_by_spv"].includes(task.status);
  const canReassignTask = canManageEscalations && !["done", "cancelled", "cancelled_by_spv"].includes(task.status);
  const pendingSkipRequest = (task.skip_requests ?? task.skipRequests ?? []).find((request) => request.status === "pending");
  const canRequestSkip = !hideCancelSkipMenus
    && canRequestQueueSkip
    && isAssignedDesigner
    && ["queued", "ready_to_start"].includes(task.status)
    && !pendingSkipRequest;
  const pendingPriorityRequest = (task.priority_requests ?? task.priorityRequests ?? []).find((request) => request.status === "pending");
  const canRequestPriority = canRequestQueuePriority
    && canClientReview
    && isRequester
    && ["queued", "ready_to_start"].includes(task.status)
    && !pendingPriorityRequest;
  const canReviewPriority = canSpvReview && Boolean(pendingPriorityRequest);
  const canExtendDeadline = canManageEscalations && !["done", "cancelled", "cancelled_by_spv"].includes(task.status);
  const reassignTargets = designerProfiles.filter((profile) => profile.status !== "off" && profile.user_id !== assignedDesigner?.id);
  const normalRevisionLimit = task.category?.normal_revision_limit ?? 2;
  const isLastNormalRevisionChance = canClientResultReview
    && !task.extra_revision_used_at
    && task.normal_revision_count + 1 >= normalRevisionLimit;
  const isUrgentFinalRevisionChance = canClientResultReview
    && Boolean(task.extra_revision_used_at)
    && !task.urgent_revision_used_at;
  const canShowNoteInput = canReturnBrief || canSpvBriefAction || canSpvResultReview || canClientResultReview || canRequestCancel || canRequestSkip || canRequestPriority || canReviewPriority || canExtendDeadline;
  const showOutputSection = true;
  const showRevisionSection = visibleRevisions.length > 0;

  const saveBrief = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canEditBrief) return;
    if (!stripRichText(briefText)) return;
    void run("brief", () => updateOddsBrief(task.id, briefText), "Brief diperbarui.");
  };

  const submitBriefRevision = () => {
    if (!stripRichText(briefRevisionText)) return;
    void run("brief", () => updateOddsBrief(task.id, briefRevisionText), "Revisi brief dikirim.");
    setIsBriefRevisionEditing(false);
  };

  const submitResult = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void run(
      "result",
      () =>
        submitOddsResult(task.id, {
          result_notes: resultNotes || undefined,
          assets: assetUrl
            ? [{ provider: "other", label: "Output", url: assetUrl }]
            : undefined,
        }),
      submitResultMessage
    );
  };

  return (
    <div className="flex w-full h-full min-h-0 flex-col gap-4 lg:gap-4 overflow-hidden">
      <TaskFeedbackToast
        toast={error ? { status: "error", message: error } : notice ? { status: "success", message: notice } : null}
        onClose={() => { setError(null); setNotice(null); }}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 items-stretch flex-1 min-h-0 h-[calc(100vh-200px)] lg:h-[calc(100vh-220px)]">
        <div className="lg:col-span-3 flex flex-col gap-4 h-full min-h-0">
          <QaComponentBoundary label="TaskHeader" wrap>
          <TaskHeader title={task.design_purpose} />
          </QaComponentBoundary>

          {/* Details Box */}
          {/* Grouped Tab + Pane Wrapper */}
          <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-hidden">
          <QaComponentBoundary label="TaskDetailTabs">
            <TaskDetailTabs activeTab={activeTab} onChange={setActiveTab} mobileOpen={mobileTabOpen} onMobileOpenChange={setMobileTabOpen} navClass={navClass} tabButtonClass={tabButtonClass} />
          </QaComponentBoundary>

            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {activeTab === "brief" && (
                <QaComponentBoundary label="BriefPanel">
                <section className={`${cardClass} ${isClientBriefRevision ? "grid grid-cols-1 gap-4 lg:grid-cols-4" : ""}`}>
                  <div className={isClientBriefRevision ? "flex min-h-0 flex-col lg:col-span-3" : "contents"}>
                  <form onSubmit={saveBrief} className="flex-1 flex flex-col min-h-0 space-y-3 overflow-hidden">
                    {isBriefRevisionEditing ? (
                      <QaComponentBoundary label="OddsRichTextEditor" tone="nested" wrap className="min-h-0 flex-1"><OddsRichTextEditor value={briefRevisionText} onChange={setBriefRevisionText} placeholder="Alasan revisi atau perbaikan brief" fillHeight className="h-full" /></QaComponentBoundary>
                    ) : (canEditBrief || isClientBriefRevision) && isTableBriefTask(task) ? (
                      <QaComponentBoundary label="ClientTableBriefEditor" tone="nested" wrap className="min-h-0 flex-1 overflow-hidden">
                        <TaskDetailClientTableBriefEditor task={task} briefText={briefText} theme={theme} returnNote={task.brief?.last_return_note ?? ""} onChange={setBriefText} hideReturnNote={isClientBriefRevision} />
                      </QaComponentBoundary>
                    ) : canEditBrief ? (
                      <QaComponentBoundary label="OddsRichTextEditor" tone="nested" wrap className="min-h-0 flex-1"><OddsRichTextEditor value={briefText} onChange={setBriefText} /></QaComponentBoundary>
                    ) : isTableBriefTask(task) ? (
                      <QaComponentBoundary label="OddsBriefViewer" tone="nested" wrap className="min-h-0 flex-1 overflow-auto"><OddsBriefViewer task={task} briefText={briefText} theme={theme} /></QaComponentBoundary>
                    ) : (
                      <QaComponentBoundary label="StandardBriefPreview" tone="nested" wrap className="min-h-0 flex-1 overflow-auto"><StandardBriefPreview html={briefText} /></QaComponentBoundary>
                    )}
                    {canEditBrief ? (
                      <div className="flex shrink-0 justify-end items-center gap-4">
                        <button
                          type="submit"
                          disabled={busy === "brief" || !stripRichText(briefText)}
                          className="inline-flex h-10 items-center gap-2 rounded-lg border border-cu-border px-4 text-sm font-semibold text-cu-ink transition hover:bg-cu-panel-soft disabled:opacity-50"
                        >
                          <MaterialIcon name="save" size="sm" />
                          Kirim Update Brief
                        </button>
                      </div>
                    ) : (
                      null
                    )}
                   </form>
                   {(isPreview ? qaPov === "designer" && qaScenario === "brief_submitted" : isAssignedDesigner && task.status === "submitted") && <QaComponentBoundary label="GroupButton" tone="nested" wrap className="mt-3"><GroupButton onButtonA={isBriefRevisionEditing ? submitBriefRevision : () => void run("accept", () => acceptOddsBrief(task.id), "Brief diterima dan masuk antrean.")} onButtonB={() => { setBriefRevisionText(""); setIsBriefRevisionEditing((editing) => !editing); }} primaryLabel={isBriefRevisionEditing ? "Kirim Revisi" : "Approve Brief"} secondaryLabel={isBriefRevisionEditing ? "Kembali" : "Revision Brief"} primaryIcon={isBriefRevisionEditing ? "send" : "check_circle"} secondaryIcon={isBriefRevisionEditing ? "arrow_back" : "edit_note"} secondaryDisabled={false} primaryVariant="blue" secondaryVariant={isBriefRevisionEditing ? "default" : "red"} /></QaComponentBoundary>}
                  </div>
                  {isClientBriefRevision && (
                    <div className="flex h-full min-h-0 flex-col gap-3 lg:col-span-1">
                      <QaComponentBoundary label="RevisionMessage" tone="nested"><RevisionMessage message={task.brief?.last_return_note ?? ""} /></QaComponentBoundary>
                      <QaComponentBoundary label="GroupButton" tone="nested" wrap>
                        <RevisionBrief
                          editing={isBriefRevisionEditing}
                          directSubmit={isTableBriefTask(task)}
                          onEdit={() => { setBriefRevisionText(briefText); setIsBriefRevisionEditing(true); }}
                          onSubmit={isTableBriefTask(task) ? () => void run("brief", () => updateOddsBrief(task.id, briefText), "Revisi brief dikirim.") : submitBriefRevision}
                        />
                      </QaComponentBoundary>
                    </div>
                  )}
                </section>
                </QaComponentBoundary>
              )}

              {activeTab === "revision" && (
                 <QaComponentBoundary label="RevisionPanel">
                <OddsTaskRevisionPanel hasRevisions={showRevisionSection} className={showRevisionSection ? "grid min-h-0 grid-cols-1 gap-2 rounded-xl lg:grid-cols-4" : cardClass}>
                 {showRevisionSection && <>
                 <div className="flex min-h-0 flex-col gap-2 lg:col-span-3">
                {activeRevision && (
                <QaComponentBoundary label="ActiveRevisionPanel" tone="nested" labelSide="right" className="rounded-xl lg:col-span-3">
                <section className={cardClass}>
                  <p className="whitespace-pre-wrap text-sm text-cu-ink flex-1 overflow-y-auto">{activeRevision.notes}</p>
                </section>
                </QaComponentBoundary>
              )}

                 </div>
                <QaComponentBoundary label="RevisionHistoryPanel" tone="nested" className="rounded-xl lg:col-span-1"><section className={`${cardClass} !p-2 !pt-5`}><div className="divide-y divide-cu-border/60 overflow-y-auto">{[...visibleRevisions].sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()).map((revision) => { const revisionNumber = revisionChronological.findIndex((item) => item.id === revision.id) + 1; const isLatest = revision.id === visibleLatestRevision?.id; const isSelected = selectedRevisionId === revision.id; return <div key={revision.id} role="button" tabIndex={0} onClick={() => setSelectedRevisionId(revision.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelectedRevisionId(revision.id); }} className={`relative flex cursor-pointer items-center gap-3 px-1 py-2.5 transition-colors ${isSelected ? "bg-cu-info/[0.06]" : "hover:bg-black/[0.025]"}`}><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold ${isLatest ? "bg-cu-info text-white" : "bg-cu-surface text-cu-muted ring-1 ring-inset ring-cu-border"}`}>{["I", "II", "III", "IV", "V"][revisionNumber - 1] ?? revisionNumber}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="text-xs font-semibold capitalize text-cu-ink">{revision.revision_type === "leader" ? "Leader" : "Client"}</span>{isLatest && <span className="rounded-sm bg-cu-info/10 px-1.5 py-0.5 text-[9px] font-medium text-cu-info">Terbaru</span>}</div><p className="mt-0.5 truncate text-[10px] text-cu-muted">{revision.created_at ? formatLogDate(revision.created_at) : "Waktu belum tersedia"}</p></div><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${isLatest ? "bg-cu-info" : "bg-cu-border"}`} aria-label={isLatest ? "Revisi terbaru" : "Revisi"} /></div>; })}</div></section></QaComponentBoundary>
                 </>}
                </OddsTaskRevisionPanel>
                </QaComponentBoundary>
              )}

              {showOutputSection && activeTab === "output" && (
                <QaComponentBoundary label="OddsTaskOutputPanel">
                  <OddsTaskOutputPanel
                  result={visibleLatestResult ?? null}
                  className={cardClass}
                  formatDate={formatOddsDate}
                  dark={dark}
                  canReview={canRichTextOutputReview}
                  reviewNote={note}
                  onReviewNoteChange={setNote}
                  busy={busy}
                  onReview={(decision, reviewNote) => run(decision === "approved" ? "spvOk" : "spvRev", () => leaderReviewOddsTask(task.id, decision, reviewNote), decision === "approved" ? "Leader approve." : "Revisi Leader dibuat.")}
                  canSubmit={canSubmitOutput}
                  resultNotes={resultNotes}
                  assetUrl={assetUrl}
                  onResultNotesChange={setResultNotes}
                  onAssetUrlChange={setAssetUrl}
                  onSubmit={submitResult}
                  submitButtonLabel={submitButtonLabel}
                  isLeaderRevisionTask={isVisibleLeaderRevisionTask}
                  isClientRevisionTask={isClientRevisionTask}
                  />
                </QaComponentBoundary>
              )}
              {activeTab === "discussion" && (
                <QaComponentBoundary label="OddsTaskDiscussionPanel" className={cardClass}>
                  <section className={cardClass}>
                    <QaComponentBoundary label="TaskDiscussionPanel" tone="nested">
                      <TaskDiscussionPanel taskId={task.id} userId={user?.id} taskStatus={task.status} preview={isPreview && qaScenario !== "brief_submitted"} unavailable={task.status === "submitted" || (isPreview && qaScenario === "brief_submitted")} />
                    </QaComponentBoundary>
                  </section>
                </QaComponentBoundary>
              )}

              {activeTab === "audit" && (
                <QaComponentBoundary label="OddsTaskAuditPanel">
                  <OddsTaskAuditPanel task={task} timerTotals={timerTotals} isSlaOverdue={isSlaOverdue} slaMinutes={slaMinutes} formatDuration={formatDuration} className={cardClass} />
                </QaComponentBoundary>
              )}
              {activeTab === "history" && (
                <QaComponentBoundary label="OddsTaskHistoryPanel">
                <OddsTaskHistoryPanel className={cardClass}>
                  <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                    {(() => {
                      const backendHistory = task.history ?? [];
                      if (backendHistory.length > 0) {
                        return (
                          <div className="relative space-y-3 pl-5 before:absolute before:bottom-2 before:left-1 before:top-2 before:w-px before:bg-cu-border/70">
                            {backendHistory.map((event) => (
                              <article key={event.sequence} className="relative rounded-xl border border-cu-border/70 bg-cu-panel-soft/30 px-3 py-2.5 shadow-sm">
                                <span className="absolute -left-[1.35rem] top-3 flex size-3 items-center justify-center rounded-full border-2 border-white bg-cu-info shadow-sm" aria-hidden="true" />
                                <p className="text-xs font-semibold text-cu-ink">{event.text}</p>
                                <p className="mt-1 text-[10px] font-medium text-cu-muted">{formatLogDate(event.occurred_at)}</p>
                              </article>
                            ))}
                          </div>
                        );
                      }

                      const events: Array<{ label: string; date: string; note?: ReactNode; order?: number }> = [];
                      
                      if (task.created_at) {
                        events.push({
                          label: "TUGAS DIBUAT",
                          date: task.created_at,
                          note: (
                            <>
                              <strong className="font-bold text-cu-ink">{task.design_purpose}</strong> berhasil dibuat oleh {task.requester?.name ?? "Client"}.
                </>
                          ),
                        });
                      }

                      (task.activities ?? []).forEach((activity) => {
                        if (task.created_at && new Date(activity.created_at).getTime() < new Date(task.created_at).getTime()) return;
                        if (activity.event === "brief_returned") {
                          events.push({ label: "DESIGNER MEMINTA REVISI BRIEF", date: activity.created_at, note: activity.description });
                        }
                        if (activity.event === "brief_updated") {
                          events.push({ label: "CLIENT MEREVISI BRIEF", date: activity.created_at, note: activity.description });
                        }
                        if (activity.event === "brief_accepted" || activity.event === "brief_forced_continue") {
                          events.push({
                            label: activity.event === "brief_accepted" ? "BRIEF DI-APPROVE" : "BRIEF DITERUSKAN KE ANTREAN",
                            date: activity.created_at,
                            note: (
                              <>
                                Brief untuk tugas <strong className="font-bold text-cu-ink">{task.design_purpose}</strong> telah disetujui dan dimasukkan ke antrean pengerjaan.
                              </>
                            ),
                          });
                        }
                        if (activity.event === "task_queued") {
                          events.push({
                            label: "TASK MASUK ANTREAN",
                            date: activity.created_at,
                            order: 6,
                            note: "Task masuk ke antrean pengerjaan.",
                          });
                        }
                        if (activity.event && ["leader_revision_requested", "spv_revision_requested"].includes(activity.event)) {
                          if (events.some((event) => event.label === "SPV MEMINTA REVISI" && event.date === activity.created_at)) return;
                          events.push({
                            label: "SPV MEMINTA REVISI",
                            date: activity.created_at,
                            order: 5,
                            note: activity.description,
                          });
                        }
                      });
                      const lastBriefReturnActivity = (task.activities ?? []).find((activity) => activity.event === "brief_returned");
                      const hasBriefUpdatedActivity = (task.activities ?? []).some((activity) => activity.event === "brief_updated");
                      const fallbackBriefUpdate = (task.activities ?? []).find((activity) => activity.event === "updated" && lastBriefReturnActivity && new Date(activity.created_at).getTime() > new Date(lastBriefReturnActivity.created_at).getTime());
                      if (!hasBriefUpdatedActivity && fallbackBriefUpdate) {
                        events.push({ label: "CLIENT MEREVISI BRIEF", date: fallbackBriefUpdate.created_at, note: "Client mengirim kembali brief setelah memperbarui isi brief." });
                      }

                      timeLogs.forEach((log) => {
                        const latestSubmittedAt = [...(task.results ?? [])]
                          .filter((result) => result.submitted_at)
                          .sort((a, b) => new Date(b.submitted_at ?? 0).getTime() - new Date(a.submitted_at ?? 0).getTime())[0]?.submitted_at;
                        const latestReviewAt = [...(task.reviews ?? [])]
                          .filter((review) => review.created_at && ((log.log_type === "spv_review" && review.review_type === "spv") || (log.log_type === "client_review" && review.review_type === "client")))
                          .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())[0]?.created_at;
                        const rawPhaseStartMs = new Date(log.started_at).getTime();
                        const rawPhaseStopMs = log.stopped_at ? new Date(log.stopped_at).getTime() : NaN;
                        const latestSubmittedMs = latestSubmittedAt ? new Date(latestSubmittedAt).getTime() : NaN;
                        const latestReviewMs = latestReviewAt ? new Date(latestReviewAt).getTime() : NaN;
                        const phaseStartDate = !["work", "revision"].includes(log.log_type)
                          && Number.isFinite(latestSubmittedMs)
                          && rawPhaseStartMs <= latestSubmittedMs
                          ? new Date(latestSubmittedMs + 1000).toISOString()
                          : log.started_at;
                        const phaseStopDate = ["work", "revision"].includes(log.log_type)
                          && Number.isFinite(latestSubmittedMs)
                          && rawPhaseStopMs < latestSubmittedMs
                          ? new Date(latestSubmittedMs).toISOString()
                          : !["work", "revision"].includes(log.log_type)
                            && Number.isFinite(latestReviewMs)
                            && rawPhaseStopMs <= latestReviewMs
                            ? new Date(latestReviewMs + 1000).toISOString()
                            : log.stopped_at;
                        events.push({
                          label: `MULAI FASE: ${statusLabel(log.log_type).toUpperCase()}`,
                          date: phaseStartDate,
                          order: ["work", "revision"].includes(log.log_type) ? 1 : 4,
                          note: `Fase ${statusLabel(log.log_type)} dimulai oleh ${task.assigned_designer?.name ?? "Desainer"}.`,
                        });
                        
                        if (phaseStopDate) {
                          events.push({
                            label: `SELESAI FASE: ${statusLabel(log.log_type).toUpperCase()}`,
                            date: phaseStopDate,
                            order: ["work", "revision"].includes(log.log_type) ? 3 : 6,
                            note: `Fase ${statusLabel(log.log_type)} selesai/dijeda. Durasi: ${formatDuration(log.duration_seconds)}.`,
                          });
                        }
                      });

                      (task.results ?? []).forEach((r) => {
                        if (r.submitted_at) {
                          events.push({
                            label: `OUTPUT SUBMITTED (V${r.version_number})`,
                            date: r.submitted_at,
                            order: 2,
                            note: r.result_notes,
                          });
                        }
                      });

                      (task.reviews ?? []).forEach((rev) => {
                        const date = rev.created_at || rev.updated_at || task.updated_at || "";
                        if (date) {
                          events.push({
                            label: `REVIEW ${rev.review_type.toUpperCase()}`,
                            date,
                            order: 5,
                            note: (
                              <>
                                Keputusan: <span className="font-bold text-cu-ink">{rev.decision.toUpperCase()}</span>{rev.notes ? ` | Catatan: ${rev.notes}` : ""}
                              </>
                            ),
                          });
                        }
                      });

                      if (task.done_at) {
                        events.push({
                          label: "TUGAS SELESAI",
                          date: task.done_at,
                          note: "Tugas dinyatakan selesai dan diarsipkan.",
                        });
                      }

                      const lifecycleOrder = (label: string) => {
                        if (label.startsWith("MULAI FASE: WORK")) return 10;
                        if (label.startsWith("OUTPUT SUBMITTED")) return 20;
                        if (label.startsWith("SELESAI FASE: WORK")) return 30;
                        if (label.startsWith("MULAI FASE: SPV_REVIEW") || label.startsWith("MULAI FASE: CLIENT_REVIEW")) return 40;
                        if (label.startsWith("REVIEW ")) return 50;
                        if (label.startsWith("SELESAI FASE: SPV_REVIEW") || label.startsWith("SELESAI FASE: CLIENT_REVIEW")) return 60;
                        if (label === "SPV MEMINTA REVISI") return 70;
                        if (label === "TASK MASUK ANTREAN") return 80;
                        return 0;
                      };
                      const sortedEvents = [...events].sort((a, b) => {
                        const dateDifference = new Date(a.date).getTime() - new Date(b.date).getTime();
                        if (Math.abs(dateDifference) <= 2000) {
                          const lifecycleDifference = lifecycleOrder(a.label) - lifecycleOrder(b.label);
                          if (lifecycleDifference) return lifecycleDifference;
                        }
                        return dateDifference || (a.order ?? 0) - (b.order ?? 0);
                      });

                      if (sortedEvents.length === 0) {
                        return <div className="flex h-full min-h-0 flex-col items-center justify-center rounded-2xl border border-dashed border-cu-border bg-cu-panel-soft/30 px-4 py-6 text-center"><span className="text-3xl" role="img" aria-label="Belum ada aktivitas">🕘</span><p className="mt-2 text-sm font-medium text-cu-muted">Belum ada riwayat aktivitas.</p></div>;
                      }

                      return (
                        <div className="relative space-y-3 pl-5 before:absolute before:bottom-2 before:left-1 before:top-2 before:w-px before:bg-cu-border/70">
                          {sortedEvents.map((event, idx) => (
                            <article key={idx} className="relative rounded-xl border border-cu-border/70 bg-cu-panel-soft/30 px-3 py-2.5 shadow-sm">
                              <span className="absolute -left-[1.35rem] top-3 flex size-3 items-center justify-center rounded-full border-2 border-white bg-cu-info shadow-sm" aria-hidden="true" />
                              <h4 className="text-xs font-semibold text-cu-ink">{event.label}</h4>
                              <p className="mt-1 text-[10px] font-medium text-cu-muted">{formatLogDate(event.date)}</p>
                            </article>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </OddsTaskHistoryPanel>
                </QaComponentBoundary>
              )}

              {activeTab === "actions" && (
                <QaComponentBoundary label="OddsTaskActionsPanel">
                <OddsTaskActionsPanel className={cardClass}>
                  <div className="grid flex-1 min-h-0 grid-cols-1 items-stretch gap-4 overflow-y-auto pr-1 lg:grid-cols-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {/* Column 1: Main State Actions */}
                      <div className={`${selectedAction && !["Reassign", "Deadline"].includes(selectedAction) ? "" : "hidden"} order-2 h-full flex flex-col lg:col-span-3 lg:order-2`}>
                        <div className="space-y-3 flex-grow flex flex-col justify-between h-full">
                            <div className="space-y-3 flex-grow flex flex-col min-h-0">
                              {canShowNoteInput && (!canRichTextOutputReview || selectedAction === "Review") && (
                                <textarea
                                  value={note}
                                  onChange={(event) => setNote(event.target.value)}
                                  placeholder={selectedAction === "Cancel Task" ? "Alasan membatalkan request tugas" : selectedAction === "Prioritas" ? (canReviewPriority ? "Catatan review prioritas antrean" : "Alasan mengajukan prioritas antrean") : selectedAction === "Review" ? (canClientResultReview ? "Alasan review Client" : "Alasan revisi Leader") : "Catatan aksi"}
                                  className={`w-full flex-grow resize-none rounded-lg border px-3 py-2 text-sm outline-none min-h-[140px] ${dark ? "bg-[#0e0e0e] border-white/10 text-white focus:border-cu-info" : "border-cu-border focus:border-cu-info"}`}
                                />
                              )}

                              {pendingSkipRequest && isAssignedDesigner && (
                                <p className="rounded-lg border border-cu-warning/30 bg-cu-warning/10 px-3 py-2 text-sm text-cu-warning">
                                  Permintaan skip antrean sedang menunggu review SPV/Manajer.
                                </p>
                              )}

                              {canEditBrief && (
                                <p className="rounded-lg border border-cu-info/20 bg-cu-info/10 px-3 py-2 text-sm text-cu-info">
                                  Desainer meminta update brief. Perbarui dan kirim brief melalui panel Brief.
                                </p>
                              )}

                              {canClientResultReview && (
                                <div className="space-y-2">
                                  <p className="rounded-lg border border-cu-border bg-cu-panel-soft px-3 py-1.5 text-xs text-cu-muted">
                                    Pilih rating lalu ACC, atau isi catatan untuk revisi.
                                  </p>
                                  {(isLastNormalRevisionChance || isUrgentFinalRevisionChance) && (
                                    <p className="rounded-lg border border-cu-warning/30 bg-cu-warning/10 px-3 py-1.5 text-xs text-cu-warning">
                                      {isUrgentFinalRevisionChance
                                        ? "Kesempatan urgent final revision."
                                        : "Kesempatan revisi normal terakhir."}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="space-y-2 mt-auto">
                              {canReturnBrief && (
                                <ActionButton icon="keyboard_return" label="Return Brief" disabled={!note || !!busy} onClick={() => run("return", () => returnOddsBrief(task.id, note), "Brief dikembalikan.")} />
                              )}

                              {canAcceptBrief && (
                                <ActionButton icon="playlist_add_check" label="Brief Sesuai" disabled={!!busy} onClick={() => run("accept", () => acceptOddsBrief(task.id), "Brief diterima dan masuk antrean.")} />
                              )}

                              {canSpvBriefAction && (
                                <div className="flex flex-col gap-2">
                                  <ActionButton icon="playlist_add_check" label="Force Queue" disabled={!!busy} onClick={() => run("force", () => forceContinueOddsTask(task.id), "Task masuk queue.")} />
                                  <ActionButton icon="cancel" label="Cancel" danger disabled={!note || !!busy} onClick={() => run("cancelBrief", () => cancelOddsBrief(task.id, note), "Task dibatalkan SPV.")} />
                                </div>
                              )}


                              {canStartTask && (
                                <ActionButton
                                  icon="play_arrow"
                                  label={isVisibleLeaderRevisionTask ? "Start Revisi SPV" : isClientRevisionTask ? "Start Revisi Client" : "Start Task"}
                                  disabled={!!busy}
                                  onClick={() => run("start", () => startOddsTask(task.id), isVisibleLeaderRevisionTask || isClientRevisionTask ? "Revisi dimulai." : "Task dimulai.")}
                                />
                              )}

                              {canRequestSkip && (
                                <ActionButton
                                  icon="skip_next"
                                  label="Ajukan Skip Antrean"
                                  disabled={!note || !!busy}
                                  onClick={() => run("queueSkip", () => requestOddsQueueSkip(task.id, note), "Permintaan skip dikirim untuk review.")}
                                />
                              )}

                              {canRequestPriority && (
                                <ActionButton
                                  icon="priority_high"
                                  label="Ajukan Prioritas Antrean"
                                  disabled={!note || !!busy}
                                  onClick={() => run("queuePriority", () => requestOddsQueuePriority(task.id, note), "Permintaan prioritas dikirim untuk approval Leader.")}
                                />
                              )}

                              {canReviewPriority && pendingPriorityRequest && (
                                <div className="flex flex-col gap-2">
                                  <p className="rounded-lg border border-cu-warning/20 bg-cu-warning/10 px-3 py-2 text-sm text-cu-warning">Alasan Client: {pendingPriorityRequest.reason}</p>
                                  <ActionButton icon="check" label="Approve Prioritas" disabled={!!busy} onClick={() => run("priorityApprove", () => reviewOddsQueuePriority(pendingPriorityRequest.id, "approved", note || undefined), "Prioritas antrean disetujui.")} />
                                  <ActionButton icon="close" label="Tolak Prioritas" danger disabled={!note || !!busy} onClick={() => run("priorityReject", () => reviewOddsQueuePriority(pendingPriorityRequest.id, "rejected", note), "Prioritas antrean ditolak.")} />
                                </div>
                              )}

                              {canSpvResultReview && (
                                <div className="flex flex-col gap-2">
                                  <ActionButton icon="check" label="Leader ACC" disabled={!!busy} onClick={() => run("spvOk", () => leaderReviewOddsTask(task.id, "approved", note || undefined), "Leader approve.")} />
                                  <ActionButton icon="edit_note" label="Leader Revisi" disabled={!note || !!busy} onClick={() => run("spvRev", () => leaderReviewOddsTask(task.id, "revision", note), "Revisi Leader dibuat.")} />
                                </div>
                              )}

                              {canClientResultReview && (
                                <div className="space-y-2">
                                  <div className="flex flex-col gap-2">
                                    <select
                                      value={rating}
                                      onChange={(event) => setRating(event.target.value)}
                                      className={`h-10 w-full rounded-lg border px-3 text-sm outline-none ${dark ? "bg-[#0e0e0e] border-white/10 text-white focus:border-cu-info" : "bg-white border-cu-border focus:border-cu-info"}`}
                                    >
                                      {[5, 4, 3, 2, 1].map((value) => (
                                        <option key={value} value={value}>{value} Star</option>
                                      ))}
                                    </select>
                                    <ActionButton
                                      icon="star"
                                      label="ACC + Rating"
                                      disabled={!!busy}
                                      onClick={() => run(
                                        "clientOk",
                                        async () => {
                                          await clientReviewOddsTask(task.id, "approved", note || undefined);
                                          await rateOddsTask(task.id, Number(rating), note || undefined);
                                        },
                                        "Client approve dan rating tersimpan."
                                      )}
                                    />
                                  </div>
                                  <ActionButton icon="rate_review" label="Client Revisi" disabled={!note || !!busy} onClick={() => run("clientRev", () => clientReviewOddsTask(task.id, "revision", note, "normal"), "Revisi client dibuat.")} />
                                </div>
                              )}

                              {canRequestCancel && (
                                <ActionButton
                                  icon="cancel"
                                  label="Cancel Task"
                                  danger
                                  disabled={!note || !!busy}
                                  onClick={() => run("clientCancel", () => requestOddsCancel(task.id, note), "Permintaan cancel diproses.")}
                                />
                              )}
                            </div>
                          </div>
                      </div>

                      <div className="order-1 flex min-h-0 flex-col gap-4 lg:contents">
                      <div className="grid h-fit w-full min-w-0 grid-cols-3 content-start gap-x-1 gap-y-3 pt-3 lg:col-span-1 lg:order-1 lg:justify-self-stretch lg:self-start">
                        {[
                          { icon: "cancel", label: "Cancel Task", color: "text-cu-danger", surface: "border-cu-danger/20 bg-cu-danger/10", enabled: canRequestCancel, visible: true },
                          { icon: "fact_check", label: "Check Brief", color: "text-cu-info", surface: "border-cu-info/20 bg-cu-info/10", enabled: canReturnBrief || canAcceptBrief, visible: true },
                          { icon: "rate_review", label: "Review", color: "text-cu-info", surface: "border-cu-info/20 bg-cu-info/10", enabled: canSpvResultReview || canClientResultReview, visible: true },
                          { icon: "play_arrow", label: "Mulai / Skip", color: "text-cu-info", surface: "border-cu-info/20 bg-cu-info/10", enabled: canStartTask || canRequestSkip, visible: canStartTask || canRequestSkip },
                          { icon: "priority_high", label: "Prioritas", color: "text-cu-warning", surface: "border-cu-warning/20 bg-cu-warning/10", enabled: canRequestPriority || canReviewPriority, visible: true },
                          { icon: "upload", label: "Kumpulkan", color: "text-cu-info", surface: "border-cu-info/20 bg-cu-info/10", enabled: canSubmitOutput, visible: canSubmitOutput },
                          { icon: "swap_horiz", label: "Reassign", color: "text-cu-muted", surface: "border-cu-border bg-cu-panel-soft", enabled: canReassignTask, visible: true },
                          { icon: "event_repeat", label: "Deadline", color: "text-cu-info", surface: "border-cu-info/20 bg-cu-info/10", enabled: canExtendDeadline, visible: true },
                          { icon: "task_alt", label: "Selesai", color: "text-cu-success", surface: "border-cu-success/20 bg-cu-success/10", enabled: false, visible: true },
                        ].filter(({ visible }) => visible).map(({ icon, label, color, surface, enabled }) => (
                          <button key={label} type="button" disabled={!enabled || !!busy} onClick={() => {
                            if (label === "Kumpulkan") {
                              setActiveTab("output");
                              setSelectedAction(null);
                              return;
                            }
                            setSelectedAction((current) => current === label ? null : label);
                          }} className={`flex w-16 min-w-0 flex-col items-center gap-2 text-center text-[10px] font-semibold leading-3 text-cu-ink disabled:cursor-not-allowed disabled:opacity-40 ${selectedAction === label ? "opacity-100" : ""}`}>
                            <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl border transition hover:brightness-95 ${color} ${surface} ${selectedAction === label ? "ring-2 ring-cu-info ring-offset-1 ring-offset-white" : ""}`}><MaterialIcon name={icon} size="sm" /></span>
                            {label}
                          </button>
                        ))}
                      </div>
                      {/* Column 2: Reassign Designer */}
                      {selectedAction === "Reassign" && canReassignTask && <div className="h-full flex flex-1 flex-col lg:col-span-3 lg:order-2">
                        <div className="space-y-3 flex-grow flex flex-col justify-between h-full">
                          <div className="flex items-center gap-2 text-sm font-semibold text-cu-ink mb-3">
                            <MaterialIcon name="swap_horiz" size="sm" />
                            Reassign Designer
                          </div>
                            <div className="space-y-3 flex-1 flex flex-col justify-end">
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setReassignDropdownOpen(!reassignDropdownOpen)}
                                  className={`min-h-11 w-full rounded-xl border px-3 text-sm outline-none flex items-center justify-between transition ${dark ? "bg-[#0e0e0e] border-white/10 text-white focus:border-cu-info" : "bg-white border-cu-border focus:border-cu-info"}`}
                                >
                                  <span className={`truncate ${reassignDesignerId ? "text-cu-ink font-medium" : "text-cu-muted"}`}>
                                    {reassignDesignerId
                                      ? designerProfiles.find(d => String(d.user_id) === String(reassignDesignerId))?.user?.name ?? `Designer #${reassignDesignerId}`
                                      : "Pilih desainer"}
                                  </span>
                                  <MaterialIcon name="expand_more" size="sm" className={`text-cu-muted transition-transform duration-200 ${reassignDropdownOpen ? "rotate-180" : ""}`} />
                                </button>

                                {reassignDropdownOpen && (
                                  <div className={`absolute left-0 right-0 bottom-full mb-1.5 max-h-48 overflow-y-auto rounded-lg border shadow-lg z-50 p-1 flex flex-col gap-0.5 ${dark ? "bg-[#171717] border-white/10" : "bg-white border-cu-border"}`}>
                                    {reassignTargets.length === 0 ? (
                                      <div className="p-3 text-sm text-cu-muted text-center italic">Tidak ada desainer tersedia</div>
                                    ) : (
                                      reassignTargets.map((profile) => {
                                        const capacityMinutes = 420;
                                        const percentage = Math.round(Math.min(profile.current_load_minutes || 0, capacityMinutes) / capacityMinutes * 100);
                                        const isOff = profile.status === "off";
                                        
                                        let badgeColor = "bg-green-500/10 text-green-500 border border-green-500/20";
                                        let badgeText = `Available (${percentage}%)`;
                                        if (isOff) {
                                          badgeColor = "bg-red-500/10 text-red-500 border border-red-500/20";
                                          badgeText = "Cuti";
                                        } else if (percentage >= 100) {
                                          badgeColor = "bg-red-500/10 text-red-500 border border-red-500/20";
                                          badgeText = `Full (${percentage}%)`;
                                        } else if (percentage >= 70) {
                                          badgeColor = "bg-amber-500/10 text-amber-500 border border-amber-500/20";
                                          badgeText = `Busy (${percentage}%)`;
                                        }

                                        return (
                                          <button
                                            key={profile.id}
                                            type="button"
                                            onClick={() => {
                                              setReassignDesignerId(String(profile.user_id));
                                              setReassignDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition text-left ${dark ? "hover:bg-white/5 text-white" : "hover:bg-slate-50 text-cu-ink"}`}
                                          >
                                            <span className="font-medium truncate mr-2">{profile.user?.name ?? `Designer #${profile.user_id}`}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${badgeColor}`}>
                                              {badgeText}
                                            </span>
                                          </button>
                                        );
                                      })
                                    )}
                      </div>
                                )}
                              </div>
                              <ActionButton
                                icon="swap_horiz"
                                label="Reassign Task"
                                disabled={!reassignDesignerId || !!busy}
                                onClick={() => run("reassign", () => reassignOddsTask(task.id, Number(reassignDesignerId)), "Task berhasil direassign.")}
                              />
                            </div>
                          </div>
                        </div>}

                      {/* Column 3: Perpanjang Deadline */}
                      {selectedAction === "Deadline" && canExtendDeadline && <div className="h-full flex flex-1 flex-col lg:col-span-3 lg:order-2">
                        <div className="space-y-3 flex-grow flex flex-col justify-between h-full">
                          <div className="flex items-center gap-2 text-sm font-semibold text-cu-ink mb-3">
                            <MaterialIcon name="event_repeat" size="sm" />
                            Perpanjang Deadline
                          </div>
                            <div className="space-y-3 flex-1 flex flex-col justify-end">
                              <div className="relative">
                                <div
                                  className={`min-h-11 w-full rounded-xl border px-3 text-sm flex items-center justify-between pointer-events-none transition ${dark ? "bg-[#0e0e0e] border-white/10 text-white" : "bg-white border-cu-border"}`}
                                >
                                  <span className={`truncate ${extendedDeadline ? "text-cu-ink font-medium" : "text-cu-muted"}`}>
                                    {extendedDeadline
                                      ? formatOddsDate(extendedDeadline, true)
                                      : "Pilih tanggal & waktu"}
                                  </span>
                                  <MaterialIcon name="calendar_today" size="sm" className="text-cu-muted" />
                                </div>
                                <input
                                  type="datetime-local"
                                  value={extendedDeadline}
                                  onChange={(event) => setExtendedDeadline(event.target.value)}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                                  aria-label="Deadline baru"
                                />
                              </div>
                              <ActionButton
                                icon="event_repeat"
                                label="Simpan Deadline Baru"
                                disabled={!extendedDeadline || !!busy}
                                onClick={() => run("deadline", () => extendOddsTaskDeadline(task.id, extendedDeadline, note || undefined), "Deadline task diperpanjang.")}
                              />
                            </div>
                          </div>
                      </div>}
                      </div>
                    </div>
                </OddsTaskActionsPanel>
                </QaComponentBoundary>
              )}
              {activeTab === "info" && (
                <QaComponentBoundary label="InfoTaskMobile">
                <section className={`${cardClass} min-h-0 !overflow-y-auto !overflow-x-hidden lg:hidden`} aria-label="Info Task">
                  <h2 className="mb-4 text-base font-bold text-cu-ink">{task.design_purpose}</h2>
                  <div className="flex-1 space-y-4">
                    <InfoRow label="Kategori" value={task.category?.name ?? "-"} />
                    <InfoRow label="Tanggal Submit" value={formatOddsDate(task.created_at, true)} />
                    <InfoRow label="Perequest" value={task.requester?.name?.trim().split(/\s+/)[0] ?? "-"} />
                    <InfoRow label="Desainer" value={assignedDesigner?.name?.trim().split(/\s+/)[0] ?? "Belum ada desainer"} />
                    <InfoRow label="Deadline" value={formatOddsDate(task.deadline, true)} />
                    <InfoRow label="Status" value={statusLabel(task.status)} />
                    <InfoRow label="Jenis task" value={statusLabel(task.task_type)} />
                    <InfoRow label="Batas waktu pengerjaan" value={(() => {
                      const total = task.category_snapshot?.sla_minutes ?? 0;
                      const days = Math.floor(total / (60 * 24));
                      const hours = Math.floor((total % (60 * 24)) / 60);
                      const mins = total % 60;
                      const parts = [];
                      if (days > 0) parts.push(`${days} Hari`);
                      if (hours > 0) parts.push(`${hours} Jam`);
                      if (mins > 0) parts.push(`${mins} Menit`);
                      return parts.length > 0 ? parts.join(" ") : "0 Menit";
                    })()} />
                    <InfoRow label="Status antrean" value={queue?.queue_status ?? "-"} />
                    <InfoRow label="Estimasi mulai" value={formatOddsDate(queue?.estimated_start_at, true)} />
                    <InfoRow label="Revisi client" value={task.normal_revision_count > 0 ? `${task.normal_revision_count}x` : "-"} />
                    <InfoRow label="Revisi Brief" value={task.brief_return_count > 0 ? `${task.brief_return_count}x` : "-"} />
                    {!isClientSideView && <InfoRow label="Revisi dari SPV" value={task.leader_revision_count > 0 ? `${task.leader_revision_count}x` : "-"} />}
                    {!isClientSideView && <InfoRow label="Ada masalah kualitas?" value={task.quality_issue_flag ? "Ya" : "Tidak"} />}
                  </div>
                </section>
                </QaComponentBoundary>
              )}
            </div>
          </div>
          </div>

        <div className="hidden lg:flex lg:col-span-1 flex-col gap-4">
        <QaComponentBoundary label="TaskTimer" tone="primary">
        <TaskTimer>{formatDuration(timerTotals.work)}</TaskTimer>
        </QaComponentBoundary>
        <QaComponentBoundary label="InfoTaskDesktop">
        <section className={cardClass + " hidden lg:flex lg:col-span-1"}>
          <h2 className="mb-4 text-base font-bold text-cu-ink">Info Task</h2>
          <div className="flex-1 space-y-4">
            <InfoRow label="Jenis task" value={statusLabel(task.task_type)} />
            <InfoRow label="Batas waktu pengerjaan" value={(() => {
              const total = task.category_snapshot?.sla_minutes ?? 0;
              const days = Math.floor(total / (60 * 24));
              const hours = Math.floor((total % (60 * 24)) / 60);
              const mins = total % 60;
              const parts = [];
              if (days > 0) parts.push(`${days} Hari`);
              if (hours > 0) parts.push(`${hours} Jam`);
              if (mins > 0) parts.push(`${mins} Menit`);
              return parts.length > 0 ? parts.join(" ") : "0 Menit";
            })()} />
            <InfoRow label="Status antrean" value={queue?.queue_status ?? "-"} />
            <InfoRow label="Estimasi mulai" value={formatOddsDate(queue?.estimated_start_at, true)} />
            <InfoRow label="Revisi client" value={task.normal_revision_count > 0 ? `${task.normal_revision_count}x` : "-"} />
            <InfoRow label="Revisi Brief" value={task.brief_return_count > 0 ? `${task.brief_return_count}x` : "-"} />
            {!isClientSideView && <InfoRow label="Revisi dari SPV" value={task.leader_revision_count > 0 ? `${task.leader_revision_count}x` : "-"} />}
            {!isClientSideView && (
              <InfoRow label="Ada masalah kualitas?" value={task.quality_issue_flag ? "Ya" : "Tidak"} />
            )}
          </div>
        </section>
        </QaComponentBoundary>
        </div>
      </div>
    </div>
  );
}

export default function OddsTaskDetailView() {
  return <DetailContent />;
}

function formatLogDate(value: string | null | undefined): string {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(value));
}
