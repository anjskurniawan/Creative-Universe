"use client";

import { useEffect, useRef, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";

export type RichTextUpload = {
  id: number;
  name: string;
  mime_type?: string | null;
};

export function stripRichText(value: string): string {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export function RichTextViewer({ html }: { html: string }) {
  const text = stripRichText(html);

  return (
    <div className="min-h-32 whitespace-pre-wrap rounded-lg border border-cu-border bg-cu-panel-soft px-4 py-3 text-sm leading-6 text-cu-ink">
      {text || "Brief belum diisi."}
    </div>
  );
}

export function OddsRichTextEditor({
  value,
  onChange,
  minHeight = 220,
  placeholder = "Tulis kebutuhan desain, ukuran, copy, channel, dan output final.",
  onUploadImage,
}: {
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
  placeholder?: string;
  onUploadImage?: (files: FileList | File[]) => Promise<RichTextUpload[]>;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const isEmpty = !stripRichText(value);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== value) editor.innerHTML = value;
  }, [value]);

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

  const updateValue = () => {
    const editor = editorRef.current;
    if (editor) onChange(editor.innerHTML);
  };

  const runCommand = (command: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    document.execCommand(command, false);
    updateValue();
    syncActiveTools();
  };

  const escapeHtml = (input: string) => input.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);

  const pastePlainTextAsParagraphs = (text: string) => {
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
    updateValue();
  };

  const insertImages = async (files: FileList | File[]) => {
    if (!onUploadImage) return;
    const editor = editorRef.current;
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (!editor || imageFiles.length === 0) return;

    setImageUploading(true);
    rememberSelection();
    try {
      const uploaded = await onUploadImage(imageFiles);
      editor.focus();
      restoreSelection();
      uploaded.filter((file) => file.mime_type?.startsWith("image/")).forEach((file) => {
        const safeName = escapeHtml(file.name);
        document.execCommand("insertHTML", false, `<figure data-reference-type="image" data-attachment-id="${file.id}"><img src="/api/v1/odds/uploads/${file.id}/content" alt="${safeName}"><figcaption>${safeName}</figcaption></figure><p><br></p>`);
      });
      updateValue();
    } finally {
      setImageUploading(false);
    }
  };

  const tools = [
    { command: "bold", icon: "format_bold", label: "Bold" },
    { command: "italic", icon: "format_italic", label: "Italic" },
    { command: "underline", icon: "format_underlined", label: "Underline" },
    { command: "insertUnorderedList", icon: "format_list_bulleted", label: "Bullet list" },
    { command: "insertOrderedList", icon: "format_list_numbered", label: "Numbered list" },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-cu-border bg-white">
      <div className="odds-scroll-hidden flex items-center gap-1 overflow-x-auto border-b border-cu-border bg-cu-panel-soft p-1.5">
        {tools.map((tool) => (
          <button
            key={tool.command}
            type="button"
            title={tool.label}
            aria-label={tool.label}
            aria-pressed={activeTools.includes(tool.command)}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand(tool.command)}
            className={`flex size-8 shrink-0 items-center justify-center rounded-md border text-cu-ink transition hover:bg-white ${activeTools.includes(tool.command) ? "border-cu-info bg-cu-info/10 text-cu-info" : "border-cu-border bg-white"}`}
          >
            <MaterialIcon name={tool.icon} size="sm" />
          </button>
        ))}
        <span className="mx-1 h-5 w-px shrink-0 bg-cu-border" />
        <button type="button" title="Clear formatting" aria-label="Clear formatting" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("removeFormat")} className="flex size-8 shrink-0 items-center justify-center rounded-md border border-cu-border bg-white text-cu-ink transition hover:bg-white">
          <MaterialIcon name="format_clear" size="sm" />
        </button>
        {onUploadImage && (
          <label title="Insert image" aria-label="Insert image" className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-cu-border bg-white text-cu-ink transition hover:bg-white">
            <MaterialIcon name={imageUploading ? "hourglass_top" : "image"} size="sm" className={imageUploading ? "animate-spin" : ""} />
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple disabled={imageUploading} onChange={(event) => event.target.files && void insertImages(event.target.files)} className="sr-only" />
          </label>
        )}
      </div>
      <div className="relative">
        {isEmpty && <span className="pointer-events-none absolute left-3 top-3 text-sm text-cu-muted">{placeholder}</span>}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
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

            if (pastedImages.length > 0 && onUploadImage) {
              event.preventDefault();
              void insertImages(pastedImages);
              return;
            }

            event.preventDefault();
            pastePlainTextAsParagraphs(event.clipboardData.getData("text/plain"));
          }}
          className="odds-scroll-hidden overflow-y-auto bg-white px-3 py-2 text-sm leading-6 text-cu-ink outline-none [&_a]:font-semibold [&_a]:text-cu-info [&_a]:underline [&_figcaption]:mt-1 [&_figcaption]:text-xs [&_figcaption]:text-cu-muted [&_figure]:my-3 [&_figure]:inline-block [&_figure]:max-w-md [&_img]:max-h-56 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:border [&_img]:border-cu-border [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-2 [&_ul]:list-disc"
          style={{ minHeight }}
        />
      </div>
    </div>
  );
}
