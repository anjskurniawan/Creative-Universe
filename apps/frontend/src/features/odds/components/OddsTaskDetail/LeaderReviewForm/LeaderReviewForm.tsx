"use client";

import { OddsRichTextEditor } from "@/features/odds/components/OddsRichTextEditor/OddsRichTextEditor";

type LeaderReviewFormProps = { value: string; onChange: (value: string) => void; onReview: (decision: "approved" | "revision") => void };

export function LeaderReviewForm({ value, onChange, onReview }: LeaderReviewFormProps) {
  return <div className="rounded-2xl border border-cu-border/60 bg-cu-panel-soft/50 p-2"><label className="mb-1.5 block text-xs font-bold text-cu-ink">Catatan Proses Review Leader</label><OddsRichTextEditor value={value} onChange={onChange} placeholder="Tulis catatan review untuk desainer..." minHeight={96} toolbarMode="focus" className="min-h-[96px]" /><div className="mt-2 flex flex-wrap justify-end gap-2"><button type="button" onClick={() => onReview("approved")} className="inline-flex h-9 items-center rounded-xl border border-cu-success/30 bg-cu-success/10 px-3 text-xs font-bold text-cu-success">Leader ACC</button><button type="button" onClick={() => onReview("revision")} className="inline-flex h-9 items-center rounded-xl bg-cu-info px-3 text-xs font-bold text-white">Leader Revisi</button></div></div>;
}
