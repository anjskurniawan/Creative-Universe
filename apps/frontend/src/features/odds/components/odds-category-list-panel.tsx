"use client";

import { useEffect, useState } from "react";
import { getOddsConfigCategories, updateOddsCategory } from "@/features/odds/api";
import { publishTaskFeedbackToast } from "@/components/odds/TaskCard";

type Category = { id: number; name: string; important_matrix?: string; brief_format?: string; score_weight?: string | number; normal_revision_limit?: number; sla_minutes?: number; is_active?: boolean };
type Draft = Partial<Category>;

const formatSla = (minutes = 0) => {
  const parts = [Math.floor(minutes / 1440) > 0 ? `${Math.floor(minutes / 1440)} hari` : "", Math.floor((minutes % 1440) / 60) > 0 ? `${Math.floor((minutes % 1440) / 60)} jam` : "", minutes % 60 > 0 ? `${minutes % 60} menit` : ""].filter(Boolean);
  return parts.join(" ") || "0 menit";
};
const formatScore = (score?: string | number) => score === undefined || score === null ? "-" : Number(score).toString();

export function OddsCategoryListPanel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { getOddsConfigCategories().then(setCategories).finally(() => setLoading(false)); }, []);
  const editAll = () => { setDrafts(Object.fromEntries(categories.map((category) => [category.id, { ...category }]))); setEditing(true); };
  const saveAll = async () => {
    setSaving(true);
    try {
      const updated = await Promise.all(categories.map((category) => updateOddsCategory(category.id, { name: drafts[category.id]?.name?.toString().trim(), score_weight: Number(drafts[category.id]?.score_weight), normal_revision_limit: Number(drafts[category.id]?.normal_revision_limit), sla_minutes: Number(drafts[category.id]?.sla_minutes) })));
      setCategories(updated.map((category, index) => ({ ...categories[index], ...category })));
      setEditing(false);
      publishTaskFeedbackToast({ status: "success", message: "Semua kategori berhasil diperbarui." });
    } catch (error) { publishTaskFeedbackToast({ status: "error", message: error instanceof Error ? error.message : "Kategori gagal diperbarui." }); }
    finally { setSaving(false); }
  };
  const input = (category: Category, key: keyof Category, type = "text") => <input type={type} value={String(drafts[category.id]?.[key] ?? "")} onChange={(event) => setDrafts((current) => ({ ...current, [category.id]: { ...current[category.id], [key]: type === "number" ? Number(event.target.value) : event.target.value } }))} className="w-full rounded border border-[#bde5fa] bg-white px-2 py-1 text-xs outline-none focus:border-[#00a4ff]" />;

  return <div className="flex h-full min-h-0 flex-col p-5">
    <div className="mb-4 flex shrink-0 items-end justify-between gap-4"><div><h2 className="text-lg font-semibold text-[#04044A]">Kategori ODDS</h2><p className="mt-1 text-sm text-[#718398]">Kelola kategori yang tersedia pada request task.</p></div><div className="flex gap-2">{editing && <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-[#bde5fa] px-3 py-2 text-xs font-semibold text-[#526677]">Batal</button>}<button type="button" disabled={saving || loading || categories.length === 0} onClick={() => editing ? void saveAll() : editAll()} className="rounded-lg bg-[#00a4ff] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">{saving ? "Menyimpan..." : editing ? "Save semua" : "Edit semua"}</button></div></div>
    <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-[#d7ecf8]"><table className="min-w-[700px] w-full border-collapse text-left text-sm"><thead className="sticky top-0 z-10 border-b border-[#d7ecf8] bg-[#f3faff] text-xs uppercase tracking-wide text-[#718398]"><tr>{["Nama", "Matrix", "Format Detail Brief", "Bobot", "Revisi", "SLA"].map((header) => <th key={header} className="border-r border-[#d7ecf8] px-3 py-3 last:border-r-0">{header}</th>)}</tr></thead><tbody className="divide-y divide-[#e4f0f5]">{loading ? <tr><td colSpan={6} className="px-3 py-8 text-center text-[#718398]">Memuat...</td></tr> : categories.length === 0 ? <tr><td colSpan={6} className="px-3 py-8 text-center text-[#718398]">Belum ada kategori.</td></tr> : categories.map((category) => { const matrix = (category.important_matrix ?? "Q4").toUpperCase(); const matrixStyle = matrix === "Q1" ? "bg-red-50 text-red-600 border-red-200" : matrix === "Q2" ? "bg-orange-50 text-orange-600 border-orange-200" : matrix === "Q3" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-slate-50 text-slate-600 border-slate-200"; return <tr key={category.id} className="align-middle hover:bg-[#f7fcff]"><td className="border-r border-[#e4f0f5] px-3 py-3 font-semibold text-[#3b4446]"><span className={`mr-2 inline-block size-2 rounded-full align-middle ${category.is_active ? "bg-emerald-500" : "bg-slate-400"}`} title={category.is_active ? "Aktif" : "Nonaktif"} />{editing ? input(category, "name") : category.name}</td><td className="border-r border-[#e4f0f5] px-3 py-3"><span className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${matrixStyle}`}>{matrix}</span></td><td className="border-r border-[#e4f0f5] px-3 py-3 text-[#526677]">{category.brief_format === "table" ? "Deskripsi Produk" : "Default"}</td><td className="border-r border-[#e4f0f5] px-3 py-3 text-[#526677]">{editing ? input(category, "score_weight", "number") : formatScore(category.score_weight)}</td><td className="border-r border-[#e4f0f5] px-3 py-3 text-[#526677]">{editing ? input(category, "normal_revision_limit", "number") : category.normal_revision_limit ?? "-"}</td><td className="px-3 py-3 text-[#526677]">{editing ? input(category, "sla_minutes", "number") : formatSla(category.sla_minutes)}</td></tr>; })}</tbody></table></div>
  </div>;
}
