"use client";

import { useEffect, useState, type ComponentPropsWithoutRef, type FormEventHandler } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";
import { OddsRichTextEditor, stripRichText } from "@/features/odds/components/OddsRichTextEditor/OddsRichTextEditor";
import { downloadProtectedAttachment, openProtectedAttachment } from "@/core/api/client";
import type { OddsTaskResult } from "@/features/odds/api";
import { ProtectedAssetPreview } from "@/features/odds/components/OddsTaskDetail/ProtectedAssetPreview/ProtectedAssetPreview";
import { QaComponentBoundary } from "@/features/odds/components/OddsTaskDetail/QaComponentBoundary/QaComponentBoundary";
import { useQaMode } from "@/features/odds/components/OddsTaskDetail/QaComponentBoundary/QaComponentBoundary";

type OddsTaskOutputPanelProps = Omit<ComponentPropsWithoutRef<"div">, "children" | "onSubmit"> & {
  result: OddsTaskResult | null;
  formatDate: (value: string | null | undefined, includeTime?: boolean) => string;
  dark: boolean;
  canReview: boolean;
  reviewNote: string;
  onReviewNoteChange: (value: string) => void;
  busy: string | null;
  onReview: (decision: "approved" | "revision", note?: string) => void;
  canSubmit: boolean;
  resultNotes: string;
  assetUrl: string;
  onResultNotesChange: (value: string) => void;
  onAssetUrlChange: (value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  submitButtonLabel: string;
  isLeaderRevisionTask: boolean;
  isClientRevisionTask: boolean;
  qaEnabled?: boolean;
};

export function OddsTaskOutputPanel({
  result, formatDate, dark, canReview, reviewNote, onReviewNoteChange, busy, onReview,
  canSubmit, resultNotes, assetUrl, onResultNotesChange, onAssetUrlChange, onSubmit,
  submitButtonLabel, isLeaderRevisionTask, isClientRevisionTask, qaEnabled, className = "", ...props
}: OddsTaskOutputPanelProps) {
  const qaModeEnabled = useQaMode();
  const qaEnabledResolved = qaEnabled ?? qaModeEnabled;
  const [copiedAssetId, setCopiedAssetId] = useState<number | null>(null);
  const [openAssetMenuId, setOpenAssetMenuId] = useState<number | null>(null);
  const [activeAssetId, setActiveAssetId] = useState<number | null>(null);
  const outputTotal = result?.result_notes?.match(/Total Output:\s*([0-9]+)/i)?.[1] ?? null;

  useEffect(() => {
    if (openAssetMenuId === null && activeAssetId === null) return;
    const closeMenus = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest("[data-asset-menu]")) setOpenAssetMenuId(null);
      if (!target?.closest("[data-asset-card]")) setActiveAssetId(null);
    };
    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus);
  }, [activeAssetId, openAssetMenuId]);

  return (
    <div {...props} className={`flex-1 overflow-y-auto ${className}`}>
      {result ? (
        <QaComponentBoundary label="OutputResultCard" enabled={qaEnabledResolved} tone="nested" wrap className="rounded-2xl border border-cu-border/70 bg-white/70 p-3 shadow-sm sm:p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-cu-info/10 text-cu-info"><MaterialIcon name="folder_open" size="sm" /></span>
              <div className="min-w-0"><p className="text-sm font-bold text-cu-ink">Output terbaru</p><p className="mt-0.5 truncate text-xs text-cu-muted">Versi {result.version_number} Â· {formatDate(result.submitted_at, true)}</p></div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5"><span className="rounded-full bg-cu-success/10 px-2.5 py-1 text-[10px] font-bold capitalize text-cu-success">{result.status === "pending_spv" ? "Proses Review Leader" : result.status}</span>{outputTotal && <span className="rounded-full bg-cu-info/10 px-2.5 py-1 text-[10px] font-bold text-cu-info">{outputTotal} Output</span>}</div>
          </div>
          {result.result_notes && result.result_notes.replace(/Total Output:\s*[0-9]+\s*/i, "").trim() && <p className="mt-3 rounded-xl bg-cu-panel-soft px-3 py-2.5 text-sm leading-6 text-cu-ink">{result.result_notes.replace(/Total Output:\s*[0-9]+\s*/i, "").trim()}</p>}
          {(result.asset_links ?? []).length > 0 && <div className="mt-3 flex flex-wrap gap-2">{(result.asset_links ?? []).map((asset) => asset.label.toLowerCase().includes("local file sharing") ? <button key={asset.id} type="button" onClick={() => { void navigator.clipboard.writeText(asset.url); setCopiedAssetId(asset.id); window.setTimeout(() => setCopiedAssetId(null), 1600); }} className="inline-flex items-center gap-1.5 rounded-lg border border-cu-info/20 bg-cu-info/5 px-2.5 py-1.5 text-xs font-semibold text-cu-info transition hover:bg-cu-info/10" title="Salin URL File Sharing"><MaterialIcon name={copiedAssetId === asset.id ? "check" : "content_copy"} size="xs" />{copiedAssetId === asset.id ? "Tersalin" : "File Sharing"}</button> : null)}</div>}
          {(result.asset_links ?? []).some((asset) => !asset.label.toLowerCase().includes("local file sharing")) && <div className="mt-3 rounded-xl border border-cu-border/60 bg-cu-panel-soft/40 p-2.5"><div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-cu-muted"><MaterialIcon name="folder" size="xs" /> File Terlampir</div><div className="grid grid-cols-2 gap-2 sm:grid-cols-5">{(result.asset_links ?? []).filter((asset) => !asset.label.toLowerCase().includes("local file sharing")).map((asset) => <OutputAssetCard key={asset.id} asset={asset} active={activeAssetId === asset.id} menuOpen={openAssetMenuId === asset.id} onToggleActive={() => { setActiveAssetId((current) => current === asset.id ? null : asset.id); setOpenAssetMenuId(null); }} onToggleMenu={() => setOpenAssetMenuId((current) => current === asset.id ? null : asset.id)} onCloseMenu={() => setOpenAssetMenuId(null)} />)}</div></div>}
        </QaComponentBoundary>
      ) : <div className="flex h-full min-h-0 flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-cu-border bg-cu-panel-soft/30 px-4 py-6 text-center"><span className="text-3xl" role="img" aria-label="Sedih">😔</span><p className="mt-2 text-sm font-medium text-cu-muted">Belum ada output.</p></div>}

      {canReview && <QaComponentBoundary label="LeaderReviewForm" enabled={qaEnabledResolved} tone="nested" wrap className="mt-3 rounded-2xl border border-cu-border/60 bg-cu-panel-soft/50 p-2"><div><label className="mb-1.5 block text-xs font-bold text-cu-ink">Catatan Proses Review Leader</label><OddsRichTextEditor value={reviewNote} onChange={onReviewNoteChange} placeholder="Tulis catatan review untuk desainer..." minHeight={96} toolbarMode="focus" className="min-h-[96px]" /><div className="mt-2 flex flex-wrap justify-end gap-2"><button type="button" disabled={!!busy} onClick={() => onReview("approved", stripRichText(reviewNote) ? reviewNote : undefined)} className="inline-flex h-9 items-center gap-2 rounded-xl border border-cu-success/30 bg-cu-success/10 px-3 text-xs font-bold text-cu-success transition hover:bg-cu-success/15 disabled:opacity-50"><MaterialIcon name="check" size="sm" /> Leader ACC</button><button type="button" disabled={!stripRichText(reviewNote) || !!busy} onClick={() => onReview("revision", reviewNote)} className="inline-flex h-9 items-center gap-2 rounded-xl bg-cu-info px-3 text-xs font-bold text-white transition hover:brightness-95 disabled:opacity-50"><MaterialIcon name="edit_note" size="sm" /> Leader Revisi</button></div></div></QaComponentBoundary>}

      {canSubmit && <form onSubmit={onSubmit} className="mt-3 grid gap-2 rounded-2xl border border-cu-border/60 bg-cu-panel-soft/50 p-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"><input value={resultNotes} onChange={(event) => onResultNotesChange(event.target.value)} placeholder={isLeaderRevisionTask ? "Catatan revisi Leader" : isClientRevisionTask ? "Catatan revisi client" : "Catatan output"} className={`h-9 rounded-xl border px-3 text-xs outline-none ${dark ? "bg-[#0e0e0e] border-white/10 text-white focus:border-cu-info" : "border-cu-border bg-white focus:border-cu-info"}`} aria-label="Catatan output" /><input value={assetUrl} onChange={(event) => onAssetUrlChange(event.target.value)} placeholder="https://output-link" className={`h-9 rounded-xl border px-3 text-xs outline-none ${dark ? "bg-[#0e0e0e] border-white/10 text-white focus:border-cu-info" : "border-cu-border bg-white focus:border-cu-info"}`} aria-label="Link aset" /><button type="submit" disabled={busy === "result"} className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-cu-info px-3 text-xs font-bold text-white shadow-sm transition hover:brightness-95 disabled:opacity-50"><MaterialIcon name="upload" size="sm" />{submitButtonLabel}</button></form>}
    </div>
  );
}

function OutputAssetCard({ asset, active, menuOpen, onToggleActive, onToggleMenu, onCloseMenu }: { asset: NonNullable<OddsTaskResult["asset_links"]>[number]; active: boolean; menuOpen: boolean; onToggleActive: () => void; onToggleMenu: () => void; onCloseMenu: () => void }) {
  const assetName = asset.label || "File output";
  const assetTypeSource = `${asset.url} ${assetName}`;
  const isVideo = /\.(mp4|webm|mov|avi)(\?|$|\s)/i.test(assetTypeSource);
  const isImage = /\.(png|jpe?g|gif|webp|svg)(\?|$|\s)/i.test(assetTypeSource);
  const uploadId = asset.url.match(/\/uploads\/(\d+)\/content/i)?.[1];
  const openAsset = () => uploadId ? void openProtectedAttachment(uploadId) : window.open(asset.url, "_blank", "noopener,noreferrer");
  const downloadAsset = () => { if (uploadId) { void downloadProtectedAttachment(uploadId, assetName); return; } const link = document.createElement("a"); link.href = asset.url; link.download = assetName; link.target = "_blank"; link.rel = "noreferrer"; link.click(); };
  return <div data-asset-menu data-asset-card className="relative w-full"><button type="button" aria-label={`Pilih ${assetName}`} aria-pressed={active} onClick={onToggleActive} className={`group w-full overflow-hidden rounded-lg border text-left transition ${active ? "border-cu-info bg-cu-info/5 ring-2 ring-cu-info/25" : "border-cu-border bg-white hover:border-cu-info/60 hover:bg-cu-info/[0.03]"}`}><div className="flex h-[72px] items-center justify-center overflow-hidden bg-cu-panel-soft">{isImage ? <ProtectedAssetPreview uploadId={uploadId} fallbackUrl={asset.url} alt={assetName} /> : isVideo ? <video src={asset.url} muted className="h-full w-full object-cover" /> : <MaterialIcon name="insert_drive_file" size="lg" className="text-cu-muted" />}</div><p className="truncate px-1.5 py-1 text-[9px] font-semibold text-cu-ink" title={assetName}>{assetName}</p></button><button type="button" aria-label={`Aksi ${assetName}`} onClick={(event) => { event.stopPropagation(); onToggleMenu(); }} className="absolute right-1.5 top-1.5 z-10 flex size-7 items-center justify-center rounded-lg bg-white/90 text-cu-ink shadow-sm transition hover:bg-white"><MaterialIcon name="more_vert" size="sm" /></button>{menuOpen && <div className="absolute right-1.5 top-10 z-20 w-28 rounded-lg border border-cu-border bg-white p-1 shadow-lg"><button type="button" onClick={() => { onCloseMenu(); openAsset(); }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[10px] font-semibold text-cu-ink hover:bg-cu-panel-soft"><MaterialIcon name="open_in_new" size="xs" /> Open</button><button type="button" onClick={() => { onCloseMenu(); downloadAsset(); }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[10px] font-semibold text-cu-ink hover:bg-cu-panel-soft"><MaterialIcon name="download" size="xs" /> Download</button></div>}</div>;
}
