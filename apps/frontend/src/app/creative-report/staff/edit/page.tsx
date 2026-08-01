"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MaterialIcon } from "@/components/ui/material-icon";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import { resolveStorageUrl } from "@/core/api/client";
import { creativeReportApi } from "@/features/creative-report/api";
import { getOddsCategories, type OddsCategory } from "@/features/odds/api";
import type { CreativeMemberProfile } from "@/features/creative-report/types";
import { useAuth } from "@/providers/auth-provider";
import { useCreativeReportTheme } from "../../theme-context";

export default function EditCreativeMemberPage() {
  const memberId = useSearchParams().get("memberId");
  const router = useRouter();
  const { hasRole } = useAuth();
  const { theme } = useCreativeReportTheme();
  const [member, setMember] = useState<CreativeMemberProfile | null>(null);
  const [categories, setCategories] = useState<OddsCategory[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"identity" | "specialties">("identity");
  useEffect(() => {
    if (!hasRole("Root") && !hasRole("Manajer"))
      return router.replace("/creative-report/creative-agent");
    if (!memberId) {
      setError("Anggota Creative tidak dipilih.");
      return;
    }
    void Promise.all([
      creativeReportApi.members.detail(memberId),
      getOddsCategories(),
    ])
      .then(([profile, odds]) => {
        setMember(profile);
        setCategories(odds);
      })
      .catch((cause) =>
        setError(
          cause instanceof Error ? cause.message : "Gagal memuat profil.",
        ),
      );
  }, [hasRole, memberId, router]);
  if (!member)
    return (
      <p className="p-4 text-sm text-[#7b868a]">
        {error ?? "Memuat profil anggota..."}
      </p>
    );
  const selected = new Set(
    (member.odds_profile?.specializations ?? []).map(String),
  );
  const save = async () => {
    setSaving(true);
    setError(null);
    const body = new FormData();
    body.set("name", member.name);
    body.set("email", member.email ?? "");
    body.set("whatsapp_number", member.whatsapp_number ?? "");
    body.set("roles", JSON.stringify(member.roles ?? []));
    body.set("position_name", member.position_name);
    body.set("joined_at", member.joined_at ?? "");
    body.set("resigned_at", member.resigned_at ?? "");
    body.set(
      "specializations",
      JSON.stringify(member.odds_profile?.specializations ?? []),
    );
    body.set("odds_status", member.odds_profile?.status ?? "available");
    if (image) body.set("card_image", image);
    try {
      await creativeReportApi.members.update(member.id, body);
      router.push("/creative-report/creative-agent");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Gagal menyimpan profil.",
      );
    } finally {
      setSaving(false);
    }
  };
  const photo = image
    ? URL.createObjectURL(image)
    : resolveStorageUrl(member.card_image_path);
  const photoIsVideo = Boolean(image?.type.startsWith("video/") || photo && /\.(mp4|webm|ogg)(?:\?.*)?$/i.test(photo));
  const dark = theme === "dark";
  const inputClass = `mt-1 h-10 w-full rounded-lg border px-3 text-sm outline-none transition ${dark ? "border-white/10 bg-[#181818] text-white focus:border-[#b0ff5e]" : "border-slate-200 bg-white text-slate-800 focus:border-[#00a4ff]"}`;
  const mutedTextClass = dark ? "text-slate-400" : "text-slate-500";
  const fieldLabelClass = dark ? "text-slate-300" : "text-slate-600";
  return (
    <main className="flex h-full min-w-0 w-full flex-1 flex-col">
      <header className="flex min-h-[45px] items-center justify-between gap-6 pb-4">
        <div>
          <span className="hidden">
            ← Kembali ke Staff
          </span>
          <h1 className={`text-4xl font-medium leading-none tracking-[-0.72px] ${theme === "dark" ? "text-white" : "text-[#24252b]"}`}>{member.name}</h1>
        </div>
      </header>
      {error && (
        <p className={`mb-4 rounded-lg p-3 text-sm ${theme === "dark" ? "bg-red-500/10 text-red-300" : "bg-[#ffedf1] text-[#b4234d]"}`}>
          {error}
        </p>
      )}
      <div className={`flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border ${theme === "dark" ? "border-white/10 bg-white/5" : theme === "retro" ? "border-[#24252b] bg-[#eceee6]" : "border-[#e1e8eb] bg-white shadow-sm"}`}>
        <nav className={`flex w-full flex-nowrap gap-2 overflow-x-auto border-b p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${theme === "dark" ? "border-white/10 bg-[#151515]" : theme === "retro" ? "border-[#24252b] bg-[#e3e5dc]" : "border-[#edf0f2] bg-[#fbfcfd]"}`} aria-label="Pengaturan Creative Agent">
          {([
            ["identity", "badge", "Personal"],
            ["specialties", "category", "Spesialisasi ODDS"],
          ] as const).map(([tab, icon, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`group flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${activeTab === tab ? theme === "dark" ? "border-[#b0ff5e]/40 bg-[#b0ff5e] text-[#181818] shadow-[0_5px_14px_rgba(176,255,94,0.16)]" : "border-[#6d46eb] bg-[#6d46eb] text-white shadow-[0_5px_14px_rgba(109,70,235,0.2)]" : theme === "dark" ? "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/10" : "border-transparent text-slate-600 hover:border-[#e0dafe] hover:bg-white"}`}
            >
              <span className={`flex size-6 items-center justify-center rounded-md ${activeTab === tab ? theme === "dark" ? "bg-black/10" : "bg-white/15" : theme === "dark" ? "bg-white/10" : "bg-[#f0edff] text-[#6d46eb]"}`}><MaterialIcon name={icon} size="xs" /></span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
        {activeTab === "identity" && <section>
          <div className="mt-5 grid gap-6 md:grid-cols-[350px_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-[#edf0f2] bg-white text-2xl text-[#3b4446] shadow-sm">
              {photo ? photoIsVideo ? (
                <video src={photo} muted playsInline controls className="size-full object-contain" />
              ) : (
                <img
                  src={photo}
                  alt="Preview"
                  className="size-full object-contain"
                />
              ) : (
                member.name.slice(0, 2)
              )}
            </div>
            <label className={`flex min-h-20 flex-1 cursor-pointer items-center gap-2 rounded-xl border border-dashed px-3 py-2 transition ${dark ? "border-white/15 bg-white/[0.03] hover:border-[#b0ff5e]" : "border-[#c9bbfc] bg-[#faf9ff] hover:border-[#6d46eb] hover:bg-[#f5f2ff]"}`}>
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${dark ? "bg-white/10 text-[#b0ff5e]" : "bg-[#ede9fe] text-[#6d46eb]"}`}><MaterialIcon name="cloud_upload" size="xs" /></span>
              <span className="min-w-0 flex-1"><span className={`block truncate text-xs font-semibold ${dark ? "text-white" : "text-[#3b4446]"}`}>{image ? image.name : "Unggah foto atau video card"}</span><span className={`mt-0.5 block text-[10px] ${mutedTextClass}`}>PNG, JPG, WEBP, MP4, WEBM, OGG</span></span>
              <span className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold ${dark ? "bg-white/10 text-white" : "bg-white text-[#6d46eb] shadow-sm"}`}>Pilih file</span>
              <input type="file" className="sr-only" accept="image/png,image/jpeg,image/webp,video/mp4,video/webm,video/ogg" onChange={(event) => setImage(event.target.files?.[0] ?? null)} />
            </label>
          </div>
          <div className={`min-w-0 md:border-l md:pl-6 ${dark ? "md:border-white/10" : "md:border-[#edf0f2]"}`}>
          <label className={`mt-5 block text-sm ${fieldLabelClass}`}>
            Nama
            <input
              value={member.name}
              onChange={(event) =>
                setMember({ ...member, name: event.target.value })
              }
              className={inputClass}
            />
          </label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className={`text-sm ${fieldLabelClass}`}>Email<input type="email" value={member.email ?? ""} onChange={(event) => setMember({ ...member, email: event.target.value })} className={inputClass} /></label>
            <label className={`text-sm ${fieldLabelClass}`}>No. WhatsApp<input value={member.whatsapp_number ?? ""} onChange={(event) => setMember({ ...member, whatsapp_number: event.target.value.replace(/\D/g, "") })} placeholder="62812..." className={inputClass} /></label>
          </div>
          <label className={`mt-3 block text-sm ${fieldLabelClass}`}>Roles<input value={(member.roles ?? []).join(", ")} readOnly className={`${inputClass} cursor-not-allowed opacity-80`} /></label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className={`text-sm ${fieldLabelClass}`}>
              Tanggal masuk
              <CustomDatePicker compact value={member.joined_at ?? ""} onChange={(value) => setMember({ ...member, joined_at: value || null })} placeholder="Pilih tanggal masuk" />
            </label>
            <label className={`text-sm ${fieldLabelClass}`}>
              Tanggal keluar
              <CustomDatePicker compact value={member.resigned_at ?? ""} onChange={(value) => setMember({ ...member, resigned_at: value || null })} placeholder="Pilih tanggal keluar" />
            </label>
          </div>
          </div>
          </div>
          <div className="mt-6 flex justify-end border-t border-[#edf0f2] pt-4"><button type="button" onClick={() => void save()} disabled={saving} className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold shadow-sm disabled:opacity-50 ${theme === "dark" ? "bg-[#b0ff5e] text-[#181818]" : "bg-[#6d46eb] text-white"}`}><MaterialIcon name="save" size="sm" />Simpan</button></div>
        </section>}
        {activeTab === "specialties" && <section className={`rounded-2xl border p-5 ${dark ? "border-white/10 bg-white/[0.03]" : "border-[#edf0f2] bg-white shadow-[0_8px_24px_rgba(44,42,39,0.04)]"}`}>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {categories.map((category) => (
              <label
                key={category.id}
                className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-sm transition-colors ${dark ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10" : "border-slate-200 bg-slate-50/70 text-slate-700 hover:border-[#bdb0f5] hover:bg-[#faf9ff]"}`}
              >
                <input
                  type="checkbox"
                  checked={selected.has(String(category.id))}
                  onChange={() => {
                    const next = new Set(selected);
                    if (next.has(String(category.id)))
                      next.delete(String(category.id));
                    else next.add(String(category.id));
                    setMember({
                      ...member,
                      odds_profile: {
                        id: member.odds_profile?.id ?? 0,
                        status: member.odds_profile?.status ?? "available",
                        specializations: Array.from(next),
                      },
                    });
                  }}
                />
                {category.name}
              </label>
            ))}
          </div>
          <div className="mt-6 flex justify-end border-t border-[#edf0f2] pt-4"><button type="button" onClick={() => void save()} disabled={saving} className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold shadow-sm disabled:opacity-50 ${theme === "dark" ? "bg-[#b0ff5e] text-[#181818]" : "bg-[#6d46eb] text-white"}`}><MaterialIcon name="save" size="sm" />Simpan</button></div>
        </section>}
        </div>
      </div>
    </main>
  );
}
