"use client";

import { useEffect, useState } from "react";
import { creativeReportApi } from "@/features/creative-report/api";
import type { CreativeMember, HistoricalCreativeMemberInput } from "@/features/creative-report/types";

const currentMonth = new Date().toISOString().slice(0, 7);

export function CreativeMemberManagement() {
  const [pending, setPending] = useState<CreativeMember[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<number | null>(null);
  const [historical, setHistorical] = useState<HistoricalCreativeMemberInput>({
    name: "", position_name: "Designer", start_month: currentMonth, end_month: currentMonth,
  });

  const load = async () => {
    try {
      setPending(await creativeReportApi.members.pending());
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal memuat validasi anggota.");
    }
  };
  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const review = async (member: CreativeMember, approved: boolean) => {
    setSaving(member.id);
    try {
      if (approved) await creativeReportApi.members.approve(member.id);
      else await creativeReportApi.members.reject(member.id);
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal memproses validasi.");
    } finally { setSaving(null); }
  };
  const addHistorical = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(-1);
    try {
      await creativeReportApi.members.createHistorical(historical);
      setHistorical({ name: "", position_name: "Designer", start_month: currentMonth, end_month: currentMonth });
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal menambah personel historis.");
    } finally { setSaving(null); }
  };

  return <section className="mt-6 grid gap-4 xl:grid-cols-2">
    <div className="rounded-2xl border border-[#ded7fb] bg-white p-5">
      <h2 className="text-base font-semibold text-[#33255d]">Validasi anggota Creative</h2>
      <p className="mt-1 text-xs text-[#7b868a]">Setujui SPV/staff agar otomatis masuk report. Manajer tidak menjadi objek penilaian.</p>
      <div className="mt-4 space-y-2">
        {pending.length === 0 ? <p className="rounded-lg bg-[#f7f5ff] px-3 py-2 text-sm text-[#6d46eb]">Tidak ada anggota yang menunggu validasi.</p> : pending.map((member) => <div key={member.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#edf0f3] p-3">
          <div><p className="text-sm font-semibold text-[#3b4446]">{member.name}</p><p className="text-xs text-[#7b868a]">{member.position_name}</p></div>
          <div className="flex gap-2"><button type="button" disabled={saving === member.id} onClick={() => void review(member, true)} className="rounded-lg bg-[#6d46eb] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">Setujui</button><button type="button" disabled={saving === member.id} onClick={() => void review(member, false)} className="rounded-lg border border-[#f2b8c7] px-3 py-2 text-xs font-semibold text-[#b4234d] disabled:opacity-50">Tolak & hapus akun</button></div>
        </div>)}</div>
    </div>
    <form onSubmit={addHistorical} className="rounded-2xl border border-[#e1e8eb] bg-white p-5">
      <h2 className="text-base font-semibold text-[#3b4446]">Personel historis tanpa akun</h2>
      <p className="mt-1 text-xs text-[#7b868a]">Untuk eks anggota yang tidak pernah memiliki akun aplikasi.</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2"><input required value={historical.name} onChange={(event) => setHistorical({ ...historical, name: event.target.value })} placeholder="Nama personel" className="h-10 rounded-lg border border-[#dbe4e8] px-3 text-sm outline-none" /><select value={historical.position_name} onChange={(event) => setHistorical({ ...historical, position_name: event.target.value as HistoricalCreativeMemberInput["position_name"] })} className="h-10 rounded-lg border border-[#dbe4e8] px-3 text-sm"><option>SPV</option><option>Designer</option><option>Videographer</option></select><label className="text-xs text-[#7b868a]">Mulai<input required type="month" value={historical.start_month} onChange={(event) => setHistorical({ ...historical, start_month: event.target.value })} className="mt-1 block h-10 w-full rounded-lg border border-[#dbe4e8] px-3 text-sm text-[#3b4446]" /></label><label className="text-xs text-[#7b868a]">Sampai<input required type="month" value={historical.end_month} onChange={(event) => setHistorical({ ...historical, end_month: event.target.value })} className="mt-1 block h-10 w-full rounded-lg border border-[#dbe4e8] px-3 text-sm text-[#3b4446]" /></label></div>
      <button disabled={saving === -1} className="mt-3 rounded-lg border border-[#6d46eb] px-3 py-2 text-xs font-semibold text-[#6d46eb] disabled:opacity-50">Tambah ke histori report</button>
    </form>
    {error && <p className="xl:col-span-2 rounded-xl bg-[#ffedf1] px-4 py-3 text-sm text-[#b4234d]">{error}</p>}
  </section>;
}
