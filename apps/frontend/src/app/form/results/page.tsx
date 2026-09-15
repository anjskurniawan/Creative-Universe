"use client";

import { useEffect, useState } from "react";
import { apiFetch, ForbiddenError } from "@/core/api/client";
import { useAuth } from "@/hooks/auth";

type Feedback = { id: number; name: string; division: string; problems: string | null; suggestions: string | null; satisfaction: number; created_at: string };

export default function FormResultsPage() {
  const { user, isLoading } = useAuth();
  const [rows, setRows] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const allowed = user?.roles.some((role) => ["root", "manajer"].includes(role.toLowerCase())) ?? false;

  useEffect(() => {
    if (isLoading || !allowed) return;
    void apiFetch<Feedback[]>("/internal-client-feedback")
      .then(setRows)
      .catch((cause) => setError(cause instanceof ForbiddenError ? "Anda tidak memiliki akses untuk melihat hasil feedback." : "Gagal memuat hasil feedback."))
      .finally(() => setLoading(false));
  }, [allowed, isLoading]);

  if (isLoading || (allowed && loading)) return <main className="cu-style min-h-screen p-6 text-sm text-[#7b868a]">Memuat hasil feedback...</main>;
  if (!allowed) return <main className="cu-style min-h-screen p-6"><div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">Anda tidak memiliki akses untuk melihat hasil feedback.</div></main>;

  const averageRating = rows.length ? (rows.reduce((total, row) => total + row.satisfaction, 0) / rows.length).toFixed(1) : "0.0";
  const lastUpdated = rows[0]?.created_at
    ? new Date(rows[0].created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
    : "Belum ada data";

  return <main className="cu-style min-h-screen bg-[#f8f9fb] p-4 text-[#33255d] sm:p-6"><div className="mx-auto max-w-[1500px]"><div className="mb-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6d46eb]">Creative Report</p><h1 className="mt-1 text-2xl font-bold">Internal Client Feedback - April</h1><p className="mt-1 text-sm text-[#7b868a]">Daftar hasil penilaian dari berbagai divisi.</p></div>{error && <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}<div className="mb-5 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-[#e5e9ed] bg-white p-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide text-[#7b868a]">Total Feedback</p><p className="mt-2 text-3xl font-bold text-[#6d46eb]">{rows.length}</p></div><div className="rounded-xl border border-[#e5e9ed] bg-white p-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide text-[#7b868a]">Rating Rata-rata</p><p className="mt-2 text-3xl font-bold text-[#6d46eb]">{averageRating}<span className="ml-1 text-base font-medium text-[#7b868a]">/ 10</span></p></div><div className="rounded-xl border border-[#e5e9ed] bg-white p-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide text-[#7b868a]">Last Updated</p><p className="mt-2 text-lg font-bold text-[#33255d]">{lastUpdated}</p></div></div><div className="overflow-hidden rounded-xl border border-[#e5e9ed] bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[1050px] border-collapse text-left text-sm"><thead className="bg-[#f7f5ff] text-xs uppercase tracking-wide text-[#66558f]"><tr><th className="px-4 py-3">No</th><th className="px-4 py-3">Nama</th><th className="px-4 py-3">Divisi</th><th className="px-4 py-3">Kendala / Problem</th><th className="px-4 py-3">Masukan / Saran</th><th className="px-4 py-3 text-center">Kepuasan</th><th className="px-4 py-3">Tanggal</th></tr></thead><tbody className="divide-y divide-[#edf0f3]">{rows.length === 0 ? <tr><td colSpan={7} className="px-4 py-10 text-center text-[#7b868a]">Belum ada feedback tersimpan.</td></tr> : rows.map((row, index) => <tr key={row.id} className="align-top hover:bg-[#fcfbff]"><td className="px-4 py-4 text-[#7b868a]">{index + 1}</td><td className="px-4 py-4 font-semibold">{row.name}</td><td className="px-4 py-4">{row.division}</td><td className="max-w-[280px] whitespace-pre-wrap px-4 py-4 text-[#566164]">{row.problems || "-"}</td><td className="max-w-[280px] whitespace-pre-wrap px-4 py-4 text-[#566164]">{row.suggestions || "-"}</td><td className="px-4 py-4 text-center"><span className="inline-flex min-w-9 items-center justify-center rounded-full bg-[#eee9ff] px-2 py-1 font-bold text-[#6d46eb]">{row.satisfaction}</span></td><td className="whitespace-nowrap px-4 py-4 text-[#7b868a]">{new Date(row.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</td></tr>)}</tbody></table></div></div></div></main>;
}
