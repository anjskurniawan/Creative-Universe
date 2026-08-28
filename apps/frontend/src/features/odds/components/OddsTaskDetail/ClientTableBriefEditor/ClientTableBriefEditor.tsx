"use client";

import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";
import { uploadOddsTaskAttachment, type OddsTask } from "@/features/odds/api";
import { TableBriefDetails } from "@/features/odds/components/BriefDetails";
import type { OddsRequestForm, TableBriefRow } from "@/features/odds/types";

export function ClientTableBriefEditor({ task, briefText, theme, returnNote, onChange, hideReturnNote = false }: { task: OddsTask; briefText: string; theme: "light" | "dark" | "retro"; returnNote: string; onChange: (value: string) => void; hideReturnNote?: boolean }) {
  const parsedRows = useMemo<TableBriefRow[]>(() => {
    const rows = [...briefText.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((match, index) => {
      const raw = [...match[1].matchAll(/<(?:td|th)\b[^>]*>([\s\S]*?)<\/(?:td|th)>/gi)].map((cell) => cell[1]);
      const cells = raw.map((cell) => cell.replace(/<[^>]*>/g, "").trim());
      if (cells.length < 2 || /^(no|deskripsi|referensi|keterangan|action|kategori|produk|gambar packaging|detail packaging)$/i.test(cells[0] ?? "")) return null;
      const url = (raw[2] ?? "").match(/<(?:img|a)[^>]+(?:src|href)=["']([^"']+)["']/i)?.[1] ?? "";
      const id = url.match(/\/uploads\/(\d+)\/content/i)?.[1];
      return { id: `revision-${index + 1}`, image_order: cells[0] || String(index + 1), image_description: cells[1] || "", image_illustration: cells[2] || "", image_illustration_id: id ? Number(id) : null, additional_notes: cells[3] || "" };
    }).filter((row): row is TableBriefRow => Boolean(row));
    return rows.length ? rows : [{ id: "revision-1", image_order: "1", image_description: "", image_illustration: "", image_illustration_id: null, additional_notes: "" }];
  }, [briefText]);
  const [rows, setRows] = useState(parsedRows);
  const [uploadingIllustrationId, setUploadingIllustrationId] = useState<string | null>(null);
  const [category, setCategory] = useState(task.category?.name ?? "");
  const [product, setProduct] = useState(task.design_purpose ?? "");
  const sync = (nextRows: TableBriefRow[]) => { setRows(nextRows); const body = nextRows.map((row) => `<tr><td>${row.image_order}</td><td>${row.image_description}</td><td>${row.image_illustration_id ? `<img src=\"/api/v1/odds/uploads/${row.image_illustration_id}/content\" alt=\"Referensi\" />` : row.image_illustration}</td><td>${row.additional_notes}</td></tr>`).join(""); onChange(`<table><tbody><tr><th>Kategori</th><td>${category}</td></tr><tr><th>Produk</th><td>${product}</td></tr></tbody></table><table><thead><tr><th>No</th><th>Deskripsi</th><th>Referensi</th><th>Keterangan</th></tr></thead><tbody>${body}</tbody></table>`); };
  const upload = async (rowId: string, files: FileList | null) => { const file = files?.[0]; if (!file) return; setUploadingIllustrationId(rowId); try { const uploaded = await uploadOddsTaskAttachment(file, task.id); sync(rows.map((row) => row.id === rowId ? { ...row, image_illustration: uploaded.name, image_illustration_id: uploaded.id } : row)); } finally { setUploadingIllustrationId(null); } };
  const form = { important_matrix: task.important_matrix ?? "Q4", deadline: task.deadline?.slice(0, 10) ?? "" } as OddsRequestForm;
  return <div className="grid h-full min-h-0 min-w-0 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-4"><div className={`min-h-0 min-w-0 overflow-y-auto ${hideReturnNote ? "lg:col-span-4" : "lg:col-span-3"}`}><TableBriefDetails category={category} product={product} packagingImageName="" packagingImageId={null} rows={rows} uploadingPackagingImage={false} onCategoryChange={setCategory} onProductChange={setProduct} onPackagingImageUpload={() => undefined} onRowChange={(id, field, value) => sync(rows.map((row) => row.id === id ? { ...row, [field]: value } : row))} onIllustrationUpload={upload} uploadingIllustrationId={uploadingIllustrationId} onAddRow={() => sync([...rows, { id: `revision-${rows.length + 1}`, image_order: String(rows.length + 1), image_description: "", image_illustration: "", image_illustration_id: null, additional_notes: "" }])} onRemoveRow={(id) => sync(rows.filter((row) => row.id !== id))} onReorderRows={() => undefined} dark={theme === "dark"} form={form} update={() => undefined} selectedCategory={undefined} todayDate="" tomorrowDate="" threeDaysDate="" hideDetailInputs flush={hideReturnNote} /></div>{!hideReturnNote && <aside className={`min-h-0 overflow-y-auto rounded-xl border p-4 ${theme === "dark" ? "border-white/10 bg-white/5 text-white" : "border-cu-border bg-cu-panel-soft text-cu-ink"}`}><div className="mb-2 flex items-center gap-2 text-sm font-semibold"><MaterialIcon name="keyboard_return" size="sm" />Keterangan Brief Return</div><p className="whitespace-pre-wrap text-sm leading-6 text-cu-muted">{returnNote || "Belum ada keterangan return dari designer."}</p></aside>}</div>;
}
