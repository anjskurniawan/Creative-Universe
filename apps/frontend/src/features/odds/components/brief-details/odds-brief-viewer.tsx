"use client";

import type { OddsTask } from "@/features/odds/api";
import { RichTextViewer } from "@/components/odds-rich-text-editor";

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
  const dark = theme === "dark";
  const retro = theme === "retro";
  const isTable = isTableBriefTask(task);

  const themedTableClass = retro
    ? "[&_table]:mt-2 [&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_th]:border-2 [&_th]:border-[#24252b] [&_th]:bg-[#c9ccc0] [&_th]:px-3 [&_th]:py-3 [&_th]:text-center [&_th]:text-xs [&_th]:font-bold [&_th]:text-black [&_td]:border-2 [&_td]:border-[#24252b] [&_td]:px-3 [&_td]:py-3 [&_td]:align-top [&_td]:text-sm [&_td]:text-black [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#24252b] [&_table:first-of-type_th]:w-48 [&_table:last-of-type_th:first-child]:w-16 [&_table:last-of-type_td:first-child]:w-16 [&_table:last-of-type_td:first-child]:text-center"
    : dark
    ? "[&_table]:mt-2 [&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-white/10 [&_th]:bg-white/5 [&_th]:px-3 [&_th]:py-3 [&_th]:text-center [&_th]:text-xs [&_th]:font-bold [&_th]:text-white [&_td]:border [&_td]:border-white/10 [&_td]:px-3 [&_td]:py-3 [&_td]:align-top [&_td]:text-sm [&_td]:text-[#f1f1f1] [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_table:first-of-type_th]:w-48 [&_table:last-of-type_th:first-child]:w-16 [&_table:last-of-type_td:first-child]:w-16 [&_table:last-of-type_td:first-child]:text-center"
    : "[&_table]:mt-2 [&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-[#bdeaff] [&_th]:bg-[#f1f9ff] [&_th]:px-3 [&_th]:py-3 [&_th]:text-center [&_th]:text-xs [&_th]:font-bold [&_th]:text-[#04044a] [&_td]:border [&_td]:border-[#bdeaff] [&_td]:px-3 [&_td]:py-3 [&_td]:align-top [&_td]:text-sm [&_td]:text-[#303431] [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#04044a] [&_table:first-of-type_th]:w-48 [&_table:last-of-type_th:first-child]:w-16 [&_table:last-of-type_td:first-child]:w-16 [&_table:last-of-type_td:first-child]:text-center";

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
          const linkHtml = `<tr><th>Gambar Packaging</th><td><a href="/api/v1/odds/uploads/${attachment.id}/content" target="_blank" rel="noopener noreferrer" class="${linkColor} hover:underline font-semibold">Open Image</a></td></tr>`;
          finalHtml = finalHtml.replace(/<tr>\s*<th>\s*Gambar\s+Packaging\s*<\/th>\s*<td>\s*.*?\s*<\/td>\s*<\/tr>/i, linkHtml);
        }
      }
    }

    return (
      <div className="flex-grow flex flex-col min-h-0 overflow-auto">
        <h2 className={`text-xl md:text-2xl font-extrabold tracking-tight mb-1.5 ${retro ? "text-black" : dark ? "text-white" : "text-[#04044A]"}`}>
          {task.design_purpose}
        </h2>
        <div
          className={`prose-odds max-w-none whitespace-normal text-sm leading-7 text-cu-ink pr-1 flex-1 [&_br]:block [&_br]:h-1 [&_div]:mb-3 [&_p]:mb-3 [&_p:has(br:only-child)]:mb-2 [&_p:has(br:only-child)]:h-2 [&_figure]:my-5 [&_figcaption]:mt-2 [&_figcaption]:text-xs [&_figcaption]:text-[#6b7280] [&_img]:max-h-72 [&_img]:w-auto [&_img]:max-w-full ${themedTableClass}`}
          dangerouslySetInnerHTML={{ __html: finalHtml || "Brief belum diisi." }}
        />
      </div>
    );
  }

  return <RichTextViewer html={briefText} />;
}
