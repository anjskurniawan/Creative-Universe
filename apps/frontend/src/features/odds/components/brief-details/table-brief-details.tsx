"use client";

import { useState } from "react";
import Image from "next/image";
import { MaterialIcon } from "@/components/material-icon";
import { OddsRichTextEditor } from "@/components/odds-rich-text-editor";

export type TableBriefRow = {
  id: string;
  image_order: string;
  image_description: string;
  image_illustration: string;
  image_illustration_id: number | null;
  additional_notes: string;
};

export type TableBriefDetailsProps = {
  category: string;
  product: string;
  packagingImageName: string;
  packagingImageId: number | null;
  rows: TableBriefRow[];
  uploadingPackagingImage: boolean;
  onCategoryChange: (value: string) => void;
  onProductChange: (value: string) => void;
  onPackagingImageUpload: (files: FileList | null) => void;
  onRowChange: (id: string, field: keyof Omit<TableBriefRow, "id">, value: string) => void;
  onIllustrationUpload: (id: string, files: FileList | null) => void;
  uploadingIllustrationId: string | null;
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
  onReorderRows: (sourceId: string, targetId: string) => void;
  dark?: boolean;
};

/** Brief packaging berbasis tabel untuk kategori yang memilih format `table`. */
export function TableBriefDetails({
  category,
  product,
  packagingImageName,
  packagingImageId,
  rows,
  uploadingPackagingImage,
  onCategoryChange,
  onProductChange,
  onPackagingImageUpload,
  onRowChange,
  onIllustrationUpload,
  uploadingIllustrationId,
  onAddRow,
  onRemoveRow,
  onReorderRows,
  dark = false,
}: TableBriefDetailsProps) {
  const [draggingRowId, setDraggingRowId] = useState<string | null>(null);
  const inputClass = dark
    ? "border-white/10 bg-[#0E0E0E] text-white placeholder:text-slate-500"
    : "border-[#BDEAFF] bg-white text-[#04044A] placeholder:text-slate-400";
  const labelClass = dark ? "text-[#B9B9B9]" : "text-[#04044A]/70";

  return (
    <div className={`flex min-h-0 flex-1 overflow-auto rounded-2xl border ${dark ? "border-white/10 bg-[#171717]" : "border-[#BDEAFF] bg-white"}`}>
      <div className="flex min-h-full min-w-[760px] flex-1 flex-col space-y-5 p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
          <span className={`mb-1.5 block text-xs font-semibold ${labelClass}`}>Kategori</span>
          <input value={category} onChange={(event) => onCategoryChange(event.target.value)} placeholder="Kategori produk" className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${inputClass}`} />
          </label>
          <label className="block">
          <span className={`mb-1.5 block text-xs font-semibold ${labelClass}`}>Product</span>
          <input value={product} onChange={(event) => onProductChange(event.target.value)} placeholder="Nama produk" className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${inputClass}`} />
        </label>
        </div>
        <div>
          <span className={`mb-1.5 block text-xs font-semibold ${labelClass}`}>Gambar Packaging</span>
          <label className={`flex cursor-pointer items-center gap-2 rounded-xl border border-dashed px-3 py-3 text-sm transition ${dark ? "border-white/15 text-[#B9B9B9] hover:bg-white/5" : "border-[#BDEAFF] text-[#04044A]/70 hover:bg-[#F3FAFF]"}`}>
            {packagingImageId ? <Image src={`/api/v1/odds/uploads/${packagingImageId}/content`} alt={packagingImageName} width={40} height={40} unoptimized className="size-10 rounded-lg border border-cu-border bg-white object-contain" /> : <MaterialIcon name={uploadingPackagingImage ? "progress_activity" : "upload_file"} size="sm" className={uploadingPackagingImage ? "animate-spin" : ""} />}
            <span>{uploadingPackagingImage ? "Mengunggah gambar..." : packagingImageName || "Upload gambar packaging (opsional)"}</span>
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploadingPackagingImage} onChange={(event) => onPackagingImageUpload(event.target.files)} className="sr-only" />
          </label>
        </div>

        <table className={`h-full w-full flex-1 table-fixed border-collapse text-sm [&_td]:min-w-0 ${dark ? "border border-white/10" : "border border-[#BDEAFF]"}`}>
          <colgroup>
            <col className="w-20" />
            <col className="w-[31%]" />
            <col className="w-[31%]" />
            <col className="w-[38%]" />
          </colgroup>
          <thead className={dark ? "bg-white/5 text-[#B9B9B9]" : "bg-[#F3FAFF] text-[#04044A]/70"}>
            <tr>
              <th className={`w-20 px-3 py-3 text-center text-xs font-semibold ${dark ? "border-r border-white/10" : "border-r border-[#BDEAFF]"}`}>Urutan gambar</th>
              <th className={`min-w-48 px-3 py-3 text-center text-xs font-semibold ${dark ? "border-r border-white/10" : "border-r border-[#BDEAFF]"}`}>Deskripsi Gambar</th>
              <th className={`min-w-48 px-3 py-3 text-center text-xs font-semibold ${dark ? "border-r border-white/10" : "border-r border-[#BDEAFF]"}`}>Ilustrasi Gambar</th>
              <th className="min-w-52 px-3 py-3 text-center text-xs font-semibold">Keterangan Tambahan</th>
            </tr>
          </thead>
          <tbody className="h-full">
            {rows.map((row, index) => (
              <tr
                key={row.id}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const sourceId = event.dataTransfer.getData("text/plain") || draggingRowId;
                  if (sourceId && sourceId !== row.id) onReorderRows(sourceId, row.id);
                  setDraggingRowId(null);
                }}
                className={`h-full ${dark ? "border-t border-white/10" : "border-t border-[#BDEAFF]/60"} ${draggingRowId === row.id ? "opacity-50" : ""}`}
              >
                <td className={`p-2 text-center text-sm font-semibold ${labelClass} ${dark ? "border-r border-white/10" : "border-r border-[#BDEAFF]/60"}`}>
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/plain", row.id);
                        setDraggingRowId(row.id);
                      }}
                      onDragEnd={() => setDraggingRowId(null)}
                      title="Tarik untuk mengubah urutan"
                      className={`inline-flex size-7 cursor-grab items-center justify-center rounded-md active:cursor-grabbing ${dark ? "text-[#B9B9B9] hover:bg-white/10" : "text-[#00A4FF] hover:bg-[#F3FAFF]"}`}
                    >
                      <MaterialIcon name="drag_indicator" size="sm" />
                    </button>
                    <span>{index + 1}</span>
                  </div>
                </td>
                <td className={`h-full p-2 align-top ${dark ? "border-r border-white/10" : "border-r border-[#BDEAFF]/60"}`}>
                  <OddsRichTextEditor value={row.image_description} onChange={(value) => onRowChange(row.id, "image_description", value)} minHeight={0} placeholder="Apa yang perlu terlihat?" toolbarMode="focus" fillHeight />
                </td>
                <td className={`h-full p-2 align-top ${dark ? "border-r border-white/10" : "border-r border-[#BDEAFF]/60"}`}>
                  <label className={`relative flex h-full min-h-[164px] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed px-3 py-4 text-center text-xs transition ${dark ? "border-white/15 text-[#B9B9B9] hover:bg-white/5" : "border-[#BDEAFF] text-[#04044A]/70 hover:bg-[#F3FAFF]"}`}>
                    {row.image_illustration_id ? (
                      <Image src={`/api/v1/odds/uploads/${row.image_illustration_id}/content`} alt="Ilustrasi gambar" fill unoptimized sizes="(max-width: 640px) 280px, 31vw" className="object-contain p-2" />
                    ) : (
                      <>
                        <MaterialIcon name={uploadingIllustrationId === row.id ? "progress_activity" : "add_photo_alternate"} size="sm" className={uploadingIllustrationId === row.id ? "animate-spin" : ""} />
                        <span>{uploadingIllustrationId === row.id ? "Mengunggah..." : "Upload ilustrasi gambar"}</span>
                      </>
                    )}
                    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploadingIllustrationId === row.id} onChange={(event) => onIllustrationUpload(row.id, event.target.files)} className="sr-only" />
                  </label>
                </td>
                <td className="h-full p-2 align-top">
                  <div className="flex h-full items-start gap-2">
                    <div className="min-w-0 flex-1"><OddsRichTextEditor value={row.additional_notes} onChange={(value) => onRowChange(row.id, "additional_notes", value)} minHeight={0} placeholder="Catatan tambahan" toolbarMode="focus" fillHeight /></div>
                    <button type="button" onClick={() => onRemoveRow(row.id)} disabled={rows.length === 1} title="Hapus baris" className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-rose-500 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-30">
                      <MaterialIcon name="delete" size="sm" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className={dark ? "border-t border-white/10" : "border-t border-[#BDEAFF]"}>
            <tr>
              <td colSpan={4} className="p-3">
                <button type="button" onClick={onAddRow} className={dark ? "inline-flex items-center gap-1.5 rounded-xl border border-[#B0FF5E]/40 px-3 py-2 text-xs font-semibold text-[#B0FF5E]" : "inline-flex items-center gap-1.5 rounded-xl border border-[#BDEAFF] px-3 py-2 text-xs font-semibold text-[#00A4FF]"}>
                  <MaterialIcon name="add" size="sm" />
                  Tambah gambar
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
