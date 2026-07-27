"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MaterialIcon } from "@/components/material-icon";
import { resolveStorageUrl } from "@/core/api/client";
import { creativeReportApi } from "@/features/creative-report/api";
import { getOddsCategories, type OddsCategory } from "@/features/odds/api";
import type { CreativeMemberProfile } from "@/features/creative-report/types";
import { useAuth } from "@/providers/auth-provider";

const METRICS = [["creativity", "Creativity"], ["speed", "Speed"], ["communication", "Communication"], ["quality", "Quality"], ["teamwork", "Teamwork"]] as const;

export default function EditCreativeMemberPage() {
  const memberId = useSearchParams().get("memberId");
  const router = useRouter();
  const { hasRole } = useAuth();
  const [member, setMember] = useState<CreativeMemberProfile | null>(null);
  const [categories, setCategories] = useState<OddsCategory[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!hasRole("Root") && !hasRole("Manajer")) return router.replace("/creative-report/staff");
    if (!memberId) { setError("Anggota Creative tidak dipilih."); return; }
    void Promise.all([creativeReportApi.members.detail(memberId), getOddsCategories()]).then(([profile, odds]) => { setMember(profile); setCategories(odds); }).catch((cause) => setError(cause instanceof Error ? cause.message : "Gagal memuat profil."));
  }, [hasRole, memberId, router]);
  if (!member) return <p className="p-4 text-sm text-[#7b868a]">{error ?? "Memuat profil anggota..."}</p>;
  const setMetric = (key: string, value: number) => setMember({ ...member, profile_metrics: { ...member.profile_metrics, [key]: value } });
  const selected = new Set((member.odds_profile?.specializations ?? []).map(String));
  const save = async () => {
    setSaving(true); setError(null);
    const body = new FormData();
    body.set("name", member.name); body.set("position_name", member.position_name); body.set("joined_at", member.joined_at ?? ""); body.set("resigned_at", member.resigned_at ?? "");
    body.set("profile_metrics", JSON.stringify(member.profile_metrics)); body.set("specializations", JSON.stringify(member.odds_profile?.specializations ?? [])); body.set("odds_status", member.odds_profile?.status ?? "available");
    if (image) body.set("card_image", image);
    try { await creativeReportApi.members.update(member.id, body); router.push("/creative-report/staff"); } catch (cause) { setError(cause instanceof Error ? cause.message : "Gagal menyimpan profil."); } finally { setSaving(false); }
  };
  const photo = image ? URL.createObjectURL(image) : resolveStorageUrl(member.card_image_path);
  return <main className="w-full max-w-5xl"><header className="mb-6 flex items-center justify-between"><div><Link href="/creative-report/staff" className="text-xs text-[#6d46eb]">← Kembali ke Staff</Link><h1 className="mt-2 text-2xl font-semibold">Edit {member.name}</h1></div><button type="button" onClick={() => void save()} disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#6d46eb] px-4 text-sm font-semibold text-white disabled:opacity-50"><MaterialIcon name="save" size="sm" />Simpan</button></header>{error && <p className="mb-4 rounded-lg bg-[#ffedf1] p-3 text-sm text-[#b4234d]">{error}</p>}<div className="grid gap-4 lg:grid-cols-2"><section className="rounded-xl border bg-white p-4"><h2 className="font-semibold">Identitas & foto Card</h2><div className="mt-4 flex gap-4"><div className="flex size-24 items-center justify-center overflow-hidden rounded-lg bg-[#3b4446] text-xl text-white">{photo ? <img src={photo} alt="Preview" className="size-full object-cover" /> : member.name.slice(0, 2)}</div><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setImage(event.target.files?.[0] ?? null)} /></div><label className="mt-3 block text-sm">Nama<input value={member.name} onChange={(event) => setMember({ ...member, name: event.target.value })} className="mt-1 h-10 w-full rounded-lg border px-3" /></label><div className="mt-3 grid grid-cols-2 gap-3"><label className="text-sm">Tanggal masuk<input type="date" value={member.joined_at ?? ""} onChange={(event) => setMember({ ...member, joined_at: event.target.value || null })} className="mt-1 h-10 w-full rounded-lg border px-3" /></label><label className="text-sm">Tanggal keluar<input type="date" value={member.resigned_at ?? ""} onChange={(event) => setMember({ ...member, resigned_at: event.target.value || null })} className="mt-1 h-10 w-full rounded-lg border px-3" /></label></div></section><section className="rounded-xl border bg-white p-4"><h2 className="font-semibold">Kompetensi manual</h2><div className="mt-4 grid grid-cols-2 gap-3">{METRICS.map(([key,label]) => <label key={key} className="text-sm">{label}<input type="number" min="0" max="10" step="0.1" value={member.profile_metrics[key] ?? 0} onChange={(event) => setMetric(key, Math.max(0, Math.min(10, Number(event.target.value) || 0)))} className="mt-1 h-10 w-full rounded-lg border px-3" /></label>)}</div></section><section className="rounded-xl border bg-white p-4 lg:col-span-2"><h2 className="font-semibold">Spesialisasi ODDS</h2><div className="mt-3 grid gap-2 sm:grid-cols-2">{categories.map((category) => <label key={category.id} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"><input type="checkbox" checked={selected.has(String(category.id))} onChange={() => { const next = new Set(selected); if (next.has(String(category.id))) next.delete(String(category.id)); else next.add(String(category.id)); setMember({ ...member, odds_profile: { id: member.odds_profile?.id ?? 0, status: member.odds_profile?.status ?? "available", specializations: Array.from(next) } }); }} />{category.name}</label>)}</div></section></div></main>;
}
