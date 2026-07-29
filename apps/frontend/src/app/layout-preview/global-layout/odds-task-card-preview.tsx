"use client";

import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { OddsTaskCard, OutputFilesPanel, OutputReviewPanel, RecommendationButton, TaskCardActionBar, TaskCardCompactDate, TaskCardCompactLayout, TaskCardMobileDate, TaskCardMobileLayout, TaskCardPeople, TaskCardPerson, TaskCardStatusBlock, TaskCardWideDate, TaskCardWideLayout, TaskCardWidePeople, TaskCardWideStatusPanel, TaskDiscussionPanel, TaskFeedbackToast, TaskSubmissionPanel, type OddsTaskCardAction, type TaskFeedbackToastState } from "@/components/odds/TaskCard";
import type { OddsTask } from "@/features/odds/api";

type CardStage = {
  title: string;
  description: string;
  task: OddsTask;
  showStart?: boolean;
  showPause?: boolean;
  showDone?: boolean;
  canCheckRole?: boolean;
  disabledActions: OddsTaskCardAction[];
};

type PointOfView = "leader" | "client" | "designer";
type CardCondition = "deadline" | "normal";

const pointOfViews: Array<{ value: PointOfView; label: string }> = [
  { value: "leader", label: "Leader" },
  { value: "client", label: "Client" },
  { value: "designer", label: "Designer" },
];

const cardConditions: Array<{ value: CardCondition; label: string }> = [
  { value: "deadline", label: "Deadline" },
  { value: "normal", label: "Normal" },
];

const previewOutputAssets = [
  { id: "local", label: "Local File Sharing", url: String.raw`\\bobby-pc\Tempat Sharing File\#DESIGN BOBBY\#JETE\DESKRIPSI PRODUK\USB HUB\X10` },
  { id: "fig", label: "KV-Promo-Payday-Final.fig", url: "" },
  { id: "image", label: "KV-Promo-Payday-Preview.png", url: "" },
];

const baseTask = {
  request_type: "design",
  brief_text: "Preview visual untuk siklus TaskCard ODDS. Tidak terhubung ke API maupun aksi backend.",
  reference_visual: null,
  deadline: "2026-07-30T10:00:00+07:00",
  important_matrix: "Q1",
  task_type: "new_task",
  priority_score: 100,
  brief_return_count: 0,
  leader_revision_count: 0,
  normal_revision_count: 0,
  created_at: "2026-07-23T10:31:00+07:00",
  category: { id: 1, name: "Creative Design", score_weight: 1, normal_revision_limit: 2, sla_minutes: 1440, important_matrix: "Q1", is_active: true },
  requester: { id: 1, name: "Client Test", roles: ["Client"] },
  assigned_designer: { id: 2, name: "Designer Test", roles: ["Designer"] },
} satisfies Omit<OddsTask, "id" | "task_number" | "design_purpose" | "status">;

const stages: CardStage[] = [
  {
    title: "1. Brief",
    description: "Brief baru dikirim dan menunggu pengecekan desainer.",
    task: { ...baseTask, id: 1651201, task_number: "ODDS-QA-001", design_purpose: "Key Visual Campaign Juli", status: "submitted" },
    disabledActions: ["start", "pause", "done", "file", "check", "chat"],
  },
  {
    title: "2. Antrean",
    description: "Brief diterima; task menunggu giliran pengerjaan.",
    task: { ...baseTask, id: 1651202, task_number: "ODDS-QA-002", design_purpose: "Banner Tokopedia & Shopee", status: "queued" },
    showStart: true,
    disabledActions: ["pause", "done", "file", "check"],
  },
  {
    title: "3. Pengerjaan",
    description: "Desainer sedang mengerjakan output task.",
    task: { ...baseTask, id: 1651203, task_number: "ODDS-QA-003", design_purpose: "Thumbnail YouTube Produk", status: "in_progress" },
    showPause: true,
    showDone: true,
    disabledActions: ["start", "file", "check"],
  },
  {
    title: "4. Review SPV",
    description: "Output terkirim dan menunggu keputusan Leader Creative.",
    task: {
      ...baseTask,
      id: 1651204,
      task_number: "ODDS-QA-004",
      design_purpose: "KV Promo Payday",
      status: "spv_review",
      results: [{ id: 1, version_number: 1, status: "pending_spv", submitted_by: 2, result_notes: "Output QA", submitted_at: "2026-07-24T10:00:00+07:00", asset_links: [] }],
    },
    canCheckRole: true,
    disabledActions: ["start", "pause", "done", "file"],
  },
  {
    title: "5. Review Client",
    description: "Output telah lolos SPV dan menunggu review client.",
    task: {
      ...baseTask,
      id: 1651205,
      task_number: "ODDS-QA-005",
      design_purpose: "Desain Feed Instagram JETE RUN",
      status: "client_review",
      results: [{ id: 2, version_number: 1, status: "pending_client", submitted_by: 2, result_notes: "Output QA", submitted_at: "2026-07-24T10:00:00+07:00", asset_links: [] }],
    },
    canCheckRole: true,
    disabledActions: ["start", "pause", "done", "file"],
  },
  {
    title: "6. Selesai",
    description: "Task telah disetujui, diberi rating, dan ditutup.",
    task: { ...baseTask, id: 1651206, task_number: "ODDS-QA-006", design_purpose: "Product Ads Headset Bluetooth", status: "done" },
    disabledActions: ["start", "pause", "done", "check", "delete"],
  },
];

const previewNowMs = 1785207600000;

const componentName = (component: unknown) => {
  const reference = component as { displayName?: string; name?: string };
  return reference.displayName || reference.name || "AnonymousComponent";
};

const taskCardComponentGroups = [
  { label: "Shell", items: [OddsTaskCard] },
  { label: "Layout", items: [TaskCardMobileLayout, TaskCardCompactLayout, TaskCardWideLayout] },
  { label: "Section", items: [TaskCardMobileDate, TaskCardCompactDate, TaskCardWideDate, TaskCardPeople, TaskCardWidePeople, TaskCardPerson, TaskCardActionBar, TaskCardStatusBlock, TaskCardWideStatusPanel] },
  { label: "Workflow interaction", items: [TaskDiscussionPanel, TaskSubmissionPanel, OutputReviewPanel, OutputFilesPanel, RecommendationButton, TaskFeedbackToast] },
];

function disabledActionsFor(status: string, pointOfView: PointOfView): OddsTaskCardAction[] {
  const disabled = new Set<OddsTaskCardAction>(["start", "pause", "done", "file", "check", "delete", "chat"]);
  const enable = (...actions: OddsTaskCardAction[]) => actions.forEach((action) => disabled.delete(action));

  if (status !== "submitted") enable("chat");
  if (status !== "done" && pointOfView !== "designer") enable("delete");

  if (pointOfView === "designer") {
    if (status === "queued") enable("start");
    if (status === "in_progress") enable("pause", "done");
    if (status === "spv_review" || status === "client_review") enable("file");
    if (status === "done") enable("file");
  }

  if (pointOfView === "leader") {
    if (status === "in_progress") enable("pause");
    if (status === "spv_review") enable("check");
    if (status === "client_review") enable("file");
    if (status === "done") enable("file");
  }

  if (pointOfView === "client") {
    if (status === "client_review") enable("check");
    if (status === "done") enable("file");
  }

  return [...disabled];
}

export default function OddsTaskCardPreview() {
  const [pointOfView, setPointOfView] = useState<PointOfView>("designer");
  const [cardCondition, setCardCondition] = useState<CardCondition>("normal");
  const [selectedStageId, setSelectedStageId] = useState(stages[0].task.id);
  const [showDoneRecommendation, setShowDoneRecommendation] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);
  const [outputOpen, setOutputOpen] = useState(false);
  const [fileOpen, setFileOpen] = useState(false);
  const [checkOpen, setCheckOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [pauseOpen, setPauseOpen] = useState(false);
  const [pauseReason, setPauseReason] = useState("");
  const [outputShareLink, setOutputShareLink] = useState("");
  const [outputFiles, setOutputFiles] = useState<File[]>([]);
  const [outputTotal, setOutputTotal] = useState("");
  const [outputDragActive, setOutputDragActive] = useState(false);
  const [taskToast, setTaskToast] = useState<TaskFeedbackToastState>(null);
  const simulateTaskAction = (message: string, shouldFail = false) => {
    setTaskToast({ status: "loading", message: "Memproses aksi task..." });
    window.setTimeout(() => setTaskToast({ status: shouldFail ? "error" : "success", message: shouldFail ? "Aksi task gagal diproses. Coba lagi." : message }), 700);
  };
  const previewAction = (action: OddsTaskCardAction) => {
    if (action === "chat") {
      setChatOpen((current) => !current);
      setOutputOpen(false);
      setFileOpen(false);
      setCheckOpen(false);
      setDeleteOpen(false);
      setPauseOpen(false);
    }
    if (action === "done") {
      setChatOpen(false);
      setCheckOpen(false);
      setDeleteOpen(false);
      setPauseOpen(false);
      setFileOpen(false);
      setOutputOpen((current) => !current);
    }
    if (action === "file") {
      setChatOpen(false);
      setCheckOpen(false);
      setDeleteOpen(false);
      setPauseOpen(false);
      setOutputOpen(false);
      setFileOpen((current) => !current);
    }
    if (action === "check") {
      setChatOpen(false);
      setOutputOpen(false);
      setFileOpen(false);
      setPauseOpen(false);
      setCheckOpen((current) => !current);
    }
    if (action === "delete") {
      setChatOpen(false);
      setOutputOpen(false);
      setFileOpen(false);
      setCheckOpen(false);
      setPauseOpen(false);
      setDeleteReason("");
      setDeleteOpen(true);
    }
    if (action === "pause") {
      setChatOpen(false);
      setOutputOpen(false);
      setFileOpen(false);
      setCheckOpen(false);
      setDeleteOpen(false);
      setPauseOpen(true);
    }
    // QA visual saja: tidak ada request API atau perubahan data pada preview ini.
  };
  const selectedStage = stages.find((stage) => stage.task.id === selectedStageId) ?? stages[0];
  const variantTask: OddsTask = selectedStage.task;
  const variantNowMs = cardCondition === "deadline"
    ? new Date(baseTask.deadline).getTime() + 60_000
    : previewNowMs;
  const variantTimerSeconds = variantTask.status === "done" || cardCondition === "deadline" ? 0 : 3725;
  const variantDisabledActions = disabledActionsFor(variantTask.status, pointOfView);
  const canCheckVariant = (pointOfView === "leader" && (variantTask.status === "spv_review" || variantTask.status === "client_review")) || (pointOfView === "client" && variantTask.status === "client_review");
  const isDoneRecommendationEligible = pointOfView === "designer" && variantTask.status === "in_progress" && cardCondition === "normal";

  useEffect(() => {
    if (!isDoneRecommendationEligible) return;

    let cycleTimeout: number | undefined;
    let cancelled = false;
    const runCycle = () => {
      cycleTimeout = window.setTimeout(() => {
        if (cancelled) return;
        setShowDoneRecommendation(true);
        cycleTimeout = window.setTimeout(() => {
          if (cancelled) return;
          setShowDoneRecommendation(false);
          runCycle();
        }, 10_000);
      }, 60_000);
    };
    runCycle();
    return () => {
      cancelled = true;
      if (cycleTimeout) window.clearTimeout(cycleTimeout);
    };
  }, [cardCondition, isDoneRecommendationEligible, pointOfView, variantTask.status]);
  useEffect(() => {
    if (!taskToast || taskToast.status === "loading") return;
    const timeoutId = window.setTimeout(() => setTaskToast(null), 3600);
    return () => window.clearTimeout(timeoutId);
  }, [taskToast]);
  const wideRecommendationLabel = pointOfView === "leader" && variantTask.status === "spv_review"
    ? "Review"
    : pointOfView === "client" && variantTask.status === "client_review"
    ? "Review"
    : pointOfView === "designer"
    ? variantTask.status === "submitted"
      ? "Check"
      : variantTask.status === "queued"
        ? "Proses"
        : isDoneRecommendationEligible && showDoneRecommendation
          ? "Done"
        : undefined
    : undefined;
  const wideRating = variantTask.status === "done" ? 4.5 : undefined;
  const clientDeleteNeedsReason = pointOfView === "client" && !["submitted", "queued"].includes(variantTask.status);

  return (
    <section id="odds-task-card" className="flex w-full flex-col gap-4 scroll-mt-4">
      <TaskFeedbackToast toast={taskToast} onClose={() => setTaskToast(null)} />
      <div>
        <h1 className="text-2xl font-semibold text-[#3b4446]">ODDS TaskCard</h1>
        <p className="mt-1 text-sm text-[#7d7c7c]">Enam tahap utama siklus ODDS untuk QA visual. Seluruh aksi masih statis.</p>
      </div>

      <section className="rounded-xl border border-[#b9def4] bg-white p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#0077bf]">Variant Playground</h2>
            <p className="mt-1 text-xs text-[#7d7c7c]">Ubah perspektif pengguna dan kondisi visual tanpa request API.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div>
              <p className="mb-1.5 text-[11px] font-medium text-[#7d7c7c]">Siklus</p>
              <div className="flex max-w-full gap-1 overflow-x-auto rounded-lg bg-[#edf9ff] p-1">
                {stages.map((stage) => (
                  <button key={stage.task.id} type="button" onClick={() => { setSelectedStageId(stage.task.id); if (stage.task.status === "submitted") setChatOpen(false); }} className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold transition ${selectedStage.task.id === stage.task.id ? "bg-[#0077bf] text-white shadow-sm" : "text-[#527083] hover:bg-white"}`}>
                    {stage.title}
                  </button>
                ))}
              </div>
            </div>
            <VariantSelector label="Point of View" value={pointOfView} options={pointOfViews} onChange={setPointOfView} />
            <VariantSelector label="Kondisi" value={cardCondition} options={cardConditions} onChange={setCardCondition} />
          </div>
        </div>
        <div className="mt-4">
          <OddsTaskCard
            task={variantTask}
            theme="light"
            viewerRole={pointOfView}
            nowMs={variantNowMs}
            timerSeconds={variantTimerSeconds}
            chatOpen={chatOpen}
            outputOpen={outputOpen}
            fileOpen={fileOpen}
            checkOpen={checkOpen}
            actionOverlayOpen={deleteOpen || pauseOpen}
            actionOverlay={pauseOpen ? <div className="grid h-full w-full grid-rows-[auto_1fr_auto] gap-2 bg-amber-50 px-4 py-3 text-[#3b4446]"><p className="text-sm font-semibold">Pause Pengerjaan</p><input id="pause-reason" value={pauseReason} onChange={(event) => setPauseReason(event.target.value)} placeholder="Tulis alasan pause..." className="h-8 w-full min-w-0 self-center rounded-md border border-amber-200 bg-white px-3 text-xs text-[#3b4446] outline-none placeholder:text-[#9aa7ac] focus:border-amber-400" /><div className="flex items-center justify-end gap-2"><button type="button" onClick={() => setPauseOpen(false)} className="h-8 rounded-md border border-[#d9e1e6] bg-white px-3 text-xs font-semibold transition hover:bg-slate-50">Batal</button><button type="button" onClick={() => { setPauseOpen(false); simulateTaskAction("Task berhasil dijeda."); }} disabled={!pauseReason.trim()} className="h-8 rounded-md bg-amber-500 px-3 text-xs font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40">Jeda Task</button></div></div> : clientDeleteNeedsReason ? <div className="grid h-full w-full grid-rows-[auto_1fr_auto] gap-2 bg-rose-50 px-4 py-3 text-[#3b4446]"><p className="text-sm font-semibold">Batalkan Task</p><input id="delete-reason" value={deleteReason} onChange={(event) => setDeleteReason(event.target.value)} placeholder="Tulis alasan pembatalan..." className="h-8 w-full min-w-0 self-center rounded-md border border-rose-200 bg-white px-3 text-xs text-[#3b4446] outline-none placeholder:text-[#9aa7ac] focus:border-rose-400" /><div className="flex items-center justify-end gap-2"><button type="button" onClick={() => setDeleteOpen(false)} className="h-8 rounded-md border border-[#d9e1e6] bg-white px-3 text-xs font-semibold transition hover:bg-slate-50">Batal</button><button type="button" onClick={() => { setDeleteOpen(false); simulateTaskAction("Task berhasil dibatalkan."); }} disabled={!deleteReason.trim()} className="h-8 rounded-md bg-rose-500 px-3 text-xs font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-40">Batalkan Task</button></div></div> : <div className="grid h-full w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 bg-rose-50 px-4 text-[#3b4446]"><div className="flex min-w-0 items-center gap-2"><MaterialIcon name="warning" size="sm" className="shrink-0 text-rose-500" /><span className="truncate text-sm font-semibold">Yakin ingin menghapus request ini?</span></div><div className="flex h-full shrink-0 items-center gap-2"><button type="button" onClick={() => setDeleteOpen(false)} className="h-8 rounded-md border border-[#d9e1e6] bg-white px-3 text-xs font-semibold transition hover:bg-slate-50">Batal</button><button type="button" onClick={() => { setDeleteOpen(false); simulateTaskAction("Request berhasil dihapus."); }} className="h-8 rounded-md bg-rose-500 px-3 text-xs font-semibold text-white transition hover:bg-rose-600">Hapus</button></div></div>}
            canCheckRole={canCheckVariant}
            showStart={variantTask.status === "queued"}
            showPause={variantTask.status === "in_progress" && pointOfView !== "designer"}
            showDone={variantTask.status === "in_progress"}
            showAllActions
            disabledActions={variantDisabledActions}
            wideHighlightLabel={wideRecommendationLabel}
            wideRating={wideRating}
            feedbackHref={variantTask.status === "done" ? `/odds/detail?id=${variantTask.id}#feedback` : undefined}
            onBriefAction={() => setBriefOpen(true)}
            onAction={previewAction}
          >
            {deleteOpen ? <section className="flex w-full flex-col gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-[#3b4446]" aria-label="Konfirmasi hapus request"><div className="flex items-start gap-2"><MaterialIcon name="warning" size="sm" className="text-rose-500" /><div><h3 className="text-sm font-semibold">Hapus request ini?</h3><p className="mt-1 text-xs text-[#7d7c7c]">Apakah Anda yakin ingin menghapus request ini?</p></div></div><div className="flex justify-end gap-2"><button type="button" onClick={() => setDeleteOpen(false)} className="h-9 rounded-lg border border-[#d9e1e6] bg-white px-3 text-xs font-semibold text-[#3b4446]">Batal</button><button type="button" onClick={() => setDeleteOpen(false)} className="h-9 rounded-lg bg-rose-500 px-3 text-xs font-semibold text-white">Hapus Request</button></div></section> : chatOpen ? <TaskDiscussionPanel preview taskId={variantTask.id} title={variantTask.design_purpose} onClose={() => setChatOpen(false)} /> : outputOpen ? <TaskSubmissionPanel
              theme="light"
              accentColor="#00a4ff"
              outputBusy={false}
              outputShareLink={outputShareLink}
              outputFiles={outputFiles}
              outputTotal={outputTotal}
              outputDragActive={outputDragActive}
              onShareLinkChange={setOutputShareLink}
              onFilesChange={(files) => setOutputFiles((current) => [...current, ...Array.from(files)])}
              onTotalChange={setOutputTotal}
              onDragActiveChange={setOutputDragActive}
              onClose={() => setOutputOpen(false)}
              onSubmit={(event) => {
                event.preventDefault();
                setOutputOpen(false);
                simulateTaskAction("Output berhasil dikirim untuk review.");
              }}
            /> : fileOpen ? <OutputFilesPanel onClose={() => setFileOpen(false)} assets={previewOutputAssets} /> : checkOpen ? <OutputReviewPanel title={variantTask.design_purpose} onClose={() => setCheckOpen(false)} assets={previewOutputAssets} onApprove={() => { setCheckOpen(false); simulateTaskAction("Output berhasil disetujui."); }} onRevisionSubmit={() => { setCheckOpen(false); simulateTaskAction("Permintaan revisi berhasil dikirim."); }} /> : <div className="rounded-lg bg-[#edf9ff] px-3 py-2 text-xs text-[#0077bf]">
              QA visual untuk POV {pointOfViews.find((item) => item.value === pointOfView)?.label} · kondisi {cardConditions.find((item) => item.value === cardCondition)?.label}.
            </div>}
          </OddsTaskCard>
        </div>
      </section>

      <section className="min-h-[280px] rounded-xl border border-[#b9def4] bg-white p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#7d7c7c]">Struktur Component</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {taskCardComponentGroups.map((group) => <div key={group.label} className="flex items-center gap-1.5 rounded-lg bg-[#f3fbff] px-2 py-1.5 text-[11px]"><span className="font-semibold text-[#0077bf]">{group.label}</span><span className="text-[#a4b3ba]">-</span><span className="text-[#527083]">{group.items.map(componentName).join(" - ")}</span></div>)}
        </div>
      </section>

      {briefOpen && <div role="dialog" aria-modal="true" aria-label="Detail Brief" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
        <div className="flex max-h-[min(720px,calc(100vh-2rem))] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
          <div className="flex items-start justify-between gap-4 border-b border-[#e6edf2] px-5 py-4"><div className="min-w-0"><p className="text-xs font-semibold text-[#0077bf]">Detail Brief</p><h2 className="mt-1 truncate text-lg font-semibold text-[#3b4446]">{variantTask.design_purpose}</h2></div><button type="button" onClick={() => setBriefOpen(false)} aria-label="Tutup detail brief" className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#d9e1e6] text-[#3b4446] transition hover:bg-[#f3fbff]"><MaterialIcon name="close" size="sm" /></button></div>
          <div className="overflow-y-auto p-5"><p className="whitespace-pre-wrap text-sm leading-6 text-[#3b4446]">{variantTask.brief_text || "Brief belum tersedia untuk task ini."}</p></div>
        </div>
      </div>}

      {false && <div className="grid w-full gap-4">
        <h2 className="text-sm font-semibold text-[#3b4446]">Tahap Siklus</h2>
        {stages.map((stage) => {
          const isOpen = selectedStageId === stage.task.id;
          return (
          <section key={stage.task.id} className="rounded-xl border border-[#dcecf5] bg-[#f8fcff] p-3 sm:p-4">
            <button type="button" onClick={() => setSelectedStageId((current) => current === stage.task.id ? stages[0].task.id : stage.task.id)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-3 text-left">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-[#0077bf]">{stage.title}</h3>
                <p className="mt-1 text-xs text-[#7d7c7c]">{stage.description}</p>
              </div>
              <MaterialIcon name={isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"} size="sm" className="shrink-0 text-[#0077bf]" />
            </button>
            {isOpen && <div className="mt-3"><OddsTaskCard
              task={stage.task}
              theme="light"
              viewerRole={pointOfView}
              nowMs={previewNowMs}
              timerSeconds={stage.task.status === "done" ? 0 : 3725}
              canCheckRole={stage.canCheckRole}
              showStart={stage.showStart}
              showPause={stage.showPause}
              showDone={stage.showDone}
              showAllActions
              disabledActions={stage.disabledActions}
              onAction={previewAction}
            >
              <div className="rounded-lg bg-[#edf9ff] px-3 py-2 text-xs text-[#0077bf]">
                Preview visual — aksi TaskCard belum diaktifkan pada halaman QA.
              </div>
            </OddsTaskCard></div>}
          </section>
          );
        })}
      </div>}
    </section>
  );
}

function VariantSelector<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Array<{ value: T; label: string }>; onChange: (value: T) => void }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-medium text-[#7d7c7c]">{label}</p>
      <div className="flex rounded-lg bg-[#edf9ff] p-1">
        {options.map((option) => (
          <button key={option.value} type="button" onClick={() => onChange(option.value)} className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${value === option.value ? "bg-[#0077bf] text-white shadow-sm" : "text-[#527083] hover:bg-white"}`}>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
