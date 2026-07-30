"use client";

import { useState } from "react";
import Image from "next/image";
import { MaterialIcon } from "@/components/ui/material-icon";
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
  productCatalog?: Array<{ id: number; name: string; products: Array<{ id: number; name: string }> }>;
  onProductCategoryCommit?: (name: string) => Promise<void>;
  onProductCommit?: (category: string, name: string) => Promise<void>;
};

function CatalogCombobox({
  value,
  placeholder,
  options,
  disabled = false,
  dark,
  onChange,
  onCommit,
}: {
  value: string;
  placeholder: string;
  options: string[];
  disabled?: boolean;
  dark: boolean;
  onChange: (value: string) => void;
  onCommit?: (value: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const filteredOptions = options.filter((option) => option.toLowerCase().includes(value.trim().toLowerCase()));
  const exactMatch = options.some((option) => option.toLowerCase() === value.trim().toLowerCase());
  const inputClass = dark
    ? "border-white/10 bg-[#0E0E0E] text-white placeholder:text-slate-500"
    : "border-[#BDEAFF] bg-white text-[#04044A] placeholder:text-slate-400";

  return (
    <div className="relative">
      <input
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(event) => { onChange(event.target.value); setOpen(true); }}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 120);
          if (value.trim() && onCommit) void onCommit(value.trim());
        }}
        className={`h-11 w-full rounded-xl border px-3.5 pr-10 text-sm outline-none transition focus:ring-1 ${inputClass} ${dark ? "focus:border-[#B0FF5E] focus:ring-[#B0FF5E]" : "focus:border-[#00A4FF] focus:ring-[#00A4FF]"}`}
      />
      <MaterialIcon name="expand_more" size="sm" className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${dark ? "text-[#B9B9B9]" : "text-[#04044A]/60"}`} />
      {open && !disabled && (
        <div className={`absolute inset-x-0 top-[calc(100%+6px)] z-30 max-h-56 overflow-y-auto rounded-xl border p-1.5 shadow-[0_10px_24px_rgba(4,4,74,0.14)] ${dark ? "border-white/10 bg-[#171717]" : "border-[#BDEAFF] bg-white"}`}>
          {filteredOptions.map((option) => (
            <button key={option} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(option); setOpen(false); }} className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${dark ? "text-white hover:bg-white/10" : "text-[#04044A] hover:bg-[#F3FAFF]"}`}>
              {option}
            </button>
          ))}
          {value.trim() && !exactMatch && (
            <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(value.trim()); setOpen(false); if (onCommit) void onCommit(value.trim()); }} className={`mt-1 block w-full rounded-lg border-t px-3 py-2.5 text-left text-sm font-semibold transition-colors ${dark ? "border-white/10 text-[#B0FF5E] hover:bg-white/10" : "border-[#BDEAFF] text-[#00A4FF] hover:bg-[#F3FAFF]"}`}>
              + Tambah &quot;{value.trim()}&quot;
            </button>
          )}
          {!filteredOptions.length && !value.trim() && <p className={`px-3 py-2 text-sm ${dark ? "text-[#B9B9B9]" : "text-[#04044A]/50"}`}>Belum ada pilihan tersimpan.</p>}
        </div>
      )}
    </div>
  );
}

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
  productCatalog = [],
  onProductCategoryCommit,
  onProductCommit,
}: TableBriefDetailsProps) {
  const [draggingRowId, setDraggingRowId] = useState<string | null>(null);
  const labelClass = dark ? "text-[#B9B9B9]" : "text-[#04044A]/70";

  return (
    <div className={`flex min-h-0 flex-1 overflow-auto rounded-2xl border ${dark ? "border-white/10 bg-[#171717]" : "border-[#BDEAFF] bg-white"}`}>
      <div className="flex min-h-full min-w-[760px] flex-1 flex-col space-y-5 p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
          <span className={`mb-1.5 block text-xs font-semibold ${labelClass}`}>Kategori</span>
          <CatalogCombobox value={category} placeholder="Cari atau tambah kategori produk" options={productCatalog.map((item) => item.name)} dark={dark} onChange={onCategoryChange} onCommit={onProductCategoryCommit} />
          </label>
          <label className="block">
          <span className={`mb-1.5 block text-xs font-semibold ${labelClass}`}>Product</span>
          <CatalogCombobox value={product} placeholder={category ? "Cari atau tambah produk" : "Pilih kategori terlebih dahulu"} options={productCatalog.find((item) => item.name === category)?.products.map((item) => item.name) ?? []} disabled={!category} dark={dark} onChange={onProductChange} onCommit={async (value) => { if (category.trim()) await onProductCommit?.(category.trim(), value); }} />
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
