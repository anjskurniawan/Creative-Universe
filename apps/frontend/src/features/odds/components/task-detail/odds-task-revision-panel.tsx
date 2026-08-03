import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { OddsTaskRevision } from "@/features/odds/api";

export function RevisionEmptyState() {
  return <div className="flex h-full min-h-0 flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-cu-border bg-cu-panel-soft/30 px-4 py-6 text-center"><span className="text-3xl" role="img" aria-label="Jempol">👍</span><p className="mt-2 text-sm font-medium text-cu-muted">Belum ada revisi.</p></div>;
}

export function OddsTaskRevisionPanel({ hasRevisions, children, className = "", ...props }: Omit<ComponentPropsWithoutRef<"div">, "children"> & { hasRevisions: boolean; children: ReactNode }) {
  return <div {...props} className={`flex-1 overflow-y-auto ${className}`}>{hasRevisions ? children : <RevisionEmptyState />}</div>;
}

export function ActiveRevisionPanel({ revision, leader }: { revision: OddsTaskRevision; leader: boolean }) { return <section className="flex-1 rounded-lg"><p className="whitespace-pre-wrap text-sm text-cu-ink">{revision.notes}</p>{leader && <p className="mt-3 text-sm text-cu-muted">Submit revisi ini akan kembali masuk review Leader sampai Leader approve.</p>}</section>; }
export function RevisionHistoryItem({ revision }: { revision: OddsTaskRevision }) {
  const typeLabel = revision.revision_type === "leader" ? "Leader" : "Client";
  const statusLabel = revision.status.replaceAll("_", " ");

  return (
    <article className="relative overflow-hidden rounded-lg border border-cu-border/80 bg-white px-2.5 py-2">
      <span className="absolute inset-y-0 left-0 w-0.5 bg-cu-info/60" aria-hidden="true" />
      <div className="flex items-center justify-between gap-2 pl-1">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold capitalize text-cu-ink">{typeLabel}</span>
            <span className="h-1 w-1 rounded-full bg-cu-info/50" aria-hidden="true" />
            <span className="text-[10px] font-medium capitalize text-cu-muted">{statusLabel}</span>
          </div>
          <p className="mt-1 line-clamp-1 whitespace-pre-wrap text-[11px] leading-4 text-cu-muted">{revision.notes}</p>
        </div>
        <span className="shrink-0 rounded-full border border-cu-info/20 bg-cu-info/10 px-1.5 py-0.5 text-[9px] font-medium text-cu-info">
          Revisi
        </span>
      </div>
    </article>
  );
}

export function RevisionHistoryPanel({ revisions, selectedRevisionId, onSelect }: { revisions: OddsTaskRevision[]; selectedRevisionId?: number | null; onSelect?: (id: number) => void }) {
  if (revisions.length === 0) return <RevisionEmptyState />;

  const chronological = [...revisions].sort((a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime());
  const sorted = [...revisions].sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime());
  const latestId = sorted[0]?.id;
  const roman = ["I", "II", "III", "IV", "V"];

  return <section className="h-full min-h-0 overflow-y-auto rounded-2xl border border-cu-border bg-white !p-2 !pt-5"><div className="divide-y divide-cu-border/60">{sorted.map((revision) => {
    const revisionNumber = chronological.findIndex((item) => item.id === revision.id) + 1;
    const isLatest = revision.id === latestId;
    const isSelected = selectedRevisionId === revision.id;
    return <button key={revision.id} type="button" onClick={() => onSelect?.(revision.id)} className={`relative flex w-full items-center gap-3 px-1 py-2.5 text-left transition-colors ${isSelected ? "bg-cu-info/[0.06]" : "hover:bg-black/[0.025]"}`}><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold ${isLatest ? "bg-cu-info text-white" : "bg-cu-surface text-cu-muted ring-1 ring-inset ring-cu-border"}`}>{roman[revisionNumber - 1] ?? revisionNumber}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="text-xs font-semibold capitalize text-cu-ink">{revision.revision_type === "leader" ? "Leader" : "Client"}</span>{isLatest && <span className="rounded-sm bg-cu-info/10 px-1.5 py-0.5 text-[9px] font-medium text-cu-info">Terbaru</span>}</div><p className="mt-0.5 truncate text-[10px] text-cu-muted">{revision.created_at ? new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(revision.created_at)) : "Waktu belum tersedia"}</p></div><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${isLatest ? "bg-cu-info" : "bg-cu-border"}`} aria-label={isLatest ? "Revisi terbaru" : "Revisi"} /></button>;
  })}</div></section>;
}
