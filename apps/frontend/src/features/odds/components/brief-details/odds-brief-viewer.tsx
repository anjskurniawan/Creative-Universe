"use client";

import { useMemo } from "react";
import type { OddsTask } from "@/features/odds/api";
import { TableBriefPreview } from "./table-brief-preview";
import type { TableBriefRow } from "./table-brief-details";

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

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
}

function buildRows(task: OddsTask, html: string): TableBriefRow[] {
  const attachments = task.brief?.attachments ?? [];
  const rows = [...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)]
    .map((match, index) => {
      const cells = [...match[1].matchAll(/<(?:td|th)\b[^>]*>([\s\S]*?)<\/(?:td|th)>/gi)].map((cell) => cell[1].trim());
      if (cells.length < 2) return null;
      const values = cells.map(stripTags);
      if (/^(no|deskripsi|referensi|keterangan|action|kategori|product|produk|gambar packaging|detail packaging)$/i.test(values[0])) return null;
      const referenceHtml = cells[2] ?? "";
      const reference = values[2] ?? "";
      const uploadId = referenceHtml.match(/(?:src|href)=["'][^"']*\/uploads\/(\d+)\/content/i)?.[1];
      const attachment = uploadId
        ? attachments.find((item) => item.id === Number(uploadId))
        : attachments.find((item) => reference.includes(item.name));
      return {
        id: `detail-row-${index + 1}`,
        image_order: values[0] || String(index + 1),
        image_description: cells[1] || "-",
        image_illustration: reference,
        image_illustration_id: uploadId ? Number(uploadId) : attachment?.id ?? null,
        additional_notes: cells[3] || "",
      } satisfies TableBriefRow;
    })
    .filter((row): row is TableBriefRow => Boolean(row));

  return rows.length > 0 ? rows : [{
    id: "detail-row-1",
    image_order: "1",
    image_description: html || "-",
    image_illustration: "",
    image_illustration_id: null,
    additional_notes: "",
  }];
}

export function OddsBriefViewer({ task, briefText }: OddsBriefViewerProps) {
  const rows = useMemo(() => buildRows(task, briefText), [task, briefText]);
  const attachments = task.brief?.attachments ?? [];
  const packaging = attachments.find((attachment) => /packaging/i.test(attachment.name)) ?? attachments[0];

  return (
    <TableBriefPreview
      packagingImageId={packaging?.id ?? null}
      packagingImageName={packaging?.name ?? ""}
      rows={rows}
      designerName={task.assigned_designer?.name ?? task.assignedDesigner?.name ?? "-"}
      deadline={task.deadline || "Otomatis"}
      title={task.design_purpose || "Request Tanpa Judul"}
    />
  );
}
