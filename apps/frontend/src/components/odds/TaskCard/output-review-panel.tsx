"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { OddsRichTextEditor, stripRichText } from "@/components/odds-rich-text-editor";
import type { OutputFileAsset } from "./output-files-panel";

export function OutputReviewPanel({ onClose, onApprove, onRevisionSubmit, assets = [], version, busy = false }: { title?: string; onClose: () => void; onApprove?: () => void; onRevisionSubmit?: (note: string) => void; assets?: OutputFileAsset[]; version?: number | null; busy?: boolean }) {
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [revisionNote, setRevisionNote] = useState("");
  const submitRevision = () => {
    const note = revisionNote.trim();
    if (!stripRichText(note)) return;
    onRevisionSubmit?.(note);
  };

  return <section className="flex w-full flex-col gap-4 text-[#3b4446]" aria-label="Cek output task">
    <div className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-2"><MaterialIcon name="fact_check" size="sm" className="text-[#00a4ff]" /><h3 className="truncate text-base font-semibold leading-6">Cek Output</h3></div><button type="button" onClick={onClose} aria-label="Tutup cek output" className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#d9e1e6] text-[#3b4446] transition hover:bg-[#f3fbff]"><MaterialIcon name="close" size="sm" /></button></div>
    <div className="rounded-lg bg-white p-3 shadow-[0_5px_14px_rgba(44,42,39,0.06)]">{revisionOpen ? <div><div className="flex items-center gap-2"><MaterialIcon name="edit_note" size="sm" className="text-amber-600" /><p className="text-sm font-semibold">Minta Revisi</p></div><p className="mt-3 text-xs font-medium text-[#65757d]">Catatan revisi</p><div className="mt-1.5"><OddsRichTextEditor value={revisionNote} onChange={setRevisionNote} minHeight={120} placeholder="Tulis detail revisi yang perlu dikerjakan..." /></div><div className="mt-3 flex justify-end gap-2"><button type="button" disabled={busy} onClick={() => { setRevisionOpen(false); setRevisionNote(""); }} className="h-8 rounded-lg border border-[#d9e1e6] bg-white px-3 text-xs font-semibold text-[#3b4446] transition hover:bg-[#f3fbff] disabled:opacity-50">Batal</button><button type="button" disabled={busy || !stripRichText(revisionNote)} onClick={submitRevision} className="inline-flex h-8 items-center gap-1 rounded-lg bg-amber-500 px-3 text-xs font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"><MaterialIcon name="send" size="xs" />{busy ? "Memproses..." : "Kirim Revisi"}</button></div></div> : <><p className="mb-2 text-xs font-semibold text-[#7d7c7c]">{version != null ? `Output Versi ${version}` : "Output"}</p><div className="grid gap-2">{assets.length > 0 ? assets.map((asset) => <OutputRow key={asset.id} asset={asset} />) : <p className="rounded-lg border border-dashed border-[#d9e1e6] px-3 py-3 text-sm text-[#7d7c7c]">Belum ada file output yang tercatat.</p>}</div><div className="mt-3 flex items-center justify-end gap-2"><button type="button" disabled={busy} onClick={() => setRevisionOpen(true)} className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#d9e1e6] bg-white px-3 text-xs font-semibold text-[#3b4446] transition hover:bg-[#f3fbff] disabled:opacity-50"><MaterialIcon name="edit_note" size="xs" />Revisi</button><button type="button" disabled={busy} onClick={onApprove} className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#00a4ff] px-3 text-xs font-semibold text-white transition hover:bg-[#0077bf] disabled:opacity-50"><MaterialIcon name="check_circle" size="xs" />{busy ? "Memproses..." : "Approve"}</button></div></>}</div>
  </section>;
}

function OutputRow({ asset }: { asset: OutputFileAsset }) {
  const [copied, setCopied] = useState(false);
  const isLocal = asset.label.toLowerCase().includes("local file sharing");
  const icon = isLocal ? "link" : asset.label.match(/\.(png|jpe?g|webp)$/i) ? "image" : asset.label.match(/\.(mp4|mov|webm)$/i) ? "movie" : "insert_drive_file";
  const copyValue = async () => {
    if (!asset.url) return;
    await navigator.clipboard?.writeText(asset.url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };
  return <div className="flex items-center justify-between gap-3 rounded-lg border border-[#d9e1e6] bg-[#f8fafb] px-3 py-2.5 text-sm"><div className="flex min-w-0 items-center gap-2"><MaterialIcon name={icon} size="sm" className="shrink-0 text-[#0077bf]" /><div className="min-w-0"><p className="truncate font-medium text-[#3b4446]">{asset.label}</p>{isLocal && <p className="truncate text-xs text-[#7d7c7c]">{asset.url}</p>}</div></div>{isLocal ? <button type="button" onClick={() => void copyValue()} className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg bg-[#00a4ff] px-3 text-xs font-semibold text-white transition hover:bg-[#0077bf]"><MaterialIcon name="content_copy" size="xs" />{copied ? "Copied" : "Copy"}</button> : asset.url ? <a href={asset.url} target="_blank" rel="noreferrer" className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg bg-[#00a4ff] px-3 text-xs font-semibold text-white transition hover:bg-[#0077bf]"><MaterialIcon name="open_in_new" size="xs" />Buka</a> : null}</div>;
}
