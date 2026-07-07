"use client";

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
}: {
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Tulis kebutuhan desain, ukuran, copy, channel, dan output final."
      className="w-full resize-y rounded-lg border border-cu-border bg-white px-4 py-3 text-sm leading-6 text-cu-ink outline-none transition focus:border-cu-info"
      style={{ minHeight }}
    />
  );
}
