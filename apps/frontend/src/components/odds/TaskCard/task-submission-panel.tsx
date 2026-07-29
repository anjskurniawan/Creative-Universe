"use client";

import { type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { MaterialIcon } from "@/components/material-icon";

type TaskSubmissionPanelProps = {
  theme: "light" | "dark" | "retro";
  accentColor: string;
  outputBusy: boolean;
  outputShareLink: string;
  outputFiles: File[];
  outputTotal: string;
  outputDragActive: boolean;
  onShareLinkChange: (value: string) => void;
  onFilesChange: (files: FileList | File[]) => void;
  onTotalChange: (value: string) => void;
  onDragActiveChange: (active: boolean) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function TaskSubmissionPanel({ theme, accentColor, outputBusy, outputShareLink, outputFiles, outputTotal, outputDragActive, onShareLinkChange, onFilesChange, onTotalChange, onDragActiveChange, onClose, onSubmit }: TaskSubmissionPanelProps) {
  const shellClass = theme === "dark" ? "text-[#f1f1f1]" : theme === "retro" ? "font-mono text-[#24252b]" : "text-[#3b4446]";

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) onFilesChange(event.target.files);
    event.currentTarget.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    onDragActiveChange(false);
    onFilesChange(event.dataTransfer.files);
  };

  return <div className={`flex w-full flex-col gap-4 ${shellClass}`}>
    <div className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-2"><MaterialIcon name="check_circle" size="sm" className="text-[#00a4ff]" style={{ color: accentColor }} /><p className="truncate text-base font-semibold leading-6">Selesaikan Task</p></div><button type="button" onClick={onClose} aria-label="Tutup panel selesaikan task" className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#d9e1e6] text-[#3b4446] transition hover:bg-[#f3fbff]"><MaterialIcon name="close" size="sm" /></button></div>
    <form onSubmit={onSubmit} className="flex flex-col gap-3 rounded-lg bg-white p-2 shadow-[0_5px_14px_rgba(44,42,39,0.06)]">
      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-1.5 text-xs font-semibold text-cu-ink"><span>Link Local File Sharing</span><input type="text" value={outputShareLink} onChange={(event) => onShareLinkChange(event.target.value)} placeholder="\\\\Server\\Share\\Example" className="h-10 rounded-lg border border-cu-border bg-white px-3 text-sm font-medium outline-none transition placeholder:text-cu-muted/70 focus:border-cu-info focus:ring-2 focus:ring-cu-info/10" /></label>
        <label className="grid gap-1.5 text-xs font-semibold text-cu-ink"><span>Total Output</span><input type="number" min="1" step="1" value={outputTotal} onChange={(event) => onTotalChange(event.target.value)} placeholder="0" className="h-10 min-w-0 w-full appearance-[textfield] rounded-lg border border-cu-border bg-white px-3 text-sm font-medium outline-none transition placeholder:text-cu-muted/70 focus:border-cu-info focus:ring-2 focus:ring-cu-info/10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" /></label>
      </div>
      <label onDragOver={(event) => { event.preventDefault(); onDragActiveChange(true); }} onDragLeave={() => onDragActiveChange(false)} onDrop={handleDrop} className={`grid h-[88px] w-full cursor-pointer grid-cols-[auto_1fr] items-center gap-x-3 rounded-lg border border-dashed px-3 text-xs transition ${outputDragActive ? "border-cu-info bg-cu-info/10 text-cu-info" : "border-cu-border bg-cu-panel-soft text-cu-muted hover:border-cu-info/60 hover:bg-cu-info/5"}`}>
        <input type="file" multiple className="sr-only" onChange={handleFileChange} /><span className="row-span-2 flex size-8 items-center justify-center rounded-lg bg-white text-cu-ink shadow-sm"><MaterialIcon name="upload_file" size="sm" /></span><span className="flex min-w-0 flex-col justify-center gap-0"><span className="truncate font-semibold leading-[14px] text-cu-ink">File Upload</span>{outputFiles.length > 0 ? <span className="truncate text-[11px] leading-[14px] text-cu-info">{outputFiles.length} file: {outputFiles.map((file) => file.name).join(", ")}</span> : <span className="truncate text-[11px] leading-[14px]">Multi-file, drag and drop.</span>}</span>
      </label>
      <button type="submit" disabled={outputBusy || !outputTotal || (outputFiles.length === 0 && !outputShareLink.trim())} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#00a4ff] px-4 text-sm font-semibold text-white transition hover:bg-[#0077bf] disabled:opacity-50"><MaterialIcon name="upload" size="sm" />{outputBusy ? "Kirim..." : "Submit"}</button>
    </form>
  </div>;
}
