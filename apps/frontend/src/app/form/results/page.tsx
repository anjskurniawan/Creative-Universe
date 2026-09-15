"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch, ForbiddenError } from "@/core/api/client";
import { useAuth } from "@/hooks/auth";

type Feedback = { id: number; name: string; division: string; problems: string | null; suggestions: string | null; satisfaction: number; created_at: string };

export default function FormResultsPage() {
  const { user, isLoading } = useAuth();
  const [rows, setRows] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [monthOpen, setMonthOpen] = useState(false);
  const allowed = user?.roles.some((role) => ["root", "manajer", "spv"].includes(role.toLowerCase())) ?? false;

  useEffect(() => {
    if (isLoading || !allowed) return;
    void apiFetch<Feedback[]>("/internal-client-feedback")
      .then(setRows)
      .catch((cause) => setError(cause instanceof ForbiddenError ? "Anda tidak memiliki akses untuk melihat hasil feedback." : "Gagal memuat hasil feedback."))
      .finally(() => setLoading(false));
  }, [allowed, isLoading]);

  const months = useMemo(() => Array.from(new Set(rows.map((row) => row.created_at.slice(0, 7)))).sort().reverse(), [rows]);
  const visibleRows = useMemo(() => selectedMonth ? rows.filter((row) => row.created_at.startsWith(selectedMonth)) : rows, [rows, selectedMonth]);

  if (isLoading || (allowed && loading)) return <main className="cu-style min-h-screen p-6 text-sm text-[#7b868a]">Memuat hasil feedback...</main>;
  if (!allowed) return <main className="cu-style min-h-screen p-6"><div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">Anda tidak memiliki akses untuk melihat hasil feedback.</div></main>;

  const averageRating = visibleRows.length ? `${((visibleRows.reduce((total, row) => total + row.satisfaction, 0) / visibleRows.length) * 10).toFixed(1)}%` : "0.0%";
  const lastUpdated = visibleRows[0]?.created_at
    ? new Date(visibleRows[0].created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
    : "Belum ada data";

  const selectedMonthLabel = selectedMonth ? new Date(`${selectedMonth}-01T00:00:00`).toLocaleDateString("id-ID", { month: "long", year: "numeric" }) : "Semua bulan";
  return <main className="cu-style min-h-screen bg-[#f8f9fb] p-4 text-[#33255d] sm:p-6"><div className="mx-auto max-w-[1500px]"><div className="mb-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6d46eb]">Creative Report</p><h1 className="mt-1 text-2xl font-bold">Internal Client Feedback - April</h1><p className="mt-1 text-sm text-[#7b868a]">Daftar hasil penilaian dari berbagai divisi.</p></div>{error && <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}<div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><div className="rounded-xl border border-[#e5e9ed] bg-white p-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide text-[#7b868a]">Total Feedback</p><p className="mt-2 text-3xl font-bold text-[#6d46eb]">{visibleRows.length}</p></div><div className="rounded-xl border border-[#e5e9ed] bg-white p-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide text-[#7b868a]">Rating Rata-rata</p><p className="mt-2 text-3xl font-bold text-[#6d46eb]">{averageRating}</p></div><div className="rounded-xl border border-[#e5e9ed] bg-white p-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide text-[#7b868a]">Last Updated</p><p className="mt-2 text-lg font-bold text-[#33255d]">{lastUpdated}</p></div><div className="rounded-xl border border-[#e5e9ed] bg-white p-4 shadow-sm"><label className="block text-xs font-semibold uppercase tracking-wide text-[#7b868a]">Bulan<div className="relative mt-2"><button type="button" aria-haspopup="listbox" aria-expanded={monthOpen} onClick={() => setMonthOpen((open) => !open)} className="flex h-10 w-full items-center justify-between rounded-lg border border-[#dbe4e8] bg-[#fbfcfd] px-3 text-left text-sm font-semibold text-[#33255d] transition hover:border-[#b8a9f5] focus:border-[#6d46eb] focus:outline-none focus:ring-2 focus:ring-[#eee9ff]"><span>{selectedMonthLabel}</span><span className={`text-[#6d46eb] transition-transform ${monthOpen ? "rotate-180" : ""}`}>⌄</span></button>{monthOpen && <div role="listbox" className="absolute left-0 right-0 z-30 mt-2 max-h-56 overflow-y-auto rounded-lg border border-[#e5e0fa] bg-white p-1 shadow-xl"><button type="button" role="option" aria-selected={!selectedMonth} onClick={() => { setSelectedMonth(""); setMonthOpen(false); }} className={`w-full rounded-md px-3 py-2 text-left text-sm ${!selectedMonth ? "bg-[#f0ecff] font-semibold text-[#6d46eb]" : "text-[#566164] hover:bg-[#f8f6ff]"}`}>Semua bulan</button>{months.map((month) => { const label = new Date(`${month}-01T00:00:00`).toLocaleDateString("id-ID", { month: "long", year: "numeric" }); return <button type="button" role="option" aria-selected={selectedMonth === month} key={month} onClick={() => { setSelectedMonth(month); setMonthOpen(false); }} className={`w-full rounded-md px-3 py-2 text-left text-sm ${selectedMonth === month ? "bg-[#f0ecff] font-semibold text-[#6d46eb]" : "text-[#566164] hover:bg-[#f8f6ff]"}`}>{label}</button>; })}</div>}</div></label></div></div><div className="overflow-hidden rounded-xl border border-[#e5e9ed] bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[1050px] border-collapse text-left text-sm"><thead className="bg-[#f7f5ff] text-xs uppercase tracking-wide text-[#66558f]"><tr><th className="px-4 py-3">No</th><th className="px-4 py-3">Nama</th><th className="px-4 py-3">Divisi</th><th className="px-4 py-3">Kendala / Problem</th><th className="px-4 py-3">Masukan / Saran</th><th className="px-4 py-3 text-center">Kepuasan</th><th className="px-4 py-3">Tanggal</th></tr></thead><tbody className="divide-y divide-[#edf0f3]">{visibleRows.length === 0 ? <tr><td colSpan={7} className="px-4 py-10 text-center text-[#7b868a]">Belum ada feedback tersimpan.</td></tr> : visibleRows.map((row, index) => <tr key={row.id} className="align-top hover:bg-[#fcfbff]"><td className="px-4 py-4 text-[#7b868a]">{index + 1}</td><td className="px-4 py-4 font-semibold">{row.name}</td><td className="px-4 py-4">{row.division}</td><td className="max-w-[280px] whitespace-pre-wrap px-4 py-4 text-[#566164]">{row.problems || "-"}</td><td className="max-w-[280px] whitespace-pre-wrap px-4 py-4 text-[#566164]">{row.suggestions || "-"}</td><td className="px-4 py-4 text-center"><span className="inline-flex min-w-9 items-center justify-center rounded-full bg-[#eee9ff] px-2 py-1 font-bold text-[#6d46eb]">{row.satisfaction}</span></td><td className="whitespace-nowrap px-4 py-4 text-[#7b868a]">{new Date(row.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</td></tr>)}</tbody></table></div></div></div></main>;
}
