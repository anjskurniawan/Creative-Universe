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
        <nav className={`flex flex-nowrap gap-1 overflow-x-auto border-b p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${theme === "dark" ? "border-white/10" : theme === "retro" ? "border-[#24252b]" : "border-[#e1e8eb]"}`} aria-label="Pengaturan Creative Agent">
          {([
            ["identity", "badge", "Identitas & Foto"],
            ["specialties", "category", "Spesialisasi ODDS"],
          ] as const).map(([tab, icon, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${activeTab === tab ? theme === "dark" ? "bg-[#b0ff5e] text-[#181818]" : "bg-[#6d46eb] text-white" : theme === "dark" ? "text-slate-300 hover:bg-white/10" : "text-slate-600 hover:bg-slate-100"}`}
            >
              <MaterialIcon name={icon} size="sm" />
              {label}
            </button>
          ))}
        </nav>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
        {activeTab === "identity" && <section>
          <div className="flex items-center justify-between gap-3"><h2 className="font-semibold">Identitas & foto Card</h2><button type="button" onClick={() => void save()} disabled={saving} className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold disabled:opacity-50 ${theme === "dark" ? "bg-[#b0ff5e] text-[#181818]" : "bg-[#6d46eb] text-white"}`}><MaterialIcon name="save" size="sm" />Simpan</button></div>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <div className="flex size-24 items-center justify-center overflow-hidden rounded-lg bg-[#3b4446] text-xl text-white">
              {photo ? photoIsVideo ? (
                <video src={photo} muted playsInline controls className="size-full object-cover" />
              ) : (
                <img
                  src={photo}
                  alt="Preview"
                  className="size-full object-cover"
                />
              ) : (
                member.name.slice(0, 2)
              )}
            </div>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,video/mp4,video/webm,video/ogg"
              onChange={(event) => setImage(event.target.files?.[0] ?? null)}
            />
          </div>
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
            <label className={`text-sm ${fieldLabelClass}`}>
              Tanggal masuk
              <input
                type="date"
                value={member.joined_at ?? ""}
                onChange={(event) =>
                  setMember({
                    ...member,
                    joined_at: event.target.value || null,
                  })
                }
                className={inputClass}
              />
            </label>
            <label className={`text-sm ${fieldLabelClass}`}>
              Tanggal keluar
              <input
                type="date"
                value={member.resigned_at ?? ""}
                onChange={(event) =>
                  setMember({
                    ...member,
                    resigned_at: event.target.value || null,
                  })
                }
                className={inputClass}
              />
            </label>
          </div>
        </section>}
        {activeTab === "specialties" && <section>
          <div className="flex items-center justify-between gap-3"><h2 className="font-semibold">Spesialisasi ODDS</h2><button type="button" onClick={() => void save()} disabled={saving} className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold disabled:opacity-50 ${theme === "dark" ? "bg-[#b0ff5e] text-[#181818]" : "bg-[#6d46eb] text-white"}`}><MaterialIcon name="save" size="sm" />Simpan</button></div>
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
        </section>}
        </div>
      </div>
    </main>
  );
}
