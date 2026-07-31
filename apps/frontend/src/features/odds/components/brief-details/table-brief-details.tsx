"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { MaterialIcon } from "@/components/ui/material-icon";
import { OddsRichTextEditor } from "@/components/odds-rich-text-editor";
import type { OddsCategory } from "@/features/odds/api";
import type { OddsRequestForm } from "../request-builder/types";

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
  form: OddsRequestForm;
  update: (field: keyof OddsRequestForm, value: string) => void;
  selectedCategory: OddsCategory | undefined;
  todayDate: string;
  tomorrowDate: string;
  threeDaysDate: string;
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

/* ─── Shared table markup ─── */
function BriefTable({
  rows, dark, labelClass, draggingRowId, setDraggingRowId,
  onReorderRows, onRowChange, onIllustrationUpload, uploadingIllustrationId,
  onRemoveRow, onAddRow,
}: {
  rows: TableBriefRow[];
  dark: boolean;
  labelClass: string;
  draggingRowId: string | null;
  setDraggingRowId: (id: string | null) => void;
  onReorderRows: (sourceId: string, targetId: string) => void;
  onRowChange: (id: string, field: keyof Omit<TableBriefRow, "id">, value: string) => void;
  onIllustrationUpload: (id: string, files: FileList | null) => void;
  uploadingIllustrationId: string | null;
  onRemoveRow: (id: string) => void;
  onAddRow: () => void;
}) {
  return (
    <table className={`w-full min-w-[700px] table-fixed border-collapse text-sm [&_td]:min-w-0 border ${dark ? "border-white/10" : "border-[#BDEAFF]"}`}>
      <colgroup>
        <col className="w-16" />
        <col className="w-[42%]" />
        <col className="w-[26%]" />
        <col className="w-[32%]" />
        <col className="w-16" />
      </colgroup>
      <thead className={dark ? "bg-white/5 text-[#B9B9B9]" : "bg-[#F3FAFF] text-[#04044A]/70"}>
        <tr>
          <th className={`w-16 px-3 py-3 text-center text-xs font-semibold ${dark ? "border-r border-white/10" : "border-r border-[#BDEAFF]"}`}>No</th>
          <th className={`min-w-44 px-3 py-3 text-center text-xs font-semibold ${dark ? "border-r border-white/10" : "border-r border-[#BDEAFF]"}`}>Deskripsi</th>
          <th className={`min-w-44 px-3 py-3 text-center text-xs font-semibold ${dark ? "border-r border-white/10" : "border-r border-[#BDEAFF]"}`}>Referensi</th>
          <th className={`min-w-48 px-3 py-3 text-center text-xs font-semibold ${dark ? "border-r border-white/10" : "border-r border-[#BDEAFF]"}`}>Keterangan</th>
          <th className="w-16 px-3 py-3 text-center text-xs font-semibold">Action</th>
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
              <div className="flex items-center justify-center gap-1">
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
                  className={`inline-flex size-6 cursor-grab items-center justify-center rounded-md active:cursor-grabbing ${dark ? "text-[#B9B9B9] hover:bg-white/10" : "text-[#00A4FF] hover:bg-[#F3FAFF]"}`}
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
                    <span>{uploadingIllustrationId === row.id ? "Mengunggah..." : "Klik untuk upload / Seret referensi ke sini"}</span>
                  </>
                )}
                <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploadingIllustrationId === row.id} onChange={(event) => onIllustrationUpload(row.id, event.target.files)} className="sr-only" />
              </label>
            </td>
            <td className={`h-full p-2 align-top ${dark ? "border-r border-white/10" : "border-r border-[#BDEAFF]/60"}`}>
              <OddsRichTextEditor value={row.additional_notes} onChange={(value) => onRowChange(row.id, "additional_notes", value)} minHeight={0} placeholder="Catatan tambahan" toolbarMode="focus" fillHeight />
            </td>
            <td className="p-2 text-center align-middle">
              <button type="button" onClick={() => onRemoveRow(row.id)} disabled={rows.length === 1} title="Hapus baris" className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-rose-500 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-30">
                <MaterialIcon name="delete" size="sm" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot className={dark ? "border-t border-white/10" : "border-t border-[#BDEAFF]"}>
        <tr>
          <td colSpan={5} className="p-3">
            <button type="button" onClick={onAddRow} className={dark ? "inline-flex items-center gap-1.5 rounded-xl border border-[#B0FF5E]/40 px-3 py-2 text-xs font-semibold text-[#B0FF5E]" : "inline-flex items-center gap-1.5 rounded-xl border border-[#BDEAFF] px-3 py-2 text-xs font-semibold text-[#00A4FF]"}>
              <MaterialIcon name="add" size="sm" />
              Tambah Baris
            </button>
          </td>
        </tr>
      </tfoot>
    </table>
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
  form,
  update,
  selectedCategory,
  todayDate,
  tomorrowDate,
  threeDaysDate,
}: TableBriefDetailsProps) {
  const [draggingRowId, setDraggingRowId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const labelClass = dark ? "text-[#B9B9B9]" : "text-[#04044A]/70";

  const tableProps = {
    rows, dark, labelClass, draggingRowId, setDraggingRowId,
    onReorderRows, onRowChange, onIllustrationUpload, uploadingIllustrationId,
    onRemoveRow, onAddRow,
  };

  return (
    <>
      {/* Normal embedded layout */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="grid grid-cols-4 gap-4 w-full h-full min-h-0">

          {/* Left Side (3/4): container with header + table */}
          <div className={`col-span-3 flex flex-col min-h-0 overflow-hidden ${dark ? "bg-[#171717]" : "bg-white"}`}>
            {/* Header bar */}
            <div className={`flex shrink-0 items-center justify-between px-3 py-2`}>
              <span className={`text-xs font-bold ${dark ? "text-white" : "text-[#04044A]"}`}>Tabel Brief</span>
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                title="Perluas ke layar penuh"
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition ${dark ? "text-[#B9B9B9] hover:bg-white/10 hover:text-white" : "text-[#04044A]/60 hover:bg-[#BDEAFF]/40 hover:text-[#04044A]"}`}
              >
                <MaterialIcon name="open_in_full" size="sm" />
                Layar Penuh
              </button>
            </div>

            {/* Table — scrollable area below the header */}
            <div className="flex min-h-0 flex-1 flex-col overflow-auto pr-1 pb-2">
              <div className="min-w-0">
                <BriefTable {...tableProps} />
              </div>
            </div>
          </div>

          {/* Right Side (1/4): detail inputs */}
          <div className="col-span-1 flex flex-col space-y-4 min-w-0 overflow-y-auto">
            <label className="block">
              <span className={`mb-1.5 block text-xs font-semibold ${labelClass}`}>Kategori</span>
              <CatalogCombobox value={category} placeholder="Cari/tambah kategori" options={productCatalog.map((item) => item.name)} dark={dark} onChange={onCategoryChange} onCommit={onProductCategoryCommit} />
            </label>
            <label className="block">
              <span className={`mb-1.5 block text-xs font-semibold ${labelClass}`}>Product</span>
              <CatalogCombobox value={product} placeholder={category ? "Cari/tambah produk" : "Pilih kategori dulu"} options={productCatalog.find((item) => item.name === category)?.products.map((item) => item.name) ?? []} disabled={!category} dark={dark} onChange={onProductChange} onCommit={async (value) => { if (category.trim()) await onProductCommit?.(category.trim(), value); }} />
            </label>
            <div>
              <span className={`mb-1.5 block text-xs font-semibold ${labelClass}`}>Gambar Packaging</span>
              <label className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-5 text-center text-xs transition ${dark ? "border-white/15 text-[#B9B9B9] hover:bg-white/5" : "border-[#BDEAFF] text-[#04044A]/70 hover:bg-[#F3FAFF]"}`}>
                {packagingImageId ? (
                  <Image src={`/api/v1/odds/uploads/${packagingImageId}/content`} alt={packagingImageName} width={80} height={80} unoptimized className="size-20 rounded-lg border border-cu-border bg-white object-contain mb-1" />
                ) : (
                  <MaterialIcon name={uploadingPackagingImage ? "progress_activity" : "upload_file"} size="md" className={uploadingPackagingImage ? "animate-spin" : ""} />
                )}
                <span>{uploadingPackagingImage ? "Mengunggah..." : packagingImageName || "Upload gambar packaging (opsional)"}</span>
                <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploadingPackagingImage} onChange={(event) => onPackagingImageUpload(event.target.files)} className="sr-only" />
              </label>
            </div>

            {/* Important Matrix Display */}
            {(() => {
              const matrixKey = (selectedCategory?.important_matrix || form.important_matrix || "Q4").toUpperCase();
              const quadranInfo =
                matrixKey === "Q1" ? { code: "Q1", label: "Quadran I", desc: "Mendesak & Penting", color: "text-red-500 border-red-500/20 bg-red-500/5", icon: "flash_on" } :
                matrixKey === "Q2" ? { code: "Q2", label: "Quadran II", desc: "Penting", color: "text-orange-500 border-orange-500/20 bg-orange-500/5", icon: "priority_high" } :
                matrixKey === "Q3" ? { code: "Q3", label: "Quadran III", desc: "Mendesak", color: "text-blue-500 border-blue-500/20 bg-blue-500/5", icon: "schedule" } :
                { code: "Q4", label: "Quadran IV", desc: "Normal / Standar", color: "text-slate-400 border-slate-500/20 bg-slate-500/5", icon: "assignment" };
              return (
                <>
                  <div>
                    <span className={`mb-1.5 block text-xs font-semibold ${labelClass}`}>Important Matrix</span>
                    <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${quadranInfo.color}`}>
                      <div className="flex flex-col">
                        <span className="font-bold">{quadranInfo.label} ({quadranInfo.code})</span>
                        <span className="text-[10px] opacity-80 font-normal">{quadranInfo.desc}</span>
                      </div>
                      <MaterialIcon name={quadranInfo.icon} size="sm" className="opacity-80" />
                    </div>
                  </div>
                  <div className="relative">
                    <span className={`mb-1.5 block text-xs font-semibold ${labelClass}`}>Tenggat Waktu / Deadline</span>
                    <input
                      type="date"
                      min={matrixKey === "Q3" || matrixKey === "Q4" ? threeDaysDate : undefined}
                      value={form.deadline}
                      onChange={(e) => update("deadline", e.target.value)}
                      className={`h-11 w-full rounded-xl border px-3.5 text-sm outline-none transition focus:ring-1 ${
                        dark
                          ? "border-white/10 bg-[#0E0E0E] text-white focus:border-[#B0FF5E] focus:ring-[#B0FF5E]"
                          : "border-[#BDEAFF] bg-white text-[#04044A] focus:border-[#00A4FF] focus:ring-[#00A4FF]"
                      }`}
                    />
                    <p className={`text-[10px] ${dark ? "text-slate-400" : "text-slate-500"} mt-1`}>
                      {matrixKey === "Q3" || matrixKey === "Q4"
                        ? `* Minimal 3 hari dari sekarang (${threeDaysDate})`
                        : "* Kosongkan untuk penjadwalan otomatis"}
                    </p>
                  </div>
                </>
              );
            })()}
          </div>

        </div>
      </div>

      {/* ── Fullscreen Popup Overlay (portaled to body) ── */}
      {isFullscreen && createPortal(
        <div className={`fixed inset-0 z-[9999] flex flex-col ${dark ? "bg-[#0E0E0E]" : "bg-white"}`}>
          {/* Popup Header */}
          <div className={`flex shrink-0 items-center justify-between border-b px-5 py-3 ${dark ? "border-white/10" : "border-[#BDEAFF]"}`}>
            <span className={`text-sm font-bold ${dark ? "text-white" : "text-[#04044A]"}`}>Tabel Brief</span>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              title="Tutup layar penuh"
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${dark ? "text-[#B9B9B9] hover:bg-white/10 hover:text-white" : "text-[#04044A]/60 hover:bg-[#BDEAFF]/40 hover:text-[#04044A]"}`}
            >
              <MaterialIcon name="close_fullscreen" size="sm" />
              Tutup
            </button>
          </div>

          {/* Popup Body — full-width table */}
          <div className="flex min-h-0 flex-1 overflow-auto p-4">
            <div className="w-full min-w-0">
              <BriefTable {...tableProps} />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}