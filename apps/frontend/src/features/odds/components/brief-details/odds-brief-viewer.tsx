"use client";

import { useEffect, useRef } from "react";
import type { OddsTask } from "@/features/odds/api";
import { RichTextViewer } from "@/components/odds-rich-text-editor";
import { openProtectedAttachment } from "@/core/api/client";

type OddsBriefViewerProps = {
  task: OddsTask;
  briefText: string;
  theme: "light" | "dark" | "retro";
};

export function isTableBriefTask(task: OddsTask): boolean {
  const format = String(task.category?.brief_format ?? task.category_snapshot?.brief_format ?? "").trim().toLowerCase();
  return ["table", "deskripsi_produk", "product_description"].includes(format)
    || /<table\b/i.test(task.brief_text ?? "")
    || /<table\b/i.test(task.brief?.content ?? "");
}

export function OddsBriefViewer({ task, briefText, theme }: OddsBriefViewerProps) {
  const htmlRef = useRef<HTMLDivElement>(null);
  const dark = theme === "dark";
  const retro = theme === "retro";
  const isTable = isTableBriefTask(task);

  useEffect(() => {
    const root = htmlRef.current;
    if (!root || !isTable) return;
    const handler = (event: MouseEvent) => {
      const download = (event.target as HTMLElement).closest<HTMLElement>('[data-download-attachment]');
      if (download) {
        event.preventDefault();
        const attachmentId = download.dataset.downloadAttachment;
        if (attachmentId) {
          void (async () => {
            const response = await fetch(attachmentId.startsWith("/") ? attachmentId : `/api/v1/odds/uploads/${attachmentId}/content`, { credentials: "include" });
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `referensi-${attachmentId.match(/\d+/)?.[0] ?? "gambar"}`;
            link.click();
            URL.revokeObjectURL(url);
          })();
        }
        return;
      }
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="/api/v1/odds/uploads/"]');
      if (!anchor) return;
      const match = anchor.href.match(/\/uploads\/(\d+)\/content/);
      if (!match) return;
      event.preventDefault();
      void openProtectedAttachment(match[1]);
    };
    root.addEventListener("click", handler, true);
    return () => root.removeEventListener("click", handler, true);
  }, [isTable, briefText]);

  const themedTableClass = retro
    ? "[&_table]:mt-2 [&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_th]:border-2 [&_th]:border-[#24252b] [&_th]:bg-[#c9ccc0] [&_th]:px-3 [&_th]:py-3 [&_th]:text-center [&_th]:text-xs [&_th]:font-bold [&_th]:text-black [&_td]:border-2 [&_td]:border-[#24252b] [&_td]:px-3 [&_td]:py-3 [&_td]:align-top [&_td]:text-sm [&_td]:text-black [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#24252b] [&_table:first-of-type_th]:w-48 [&_table:last-of-type_th:first-child]:w-16 [&_table:last-of-type_td:first-child]:w-16 [&_table:last-of-type_td:first-child]:text-center [&_table:last-of-type_th:nth-child(3)]:w-64 [&_table:last-of-type_td:nth-child(3)]:w-64 [&_td:nth-child(3)]:align-middle [&_td:nth-child(3)]:text-center [&_th:nth-child(3)]:text-center [&_table:last-of-type_td:nth-child(4)]:text-xs"
    : dark
    ? "[&_table]:mt-2 [&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-white/10 [&_th]:bg-white/5 [&_th]:px-3 [&_th]:py-3 [&_th]:text-center [&_th]:text-xs [&_th]:font-bold [&_th]:text-white [&_td]:border [&_td]:border-white/10 [&_td]:px-3 [&_td]:py-3 [&_td]:align-top [&_td]:text-sm [&_td]:text-[#f1f1f1] [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_table:first-of-type_th]:w-48 [&_table:last-of-type_th:first-child]:w-16 [&_table:last-of-type_td:first-child]:w-16 [&_table:last-of-type_td:first-child]:text-center [&_table:last-of-type_th:nth-child(3)]:w-64 [&_table:last-of-type_td:nth-child(3)]:w-64 [&_td:nth-child(3)]:align-middle [&_td:nth-child(3)]:text-center [&_th:nth-child(3)]:text-center [&_table:last-of-type_td:nth-child(4)]:text-xs"
    : "[&_table]:mt-2 [&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-[#bdeaff] [&_th]:bg-[#f1f9ff] [&_th]:px-3 [&_th]:py-3 [&_th]:text-center [&_th]:text-xs [&_th]:font-bold [&_th]:text-[#04044a] [&_td]:border [&_td]:border-[#bdeaff] [&_td]:px-3 [&_td]:py-3 [&_td]:align-top [&_td]:text-sm [&_td]:text-[#303431] [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#04044a] [&_table:first-of-type_th]:w-48 [&_table:last-of-type_th:first-child]:w-16 [&_table:last-of-type_td:first-child]:w-16 [&_table:last-of-type_td:first-child]:text-center [&_table:last-of-type_th:nth-child(3)]:w-64 [&_table:last-of-type_td:nth-child(3)]:w-64 [&_td:nth-child(3)]:align-middle [&_td:nth-child(3)]:text-center [&_th:nth-child(3)]:text-center [&_table:last-of-type_td:nth-child(4)]:text-xs";

  if (isTable) {
    const cleanedHtml = (briefText || "")
      .replace(/<tr\b[^>]*>\s*<h[1-6]\b[^>]*>\s*Kategori\s*<\/h[1-6]>\s*<td\b[^>]*>[\s\S]*?<\/td>\s*<\/tr>/gi, "")
      .replace(/<tr\b[^>]*>\s*<th\b[^>]*>\s*Kategori\s*<\/th>\s*<td\b[^>]*>[\s\S]*?<\/td>\s*<\/tr>/gi, "")
      .replace(/<tr\b[^>]*>\s*<h[1-6]\b[^>]*>\s*Product\s*<\/h[1-6]>\s*<td\b[^>]*>[\s\S]*?<\/td>\s*<\/tr>/gi, "")
      .replace(/<tr\b[^>]*>\s*<th\b[^>]*>\s*Product\s*<\/th>\s*<td\b[^>]*>[\s\S]*?<\/td>\s*<\/tr>/gi, "")
      .replace(/(<th>\s*Gambar\s+Packaging\s*<\/th>\s*<td>)\s*(<\/td>)/gi, "$1-$2")
      .replace(/<th>Urutan\s+gambar<\/th>/gi, "<th>No</th>")
      .replace(/<th>Deskripsi\s+Gambar<\/th>/gi, "<th>Deskripsi</th>")
      .replace(/<th>Ilustrasi\s+Gambar<\/th>/gi, "<th>Referensi</th>")
      .replace(/<th>Keterangan\s+Tambahan<\/th>/gi, "<th>Keterangan</th>")
      .replace(/<td>\s*<\/td>/gi, '<td class="text-center">-</td>')
      .replace(/<td>\s*-\s*<\/td>/gi, '<td class="text-center">-</td>')
      .replace(/<h[1-6]\b[^>]*>\s*Detail\s+Packaging\s*<\/h[1-6]>/gi, "")
      .replace(/<p\b[^>]*>\s*(?:<strong>|<b>)?\s*Detail\s+Packaging\s*(?:<\/strong>|<\/b>)?\s*<\/p>/gi, "")
      .replace(/<table>\s*<tbody>\s*<\/tbody>\s*<\/table>/gi, "");

    let finalHtml = cleanedHtml;
    const packagingMatch = cleanedHtml.match(/<tr>\s*<th>\s*Gambar\s+Packaging\s*<\/th>\s*<td>\s*(.*?)\s*<\/td>\s*<\/tr>/i);
    if (packagingMatch) {
      const fileName = packagingMatch[1].trim();
      if (fileName && fileName !== "-") {
        const attachment = task.brief?.attachments?.find((att) => att.name === fileName);
        if (attachment) {
          const linkColor = retro ? "text-[#ba0dcb]" : dark ? "text-[#b0ff5e]" : "text-[#00a4ff]";
          const linkHtml = `<tr><th>Gambar Packaging</th><td><a href="/api/v1/odds/uploads/${attachment.id}/content" target="_blank" rel="noopener noreferrer" class="${linkColor} hover:underline font-semibold">Buka Gambar</a></td></tr>`;
          finalHtml = finalHtml.replace(/<tr>\s*<th>\s*Gambar\s+Packaging\s*<\/th>\s*<td>\s*.*?\s*<\/td>\s*<\/tr>/i, linkHtml);
        }
      }
    }

    // Replace reference file names in table cells with actual image previews or download links
    task.brief?.attachments?.forEach((attachment) => {
      const isImg = /\.(jpe?g|png|webp|gif|svg)$/i.test(attachment.name);
      const escapedName = attachment.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`>\\s*${escapedName}\\s*<`, 'g');
      if (isImg) {
        const imgHtml = `><a href="/api/v1/odds/uploads/${attachment.id}/content" target="_blank" rel="noopener noreferrer" class="inline-block w-64 h-auto"><img src="/api/v1/odds/uploads/${attachment.id}/content" class="w-64 h-auto rounded border border-cu-border/50 object-contain bg-white p-0.5 hover:border-cu-info transition" style="margin: 0 auto !important; display: inline-block !important;" alt="${attachment.name}"/></a><`;
        finalHtml = finalHtml.replace(regex, imgHtml);
      } else {
        const linkColor = retro ? "text-[#ba0dcb]" : dark ? "text-[#b0ff5e]" : "text-[#00a4ff]";
        const fileHtml = `><a href="/api/v1/odds/uploads/${attachment.id}/content" target="_blank" rel="noopener noreferrer" class="${linkColor} hover:underline font-semibold text-xs">${attachment.name}</a><`;
        finalHtml = finalHtml.replace(regex, fileHtml);
      }
    });

    // Reference cells show the image inline; packaging intentionally remains a link.
    finalHtml = finalHtml.replace(
      /(<tr>\s*<td>\s*\d+\s*<\/td>[\s\S]*?<td>\s*)<a\s+href="(\/api\/v1\/odds\/uploads\/\d+\/content)"[^>]*>\s*Buka Gambar\s*<\/a>(\s*<\/td>)/gi,
      '$1<span class="relative inline-flex max-w-full items-start"><img src="$2" alt="Referensi gambar" class="max-h-72 w-auto max-w-full rounded border border-cu-border/50 object-contain bg-white p-0.5" /><button type="button" data-download-attachment="$2" title="Download gambar" class="pointer-events-auto absolute right-1 top-1 z-10 flex size-7 cursor-pointer items-center justify-center rounded-full bg-white/95 text-lg font-bold leading-none text-slate-700 shadow hover:bg-slate-100">⋮</button></span>$3',
    );

    // Only description and notes cells are editable; reference/download cells stay interactive media.
    finalHtml = finalHtml.replace(
      /(<tr>\s*<td>\s*\d+\s*<\/td>\s*)(<td)([\s\S]*?<\/td>)(<td[\s\S]*?<\/td>)(<td)([\s\S]*?<\/td>)/gi,
      '$1$2 contenteditable="true" class="focus:outline-none focus:bg-cu-panel-soft/30 rounded select-text cursor-text"$3$4$5 contenteditable="true" class="focus:outline-none focus:bg-cu-panel-soft/30 rounded select-text cursor-text"$6',
    );

    return (
      <div className="flex-grow flex flex-col min-h-0 overflow-auto">
        <h2 className={`text-xl md:text-2xl font-extrabold tracking-tight mb-1.5 ${retro ? "text-black" : dark ? "text-white" : "text-[#04044A]"}`}>
          {task.design_purpose}
        </h2>
        <div
          ref={htmlRef}
          className={`prose-odds max-w-none whitespace-normal text-sm leading-7 text-cu-ink pr-1 flex-1 select-text [&_div]:mb-3 [&_p]:mb-3 [&_p:has(br:only-child)]:mb-0 [&_p:empty]:mb-0 [&_figure]:my-5 [&_figcaption]:mt-2 [&_figcaption]:text-xs [&_figcaption]:text-[#6b7280] [&_img]:max-h-72 [&_img]:w-auto [&_img]:max-w-full ${themedTableClass}`}
          dangerouslySetInnerHTML={{ __html: finalHtml || "Brief belum diisi." }}
        />
      </div>
    );
  }

  return <RichTextViewer html={briefText} />;
}
