"use client";

import { useState, type FormEvent } from "react";
import { createOddsCategory } from "@/features/odds/api";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";
import { publishTaskFeedbackToast } from "@/features/odds/components/OddsTaskCard";

function StyledSelect({ value, options, onChange }: { value: string; options: Array<{ value: string; label: string }>; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((current) => !current)} className="flex h-10 w-full items-center justify-between rounded-lg border border-[#cfe4f0] bg-white px-3 text-left text-sm font-normal text-[#526677] outline-none transition hover:border-[#9ed9f4] focus:border-[#00a4ff] focus:ring-2 focus:ring-[#00a4ff]/15">
        <span>{selected?.label}</span><MaterialIcon name="expand_more" size="sm" className={`transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-[#cfe4f0] bg-white p-1 shadow-[0_8px_22px_rgba(0,80,140,0.14)]">
        {options.map((option) => <button key={option.value} type="button" onClick={() => { onChange(option.value); setOpen(false); }} className={`block w-full rounded-md px-3 py-2 text-left text-sm transition ${option.value === value ? "bg-[#e9f7ff] font-semibold text-[#0077bf]" : "text-[#526677] hover:bg-[#f1f9fd] hover:text-[#0077bf]"}`}>{option.label}</button>)}
      </div>}
    </div>
  );
}

export function OddsCategoryCreatePanel() {
  const [name, setName] = useState("");
  const [scoreWeight, setScoreWeight] = useState("1");
  const [revisionLimit, setRevisionLimit] = useState("2");
  const [slaDays, setSlaDays] = useState("0");
  const [slaHours, setSlaHours] = useState("0");
  const [slaMinutes, setSlaMinutes] = useState("0");
  const [matrix, setMatrix] = useState("Q4");
  const [format, setFormat] = useState<"default" | "table">("default");
  const [isActive, setIsActive] = useState(true);

  const updateSlaMinutes = (value: string) => {
    const minutes = Math.max(0, Number(value) || 0);
    const extraHours = Math.floor(minutes / 60);
    const normalizedMinutes = minutes % 60;
    const totalHours = Math.max(0, Number(slaHours) || 0) + extraHours;
    setSlaMinutes(String(normalizedMinutes));
    setSlaHours(String(totalHours % 24));
    if (totalHours >= 24) setSlaDays(String((Number(slaDays) || 0) + Math.floor(totalHours / 24)));
  };

  const updateSlaHours = (value: string) => {
    const hours = Math.max(0, Number(value) || 0);
    setSlaHours(String(hours % 24));
    if (hours >= 24) setSlaDays(String((Number(slaDays) || 0) + Math.floor(hours / 24)));
  };
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      publishTaskFeedbackToast({ status: "error", message: "Nama kategori wajib diisi." });
      return;
    }
    setSaving(true);
    try {
      const totalSlaMinutes = (Number(slaDays) * 24 * 60) + (Number(slaHours) * 60) + Number(slaMinutes);
      if (totalSlaMinutes < 1) {
        publishTaskFeedbackToast({ status: "error", message: "SLA harus lebih dari 0 menit." });
        return;
      }
      await createOddsCategory({ name: name.trim(), score_weight: Number(scoreWeight), normal_revision_limit: Number(revisionLimit), sla_minutes: totalSlaMinutes, important_matrix: matrix, brief_format: format, is_active: isActive });
      setName("");
      publishTaskFeedbackToast({ status: "success", message: "Kategori berhasil disimpan." });
    } catch (error) {
      publishTaskFeedbackToast({ status: "error", message: error instanceof Error ? error.message : "Kategori gagal disimpan." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex min-h-full w-full flex-col gap-4 p-5">
      <div>
        <h2 className="text-lg font-semibold text-[#04044A]">Tambah Kategori</h2>
        <p className="mt-1 text-sm text-[#718398]">Tambahkan kategori baru untuk request task ODDS.</p>
      </div>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-[#526677]">
        Nama kategori
        <input required value={name} onChange={(event) => setName(event.target.value)} className="h-10 rounded-lg border border-[#cfe4f0] px-3 outline-none focus:border-[#00a4ff]" />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-[#526677]">
          Important Matrix
          <StyledSelect value={matrix} onChange={setMatrix} options={[{ value: "Q1", label: "Q1 - Mendesak & Penting" }, { value: "Q2", label: "Q2 - Penting" }, { value: "Q3", label: "Q3 - Mendesak" }, { value: "Q4", label: "Q4 - Normal / Standar" }]} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-[#526677]">
          Format Detail Brief
          <StyledSelect value={format} onChange={(value) => setFormat(value as "default" | "table")} options={[{ value: "default", label: "Default" }, { value: "table", label: "Deskripsi Produk" }]} />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-[#526677]">
          Bobot score
          <input type="number" min="0" step="0.5" value={scoreWeight} onChange={(event) => setScoreWeight(event.target.value)} className="h-10 rounded-lg border border-[#cfe4f0] px-3 outline-none focus:border-[#00a4ff]" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-[#526677]">
          Max Revisi
          <input type="number" min="0" step="1" value={revisionLimit} onChange={(event) => setRevisionLimit(event.target.value)} className="h-10 rounded-lg border border-[#cfe4f0] px-3 outline-none focus:border-[#00a4ff]" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-[#526677]">
          SLA
          <div className="grid grid-cols-3 gap-2">
            <div className="relative"><input aria-label="SLA hari" type="number" min="0" value={slaDays} onChange={(event) => setSlaDays(event.target.value)} className="h-10 w-full appearance-none rounded-lg border border-[#cfe4f0] px-3 pr-9 text-sm font-normal outline-none focus:border-[#00a4ff] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" /><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#718398]">H</span></div>
            <div className="relative"><input aria-label="SLA jam" type="number" min="0" max="23" value={slaHours} onChange={(event) => updateSlaHours(event.target.value)} className="h-10 w-full appearance-none rounded-lg border border-[#cfe4f0] px-3 pr-9 text-sm font-normal outline-none focus:border-[#00a4ff] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" /><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#718398]">J</span></div>
            <div className="relative"><input aria-label="SLA menit" type="number" min="0" max="59" value={slaMinutes} onChange={(event) => updateSlaMinutes(event.target.value)} className="h-10 w-full appearance-none rounded-lg border border-[#cfe4f0] px-3 pr-9 text-sm font-normal outline-none focus:border-[#00a4ff] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" /><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#718398]">M</span></div>
          </div>
        </label>
      </div>
      <label className="flex cursor-pointer items-center justify-between rounded-lg border border-[#cfe4f0] px-3 py-2.5 text-sm font-medium text-[#526677]">
        <span>Aktif</span>
        <button type="button" role="switch" aria-checked={isActive} onClick={() => setIsActive((value) => !value)} className={`relative h-6 w-11 rounded-full transition ${isActive ? "bg-[#00a4ff]" : "bg-[#cbd8e0]"}`}><span className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition ${isActive ? "left-6" : "left-1"}`} /></button>
      </label>
      <button type="submit" disabled={saving} className="mt-auto h-10 rounded-lg bg-[#00a4ff] px-4 text-sm font-semibold text-white transition hover:bg-[#008edb] disabled:opacity-50">{saving ? "Menyimpan..." : "Simpan Kategori"}</button>
    </form>
  );
}
