"use client";

import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { CreativeMemberManagement } from "@/features/creative-report/creative-member-management";
import { useAuth } from "@/providers/auth-provider";
import { useCreativeReportTheme } from "../theme-context";
import {
  getCollabAspects,
  getDetailCardAspectIndexes,
  getAspectGroupTitles,
  getPerfAspects,
  saveAspectGroupTitles,
  saveCollabAspects,
  saveDetailCardAspectIndexes,
  savePerfAspects,
  type CreativeReportAspect,
  type CreativeReportAspectGroupTitles,
} from "../settings";

function AspectsConfiguration({ theme }: { theme: "light" | "dark" | "retro" }) {
  const [collab, setCollab] = useState<CreativeReportAspect[]>([]);
  const [perf, setPerf] = useState<CreativeReportAspect[]>([]);
  const [groupTitles, setGroupTitles] = useState<CreativeReportAspectGroupTitles>({ collab: "", perf: "" });
  const [detailAspectIndexes, setDetailAspectIndexes] = useState<number[]>([0, 1, 2, 3, 4]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setCollab(getCollabAspects());
    setPerf(getPerfAspects());
    setGroupTitles(getAspectGroupTitles());
    setDetailAspectIndexes(getDetailCardAspectIndexes());
  }, []);

  const totalCollab = collab.reduce((sum, item) => sum + (item.maxPoints || 0), 0);
  const totalPerf = perf.reduce((sum, item) => sum + (item.maxPoints || 0), 0);

  const isCollabValid = totalCollab === 30;
  const isPerfValid = totalPerf === 50;
  const isValid = isCollabValid && isPerfValid && Boolean(groupTitles.collab.trim()) && Boolean(groupTitles.perf.trim());

  const handleSave = () => {
    if (!isValid) return;
    saveCollabAspects(collab);
    savePerfAspects(perf);
    saveAspectGroupTitles(groupTitles);
    saveDetailCardAspectIndexes(detailAspectIndexes);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const updateCollab = (index: number, key: keyof CreativeReportAspect, value: string | number) => {
    setCollab((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [key]: key === "maxPoints" ? Math.max(0, Number(value) || 0) : value,
            }
          : item
      )
    );
  };

  const updatePerf = (index: number, key: keyof CreativeReportAspect, value: string | number) => {
    setPerf((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [key]: key === "maxPoints" ? Math.max(0, Number(value) || 0) : value,
            }
          : item
      )
    );
  };

  const dark = theme === "dark";
  const retro = theme === "retro";
  const cardBg = dark ? "bg-white/5 border-white/10" : retro ? "bg-[#eceee6] border-[#24252b]" : "bg-white border-[#e8edf0] shadow-sm";
  const inputClass = `h-9 px-3 text-xs rounded-lg border outline-none transition w-full ${dark ? "bg-[#181818] border-white/10 text-white focus:border-[#b0ff5e]" : "bg-white border-slate-200 text-slate-800 focus:border-[#00a4ff]"}`;
  const headingClass = dark ? "text-[#b0ff5e]" : retro ? "text-[#24252b]" : "text-[#6d46eb]";
  const sectionTitleClass = dark ? "text-slate-200" : "text-slate-700";

  return (
    <div className={`w-full p-6 rounded-2xl border ${cardBg}`}>
      <h2 className={`mb-4 flex items-center gap-2 text-lg font-bold ${headingClass}`}>
        <MaterialIcon name="tune" />
        Konfigurasi Aspek Penilaian
      </h2>
      <p className={`mb-6 text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
        Atur nama aspek beserta nilai maksimalnya untuk porsi penilaian 30% dan 50%.
      </p>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold flex items-center gap-2">
          <MaterialIcon name="check_circle" />
          Konfigurasi aspek penilaian berhasil disimpan!
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {/* Collab aspects (30%) */}
        <div>
          <div className={`mb-3 rounded-xl border p-3 ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50/70"}`}>
            <label className={`mb-1.5 block text-[11px] font-semibold ${dark ? "text-slate-400" : "text-slate-500"}`} htmlFor="collab-category-title">Nama kategori</label>
            <input
              id="collab-category-title"
              aria-label="Nama kelompok aspek penilaian 30%"
              value={groupTitles.collab}
              onChange={(event) => setGroupTitles((current) => ({ ...current, collab: event.target.value }))}
              className={`h-9 w-full rounded-lg border px-2 text-sm font-bold outline-none ${dark ? "border-white/10 bg-[#181818] text-slate-200" : "border-slate-200 bg-white text-slate-700 focus:border-[#00a4ff]"}`}
            />
          </div>
          <div className={`mb-2 grid grid-cols-[minmax(0,1fr)_80px] items-center gap-2 px-1 text-[11px] font-semibold ${sectionTitleClass}`}>
            <span>Nama aspek</span>
            <span className={`rounded-md px-2 py-1 text-center ${isCollabValid ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>Total: {totalCollab}/30</span>
          </div>
          <div className="space-y-3">
            {collab.map((item, index) => (
              <div key={index} className="grid grid-cols-[1fr_80px] gap-2 items-center">
                <input
                  type="text"
                  placeholder={`Nama Aspek ${index + 1}`}
                  value={item.name}
                  onChange={(e) => updateCollab(index, "name", e.target.value)}
                  className={inputClass}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={item.maxPoints || ""}
                  onChange={(e) => updateCollab(index, "maxPoints", e.target.value)}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
          {!isCollabValid && (
            <p className="text-[10px] text-amber-500 mt-2">
              * Jumlah total nilai maksimal aspek 30% harus sama dengan 30.
            </p>
          )}
        </div>

        {/* Perf aspects (50%) */}
        <div>
          <div className={`mb-3 rounded-xl border p-3 ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50/70"}`}>
            <label className={`mb-1.5 block text-[11px] font-semibold ${dark ? "text-slate-400" : "text-slate-500"}`} htmlFor="perf-category-title">Nama kategori</label>
            <input
              id="perf-category-title"
              aria-label="Nama kelompok aspek penilaian 50%"
              value={groupTitles.perf}
              onChange={(event) => setGroupTitles((current) => ({ ...current, perf: event.target.value }))}
              className={`h-9 w-full rounded-lg border px-2 text-sm font-bold outline-none ${dark ? "border-white/10 bg-[#181818] text-slate-200" : "border-slate-200 bg-white text-slate-700 focus:border-[#00a4ff]"}`}
            />
          </div>
          <div className={`mb-2 grid grid-cols-[minmax(0,1fr)_80px] items-center gap-2 px-1 text-[11px] font-semibold ${sectionTitleClass}`}>
            <span>Nama aspek</span>
            <span className={`rounded-md px-2 py-1 text-center ${isPerfValid ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>Total: {totalPerf}/50</span>
          </div>
          <div className="space-y-3">
            {perf.map((item, index) => (
              <div key={index} className="grid grid-cols-[1fr_80px] gap-2 items-center">
                <input
                  type="text"
                  placeholder={`Nama Aspek ${index + 1}`}
                  value={item.name}
                  onChange={(e) => updatePerf(index, "name", e.target.value)}
                  className={inputClass}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={item.maxPoints || ""}
                  onChange={(e) => updatePerf(index, "maxPoints", e.target.value)}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
          {!isPerfValid && (
            <p className="text-[10px] text-amber-500 mt-2">
              * Jumlah total nilai maksimal aspek 50% harus sama dengan 50.
            </p>
          )}
        </div>
      </div>

      <section className={`mt-6 rounded-xl border p-4 ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50/70"}`}>
        <h3 className={`text-sm font-bold ${sectionTitleClass}`}>Aspek pada Detail Card</h3>
        <p className={`mt-1 text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>Pilih lima aspek yang tampil pada profil Creative Agent. Nilainya diambil dari assessment bulan berjalan.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {detailAspectIndexes.map((selectedIndex, slot) => (
            <label key={slot} className={`text-xs font-medium ${dark ? "text-slate-300" : "text-slate-600"}`}>
              Bar {slot + 1}
              <select
                value={selectedIndex}
                onChange={(event) => setDetailAspectIndexes((current) => current.map((value, index) => index === slot ? Number(event.target.value) : value))}
                className={`mt-1 h-9 w-full rounded-lg border px-2 text-xs outline-none ${dark ? "border-white/10 bg-[#181818] text-white" : "border-slate-200 bg-white text-slate-800"}`}
              >
                {[...collab, ...perf].map((aspect, index) => <option key={`${aspect.name}-${index}`} value={index}>{aspect.name} ({aspect.maxPoints})</option>)}
              </select>
            </label>
          ))}
        </div>
      </section>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          disabled={!isValid}
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
            isValid
              ? dark
                ? "bg-[#b0ff5e] text-[#181818] hover:bg-[#c4ff80]"
                : "bg-[#6d46eb] hover:bg-[#5b35d9] text-white"
              : "bg-slate-300 dark:bg-white/5 text-slate-500 dark:text-slate-600 cursor-not-allowed"
          }`}
        >
          <MaterialIcon name="save" size="auto" className="text-base" />
          Simpan Konfigurasi
        </button>
      </div>
    </div>
  );
}

export default function CreativeReportOptionPage() {
  const { theme } = useCreativeReportTheme();
  const { hasRole } = useAuth();
  const canManageMembers = hasRole("Root") || hasRole("Manajer");
  const [activeTab, setActiveTab] = useState<"validation" | "historical" | "aspects">("validation");

  const tabs = [
    { id: "validation" as const, label: "Validasi Anggota", icon: "how_to_reg" },
    { id: "historical" as const, label: "Personel Historis", icon: "history" },
    { id: "aspects" as const, label: "Aspek Penilaian", icon: "tune" },
  ];

  return (
    <main className="flex h-full min-w-0 w-full flex-1 flex-col">
      <div className="flex h-full min-h-0 w-full flex-1 flex-col">
        <header className="flex min-h-[45px] items-center justify-between gap-6 pb-4">
          <div>
            <h1 className={`text-4xl font-medium leading-none tracking-[-0.72px] ${theme === "dark" ? "text-white" : "text-[#24252b]"}`}>
              Setting
            </h1>
          </div>
        </header>

        <div className="flex h-full min-h-0 w-full flex-1 flex-col">
          {canManageMembers ? (
            <>
              <section className={`flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border ${theme === "dark" ? "border-white/10 bg-white/5" : theme === "retro" ? "border-[#24252b] bg-[#eceee6]" : "border-[#e1e8eb] bg-white shadow-sm"}`}>
                <div className={`flex flex-wrap gap-1 border-b p-2 ${theme === "dark" ? "border-white/10" : theme === "retro" ? "border-[#24252b]" : "border-[#e1e8eb]"}`}>
                  {tabs.map((tab) => {
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${active ? theme === "dark" ? "bg-[#b0ff5e] text-[#181818]" : "bg-[#6d46eb] text-white" : theme === "dark" ? "text-slate-300 hover:bg-white/10" : "text-slate-600 hover:bg-slate-100"}`}
                      >
                        <MaterialIcon name={tab.icon} className="text-base" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-5 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
                  {activeTab === "validation" && <CreativeMemberManagement section="pending" />}
                  {activeTab === "historical" && <CreativeMemberManagement section="historical" />}
                  {activeTab === "aspects" && <AspectsConfiguration theme={theme} />}
                </div>
              </section>
            </>
          ) : (
            <div className={`p-8 text-center rounded-2xl border ${theme === "dark" ? "border-white/10 bg-white/5 text-[#888c80]" : "border-slate-200 bg-slate-50 text-slate-500"}`}>
              <MaterialIcon name="info" className="text-4xl mx-auto mb-2 opacity-80" />
              <p className="text-sm font-medium">Anda tidak memiliki akses untuk mengelola anggota Creative.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
