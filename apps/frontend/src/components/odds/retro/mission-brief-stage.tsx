"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { MaterialIcon } from "@/components/ui/material-icon";
import { OddsCategory, OddsDesignerProfile, OddsTaskAttachment } from "@/features/odds/api";
import { OddsGameboyFrame } from "@/components/odds/odds-gameboy-frame";
import { primaryButtonClass, secondaryButtonClass } from "./constants";
import { stripRichText } from "@/components/odds-rich-text-editor";
import { TaskForm } from "@/app/odds/new/types";

export function MissionBriefStage({
  initialStep,
  form,
  briefPlainText,
  attachments,
  uploading,
  onUpdate,
  onUpload,
  onRemoveAttachment,
  onBack,
  onContinue,
}: {
  initialStep: number;
  form: TaskForm;
  briefPlainText: string;
  attachments: OddsTaskAttachment[];
  uploading: boolean;
  onUpdate: (field: keyof TaskForm, value: string) => void;
  onUpload: (files: FileList | File[] | null) => Promise<OddsTaskAttachment[]>;
  onRemoveAttachment: (id: number) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const [missionStep, setMissionStep] = useState(initialStep);
  const [assetMode, setAssetMode] = useState<"add" | "skip" | null>(null);
  const missionNamed = Boolean(form.design_purpose.trim());
  const briefReady = Boolean(briefPlainText.trim());
  const canAdvanceMission = missionStep === 1
    ? missionNamed
    : missionStep === 4
      ? briefReady
      : true;

  const dateFromNow = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString("en-CA");
  };

  const deadlineOptions = [
    { label: "Tomorrow", value: dateFromNow(1) },
    { label: "+3 Days", value: dateFromNow(3) },
  ];
  const operatorMessage = [
    missionNamed ? "MISSION NAME SAVED. CHECK MATRIX LEVEL." : "ENTER A MISSION NAME TO BEGIN.",
    `${(form.important_matrix || "Q4").toUpperCase()} MATRIX LEVEL ASSIGNED.`,
    form.deadline ? "TARGET DATE LOCKED. KEEP MOVING." : "WE WILL SET THE BEST TIME AUTOMATICALLY.",
    briefReady ? "TRANSMISSION RECEIVED. OPEN THE MISSION SCROLL." : "WRITE A CLEAR BRIEF FOR THE CREATIVE.",
  ][missionStep - 1];

  return (
    <section className="mission-brief-stage relative flex h-full min-h-0 flex-col overflow-hidden border-2 border-[#24252b] bg-[#c9ccc0] p-2 text-[#24252b] shadow-[inset_0_0_0_2px_#eceee6] sm:min-h-[560px] sm:p-3">
      <span className="pointer-events-none absolute -right-7 -top-7 size-20 rotate-45 border-[11px] border-[#ba0dcb] opacity-30" />
      <header className="relative mb-2 flex shrink-0 items-center justify-between gap-2 border-b-2 border-[#24252b] bg-[#24252b] px-3 py-2 text-[#dfe2d3] sm:mb-3 sm:items-end sm:gap-3 sm:px-4 sm:py-3">
        <div className="min-w-0">
          <span className="hidden text-[10px] font-black uppercase tracking-[0.2em] text-[#f2b8f6] sm:block">Mission 0{missionStep}/04</span>
          <h2 className="whitespace-nowrap text-xs font-black uppercase tracking-[0.02em] text-[#dfe2d3] min-[360px]:text-sm min-[360px]:tracking-[0.04em] sm:mt-1 sm:text-3xl sm:tracking-[0.06em]">{["Name The Mission", "Important Matrix", "Set Mission Timer", "Transmit The Brief"][missionStep - 1]}</h2>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {[1, 2, 3, 4].map((step) => <span key={step} className={`size-2 border border-[#eceee6] transition-colors sm:h-3 sm:w-10 ${step <= missionStep ? "bg-[#ba0dcb]" : "bg-[#555850]"}`} />)}
        </div>
      </header>

      <div className="grid h-full min-h-0 flex-1 grid-cols-1 items-stretch gap-3">
        <div className={`${missionStep === 1 || missionStep === 2 || missionStep === 4 ? "flex" : "hidden"} h-full min-h-0 flex-col justify-center bg-transparent`}>
          <div className={`${missionStep === 1 || missionStep === 2 ? "grid" : "hidden"} mx-auto w-full shrink-0 gap-2 border-2 border-[#24252b] bg-[#eceee6] p-3 shadow-[2px_2px_0_#24252b] sm:gap-5 sm:border-[3px] sm:p-8 sm:shadow-[3px_3px_0_#24252b] ${missionStep === 2 ? "max-w-5xl md:grid-cols-3" : "max-w-3xl grid-cols-1"}`}>
            <label className={`${missionStep === 1 ? "block" : "hidden"} group`}>
              <span className="mb-2 flex items-center justify-between gap-2 text-[9px] font-black uppercase tracking-[0.08em] sm:mb-3 sm:text-xs sm:tracking-[0.12em]">
                <span className="whitespace-nowrap"><span className="sm:hidden">Mission Name</span><span className="hidden sm:inline">01 / Mission Name</span></span>
                <span className={`shrink-0 border-2 border-[#24252b] px-2 py-0.5 text-[8px] tracking-[0.08em] sm:px-3 sm:py-1 sm:text-[10px] sm:tracking-[0.1em] ${missionNamed ? "bg-[#ba0dcb] text-white" : "bg-[#dfe2d3] text-[#555850]"}`}>{missionNamed ? "Data OK" : "Required"}</span>
              </span>
              <textarea
                value={form.design_purpose}
                onChange={(event) => onUpdate("design_purpose", event.target.value)}
                placeholder="ENTER MISSION NAME_"
                rows={3}
                className="odds-scroll-hidden min-h-24 w-full resize-none overflow-y-auto border-2 border-[#24252b] bg-[#eceee6] px-4 py-3 text-lg font-black uppercase leading-7 tracking-[0.04em] outline-none shadow-[inset_2px_2px_0_#c9ccc0] placeholder:text-[#969a90] focus:border-[#ba0dcb] focus:bg-white sm:hidden"
              />
              <input
                value={form.design_purpose}
                onChange={(event) => onUpdate("design_purpose", event.target.value)}
                placeholder="ENTER MISSION NAME_"
                className="hidden h-20 w-full border-2 border-[#24252b] bg-[#eceee6] px-5 text-3xl font-black uppercase tracking-[0.05em] outline-none shadow-[inset_3px_3px_0_#c9ccc0] placeholder:text-[#969a90] focus:border-[#ba0dcb] focus:bg-white sm:block"
              />
            </label>

            {(() => {
              const matrixKey = (form.important_matrix || "Q4").toUpperCase();
              const quadranDesc = 
                matrixKey === "Q1" ? "Quadran I: Mendesak & Penting (High Priority)" :
                matrixKey === "Q2" ? "Quadran II: Penting (Strategic Task)" :
                matrixKey === "Q3" ? "Quadran III: Mendesak (Daily Queue)" :
                "Quadran IV: Normal (Standard Timeline)";

              return (
                <div className={`${missionStep === 2 ? "flex" : "hidden"} min-h-40 flex-col items-center justify-center gap-3 border-[3px] border-[#24252b] bg-[#ba0dcb] p-6 text-center text-white shadow-[3px_3px_0_#24252b]`}>
                  <span className="text-3xl font-black tracking-widest">{matrixKey} THREAT MATRIX</span>
                  <p className="text-xs font-bold text-white/90">{quadranDesc}</p>
                  <p className="text-[10px] uppercase text-white/70">Matrix level is automatically locked by selected category</p>
                </div>
              );
            })()}
          </div>

          <div className={`${missionStep === 4 ? "flex" : "hidden"} min-h-0 flex-1 flex-col border border-[#24252b] bg-[#24252b] sm:min-h-[360px]`}>
            <div className="flex shrink-0 items-center justify-between gap-2 px-2 py-1.5 text-[#eceee6] sm:px-3 sm:py-2">
              <span className="whitespace-nowrap text-[8px] font-black uppercase tracking-[0.08em] sm:text-[9px] sm:tracking-[0.16em]">Mission Transmission</span>
              <span className={`flex shrink-0 items-center gap-1 text-[7px] font-black uppercase sm:gap-1.5 sm:text-[8px] ${briefReady ? "text-[#f2b8f6]" : "text-[#969a90]"}`}><span className={`size-1.5 sm:size-2 ${briefReady ? "animate-pulse bg-[#ba0dcb]" : "bg-[#666961]"}`} /><span className="sm:hidden">{briefReady ? "Ready" : "Empty"}</span><span className="hidden sm:inline">{briefReady ? "Signal Clear" : "No Signal"}</span></span>
            </div>
            <RetroBriefEditor value={form.brief_text} onChange={(value) => onUpdate("brief_text", value)} onUploadImage={onUpload} />
          </div>
        </div>

        <aside className={`${missionStep === 3 ? "flex" : "hidden"} h-full min-h-0 flex-col justify-center gap-3`}>
          <div className={`${missionStep === 3 ? "flex" : "hidden"} relative mx-auto h-full w-full max-w-3xl flex-col justify-center border-2 border-[#24252b] bg-[#eceee6] p-3 shadow-[2px_2px_0_#24252b] sm:block sm:h-auto sm:border-[3px] sm:p-8 sm:shadow-[3px_3px_0_#24252b]`}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-[0.16em]">Mission Timer</span>
              <MaterialIcon name="timer" size="sm" />
            </div>
            <p className="mb-3 text-[9px] font-bold leading-4 text-[#666961] sm:mb-4 sm:text-sm sm:leading-6">Leave this empty to let us choose the best timing automatically for your request.</p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {deadlineOptions.map((option) => (
                <button key={option.label} type="button" onClick={() => onUpdate("deadline", option.value)} className={`border-2 border-[#24252b] px-2 py-2 text-[8px] font-black uppercase transition sm:py-3 sm:text-[9px] ${form.deadline === option.value ? "bg-[#ba0dcb] text-white hover:bg-[#a80cba]" : "bg-[#dfe2d3] hover:bg-white"}`}>{option.label}</button>
              ))}
            </div>
            <RetroDatePicker value={form.deadline} onChange={(value) => onUpdate("deadline", value)} />
          </div>

          <div className={`${missionStep === 99 && assetMode !== "add" ? "grid" : "hidden"} mx-auto w-full max-w-4xl gap-5 border-[3px] border-[#24252b] bg-[#eceee6] p-8 shadow-[3px_3px_0_#24252b] md:grid-cols-2`}>
            <div className="md:col-span-2">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#666961]">Optional Mission Data</span>
              <h3 className="mt-2 text-2xl font-black uppercase tracking-[0.04em]">Do you have references?</h3>
              <p className="mt-2 text-sm font-bold text-[#666961]">References can help the creative understand your direction, but they are not required.</p>
            </div>
            <button type="button" onClick={() => setAssetMode("add")} className="group flex min-h-48 flex-col border-[3px] border-[#24252b] bg-[#dfe2d3] p-5 text-left shadow-[3px_3px_0_#777a72] transition hover:-translate-y-1 hover:bg-white hover:shadow-[5px_5px_0_#24252b]">
              <span className="flex size-12 items-center justify-center border-2 border-[#24252b] bg-[#ba0dcb] text-white"><MaterialIcon name="add_photo_alternate" size="lg" /></span>
              <span className="mt-5 text-xl font-black uppercase">Yes, I Have</span>
              <span className="mt-2 text-xs font-bold leading-5 text-[#666961]">Add links, files, or visual notes to the mission.</span>
              <span className="mt-auto pt-4 text-[9px] font-black uppercase text-[#ba0dcb]">Open Inventory ›</span>
            </button>
            <button type="button" onClick={() => setAssetMode("skip")} className={`group flex min-h-48 flex-col border-[3px] border-[#24252b] p-5 text-left transition hover:-translate-y-1 hover:shadow-[5px_5px_0_#24252b] ${assetMode === "skip" ? "bg-[#ba0dcb] text-white shadow-[3px_3px_0_#24252b]" : "bg-[#dfe2d3] shadow-[3px_3px_0_#777a72] hover:bg-white"}`}>
              <span className={`flex size-12 items-center justify-center border-2 border-[#24252b] ${assetMode === "skip" ? "bg-white text-[#ba0dcb]" : "bg-[#c9ccc0]"}`}><MaterialIcon name="fast_forward" size="lg" /></span>
              <span className="mt-5 text-xl font-black uppercase">No Reference</span>
              <span className={`mt-2 text-xs font-bold leading-5 ${assetMode === "skip" ? "text-white/85" : "text-[#666961]"}`}>Continue now and let the creative develop the direction.</span>
              <span className="mt-auto pt-4 text-[9px] font-black uppercase">{assetMode === "skip" ? "Selected" : "Continue Without Assets ›"}</span>
            </button>
          </div>

          <div className={`${missionStep === 99 && assetMode === "add" ? "block" : "hidden"} mx-auto w-full max-w-5xl border-[3px] border-[#24252b] bg-[#eceee6] p-6 shadow-[3px_3px_0_#24252b]`}>
            <div className="mb-5 flex items-end justify-between border-b-2 border-[#24252b] pb-4">
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#ba0dcb]">Optional Reference Kit</span>
                <h3 className="mt-1 text-2xl font-black uppercase tracking-[0.04em]">Build The Asset Pack</h3>
              </div>
              <span className="border-2 border-[#24252b] bg-[#dfe2d3] px-3 py-1.5 text-[9px] font-black uppercase">{attachments.length} / 8 Files</span>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(240px,2fr)]">
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em]"><span className="flex size-6 items-center justify-center bg-[#24252b] text-[8px] text-white">01</span> Reference Link</span>
                  <span className="flex h-12 items-center border-2 border-[#24252b] bg-[#dfe2d3] focus-within:border-[#ba0dcb] focus-within:bg-white">
                    <MaterialIcon name="link" size="sm" className="ml-3 shrink-0 text-[#666961]" />
                    <input value={form.reference_visual} onChange={(event) => onUpdate("reference_visual", event.target.value)} placeholder="Figma, Drive, Pinterest, or website URL" className="h-full min-w-0 flex-1 bg-transparent px-3 text-xs font-bold outline-none placeholder:text-[#777a72]" />
                  </span>
                </label>

                <div>
                  <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em]"><span className="flex size-6 items-center justify-center bg-[#24252b] text-[8px] text-white">02</span> Reference Files</span>
                  <div className="retro-scrollbar grid max-h-32 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-4">
                    {attachments.map((attachment) => (
                      <button key={attachment.id} type="button" onClick={() => onRemoveAttachment(attachment.id)} title={`Remove ${attachment.name}`} className="group relative flex h-16 min-w-0 items-center gap-2 overflow-hidden border-2 border-[#24252b] bg-[#dfe2d3] px-2 text-left hover:bg-[#f2b8f6]">
                        <MaterialIcon name="draft" size="sm" className="shrink-0" />
                        <span className="min-w-0 truncate text-[7px] font-black uppercase">{attachment.name}</span>
                        <span className="absolute inset-0 hidden items-center justify-center bg-[#24252b]/90 text-[8px] font-black uppercase text-white group-hover:flex">Remove</span>
                      </button>
                    ))}
                    <label className="flex h-16 cursor-pointer items-center justify-center gap-2 border-2 border-dashed border-[#24252b] bg-[#dfe2d3] px-3 transition hover:bg-white">
                      <MaterialIcon name={uploading ? "hourglass_top" : "upload_file"} size="sm" className={uploading ? "animate-spin" : ""} />
                      <span className="text-[8px] font-black uppercase">{uploading ? "Uploading" : "Add Files"}</span>
                      <input type="file" multiple disabled={uploading} onChange={(event) => void onUpload(event.target.files)} className="sr-only" />
                    </label>
                  </div>
                </div>
              </div>

              <label className="flex flex-col border-2 border-[#24252b] bg-[#dfe2d3] p-4">
                <span className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.12em]"><span className="flex items-center gap-2"><MaterialIcon name="sticky_note_2" size="sm" /> Quick Notes</span><span className="text-[8px] text-[#777a72]">Optional</span></span>
                <p className="mt-2 text-[9px] font-bold leading-4 text-[#666961]">Add access instructions, passwords, or a short visual direction.</p>
                <textarea value={form.attachment_notes} onChange={(event) => onUpdate("attachment_notes", event.target.value)} placeholder="Type a short note..." className="mt-3 h-24 resize-none border-2 border-[#24252b] bg-[#eceee6] p-3 text-xs font-bold leading-5 outline-none placeholder:text-[#777a72] focus:border-[#ba0dcb] focus:bg-white" />
                <span className="mt-2 text-right text-[8px] font-black uppercase text-[#777a72]">{form.attachment_notes.length} chars</span>
              </label>
            </div>
          </div>

        </aside>

      </div>

      <div className="mt-3 flex shrink-0 items-center justify-between border-t-2 border-[#24252b] pt-3">
        <RobotOperator message={operatorMessage} />
        <div className="ml-auto flex gap-2">
          <button type="button" onClick={missionStep === 1 ? onBack : () => setMissionStep((step) => step - 1)} className={secondaryButtonClass}>Back</button>
          {missionStep < 4 ? (
            <button type="button" onClick={() => setMissionStep((step) => step + 1)} disabled={!canAdvanceMission} className={primaryButtonClass}>{missionStep === 3 && !form.deadline ? "Continue Automatically" : "Next"} <MaterialIcon name="arrow_forward" size="sm" /></button>
          ) : (
            <button type="button" onClick={onContinue} disabled={!briefReady} className={primaryButtonClass}>Next <MaterialIcon name="arrow_forward" size="sm" /></button>
          )}
        </div>
      </div>
    </section>
  );
}


export function RetroBriefEditor({ value, onChange, onUploadImage }: { value: string; onChange: (value: string) => void; onUploadImage: (files: FileList | File[] | null) => Promise<OddsTaskAttachment[]> }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [linkPanelOpen, setLinkPanelOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [toolbarHint, setToolbarHint] = useState({ overflow: false, atEnd: false });
  const isEmpty = !stripRichText(value);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== value) editor.innerHTML = value;
  }, [value]);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return;

    const syncToolbarHint = () => {
      const maxScroll = toolbar.scrollWidth - toolbar.clientWidth;
      setToolbarHint({ overflow: maxScroll > 2, atEnd: toolbar.scrollLeft >= maxScroll - 2 });
    };

    syncToolbarHint();
    const observer = new ResizeObserver(syncToolbarHint);
    observer.observe(toolbar);
    window.addEventListener("resize", syncToolbarHint);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncToolbarHint);
    };
  }, []);

  const tools = [
    { command: "bold", icon: "format_bold", label: "Bold" },
    { command: "italic", icon: "format_italic", label: "Italic" },
    { command: "underline", icon: "format_underlined", label: "Underline" },
    { command: "insertUnorderedList", icon: "format_list_bulleted", label: "Bullet list" },
    { command: "insertOrderedList", icon: "format_list_numbered", label: "Numbered list" },
    { command: "undo", icon: "undo", label: "Undo" },
    { command: "redo", icon: "redo", label: "Redo" },
  ];

  const syncActiveTools = () => {
    const statefulCommands = ["bold", "italic", "underline", "insertUnorderedList", "insertOrderedList"];
    setActiveTools(statefulCommands.filter((command) => {
      try {
        return document.queryCommandState(command);
      } catch {
        return false;
      }
    }));
  };

  const runCommand = (command: string, commandValue?: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    document.execCommand(command, false, commandValue);
    onChange(editor.innerHTML);
    syncActiveTools();
  };

  const rememberSelection = () => {
    const selection = window.getSelection();
    if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (!savedRangeRef.current) return;
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(savedRangeRef.current);
  };

  const insertLink = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const normalized = /^https?:\/\//i.test(linkUrl.trim()) ? linkUrl.trim() : `https://${linkUrl.trim()}`;
    if (!/^https?:\/\/[^\s]+$/i.test(normalized)) return;
    editor.focus();
    restoreSelection();
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      document.execCommand("createLink", false, normalized);
      const anchor = selection.anchorNode?.parentElement?.closest("a");
      anchor?.setAttribute("data-reference-type", "link");
      anchor?.setAttribute("target", "_blank");
      anchor?.setAttribute("rel", "noopener noreferrer");
    } else {
      document.execCommand("insertHTML", false, `<a href="${normalized}" data-reference-type="link" target="_blank" rel="noopener noreferrer">${normalized}</a>`);
    }
    onChange(editor.innerHTML);
    setLinkUrl("");
    setLinkPanelOpen(false);
  };

  const insertImages = async (files: FileList | File[] | null) => {
    const editor = editorRef.current;
    if (!editor || !files?.length) return;
    setImageUploading(true);
    rememberSelection();
    const uploaded = await onUploadImage(files);
    editor.focus();
    restoreSelection();
    uploaded.filter((file) => file.mime_type?.startsWith("image/")).forEach((file) => {
      const safeName = file.name.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
      document.execCommand("insertHTML", false, `<figure data-reference-type="image" data-attachment-id="${file.id}"><img src="/api/v1/odds/uploads/${file.id}/content" alt="${safeName}"><figcaption>${safeName}</figcaption></figure><p><br></p>`);
    });
    onChange(editor.innerHTML);
    setImageUploading(false);
  };

  const pastePlainTextAsParagraphs = (text: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    const escapeHtml = (input: string) => input.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
    const normalizedText = text
      .replace(/\r\n?/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n");
    const paragraphs = normalizedText
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim()
        ? `<p>${paragraph.split("\n").map(escapeHtml).join("<br>")}</p>`
        : "<p><br></p>")
      .join("<p><br></p>");
    document.execCommand("insertHTML", false, paragraphs || "<p><br></p>");
    onChange(editor.innerHTML);
  };

  return (
    <div className="mission-terminal-editor flex min-h-0 flex-1 flex-col bg-[#eceee6]">
      <div className="relative flex shrink-0 items-center border-b-2 border-[#24252b] bg-[#c9ccc0] p-1 sm:justify-between sm:gap-2 sm:p-2">
        <div ref={toolbarRef} onScroll={() => {
          const toolbar = toolbarRef.current;
          if (!toolbar) return;
          const maxScroll = toolbar.scrollWidth - toolbar.clientWidth;
          setToolbarHint({ overflow: maxScroll > 2, atEnd: toolbar.scrollLeft >= maxScroll - 2 });
        }} className="retro-scrollbar flex w-full flex-nowrap gap-1 overflow-x-auto p-0.5 sm:w-auto sm:flex-wrap sm:gap-1.5 sm:overflow-visible sm:p-0" role="toolbar" aria-label="Brief formatting tools">
          {tools.map((tool) => (
            <button
              key={tool.command}
              type="button"
              title={tool.label}
              aria-label={tool.label}
              aria-pressed={activeTools.includes(tool.command)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand(tool.command)}
              className={`flex size-8 shrink-0 items-center justify-center border-2 border-[#24252b] shadow-[2px_2px_0_#777a72] transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#24252b] active:translate-y-0 active:shadow-none sm:size-9 ${activeTools.includes(tool.command) ? "bg-[#ba0dcb] text-white" : "bg-[#eceee6] text-[#24252b] hover:bg-white"}`}
            >
              <MaterialIcon name={tool.icon} size="sm" />
            </button>
          ))}
          <span className="mx-1 hidden w-px bg-[#24252b]/40 sm:block" />
          <button type="button" title="Clear formatting" aria-label="Clear formatting" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("removeFormat")} className="flex size-8 shrink-0 items-center justify-center gap-1.5 border-2 border-[#24252b] bg-[#eceee6] text-[8px] font-black uppercase shadow-[2px_2px_0_#777a72] hover:bg-white active:shadow-none sm:h-9 sm:w-auto sm:px-3"><MaterialIcon name="format_clear" size="sm" /><span className="hidden sm:inline">Clear</span></button>
          <button type="button" title="Insert link" aria-label="Insert link" aria-pressed={linkPanelOpen} onMouseDown={(event) => { event.preventDefault(); rememberSelection(); }} onClick={() => setLinkPanelOpen((open) => !open)} className={`flex size-8 shrink-0 items-center justify-center gap-1.5 border-2 border-[#24252b] text-[8px] font-black uppercase shadow-[2px_2px_0_#777a72] sm:h-9 sm:w-auto sm:px-3 ${linkPanelOpen ? "bg-[#ba0dcb] text-white" : "bg-[#eceee6] hover:bg-white"}`}><MaterialIcon name="link" size="sm" /><span className="hidden sm:inline">Link</span></button>
          <label title="Insert image" aria-label="Insert image" className="flex size-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 border-2 border-[#24252b] bg-[#eceee6] text-[8px] font-black uppercase shadow-[2px_2px_0_#777a72] hover:bg-white sm:h-9 sm:w-auto sm:px-3">
            <MaterialIcon name={imageUploading ? "hourglass_top" : "image"} size="sm" className={imageUploading ? "animate-spin" : ""} /><span className="hidden sm:inline">{imageUploading ? "Uploading" : "Image"}</span>
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple disabled={imageUploading} onChange={(event) => void insertImages(event.target.files)} className="sr-only" />
          </label>
        </div>
        {toolbarHint.overflow && !toolbarHint.atEnd && <span className="pointer-events-none absolute bottom-1 right-1 top-1 flex items-center bg-gradient-to-l from-[#c9ccc0] via-[#c9ccc0] to-transparent pl-5 sm:hidden"><span className="animate-pulse border-2 border-[#24252b] bg-[#ba0dcb] px-1.5 py-1 text-[6px] font-black uppercase tracking-[0.08em] text-white shadow-[2px_2px_0_#24252b]">Swipe ›</span></span>}
        <span className="hidden text-[8px] font-black uppercase tracking-[0.12em] text-[#666961] lg:block">Ctrl+B · Ctrl+I · Ctrl+U</span>
      </div>

      {linkPanelOpen && (
        <div className="flex shrink-0 items-center gap-1 border-b-2 border-[#24252b] bg-[#dfe2d3] p-1 sm:gap-2 sm:p-2">
          <MaterialIcon name="link" size="sm" className="shrink-0" />
          <input value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} onKeyDown={(event) => event.key === "Enter" && (event.preventDefault(), insertLink())} placeholder="https://figma.com/..." className="h-8 min-w-0 flex-1 border-2 border-[#24252b] bg-[#eceee6] px-2 text-[10px] font-bold outline-none focus:border-[#ba0dcb] sm:h-9 sm:px-3 sm:text-xs" autoFocus />
          <button type="button" onClick={insertLink} disabled={!linkUrl.trim()} aria-label="Insert link" className="flex size-8 items-center justify-center border-2 border-[#24252b] bg-[#ba0dcb] text-[8px] font-black uppercase text-white disabled:bg-[#a9aca2] sm:h-9 sm:w-auto sm:px-4"><MaterialIcon name="check" size="sm" /><span className="hidden sm:inline">Insert Link</span></button>
          <button type="button" onClick={() => setLinkPanelOpen(false)} aria-label="Close link panel" className="flex size-8 items-center justify-center border-2 border-[#24252b] bg-[#eceee6] sm:size-9"><MaterialIcon name="close" size="sm" /></button>
        </div>
      )}

      <div className="relative min-h-0 flex-1">
        {isEmpty && <span className="pointer-events-none absolute left-3 top-3 z-10 max-w-[calc(100%-24px)] text-xs font-bold leading-5 text-[#969a90] sm:left-5 sm:top-5 sm:max-w-xl sm:text-sm sm:leading-6">Describe the design need, dimensions, copy, channel, and final output...</span>}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Mission brief editor"
          onInput={(event) => {
            onChange(event.currentTarget.innerHTML);
            syncActiveTools();
          }}
          onKeyUp={() => { syncActiveTools(); rememberSelection(); }}
          onMouseUp={() => { syncActiveTools(); rememberSelection(); }}
          onKeyDown={rememberSelection}
          onFocus={syncActiveTools}
          onPaste={(event) => {
            const items = Array.from(event.clipboardData.items || []);
            const pastedImages: File[] = [];
            for (const item of items) {
              if (item.type.startsWith("image/")) {
                const file = item.getAsFile();
                if (file) pastedImages.push(file);
              }
            }
            if (pastedImages.length === 0 && event.clipboardData.files?.length) {
              for (const file of Array.from(event.clipboardData.files)) {
                if (file.type.startsWith("image/")) pastedImages.push(file);
              }
            }

            if (pastedImages.length > 0) {
              event.preventDefault();
              void insertImages(pastedImages);
              return;
            }

            event.preventDefault();
            pastePlainTextAsParagraphs(event.clipboardData.getData("text/plain"));
          }}
          className="retro-scrollbar h-full min-h-0 overflow-y-auto bg-[#eceee6] p-3 text-sm font-normal leading-6 text-[#24252b] outline-none [caret-color:#ba0dcb] focus:bg-white sm:min-h-[300px] sm:p-5 sm:leading-7 [&_a]:font-black [&_a]:text-[#ba0dcb] [&_a]:underline [&_figcaption]:border-x-2 [&_figcaption]:border-b-2 [&_figcaption]:border-[#24252b] [&_figcaption]:bg-[#c9ccc0] [&_figcaption]:px-3 [&_figcaption]:py-1 [&_figcaption]:text-[9px] [&_figcaption]:font-black [&_figcaption]:uppercase [&_figure]:my-4 [&_figure]:inline-block [&_figure]:max-w-md [&_figure]:align-top [&_img]:max-h-64 [&_img]:w-auto [&_img]:border-2 [&_img]:border-[#24252b] [&_img]:object-contain [&_li]:ml-6 [&_ol]:list-decimal [&_p]:mb-3 [&_ul]:list-disc"
        />
      </div>

    </div>
  );
}


export function RobotOperator({ message }: { message: string }) {
  const [typedMessage, setTypedMessage] = useState("");

  useEffect(() => {
    let character = 0;
    let typing: number | undefined;
    const start = window.setTimeout(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setTypedMessage(message);
        return;
      }

      setTypedMessage("");
      typing = window.setInterval(() => {
        character += 1;
        setTypedMessage(message.slice(0, character));
        if (character >= message.length && typing) window.clearInterval(typing);
      }, 28);
    }, 0);

    return () => {
      window.clearTimeout(start);
      if (typing) window.clearInterval(typing);
    };
  }, [message]);

  return (
    <div className="hidden h-8 min-w-0 items-center gap-2 sm:flex" aria-live="polite">
      <span className="relative flex size-7 shrink-0 animate-pulse items-center justify-center border-2 border-[#24252b] bg-[#ba0dcb] text-white shadow-[2px_2px_0_#24252b]">
        <MaterialIcon name="smart_toy" size="sm" />
        <span className="absolute -right-1 -top-1 size-2 animate-pulse border border-[#24252b] bg-[#dfe2d3]" />
      </span>
      <span className="flex h-7 min-w-0 items-center border-l-2 border-[#24252b] pl-2 text-[8px] font-black uppercase leading-none tracking-[0.12em] text-[#666961]">
        <span className="shrink-0 text-[#ba0dcb]">OP-04 ›&nbsp;</span><span className="truncate leading-none">{typedMessage}</span><span className="ml-1 inline-block h-3 w-1 shrink-0 animate-pulse bg-[#ba0dcb]" />
      </span>
    </div>
  );
}


export function RetroDatePicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const initialDate = value ? new Date(`${value}T00:00:00`) : new Date();
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, index) => {
    const day = index - firstDay + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });
  const formatDate = (day: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <div className="mt-3 sm:relative">
      <button type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} className={`flex h-11 w-full min-w-0 items-center justify-between gap-2 border-2 border-[#24252b] px-3 text-left text-[9px] font-black uppercase shadow-[2px_2px_0_#777a72] transition hover:bg-white sm:h-14 sm:px-4 sm:text-xs ${open ? "bg-white ring-2 ring-[#ba0dcb]" : "bg-[#dfe2d3]"}`}>
        <span className="min-w-0 truncate">{value ? new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Choose a specific date"}</span>
        <MaterialIcon name={open ? "expand_less" : "calendar_month"} size="sm" />
      </button>
      {open && (
        <div className="absolute inset-0 z-30 flex min-w-0 flex-col border-2 border-[#24252b] bg-[#eceee6] p-2 shadow-[3px_3px_0_#24252b] sm:inset-auto sm:left-auto sm:right-0 sm:top-[calc(100%+8px)] sm:block sm:w-full sm:min-w-[320px] sm:p-3 sm:shadow-[5px_5px_0_#24252b]">
          <div className="mb-2 flex items-center justify-between gap-2 border-b-2 border-[#24252b] pb-2 sm:hidden">
            <span className="min-w-0 truncate text-[9px] font-black uppercase tracking-[0.08em]">{viewDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</span>
            <span className="flex shrink-0 items-center gap-1">
              <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))} aria-label="Previous month" className="flex size-7 items-center justify-center border-2 border-[#24252b] bg-[#dfe2d3] hover:bg-white"><MaterialIcon name="chevron_left" size="sm" /></button>
              <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))} aria-label="Next month" className="flex size-7 items-center justify-center border-2 border-[#24252b] bg-[#dfe2d3] hover:bg-white"><MaterialIcon name="chevron_right" size="sm" /></button>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close calendar" className="flex size-7 items-center justify-center border-2 border-[#24252b] bg-[#24252b] text-[#eceee6] hover:bg-[#555850]"><MaterialIcon name="close" size="sm" /></button>
            </span>
          </div>
          <div className="mb-3 hidden items-center justify-between border-b-2 border-[#24252b] pb-3 sm:flex">
            <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))} className="flex size-9 items-center justify-center border-2 border-[#24252b] bg-[#dfe2d3] font-black hover:bg-white">‹</button>
            <span className="text-[9px] font-black uppercase tracking-[0.08em] sm:text-xs sm:tracking-[0.12em]">{viewDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</span>
            <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))} className="flex size-9 items-center justify-center border-2 border-[#24252b] bg-[#dfe2d3] font-black hover:bg-white">›</button>
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-7 gap-1 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={`${day}-${index}`} className="py-1 text-[8px] font-black text-[#666961]">{day}</span>)}
            {cells.map((day, index) => day ? (
              <button key={day} type="button" onClick={() => { onChange(formatDate(day)); setOpen(false); }} className={`min-h-5 border text-[8px] font-black transition hover:border-[#24252b] hover:bg-[#f2b8f6] sm:aspect-square sm:text-[9px] ${value === formatDate(day) ? "border-[#24252b] !bg-[#ba0dcb] text-white shadow-[2px_2px_0_#24252b]" : `border-transparent ${index % 7 === 0 ? "!bg-[#b9bdb1] sm:!bg-[#dfe2d3]" : "bg-[#dfe2d3]"}`}`}>{day}</button>
            ) : <span key={`empty-${index}`} />)}
          </div>
          {value && <button type="button" onClick={() => { onChange(""); setOpen(false); }} className="mt-2 w-full border-2 border-[#24252b] bg-[#dfe2d3] py-1.5 text-[7px] font-black uppercase hover:bg-white sm:mt-3 sm:py-2 sm:text-[8px]">Clear Date</button>}
        </div>
      )}
    </div>
  );
}


