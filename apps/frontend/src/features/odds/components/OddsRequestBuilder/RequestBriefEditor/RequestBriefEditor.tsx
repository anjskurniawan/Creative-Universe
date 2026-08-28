"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";
import type { OddsTaskAttachment } from "@/features/odds/api";

export function RequestBriefEditor({
  value,
  onChange,
  onUploadImage,
  dark,
  fullHeight = false,
}: {
  value: string;
  onChange: (value: string) => void;
  onUploadImage: (files: FileList | File[] | null) => Promise<OddsTaskAttachment[]>;
  dark: boolean;
  fullHeight?: boolean;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [linkPanelOpen, setLinkPanelOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  // Sync value with contenteditable div
  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== value) {
      editor.innerHTML = value;
    }
  }, [value]);

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

  const toolbarBtnClass = `flex size-8 shrink-0 items-center justify-center rounded-lg border transition ${
    dark
      ? "border-white/10 bg-[#0E0E0E] text-[#B9B9B9] hover:bg-white/10"
      : "border-[#BDEAFF] bg-white text-[#04044A] hover:bg-[#DFF6FF]"
  }`;

  const activeBtnClass = dark
    ? "bg-[#B0FF5E] text-[#181818] border-[#B0FF5E] hover:bg-[#B0FF5E]"
    : "bg-[#00A4FF] text-white border-[#00A4FF] hover:bg-[#00A4FF]";

  const inputClass = `h-8 min-w-0 flex-1 rounded-lg border px-2 text-xs outline-none transition ${
    dark
      ? "bg-[#0E0E0E] border-white/10 text-white focus:border-[#B0FF5E]"
      : "bg-white border-[#BDEAFF] text-[#04044A] focus:border-[#00A4FF]"
  }`;

  const linkInsertBtnClass = `flex h-8 items-center justify-center gap-1 rounded-lg px-3 text-[10px] font-bold transition disabled:opacity-50 ${
    dark ? "bg-[#B0FF5E] text-[#181818]" : "bg-[#00A4FF] text-white"
  }`;

  return (
    <div className={`flex ${fullHeight ? "h-full flex-1" : "h-[280px] flex-none xl:h-auto xl:flex-1"} flex-col min-h-0 rounded-2xl border overflow-hidden ${
      dark ? "border-white/10 bg-[#171717]" : "border-[#BDEAFF] bg-white shadow-sm"
    }`}>
      {/* Editor Toolbar */}
      <div className={`flex items-center justify-between border-b p-2 ${
        dark ? "border-white/10 bg-[#0E0E0E]" : "border-[#BDEAFF] bg-[#F3FAFF]"
      }`}>
        <div ref={toolbarRef} className="flex flex-wrap gap-1 items-center">
          {tools.map((tool) => {
            const isPressed = activeTools.includes(tool.command);
            return (
              <button
                key={tool.command}
                type="button"
                title={tool.label}
                aria-label={tool.label}
                aria-pressed={isPressed}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => runCommand(tool.command)}
                className={`${toolbarBtnClass} ${isPressed ? activeBtnClass : ""}`}
              >
                <MaterialIcon name={tool.icon} size="sm" />
              </button>
            );
          })}
          <span className={`w-px h-5 mx-1 ${dark ? "bg-white/10" : "bg-[#BDEAFF]"}`} />
          <button
            type="button"
            title="Clear formatting"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand("removeFormat")}
            className={toolbarBtnClass}
          >
            <MaterialIcon name="format_clear" size="sm" />
          </button>
          <button
            type="button"
            title="Insert link"
            onMouseDown={(event) => { event.preventDefault(); rememberSelection(); }}
            onClick={() => setLinkPanelOpen((open) => !open)}
            className={`${toolbarBtnClass} ${linkPanelOpen ? activeBtnClass : ""}`}
          >
            <MaterialIcon name="link" size="sm" />
          </button>
          <label title="Insert image" className={`${toolbarBtnClass} cursor-pointer`}>
            <MaterialIcon name={imageUploading ? "hourglass_top" : "image"} size="sm" className={imageUploading ? "animate-spin" : ""} />
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              disabled={imageUploading}
              onChange={(event) => void insertImages(event.target.files)}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {/* Link Input Panel */}
      {linkPanelOpen && (
        <div className={`flex items-center gap-2 border-b p-2 ${
          dark ? "border-white/10 bg-[#0E0E0E]" : "border-[#BDEAFF] bg-[#F3FAFF]"
        }`}>
          <MaterialIcon name="link" size="sm" className="opacity-60" />
          <input
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && (event.preventDefault(), insertLink())}
            placeholder="https://figma.com/..."
            className={inputClass}
            autoFocus
          />
          <button
            type="button"
            onClick={insertLink}
            disabled={!linkUrl.trim()}
            className={linkInsertBtnClass}
          >
            <MaterialIcon name="check" size="sm" />
            <span>Link</span>
          </button>
          <button
            type="button"
            onClick={() => setLinkPanelOpen(false)}
            className={toolbarBtnClass}
          >
            <MaterialIcon name="close" size="sm" />
          </button>
        </div>
      )}

      {/* Editor Input Area */}
      <div
        className="relative flex-1 min-h-0"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            editorRef.current?.focus();
          }
        }}
      >
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Mission brief editor"
          data-placeholder="Tulis kebutuhan desain, ukuran, copy teks, channel, dan output final..."
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              editorRef.current?.focus();
            }
          }}
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
          className={`h-full overflow-y-auto p-3 text-sm leading-6 outline-none transition [scrollbar-width:none] [&::-webkit-scrollbar]:hidden empty:before:pointer-events-none empty:before:select-none empty:before:content-[attr(data-placeholder)] ${
            dark
              ? "bg-[#0E0E0E] text-white [caret-color:#B0FF5E] focus:bg-[#0a0a0a] empty:before:text-slate-500"
              : "bg-white text-[#04044A] [caret-color:#00A4FF] focus:bg-white empty:before:text-slate-400"
          } [&_a]:font-bold [&_a]:text-[#00A4FF] dark:[&_a]:text-[#B0FF5E] [&_a]:underline [&_figcaption]:bg-black/20 dark:[&_figcaption]:bg-white/5 [&_figcaption]:px-3 [&_figcaption]:py-1 [&_figcaption]:text-[9px] [&_figcaption]:font-bold [&_figure]:my-4 [&_figure]:inline-block [&_figure]:max-w-md [&_figure]:align-top [&_img]:max-h-64 [&_img]:w-auto [&_img]:rounded-xl [&_img]:border [&_img]:border-black/10 dark:[&_img]:border-white/5 [&_img]:object-contain [&_li]:ml-6 [&_ol]:list-decimal [&_p]:mb-3 [&_ul]:list-disc`}
        />
      </div>
    </div>
  );
}
