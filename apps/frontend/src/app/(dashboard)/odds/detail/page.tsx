"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { MaterialIcon } from "@/components/material-icon";
import { OddsRichTextEditor, RichTextViewer, stripRichText } from "@/components/odds-rich-text-editor";
import { OddsTaskChat } from "@/components/odds-task-chat";
import { useAuth } from "@/providers/auth-provider";
import {
  OddsDesignerProfile,
  OddsTask,
  acceptOddsBrief,
  cancelOddsBrief,
  clientReviewOddsTask,
  forceContinueOddsTask,
  getOddsDesignerProfiles,
  formatOddsDate,
  getOddsTask,
  oddsError,
  rateOddsTask,
  reassignOddsTask,
  requestOddsCancel,
  returnOddsBrief,
  spvReviewOddsTask,
  startOddsTask,
  statusLabel,
  submitOddsResult,
  updateOddsBrief,
} from "@/lib/odds";

function badgeClass(status: string) {
  if (["done", "client_review"].includes(status)) return "bg-cu-success/10 text-cu-success border-cu-success/20";
  if (["cancelled", "cancelled_by_spv", "revision_rejected_by_spv"].includes(status)) {
    return "bg-cu-danger/10 text-cu-danger border-cu-danger/20";
  }
  if (["in_progress", "spv_review", "queued"].includes(status)) return "bg-cu-info/10 text-cu-info border-cu-info/20";
  return "bg-cu-panel-soft text-cu-muted border-cu-border";
}

function durationSeconds(log: { started_at: string; stopped_at: string | null; duration_seconds: number }, nowMs = Date.now()) {
  if (log.stopped_at) return log.duration_seconds;
  const started = new Date(log.started_at).getTime();
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
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { user, hasPermission } = useAuth();
  const [task, setTask] = useState<OddsTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
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

  const canReviewBrief = hasPermission("review-odds-briefs");
  const canStart = hasPermission("start-odds-tasks");
  const canSubmit = hasPermission("submit-odds-results");
  const canSpvReview = hasPermission("review-odds-spv");
  const canClientReview = hasPermission("review-odds-client");
  const canManageEscalations = hasPermission("manage-odds-escalations");

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
      await loadTask();
    } catch (err) {
      setError(oddsError(err));
    } finally {
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
  const designerTimeLogs = timeLogs.filter((log) => ["work", "revision"].includes(log.log_type));
  const timerTotals = {
    work: designerTimeLogs.filter((log) => log.log_type === "work").reduce((total, log) => total + durationSeconds(log, timerNow), 0),
    revision: designerTimeLogs.filter((log) => log.log_type === "revision").reduce((total, log) => total + durationSeconds(log, timerNow), 0),
  };
  const outputTitle = isVisibleLeaderRevisionTask ? "Output Revisi SPV" : isClientRevisionTask ? "Output Revisi Client" : "Output";
  const outputNotice = isVisibleLeaderRevisionTask
    ? "Task sedang dalam revisi SPV. Setelah disubmit, hasil revisi kembali masuk review SPV."
    : isClientRevisionTask
      ? "Task sedang dalam revisi client. Kirim hasil revisi melalui form Output di sisi kiri."
      : "Task sedang dikerjakan. Kirim output melalui form Output di sisi kiri.";
  const submitButtonLabel = isVisibleLeaderRevisionTask || isClientRevisionTask ? "Submit Revisi" : "Submit";
  const submitResultMessage = isVisibleLeaderRevisionTask
    ? "Revisi dikirim ke SPV."
    : isClientRevisionTask
      ? "Revisi dikirim ke client."
      : "Output dikirim ke SPV.";
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
  const reassignTargets = designerProfiles.filter((profile) => profile.status !== "off" && profile.user_id !== assignedDesigner?.id);
  const normalRevisionLimit = task.category?.normal_revision_limit ?? 2;
  const isLastNormalRevisionChance = canClientResultReview
    && !task.extra_revision_used_at
    && task.normal_revision_count + 1 >= normalRevisionLimit;
  const isUrgentFinalRevisionChance = canClientResultReview
    && Boolean(task.extra_revision_used_at)
    && !task.urgent_revision_used_at;
  const canShowNoteInput = canReturnBrief || canSpvBriefAction || canSpvResultReview || canClientResultReview || canRequestCancel;
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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 py-6">
      <header className="flex flex-col gap-4 border-b border-cu-border pb-5 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <Link
            href="/odds"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-cu-border text-cu-ink transition hover:bg-cu-panel-soft"
            aria-label="Kembali"
          >
            <MaterialIcon name="arrow_back" size="sm" />
          </Link>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-cu-muted">{task.task_number}</p>
            <h1 className="mt-1 break-words text-2xl font-semibold text-cu-ink md:text-3xl">{task.design_purpose}</h1>
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-cu-muted">
              <span>{task.category?.name ?? "-"}</span>
              <span>·</span>
              <span>{assignedDesigner?.name ?? "Belum ada desainer"}</span>
              <span>·</span>
              <span>{formatOddsDate(task.deadline, true)}</span>
            </div>
          </div>
        </div>
        <span className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${badgeClass(task.status)}`}>
          {statusLabel(task.status)}
        </span>
      </header>

      {(error || notice) && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            error ? "border-cu-danger/20 bg-cu-danger/10 text-cu-danger" : "border-cu-success/20 bg-cu-success/10 text-cu-success"
          }`}
        >
          {error || notice}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <section className="rounded-lg border border-cu-border bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-cu-ink">Brief</h2>
              <span className="text-sm text-cu-muted">Return {task.brief_return_count}</span>
            </div>
            {task.brief?.last_return_note && (
              <div className="mb-4 rounded-lg border border-cu-danger/20 bg-cu-danger/10 px-3 py-2 text-sm text-cu-danger">
                Catatan return terakhir: {task.brief.last_return_note}
              </div>
            )}
            <form onSubmit={saveBrief} className="space-y-3">
              {canEditBrief ? (
                <OddsRichTextEditor value={briefText} onChange={setBriefText} />
              ) : (
                <RichTextViewer html={briefText} />
              )}
              {canEditBrief ? (
                <div className="flex justify-end">
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
                <p className="text-sm text-cu-muted">
                  Brief hanya bisa diubah client saat desainer meminta update brief.
                </p>
              )}
            </form>
          </section>

          {activeRevision && (
            <section className={`rounded-lg border p-5 ${
              isLeaderRevisionTask
                ? "border-cu-warning/30 bg-cu-warning/10"
                : "border-cu-info/20 bg-cu-info/10"
            }`}>
              <div className="mb-3 flex items-center gap-2">
                <MaterialIcon name={isVisibleLeaderRevisionTask ? "edit_note" : "rate_review"} size="sm" className={isVisibleLeaderRevisionTask ? "text-cu-warning" : "text-cu-info"} />
                <h2 className="text-lg font-semibold text-cu-ink">
                  {isVisibleLeaderRevisionTask ? "Revisi dari SPV" : "Revisi dari Client"}
                </h2>
              </div>
              <p className="whitespace-pre-wrap text-sm text-cu-ink">{activeRevision.notes}</p>
              {isVisibleLeaderRevisionTask && (
                <p className="mt-3 rounded-lg border border-cu-warning/20 bg-white px-3 py-2 text-sm text-cu-muted">
                  Submit revisi ini akan kembali masuk review SPV sampai SPV approve.
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-cu-muted">
                <span className="rounded-full border border-cu-border bg-white px-2.5 py-1 capitalize">{statusLabel(activeRevision.revision_type)}</span>
                <span className="rounded-full border border-cu-border bg-white px-2.5 py-1 capitalize">{activeRevision.status}</span>
              </div>
            </section>
          )}

          {showOutputSection && (
          <section className="rounded-lg border border-cu-border bg-white p-5">
            <h2 className="mb-4 text-lg font-semibold text-cu-ink">{outputTitle}</h2>
            {visibleLatestResult ? (
              <div className="rounded-lg border border-cu-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-cu-ink">Versi {visibleLatestResult.version_number}</p>
                    <p className="text-sm text-cu-muted">{visibleLatestResult.status} · {formatOddsDate(visibleLatestResult.submitted_at, true)}</p>
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

            {canSubmitOutput && (
              <form onSubmit={submitResult} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                <input
                  value={resultNotes}
                  onChange={(event) => setResultNotes(event.target.value)}
                  placeholder={isVisibleLeaderRevisionTask ? "Catatan revisi SPV" : isClientRevisionTask ? "Catatan revisi client" : "Catatan output"}
                  className="h-10 rounded-lg border border-cu-border px-3 text-sm outline-none focus:border-cu-info"
                />
                <input
                  value={assetUrl}
                  onChange={(event) => setAssetUrl(event.target.value)}
                  placeholder="https://output-link"
                  className="h-10 rounded-lg border border-cu-border px-3 text-sm outline-none focus:border-cu-info"
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

          {showRevisionSection && (
          <section className="rounded-lg border border-cu-border bg-white p-5">
            <h2 className="mb-4 text-lg font-semibold text-cu-ink">Revisi</h2>
            <div className="space-y-2">
              {visibleRevisions.map((revision) => (
                <div key={revision.id} className="rounded-lg border border-cu-border px-3 py-2">
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
        </div>

        <aside className="space-y-6">
          <section className="rounded-lg border border-cu-border bg-white p-5">
            <h2 className="mb-4 text-lg font-semibold text-cu-ink">Status</h2>
            <InfoRow label="Task type" value={statusLabel(task.task_type)} />
            <InfoRow label="Workload" value={`${task.workload_point} point`} />
            <InfoRow label="Priority" value={Number(task.priority_score).toFixed(1)} />
            <InfoRow label="Queue" value={queue?.queue_status ?? "-"} />
            <InfoRow label="Est. mulai" value={formatOddsDate(queue?.estimated_start_at, true)} />
            <InfoRow label="Normal revisi" value={String(task.normal_revision_count)} />
            {!isClientSideView && <InfoRow label="Leader revisi" value={String(task.leader_revision_count)} />}
            {!isClientSideView && (
              <>
                <InfoRow label="Quality issue" value={task.quality_issue_flag ? "Ya" : "Tidak"} />
                <p className="mt-3 rounded-lg border border-cu-border bg-cu-panel-soft px-3 py-2 text-xs leading-5 text-cu-muted">
                  Quality issue adalah flag internal saat revisi SPV melewati batas wajar. Dipakai untuk audit, reporting, dan ranking kualitas desainer.
                </p>
              </>
            )}
          </section>

          <OddsTaskChat taskId={task.id} userId={user?.id} />

          {!isClientSideView && (
            <section className="rounded-lg border border-cu-border bg-white p-5">
              <h2 className="mb-4 text-lg font-semibold text-cu-ink">Time Logging</h2>
              <p className="mb-3 text-sm text-cu-muted">
                Timer hanya mencatat proses pengerjaan desainer: task awal, revisi SPV, dan revisi client.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <TimerTile label="Work" value={formatDuration(timerTotals.work)} />
                <TimerTile label="Revisi" value={formatDuration(timerTotals.revision)} />
              </div>
              {task.quality_issue_flag && (
                <p className="mt-3 rounded-lg border border-cu-warning/20 bg-cu-warning/10 px-3 py-2 text-sm text-cu-warning">
                  Quality issue: {task.quality_issue_note ?? "Revisi SPV melewati batas wajar."}
                </p>
              )}
              <div className="mt-3 space-y-2">
                {designerTimeLogs.slice(-5).reverse().map((log) => (
                  <div key={log.id} className="flex items-center justify-between rounded-lg border border-cu-border px-3 py-2 text-xs">
                    <div>
                      <p className="font-semibold capitalize text-cu-ink">{statusLabel(log.log_type)}</p>
                      <p className="text-cu-muted">{log.stopped_at ? "Selesai" : "Berjalan"}</p>
                    </div>
                    <span className="font-medium text-cu-muted">{formatDuration(durationSeconds(log, timerNow))}</span>
                  </div>
                ))}
                {designerTimeLogs.length === 0 && <p className="rounded-lg border border-dashed border-cu-border px-3 py-3 text-sm text-cu-muted">Belum ada timer pengerjaan desainer.</p>}
              </div>
            </section>
          )}

          <section className="rounded-lg border border-cu-border bg-white p-5">
            <h2 className="mb-4 text-lg font-semibold text-cu-ink">Aksi</h2>
            <div className="space-y-3">
              {canShowNoteInput && (
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={3}
                  placeholder="Catatan aksi"
                  className="w-full resize-y rounded-lg border border-cu-border px-3 py-2 text-sm outline-none focus:border-cu-info"
                />
              )}

              {canReturnBrief && (
                <div className="grid grid-cols-1 gap-2">
                  <ActionButton icon="keyboard_return" label="Return Brief" disabled={!note || !!busy} onClick={() => run("return", () => returnOddsBrief(task.id, note), "Brief dikembalikan.")} />
                </div>
              )}

              {canAcceptBrief && (
                <ActionButton icon="playlist_add_check" label="Brief Sesuai" disabled={!!busy} onClick={() => run("accept", () => acceptOddsBrief(task.id), "Brief diterima dan masuk antrean.")} />
              )}

              {canSpvBriefAction && (
                <div className="grid grid-cols-1 gap-2">
                  <ActionButton icon="playlist_add_check" label="Force Queue" disabled={!!busy} onClick={() => run("force", () => forceContinueOddsTask(task.id), "Task masuk queue.")} />
                  <ActionButton icon="cancel" label="Cancel SPV" danger disabled={!note || !!busy} onClick={() => run("cancelBrief", () => cancelOddsBrief(task.id, note), "Task dibatalkan SPV.")} />
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

              {canReassignTask && (
                <div className="rounded-lg border border-cu-border bg-cu-panel-soft p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-cu-ink">
                    <MaterialIcon name="swap_horiz" size="sm" />
                    Reassign Designer
                  </div>
                  <div className="mt-3 grid gap-2">
                    <select
                      value={reassignDesignerId}
                      onChange={(event) => setReassignDesignerId(event.target.value)}
                      className="h-10 rounded-lg border border-cu-border bg-white px-3 text-sm text-cu-ink outline-none focus:border-cu-info"
                    >
                      <option value="">{reassignTargets.length ? "Pilih desainer" : "Tidak ada desainer tersedia"}</option>
                      {reassignTargets.map((profile) => (
                        <option key={profile.id} value={profile.user_id}>
                          {profile.user?.name ?? `Designer #${profile.user_id}`} ({statusLabel(profile.status)})
                        </option>
                      ))}
                    </select>
                    <ActionButton
                      icon="swap_horiz"
                      label="Reassign Task"
                      disabled={!reassignDesignerId || !!busy}
                      onClick={() => run("reassign", () => reassignOddsTask(task.id, Number(reassignDesignerId)), "Task berhasil direassign.")}
                    />
                  </div>
                </div>
              )}

              {canSpvResultReview && (
                <div className="grid grid-cols-2 gap-2">
                  <ActionButton icon="check" label="SPV ACC" disabled={!!busy} onClick={() => run("spvOk", () => spvReviewOddsTask(task.id, "approved", note || undefined), "SPV approve.")} />
                  <ActionButton icon="edit_note" label="SPV Revisi" disabled={!note || !!busy} onClick={() => run("spvRev", () => spvReviewOddsTask(task.id, "revision", note), "Revisi SPV dibuat.")} />
                </div>
              )}

              {canClientResultReview && (
                <>
                  <p className="rounded-lg border border-cu-border bg-cu-panel-soft px-3 py-2 text-sm text-cu-muted">
                    Jika hasil sudah sesuai, pilih rating lalu approve. Jika belum sesuai, isi catatan dan minta revisi.
                  </p>
                  {(isLastNormalRevisionChance || isUrgentFinalRevisionChance) && (
                    <p className="rounded-lg border border-cu-warning/30 bg-cu-warning/10 px-3 py-2 text-sm text-cu-warning">
                      {isUrgentFinalRevisionChance
                        ? "Ini kesempatan urgent final revision. Jika setelah ini masih revisi, task akan dikunci selesai dan request berikutnya perlu diajukan dari awal."
                        : "Ini kesempatan revisi normal terakhir. Jika masih revisi setelah ini, request akan masuk extra revision dan perlu persetujuan SPV."}
                    </p>
                  )}
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <select
                      value={rating}
                      onChange={(event) => setRating(event.target.value)}
                      className="h-10 rounded-lg border border-cu-border bg-white px-3 text-sm outline-none focus:border-cu-info"
                    >
                      {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>{value}</option>
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
                </>
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

              {!canEditBrief && !canReturnBrief && !canAcceptBrief && !canSpvBriefAction && !canStartTask && !canSubmitOutput && !canSpvResultReview && !canClientResultReview && !canRequestCancel && !canReassignTask && (
                <p className="rounded-lg border border-dashed border-cu-border px-3 py-3 text-sm text-cu-muted">
                  Belum ada aksi untuk role ini pada status task sekarang.
                </p>
              )}
            </div>
          </section>
        </aside>
      </section>
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
  return (
    <div className="flex items-center justify-between border-b border-cu-border py-2 last:border-b-0">
      <span className="text-sm text-cu-muted">{label}</span>
      <span className="text-right text-sm font-medium text-cu-ink">{value}</span>
    </div>
  );
}

function TimerTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-cu-border bg-cu-panel-soft px-3 py-2">
      <p className="text-xs text-cu-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-cu-ink">{value}</p>
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
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition disabled:opacity-50 ${
        danger
          ? "border border-cu-danger/20 bg-cu-danger/10 text-cu-danger hover:bg-cu-danger/15"
          : "border border-cu-border bg-white text-cu-ink hover:bg-cu-panel-soft"
      }`}
    >
      <MaterialIcon name={icon} size="sm" />
      {label}
    </button>
  );
}
