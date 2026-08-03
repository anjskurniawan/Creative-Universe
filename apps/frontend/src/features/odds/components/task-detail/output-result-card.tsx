import type { OddsTaskResult } from "@/features/odds/api";

type OutputResultCardProps = { result: OddsTaskResult; formatDate: (value: string | null | undefined, includeTime?: boolean) => string };

export function OutputResultCard({ result, formatDate }: OutputResultCardProps) {
  const outputTotal = result.result_notes?.match(/Total Output:\s*([0-9]+)/i)?.[1];
  const note = result.result_notes?.replace(/Total Output:\s*[0-9]+\s*/i, "").trim();

  return <div className="rounded-2xl border border-cu-border/70 bg-white/70 p-3 shadow-sm sm:p-4">
    <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-cu-ink">Output terbaru</p><p className="mt-0.5 text-xs text-cu-muted">Versi {result.version_number} · {formatDate(result.submitted_at, true)}</p></div><div className="flex gap-1.5"><span className="rounded-full bg-cu-success/10 px-2.5 py-1 text-[10px] font-bold text-cu-success">{result.status === "pending_spv" ? "Proses Review Leader" : result.status}</span>{outputTotal && <span className="rounded-full bg-cu-info/10 px-2.5 py-1 text-[10px] font-bold text-cu-info">{outputTotal} Output</span>}</div></div>
    {note && <p className="mt-3 rounded-xl bg-cu-panel-soft px-3 py-2.5 text-sm leading-6 text-cu-ink">{note}</p>}
  </div>;
}
