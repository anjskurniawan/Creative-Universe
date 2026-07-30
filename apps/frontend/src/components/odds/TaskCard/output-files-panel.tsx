"use client";

import { MaterialIcon } from "@/components/ui/material-icon";
import { useState } from "react";

export type OutputFileAsset = { id: string | number; label: string; url: string };

export function OutputFilesPanel({ onClose, assets = [], version, rating, feedback, showReview = false, emptyText = "Belum ada file output yang tercatat." }: { onClose: () => void; assets?: OutputFileAsset[]; version?: number | null; rating?: number | null; feedback?: string | null; showReview?: boolean; emptyText?: string }) {
  return <section className="flex w-full flex-col gap-4 text-[#3b4446]" aria-label="File output task">
    <div className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-2"><MaterialIcon name="folder" size="sm" className="text-[#00a4ff]" /><h3 className="truncate text-base font-semibold leading-6">File Output</h3></div><button type="button" onClick={onClose} aria-label="Tutup file output" className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#d9e1e6] text-[#3b4446] transition hover:bg-[#f3fbff]"><MaterialIcon name="close" size="sm" /></button></div>
    <div className="rounded-lg bg-white p-3 shadow-[0_5px_14px_rgba(44,42,39,0.06)]">{version != null && <p className="mb-2 text-xs font-semibold text-[#7d7c7c]">Output Versi {version}</p>}<div className="grid gap-2">
      {assets.length > 0 ? assets.map((asset) => <OutputRow key={asset.id} icon={asset.label.toLowerCase().includes("local file sharing") ? "link" : asset.label.match(/\.(png|jpe?g|webp)$/i) ? "image" : asset.label.match(/\.(mp4|mov|webm)$/i) ? "movie" : "insert_drive_file"} label={asset.label} value={asset.label.toLowerCase().includes("local file sharing") ? asset.url : undefined} href={asset.label.toLowerCase().includes("local file sharing") ? undefined : asset.url || undefined} />) : <p className="rounded-lg border border-dashed border-[#d9e1e6] px-3 py-3 text-sm text-[#7d7c7c]">{emptyText}</p>}
    </div>{showReview && <TaskRatingFeedback rating={rating} feedback={feedback} />}</div>
  </section>;
}

function TaskRatingFeedback({ rating, feedback }: { rating?: number | null; feedback?: string | null }) {
  const hasFeedback = Boolean(feedback?.trim());
  return <div className="mt-3 grid gap-2 border-t border-[#e6edf2] pt-3">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-xs font-semibold text-[#3b4446]">Rating Client</p>
      {rating != null ? <div className="flex items-center gap-0.5" aria-label={`Rating ${rating} dari 5`}>{Array.from({ length: 5 }, (_, index) => <MaterialIcon key={index} name="star" size="xs" className={index < Math.round(rating) ? "text-[#f59e0b]" : "text-[#d9e1e6]"} />)}<span className="ml-1 text-xs font-semibold text-[#3b4446]">{rating}/5</span></div> : <span className="text-xs text-[#7d7c7c]">Belum ada rating</span>}
    </div>
    <div className="rounded-lg bg-[#f8fafb] px-3 py-2.5">
      <p className="text-[11px] font-semibold text-[#7d7c7c]">Feedback Client</p>
      <p className="mt-1 text-sm leading-relaxed text-[#3b4446]">{hasFeedback ? feedback : "Belum ada feedback dari client."}</p>
    </div>
  </div>;
}

function OutputRow({ icon, label, value, href }: { icon: string; label: string; value?: string; href?: string }) {
  const [copied, setCopied] = useState(false);
  const copyValue = async () => {
    if (!value) return;
    await navigator.clipboard?.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };
  return <div className="flex items-center justify-between gap-3 rounded-lg border border-[#d9e1e6] bg-[#f8fafb] px-3 py-2.5 text-sm"><div className="flex min-w-0 items-center gap-2"><MaterialIcon name={icon} size="sm" className="shrink-0 text-[#0077bf]" /><div className="min-w-0"><p className="truncate font-medium text-[#3b4446]">{label}</p>{value && <p className="truncate text-xs text-[#7d7c7c]">{value}</p>}</div></div>{href ? <a href={href} target="_blank" rel="noreferrer" className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg bg-[#00a4ff] px-3 text-xs font-semibold text-white transition hover:bg-[#0077bf]"><MaterialIcon name="open_in_new" size="xs" />Buka</a> : <button type="button" onClick={value ? () => void copyValue() : undefined} className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg bg-[#00a4ff] px-3 text-xs font-semibold text-white transition hover:bg-[#0077bf]"><MaterialIcon name={value ? "content_copy" : "open_in_new"} size="xs" />{value ? copied ? "Copied" : "Copy" : "Buka"}</button>}</div>;
}
