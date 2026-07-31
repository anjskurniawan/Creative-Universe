"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { MaterialIcon } from "@/components/ui/material-icon";
import { OddsRichTextEditor, RichTextViewer, stripRichText } from "@/components/odds-rich-text-editor";
import { OddsTaskChat } from "@/components/odds-task-chat";
import { TaskFeedbackToast, TaskDiscussionPanel } from "@/components/odds/TaskCard";
import { useAuth } from "@/providers/auth-provider";
import { HeaderTitle } from "@/components/typography/header-title";
import { useOddsTheme } from "../odds-theme-context";
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
  requestOddsQueueSkip,
  returnOddsBrief,
  spvReviewOddsTask,
  startOddsTask,
  statusLabel,
  submitOddsResult,
  updateOddsBrief,
} from "@/features/odds/api";

import { OddsBriefViewer, isTableBriefTask } from "@/features/odds/components/brief-details";

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
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

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
    ? "border border-white/10 bg-[#171717]/85 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.3)] p-4 md:p-5 text-white rounded-2xl flex-grow flex flex-col min-h-0 overflow-hidden"
    : "border border-[#BDEAFF]/60 bg-white shadow-[0_8px_30px_rgba(0,164,255,0.04)] p-4 md:p-5 text-[#04044A] rounded-2xl flex-grow flex flex-col min-h-0 overflow-hidden";

  const textLabelClass = retro
    ? "block text-[10px] font-bold uppercase tracking-wider text-[#24252b]"
    : dark
    ? "block text-[10px] font-bold uppercase tracking-wider text-[#7d827f]"
    : "block text-[10px] font-bold uppercase tracking-wider text-[#04044A]/60";

  const textValueClass = retro
    ? "mt-1 block font-extrabold text-sm text-[#24252b]"
    : dark
    ? "mt-1 block font-semibold text-sm text-[#f1f1f1]"
    : "mt-1 block font-semibold text-sm text-[#04044A]";

  const navClass = retro
    ? "flex gap-2 overflow-x-auto rounded-none border-2 border-[#24252b] bg-[#eceee6] p-2 shadow-[2px_2px_0px_#24252b] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    : dark
    ? "flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-[#171717]/85 backdrop-blur-md p-2 shadow-lg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    : "flex gap-2 overflow-x-auto rounded-2xl border border-[#BDEAFF]/60 bg-white p-2 shadow-[0_8px_30px_rgba(0,164,255,0.03)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

  const tabButtonClass = (tab: string) => {
    const active = activeTab === tab;
    if (retro) {
      return active
        ? "border-[#ba0dcb] text-[#ba0dcb]"
        : "border-transparent text-[#24252b]/60 hover:text-[#24252b]";
    }
    if (dark) {
      return active
        ? "border-[#b0ff5e] text-[#b0ff5e]"
        : "border-transparent text-[#7d827f] hover:text-white";
    }
    return active
      ? "border-[#00A4FF] text-[#00A4FF]"
      : "border-transparent text-[#04044A]/60 hover:text-[#00A4FF]";
  };

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { user, hasPermission } = useAuth();
  const [task, setTask] = useState<OddsTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const busyRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
 
  const [briefText, setBriefText] = useState("");
  const [note, setNote] = useState("");
  const [resultNotes, setResultNotes] = useState("");
  const [assetUrl, setAssetUrl] = useState("");
  const [rating, setRating] = useState("5");
  const [timerNow, setTimerNow] = useState(() => Date.now());
  const [designerProfiles, setDesignerProfiles] = useState<OddsDesignerProfile[]>([]);
  const [reassignDesignerId, setReassignDesignerId] = useState("");
  const [reassignDropdownOpen, setReassignDropdownOpen] = useState(false);
  const [extendedDeadline, setExtendedDeadline] = useState("");
  const [activeTab, setActiveTab] = useState<
    "brief" | "output" | "revision" | "discussion" | "status" | "audit" | "actions"
  >("brief");

  const canReviewBrief = hasPermission("review-odds-briefs");
  const canStart = hasPermission("start-odds-tasks");
  const canSubmit = hasPermission("submit-odds-results");
  const canSpvReview = hasPermission("review-odds-spv");
  const canClientReview = hasPermission("review-odds-client");
  const canManageEscalations = hasPermission("manage-odds-escalations");
  const canRequestQueueSkip = hasPermission("request-odds-queue-skip");

  const latestResult = useMemo(() => {
    return [...(task?.results ?? [])].sort((a, b) => b.version_number - a.version_number)[0];
  }, [task]);

  const loadTask = useCallback(async (silent = false) => {
    if (!id) return;
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await getOddsTask(id);
      setTask(data);
      setBriefText(data.brief?.content ?? data.brief_text ?? "");
    } catch (err) {
      setError(oddsError(err));
    } finally {
      if (!silent) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadTask();
    }, 0);
    const interval = window.setInterval(() => {
      void loadTask(true);
    }, 10000);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, [loadTask]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimerNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

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

  if (!id) {
    return <ShellMessage message="ID task tidak ditemukan." />;
  }

  if (loading && !task) {
    return <ShellMessage message="Memuat detail ODDS..." muted />;
  }

  if (!task) {
    return <ShellMessage message={error ?? "Task tidak ditemukan."} />;
  }

  const assignedDesigner = task.assigned_designer ?? task.assignedDesigner;
  const queue = task.current_queue ?? task.currentQueue;
  const isRequester = task.requester?.id === user?.id;
  const isAssignedDesigner = assignedDesigner?.id === user?.id;
  const isClientSideView = canClientReview && isRequester && !canReviewBrief && !canSpvReview;
  const isLeaderRevisionTask = task.task_type === "leader_revision";
  const isClientRevisionTask = ["client_revision", "extra_revision", "urgent_revision"].includes(task.task_type);
  const isVisibleLeaderRevisionTask = isLeaderRevisionTask && !isClientSideView;
  const visibleRevisions = isClientSideView
    ? (task.revisions ?? []).filter((revision) => revision.revision_type !== "leader")
    : (task.revisions ?? []);
  const visibleLatestRevision = [...visibleRevisions].sort((a, b) => b.id - a.id)[0];
  const activeRevision = isVisibleLeaderRevisionTask || isClientRevisionTask ? visibleLatestRevision : null;
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
  const isDeadlineOverdue = Boolean(task.deadline && new Date(task.deadline).getTime() < timerNow && task.status !== "done");
  const outputTitle = isVisibleLeaderRevisionTask ? "Output Revisi Leader Creative" : isClientRevisionTask ? "Output Revisi Client" : "Output";
  const outputNotice = isVisibleLeaderRevisionTask
    ? "Task sedang dalam revisi Leader Creative. Setelah disubmit, hasil revisi kembali masuk review Leader Creative."
    : isClientRevisionTask
      ? "Task sedang dalam revisi client. Kirim hasil revisi melalui form Output di sisi kiri."
      : "Task sedang dikerjakan. Kirim output melalui form Output di sisi kiri.";
  const submitButtonLabel = isVisibleLeaderRevisionTask || isClientRevisionTask ? "Submit Revisi" : "Submit";
  const submitResultMessage = isVisibleLeaderRevisionTask
    ? "Revisi dikirim ke Leader Creative."
    : isClientRevisionTask
      ? "Revisi dikirim ke client."
      : "Output dikirim ke Leader Creative.";
  const canEditBrief = canClientReview && isRequester && task.status === "brief_revision_requested";
  const canReturnBrief = canReviewBrief && isAssignedDesigner && task.status === "submitted";
  const canAcceptBrief = canReviewBrief && isAssignedDesigner && task.status === "submitted";
  const canStartTask = canStart && isAssignedDesigner && ["queued", "ready_to_start"].includes(task.status);
  const canSubmitOutput = canSubmit && isAssignedDesigner && task.status === "in_progress";
  const canSpvBriefAction = canSpvReview && ["submitted", "brief_revision_requested"].includes(task.status);
  const canSpvResultReview = canSpvReview && task.status === "spv_review";
  const canClientResultReview = canClientReview && isRequester && task.status === "client_review";
  const canRequestCancel = canClientReview && isRequester && !["done", "cancelled", "cancelled_by_spv"].includes(task.status);
  const canReassignTask = canManageEscalations && !["done", "cancelled", "cancelled_by_spv"].includes(task.status);
  const pendingSkipRequest = (task.skip_requests ?? task.skipRequests ?? []).find((request) => request.status === "pending");
  const canRequestSkip = canRequestQueueSkip
    && isAssignedDesigner
    && ["queued", "ready_to_start"].includes(task.status)
    && !pendingSkipRequest;
  const canExtendDeadline = canManageEscalations && !["done", "cancelled", "cancelled_by_spv"].includes(task.status);
  const reassignTargets = designerProfiles.filter((profile) => profile.status !== "off" && profile.user_id !== assignedDesigner?.id);
  const normalRevisionLimit = task.category?.normal_revision_limit ?? 2;
  const isLastNormalRevisionChance = canClientResultReview
    && !task.extra_revision_used_at
    && task.normal_revision_count + 1 >= normalRevisionLimit;
  const isUrgentFinalRevisionChance = canClientResultReview
    && Boolean(task.extra_revision_used_at)
    && !task.urgent_revision_used_at;
  const canShowNoteInput = canReturnBrief || canSpvBriefAction || canSpvResultReview || canClientResultReview || canRequestCancel || canRequestSkip || canExtendDeadline;
  const showOutputSection = Boolean(visibleLatestResult) || canSubmitOutput;
  const showRevisionSection = visibleRevisions.length > 0;

  const saveBrief = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canEditBrief) return;
    if (!stripRichText(briefText)) return;
    void run("brief", () => updateOddsBrief(task.id, briefText), "Brief diperbarui.");
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
    <div className="flex w-full h-full min-h-0 flex-col gap-4 lg:gap-6 p-4 overflow-hidden">
      <TaskFeedbackToast
        toast={error ? { status: "error", message: error } : notice ? { status: "success", message: notice } : null}
        onClose={() => { setError(null); setNotice(null); }}
      />
      <HeaderTitle>{task.design_purpose}</HeaderTitle>

      <div className="grid gap-5 lg:grid-cols-4 items-stretch flex-1 min-h-0 h-[calc(100vh-200px)] lg:h-[calc(100vh-220px)]">
        <div className="lg:col-span-3 flex flex-col gap-5 h-full min-h-0">
          {/* Details Box */}
          <div className={`${cardClass} flex flex-row flex-nowrap items-stretch gap-x-6 overflow-x-auto md:p-5 flex-grow-0`}>
            <div className="w-fit shrink-0 border-r border-cu-border pr-6">
              <span className={textLabelClass}>Kategori</span>
              <span className={textValueClass}>{task.category?.name ?? "-"}</span>
            </div>
            <div className="w-fit shrink-0 border-r border-cu-border pr-6">
              <span className={textLabelClass}>Tanggal Submit</span>
              <span className={textValueClass}>{formatOddsDate(task.created_at, true)}</span>
            </div>
            <div className="w-fit shrink-0 border-r border-cu-border pr-6">
              <span className={textLabelClass}>Perequest</span>
              <span className={textValueClass}>{task.requester?.name?.trim().split(/\s+/)[0] ?? "-"}</span>
            </div>
            <div className="w-fit shrink-0 border-r border-cu-border pr-6">
              <span className={textLabelClass}>Desainer</span>
              <span className={textValueClass}>{assignedDesigner?.name?.trim().split(/\s+/)[0] ?? "Belum ada desainer"}</span>
            </div>
            <div className="w-fit shrink-0 border-r border-cu-border pr-6">
              <span className={textLabelClass}>Deadline</span>
              <span className={textValueClass}>{formatOddsDate(task.deadline, true)}</span>
            </div>
            <div>
              <span className={textLabelClass}>Status</span>
              <span className={textValueClass}>{statusLabel(task.status)}</span>
            </div>
          </div>

          {/* Grouped Tab + Pane Wrapper */}
          <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-hidden">
            <nav className={navClass} aria-label="Detail task">
              {([
                ["brief", "description", "Brief"],
                ["output", "folder_open", "Output"],
                ["revision", "edit_note", "Revisi"],
                ["discussion", "chat", "Diskusi"],
                ["audit", "timer", "Audit"],
                ["actions", "bolt", "Aksi"],
              ] as const).map(([tab, icon, label]) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-t-xl rounded-b-none px-5 text-sm font-semibold border-b-2 transition-all duration-200 ${tabButtonClass(tab)}`}
                >
                  <MaterialIcon name={icon} size="sm" />
                  {label}
                </button>
              ))}
            </nav>

            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {activeTab === "brief" && (
                <section className={cardClass}>
                  {task.brief?.last_return_note && (
                    <div className="mb-4 rounded-lg border border-cu-danger/20 bg-cu-danger/10 px-3 py-2 text-sm text-cu-danger">
                      Catatan return terakhir: {task.brief.last_return_note}
                    </div>
                  )}
                  <form onSubmit={saveBrief} className="flex-1 flex flex-col min-h-0 justify-between space-y-3">
                    {canEditBrief ? (
                      <OddsRichTextEditor value={briefText} onChange={setBriefText} />
                    ) : (
                      <OddsBriefViewer task={task} briefText={briefText} theme={theme} />
                    )}
                    {canEditBrief ? (
                      <div className="flex justify-between items-center mt-auto gap-4">
                        <span className="text-sm text-cu-muted">Return {task.brief_return_count}</span>
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
                      <div className="flex justify-between items-center mt-auto gap-4 text-sm text-cu-muted">
                        <p>
                          Brief hanya bisa diubah client saat desainer meminta update brief.
                        </p>
                        <span className="shrink-0 font-medium">Return {task.brief_return_count}</span>
                      </div>
                    )}
                  </form>
                </section>
              )}

              {activeRevision && activeTab === "revision" && (
                <section className={cardClass}>
                  <p className="whitespace-pre-wrap text-sm text-cu-ink flex-1 overflow-y-auto">{activeRevision.notes}</p>
                  {isVisibleLeaderRevisionTask && (
                    <p className="text-sm text-cu-muted mt-auto pt-3">
                      Submit revisi ini akan kembali masuk review SPV sampai SPV approve.
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-cu-muted">
                    <span className="rounded-full border border-cu-border bg-white/5 px-2.5 py-1 capitalize">{statusLabel(activeRevision.revision_type)}</span>
                    <span className="rounded-full border border-cu-border bg-white/5 px-2.5 py-1 capitalize">{activeRevision.status}</span>
                  </div>
                </section>
              )}

              {showOutputSection && activeTab === "output" && (
                <section className={cardClass}>
                  <div className="flex-1 overflow-y-auto">
                    {visibleLatestResult ? (
                      <div className="rounded-lg border border-cu-border p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-cu-ink">Versi {visibleLatestResult.version_number}</p>
                            <p className="text-sm text-cu-muted">{visibleLatestResult.status} &middot; {formatOddsDate(visibleLatestResult.submitted_at, true)}</p>
                          </div>
                          <span className="rounded-full border border-cu-border px-2.5 py-1 text-xs text-cu-muted">v{visibleLatestResult.version_number}</span>
                        </div>
                        {visibleLatestResult.result_notes && <p className="mt-3 whitespace-pre-wrap text-sm text-cu-ink">{visibleLatestResult.result_notes}</p>}
                        {(visibleLatestResult.asset_links ?? []).map((asset) => (
                          <a key={asset.id} href={asset.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-cu-info">
                            <MaterialIcon name="link" size="xs" />
                            {asset.label}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-lg border border-dashed border-cu-border p-4 text-sm text-cu-muted">Belum ada output.</p>
                    )}
                  </div>

                  {canSubmitOutput && (
                    <form onSubmit={submitResult} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                      <input
                        value={resultNotes}
                        onChange={(event) => setResultNotes(event.target.value)}
                        placeholder={isVisibleLeaderRevisionTask ? "Catatan revisi SPV" : isClientRevisionTask ? "Catatan revisi client" : "Catatan output"}
                        className={`h-10 rounded-lg border px-3 text-sm outline-none ${dark ? "bg-[#0e0e0e] border-white/10 text-white focus:border-cu-info" : "border-cu-border focus:border-cu-info"}`}
                        aria-label="Catatan output"
                      />
                      <input
                        value={assetUrl}
                        onChange={(event) => setAssetUrl(event.target.value)}
                        placeholder="https://output-link"
                        className={`h-10 rounded-lg border px-3 text-sm outline-none ${dark ? "bg-[#0e0e0e] border-white/10 text-white focus:border-cu-info" : "border-cu-border focus:border-cu-info"}`}
                        aria-label="Link aset"
                      />
                      <button
                        type="submit"
                        disabled={busy === "result"}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cu-info px-4 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        <MaterialIcon name="upload" size="sm" />
                        {submitButtonLabel}
                      </button>
                    </form>
                  )}
                </section>
              )}

              {showRevisionSection && activeTab === "revision" && (
                <section className={cardClass}>
                  <div className="space-y-2 flex-1 overflow-y-auto">
                    {visibleRevisions.map((revision) => (
                      <div key={revision.id} className={`rounded-lg border px-3 py-2 ${dark ? "border-white/5 bg-white/5" : "border-cu-border"}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium capitalize text-cu-ink">{statusLabel(revision.revision_type)}</span>
                          <span className="text-xs text-cu-muted">{revision.status}</span>
                        </div>
                        <p className="mt-1 text-sm text-cu-muted">{revision.notes}</p>
                      </div>
                    ))}
                    {visibleRevisions.length === 0 && <p className="text-sm text-cu-muted">Belum ada revisi.</p>}
                  </div>
                </section>
              )}

              {activeTab === "discussion" && (
                <section className={cardClass}>
                  <TaskDiscussionPanel taskId={task.id} userId={user?.id} taskStatus={task.status} />
                </section>
              )}

               {!isClientSideView && activeTab === "audit" && (
                <section className={cardClass}>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <TimerTile label={`Work (SLA: ${slaMinutes}m)`} value={formatDuration(timerTotals.work)} />
                    <TimerTile label="Revisi" value={formatDuration(timerTotals.revision)} />
                    <TimerTile label="Review Leader" value={formatDuration(timerTotals.spv_review)} />
                    <TimerTile label="Review Client" value={formatDuration(timerTotals.client_review)} />
                  </div>

                  {isSlaOverdue && (
                    <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                      ⚠️ Overdue SLA: Waktu pengerjaan awal desainer ({formatDuration(timerTotals.work)}) melebihi SLA Kategori ({slaMinutes} menit).
                    </p>
                  )}

                  {isDeadlineOverdue && (
                    <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
                      ⏳ Overdue Deadline: Target deadline client terlewati.
                      {timerTotals.client_review > timerTotals.work && timerTotals.client_review > timerTotals.spv_review && " (Bottleneck terbesar: Menunggu Review Client)"}
                      {timerTotals.spv_review > timerTotals.work && timerTotals.spv_review > timerTotals.client_review && " (Bottleneck terbesar: Menunggu Review Leader Creative)"}
                      {timerTotals.work > timerTotals.spv_review && timerTotals.work > timerTotals.client_review && " (Bottleneck terbesar: Pengerjaan Desainer)"}
                    </p>
                  )}

                  {task.quality_issue_flag && (
                    <p className="mt-3 rounded-lg border border-cu-warning/20 bg-cu-warning/10 px-3 py-2 text-sm text-cu-warning">
                      Quality issue: {task.quality_issue_note ?? "Revisi SPV melewati batas wajar."}
                    </p>
                  )}
                  <div className="mt-3 space-y-2 flex-1 overflow-y-auto">
                    {designerTimeLogs.slice(-6).reverse().map((log) => (
                      <div key={log.id} className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs ${dark ? "border-white/5 bg-white/5" : "border-cu-border"}`}>
                        <div>
                          <p className="font-semibold capitalize text-cu-ink">{statusLabel(log.log_type)}</p>
                          <p className="text-cu-muted">{log.stopped_at ? "Selesai" : "Berjalan"}</p>
                        </div>
                        <span className="font-medium text-cu-muted">{formatDuration(durationSeconds(log, timerNow))}</span>
                      </div>
                    ))}
                    {designerTimeLogs.length === 0 && <p className="rounded-lg border border-dashed border-cu-border px-3 py-3 text-sm text-cu-muted">Belum ada timer pengerjaan desainer.</p>}
                  </div>
                  <p className="text-sm text-cu-muted mt-auto">
                    Transparansi pencatatan durasi per fase untuk melacak bottleneck pengerjaan dan SLA desainer.
                  </p>
                </section>
              )}

              {activeTab === "actions" && (
                <section className={cardClass}>
                  {!canEditBrief && !canReturnBrief && !canAcceptBrief && !canSpvBriefAction && !canStartTask && !canRequestSkip && !canSubmitOutput && !canSpvResultReview && !canClientResultReview && !canRequestCancel && !canReassignTask && !canExtendDeadline ? (
                    <p className="rounded-lg border border-dashed border-cu-border px-3 py-3 text-sm text-cu-muted">
                      Belum ada aksi untuk role ini pada status task sekarang.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch flex-1 min-h-0 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {/* Column 1: Main State Actions */}
                      <div className="h-full flex flex-col">
                        <div className="space-y-3 flex-grow flex flex-col justify-between h-full">
                            <div className="space-y-3 flex-grow flex flex-col min-h-0">
                              {canShowNoteInput && (
                                <textarea
                                  value={note}
                                  onChange={(event) => setNote(event.target.value)}
                                  placeholder="Catatan aksi"
                                  className={`w-full flex-grow resize-none rounded-lg border px-3 py-2 text-sm outline-none min-h-[140px] ${dark ? "bg-[#0e0e0e] border-white/10 text-white focus:border-cu-info" : "border-cu-border focus:border-cu-info"}`}
                                />
                              )}

                              {pendingSkipRequest && isAssignedDesigner && (
                                <p className="rounded-lg border border-cu-warning/30 bg-cu-warning/10 px-3 py-2 text-sm text-cu-warning">
                                  Permintaan skip antrean sedang menunggu review SPV/Manajer.
                                </p>
                              )}

                              {canSubmitOutput && (
                                <p className="rounded-lg border border-cu-info/20 bg-cu-info/10 px-3 py-2 text-sm text-cu-info">
                                  {outputNotice}
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

                              {canSpvResultReview && (
                                <div className="flex flex-col gap-2">
                                  <ActionButton icon="check" label="SPV ACC" disabled={!!busy} onClick={() => run("spvOk", () => spvReviewOddsTask(task.id, "approved", note || undefined), "SPV approve.")} />
                                  <ActionButton icon="edit_note" label="SPV Revisi" disabled={!note || !!busy} onClick={() => run("spvRev", () => spvReviewOddsTask(task.id, "revision", note), "Revisi SPV dibuat.")} />
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
                          <p title="Aksi utama digunakan untuk menjalankan, mengembalikan, menyetujui, merevisi, atau membatalkan proses tugas sesuai statusnya." className="mt-4 line-clamp-2 border-t border-cu-border pt-3 text-xs leading-5 text-cu-muted">
                            Aksi utama digunakan untuk menjalankan, mengembalikan, menyetujui, merevisi, atau membatalkan proses tugas sesuai statusnya.
                          </p>
                      </div>

                      {/* Column 2: Reassign Designer */}
                      <div className="h-full flex flex-col">
                        <div className="space-y-3 flex-grow flex flex-col justify-between h-full">
                          <div className="flex items-center gap-2 text-sm font-semibold text-cu-ink mb-3">
                            <MaterialIcon name="swap_horiz" size="sm" />
                            Reassign Designer
                          </div>
                           {canReassignTask ? (
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
                          ) : (
                            <div className="flex-1 flex items-center justify-center">
                              <p className="text-sm text-cu-muted text-center italic">Aksi Reassign tidak tersedia.</p>
                            </div>
                          )}
                          </div>
                          <p title="Reassign Designer digunakan untuk mengganti desainer yang bertanggung jawab atas tugas ini." className="mt-4 line-clamp-2 border-t border-cu-border pt-3 text-xs leading-5 text-cu-muted">
                            Reassign Designer digunakan untuk mengganti desainer yang bertanggung jawab atas tugas ini.
                          </p>
                        </div>

                      {/* Column 3: Perpanjang Deadline */}
                      <div className="h-full flex flex-col">
                        <div className="space-y-3 flex-grow flex flex-col justify-between h-full">
                          <div className="flex items-center gap-2 text-sm font-semibold text-cu-ink mb-3">
                            <MaterialIcon name="event_repeat" size="sm" />
                            Perpanjang Deadline
                          </div>
                          {canExtendDeadline ? (
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
                          ) : (
                            <div className="flex-1 flex items-center justify-center">
                              <p className="text-sm text-cu-muted text-center italic">Perpanjang deadline tidak tersedia.</p>
                            </div>
                          )}
                          </div>
                          <p title="Perpanjang Deadline digunakan untuk mengubah batas waktu pengerjaan tugas." className="mt-4 line-clamp-2 border-t border-cu-border pt-3 text-xs leading-5 text-cu-muted">
                            Perpanjang Deadline digunakan untuk mengubah batas waktu pengerjaan tugas.
                          </p>
                        </div>
                    </div>
                  )}
                </section>
              )}
            </div>
          </div>
        </div>

        <section className={cardClass + " lg:col-span-1"}>
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
            {!isClientSideView && <InfoRow label="Revisi dari SPV" value={task.leader_revision_count > 0 ? `${task.leader_revision_count}x` : "-"} />}
            {!isClientSideView && (
              <InfoRow label="Ada masalah kualitas?" value={task.quality_issue_flag ? "Ya" : "Tidak"} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function OddsDetailPage() {
  return (
    <Suspense fallback={<ShellMessage message="Memuat detail ODDS..." muted />}>
      <DetailContent />
    </Suspense>
  );
}

function ShellMessage({ message, muted = false }: { message: string; muted?: boolean }) {
  return (
    <div className="mx-auto w-full max-w-4xl py-10">
      <div className={`rounded-lg border px-4 py-3 text-sm ${muted ? "border-cu-border text-cu-muted" : "border-cu-danger/20 bg-cu-danger/10 text-cu-danger"}`}>
        {message}
      </div>
      <Link href="/odds" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cu-info">
        <MaterialIcon name="arrow_back" size="xs" />
        ODDS
      </Link>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const { theme } = useOddsTheme();
  const dark = theme === "dark";
  const retro = theme === "retro";

  const borderClass = retro
    ? "border-b border-[#24252b] py-2.5 last:border-b-0"
    : dark
    ? "border-b border-white/5 py-2.5 last:border-b-0"
    : "border-b border-[#BDEAFF]/40 py-2.5 last:border-b-0";

  const labelClass = retro
    ? "text-xs text-[#24252b] font-medium"
    : dark
    ? "text-xs text-[#7d827f]"
    : "text-xs text-[#04044A]/60";

  const valueClass = retro
    ? "text-right text-xs font-bold text-[#24252b]"
    : dark
    ? "text-right text-xs font-semibold text-[#f1f1f1]"
    : "text-right text-xs font-semibold text-[#04044A]";

  return (
    <div className={`flex items-center justify-between ${borderClass}`}>
      <span className={labelClass}>{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

function TimerTile({ label, value }: { label: string; value: string }) {
  const { theme } = useOddsTheme();
  const dark = theme === "dark";
  const retro = theme === "retro";

  const containerClass = retro
    ? "border-2 border-[#24252b] bg-[#eceee6] p-4 aspect-square flex flex-col items-center justify-center text-center shadow-[3px_3px_0px_#24252b] transition-all duration-200"
    : dark
    ? "rounded-2xl border border-white/5 bg-[#0e0e0e]/45 p-4 aspect-square flex flex-col items-center justify-center text-center hover:bg-[#0e0e0e]/70 transition-all duration-200"
    : "rounded-2xl border border-[#BDEAFF]/50 bg-[#F3FAFF]/30 p-4 aspect-square flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:bg-[#F3FAFF]/50 transition-all duration-200";

  const labelClass = retro
    ? "text-[10px] text-[#24252b] font-bold uppercase tracking-wider"
    : dark
    ? "text-[10px] text-[#7d827f] font-bold uppercase tracking-wider"
    : "text-[10px] text-[#04044A]/50 font-bold uppercase tracking-wider";

  const valueClass = retro
    ? "mt-2 text-base font-extrabold text-black md:text-lg"
    : dark
    ? "mt-2 text-base font-extrabold text-[#b0ff5e] md:text-lg"
    : "mt-2 text-base font-bold text-[#00A4FF] md:text-lg";

  return (
    <div className={containerClass}>
      <p className={labelClass}>{label}</p>
      <p className={valueClass}>{value}</p>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  danger = false,
  disabled,
  onClick,
}: {
  icon: string;
  label: string;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const { theme } = useOddsTheme();
  const dark = theme === "dark";
  const retro = theme === "retro";

  let btnClass = "";
  if (retro) {
    btnClass = danger
      ? "border-2 border-[#24252b] bg-[#ff8080] text-black shadow-[2px_2px_0px_#24252b] hover:bg-[#ff9999]"
      : "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b] shadow-[2px_2px_0px_#24252b] hover:bg-[#dfe2d3]";
  } else if (dark) {
    btnClass = danger
      ? "border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/15"
      : "border border-white/10 bg-[#171717] text-[#f1f1f1] hover:bg-white/5";
  } else {
    btnClass = danger
      ? "border border-red-200 bg-red-50 text-red-500 hover:bg-red-100/60 shadow-sm"
      : "border border-[#BDEAFF] bg-white text-[#04044A] hover:bg-[#F3FAFF] hover:text-[#00A4FF] shadow-sm";
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-xl px-3.5 text-xs font-bold uppercase tracking-wider transition disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98] ${btnClass}`}
    >
      <MaterialIcon name={icon} size="sm" />
      {label}
    </button>
  );
}
