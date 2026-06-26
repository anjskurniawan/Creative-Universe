"use client";

import { useEffect, useRef, type ClipboardEvent } from "react";
import { MaterialIcon } from "@/components/material-icon";

const emptyRichText = "<p><br></p>";
const allowedRichTextTags = new Set([
  "A", "B", "BLOCKQUOTE", "BR", "DIV", "EM", "H2", "H3", "I", "LI", "OL", "P", "SPAN", "STRONG", "U", "UL",
]);

export function stripRichText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeRichText(html: string): string {
  const preSanitized = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/\son\w+=\S+/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/<\/?([a-z0-9-]+)(?:\s[^>]*)?>/gi, (match, tagName) => (
      allowedRichTextTags.has(String(tagName).toUpperCase()) ? match : ""
    ));

  if (typeof window === "undefined") return preSanitized;

  const template = document.createElement("template");
  template.innerHTML = preSanitized;

  template.content.querySelectorAll("script, style, iframe, object, embed").forEach((node) => node.remove());
  template.content.querySelectorAll("*").forEach((node) => {
    if (!allowedRichTextTags.has(node.tagName)) {
      node.replaceWith(document.createTextNode(node.textContent ?? ""));
      return;
    }

    Array.from(node.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.toLowerCase();
      const keepLink = node.tagName === "A" && name === "href" && !value.startsWith("javascript:");
      const keepTarget = node.tagName === "A" && ["target", "rel"].includes(name);
      const keepStyle = name === "style" && /text-align:\s*(left|center|right)/i.test(attribute.value);

      if (!keepLink && !keepTarget && !keepStyle) {
        node.removeAttribute(attribute.name);
      }
    });

    if (node.tagName === "A") {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noreferrer");
    }
  });

  return template.innerHTML.trim() || emptyRichText;
}

export function RichTextViewer({ html }: { html: string }) {
  return (
    <div
      className="prose-odds min-h-32 rounded-lg border border-cu-border bg-cu-panel-soft px-4 py-3 text-sm leading-6 text-cu-ink"
      dangerouslySetInnerHTML={{ __html: sanitizeRichText(html || emptyRichText) }}
    />
  );
}

export function OddsRichTextEditor({
  value,
  onChange,
  minHeight = 220,
}: {
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const nextHtml = value || emptyRichText;
    if (editor.innerHTML !== nextHtml) {
      editor.innerHTML = nextHtml;
    }
  }, [value]);

  const sync = () => {
    const html = sanitizeRichText(editorRef.current?.innerHTML ?? emptyRichText);
    onChange(html);
  };

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const command = (name: string, commandValue?: string) => {
    focusEditor();
    document.execCommand(name, false, commandValue);
    sync();
  };

  const insertHtml = (html: string) => {
    focusEditor();
    document.execCommand("insertHTML", false, html);
    sync();
  };

  const createLink = () => {
    const url = window.prompt("Masukkan URL");
    if (!url) return;
    command("createLink", url);
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    insertHtml(text.replace(/\n/g, "<br>"));
  };

  return (
    <div className="overflow-hidden rounded-lg border border-cu-border bg-white focus-within:border-cu-info">
      <div className="flex flex-wrap items-center gap-1 border-b border-cu-border bg-cu-panel-soft px-2 py-2">
        <select
          aria-label="Text style"
          defaultValue="p"
          onChange={(event) => {
            command("formatBlock", event.target.value);
            event.target.value = "p";
          }}
          className="h-9 rounded-md border border-cu-border bg-white px-2 text-sm font-medium text-cu-ink outline-none"
        >
          <option value="p">Paragraph</option>
          <option value="h2">Heading</option>
          <option value="h3">Subheading</option>
          <option value="blockquote">Quote</option>
        </select>
        <ToolbarButton icon="format_bold" label="Bold" onClick={() => command("bold")} />
        <ToolbarButton icon="format_italic" label="Italic" onClick={() => command("italic")} />
        <ToolbarButton icon="format_underlined" label="Underline" onClick={() => command("underline")} />
        <ToolbarDivider />
        <ToolbarButton icon="format_list_bulleted" label="Bullet list" onClick={() => command("insertUnorderedList")} />
        <ToolbarButton icon="format_list_numbered" label="Numbered list" onClick={() => command("insertOrderedList")} />
        <ToolbarButton icon="checklist" label="Checklist" onClick={() => insertHtml("<ul><li>[ ] Checklist item</li></ul>")} />
        <ToolbarDivider />
        <ToolbarButton icon="format_align_left" label="Align left" onClick={() => command("justifyLeft")} />
        <ToolbarButton icon="format_align_center" label="Align center" onClick={() => command("justifyCenter")} />
        <ToolbarButton icon="format_align_right" label="Align right" onClick={() => command("justifyRight")} />
        <ToolbarDivider />
        <ToolbarButton icon="link" label="Link" onClick={createLink} />
        <ToolbarButton icon="undo" label="Undo" onClick={() => command("undo")} />
        <ToolbarButton icon="redo" label="Redo" onClick={() => command("redo")} />
        <ToolbarButton icon="format_clear" label="Clear format" onClick={() => command("removeFormat")} />
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder="Tulis kebutuhan desain, ukuran, copy, channel, dan output final."
        onInput={sync}
        onBlur={sync}
        onPaste={handlePaste}
        className="prose-odds rich-editor min-h-[220px] w-full overflow-y-auto px-4 py-3 text-sm leading-6 text-cu-ink outline-none"
        style={{ minHeight }}
      />
    </div>
  );
}

function ToolbarButton({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="inline-flex size-9 items-center justify-center rounded-md border border-cu-border bg-white text-cu-ink transition hover:bg-white/70"
    >
      <MaterialIcon name={icon} size="xs" />
    </button>
  );
}

function ToolbarDivider() {
  return <span className="mx-1 h-6 w-px bg-cu-border" aria-hidden />;
}
