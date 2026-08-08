"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { CreativeMemberManagement } from "@/features/creative-report/creative-member-management";
import { useAuth } from "@/providers/auth-provider";
import { Toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/form/input";
import { Button } from "@/components/ui/button";
import { useAspectsConfiguration } from "./use-aspects-configuration";

/**
 * Panel Konfigurasi Aspek Penilaian (Collab 30% & Performance 50%)
 */
function AspectsConfiguration() {
  // --- KONSUMSI CUSTOM DATA HOOK ---
  const {
    collab,
    perf,
    groupTitles,
    setGroupTitles,
    detailAspectIndexes,
    setDetailAspectIndexes,
    success,
    setSuccess,
    totalCollab,
    totalPerf,
    isCollabValid,
    isPerfValid,
    isValid,
    handleSave,
    updateCollab,
    updatePerf,
  } = useAspectsConfiguration();

  // --- STYLING CONSTANTS ---
  const dark = false;
  const sectionTitleClass = "text-slate-700";

  return (
    <div className="w-full">
      {/* Header Info */}
      <h2 className="text-base font-semibold text-[#3b4446]">
        Konfigurasi Aspek Penilaian
      </h2>
      <p className="mt-1 mb-4 text-xs text-slate-500">
        Atur nama aspek beserta nilai maksimalnya untuk porsi penilaian 30% dan 50%.
      </p>

      {/* Toast Alert Sukses */}
      {success && (
        <Toast
          message="Konfigurasi aspek penilaian berhasil disimpan!"
          status="success"
          onClose={() => setSuccess(false)}
        />
      )}

      {/* Grid Inputs Aspek Penilaian */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* KOLOM KIRI: Aspek Kolaboratif (30%) */}
        <div>
          <div className="mb-3 rounded-xl border p-3 border-slate-200 bg-slate-50/70">
            <Input
              id="collab-category-title"
              label="Nama kategori"
              value={groupTitles.collab}
              onChange={(event) => setGroupTitles((current) => ({ ...current, collab: event.target.value }))}
              className="font-bold text-slate-700 focus:border-[#00a4ff]"
            />
          </div>
          <div className={`mb-2 grid grid-cols-[minmax(0,1fr)_80px] items-center gap-2 px-1 text-[11px] font-semibold ${sectionTitleClass}`}>
            <span>Nama aspek</span>
            <span className={`rounded-md px-2 py-1 text-center ${isCollabValid ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>Total: {totalCollab}/30</span>
          </div>
          <div className="space-y-3">
            {collab.map((item, index) => (
              <div key={index} className="grid grid-cols-[1fr_80px] gap-2 items-center">
                <Input
                  id={`collab-aspect-name-${index}`}
                  type="text"
                  placeholder={`Nama Aspek ${index + 1}`}
                  value={item.name}
                  onChange={(e) => updateCollab(index, "name", e.target.value)}
                />
                <Input
                  id={`collab-aspect-max-${index}`}
                  type="number"
                  placeholder="Max"
                  value={item.maxPoints || ""}
                  onChange={(e) => updateCollab(index, "maxPoints", e.target.value)}
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

        {/* KOLOM KANAN: Aspek Performa (50%) */}
        <div>
          <div className="mb-3 rounded-xl border p-3 border-slate-200 bg-slate-50/70">
            <Input
              id="perf-category-title"
              label="Nama kategori"
              value={groupTitles.perf}
              onChange={(event) => setGroupTitles((current) => ({ ...current, perf: event.target.value }))}
              className="font-bold text-slate-700 focus:border-[#00a4ff]"
            />
          </div>
          <div className={`mb-2 grid grid-cols-[minmax(0,1fr)_80px] items-center gap-2 px-1 text-[11px] font-semibold ${sectionTitleClass}`}>
            <span>Nama aspek</span>
            <span className={`rounded-md px-2 py-1 text-center ${isPerfValid ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>Total: {totalPerf}/50</span>
          </div>
          <div className="space-y-3">
            {perf.map((item, index) => (
              <div key={index} className="grid grid-cols-[1fr_80px] gap-2 items-center">
                <Input
                  id={`perf-aspect-name-${index}`}
                  type="text"
                  placeholder={`Nama Aspek ${index + 1}`}
                  value={item.name}
                  onChange={(e) => updatePerf(index, "name", e.target.value)}
                />
                <Input
                  id={`perf-aspect-max-${index}`}
                  type="number"
                  placeholder="Max"
                  value={item.maxPoints || ""}
                  onChange={(e) => updatePerf(index, "maxPoints", e.target.value)}
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

      {/* Bagian Pilihan Tampilan Aspek pada Detail Card */}
      <section className="mt-6 rounded-xl border p-4 border-slate-200 bg-slate-50/70">
        <h3 className={`text-sm font-bold ${sectionTitleClass}`}>Aspek pada Detail Card</h3>
        <p className="mt-1 text-xs text-slate-500 font-medium">Pilih lima aspek yang tampil pada profil Creative Agent. Nilainya diambil dari assessment bulan berjalan.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {detailAspectIndexes.map((selectedIndex, slot) => (
            <label key={slot} className="text-xs font-semibold text-slate-600">
              Bar {slot + 1}
              <select
                value={selectedIndex}
                onChange={(event) => setDetailAspectIndexes((current) => current.map((value, index) => index === slot ? Number(event.target.value) : value))}
                className="mt-1 h-9 w-full rounded-lg border px-2 text-xs outline-none border-slate-200 bg-white text-slate-800"
              >
                {[...collab, ...perf].map((aspect, index) => <option key={`${aspect.name}-${index}`} value={index}>{aspect.name} ({aspect.maxPoints})</option>)}
              </select>
            </label>
          ))}
        </div>
      </section>

      {/* Tombol Simpan Konfigurasi */}
      <div className="mt-6 flex justify-end">
        <Button
          disabled={!isValid}
          onClick={handleSave}
          className="!h-9 !py-2 !text-xs font-bold sm:!w-auto flex items-center justify-center gap-1.5 px-4"
        >
          <MaterialIcon name="save" size="auto" className="text-base" />
          Simpan Konfigurasi
        </Button>
      </div>
    </div>
  );
}

/**
 * Halaman Utama Pengaturan Creative Report (Tabs & Access Gate)
 */
export default function CreativeReportOptionPage() {
  // Validasi Role User
  const { hasRole } = useAuth();
  const canManageMembers = hasRole("Root") || hasRole("Manajer");
  
  // Tab Aktif
  const [activeTab, setActiveTab] = useState<"validation" | "historical" | "aspects">("validation");

  // Definisi Item Tab Pengaturan
  const tabs = [
    { id: "validation" as const, label: "Agent", icon: "how_to_reg" },
    { id: "historical" as const, label: "Add Agent", icon: "history" },
    { id: "aspects" as const, label: "Performa", icon: "tune" },
  ];

  return (
    <main className="flex h-full min-w-0 w-full flex-1 flex-col">
      <div className="flex h-full min-h-0 w-full flex-1 flex-col">
        {/* Title Header */}
        <header className="flex min-h-[45px] items-center justify-between gap-6 pb-4">
          <div>
            <h1 className="text-4xl font-medium leading-none tracking-[-0.72px] text-[#24252b]">
              Setting
            </h1>
          </div>
        </header>

        {/* Tabbed Layout Area */}
        <div className="flex h-full min-h-0 w-full flex-1 flex-col">
          {canManageMembers ? (
            <>
              <section className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border border-[#e1e8eb] bg-white shadow-sm">
                {/* Tab Navigation */}
                <div className="flex flex-nowrap gap-1 overflow-x-auto border-b p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-[#e1e8eb]">
                  {tabs.map((tab) => {
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${active ? "bg-[#6d46eb] text-white" : "text-slate-600 hover:bg-slate-100"}`}
                      >
                        <MaterialIcon name={tab.icon} className="text-base" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
                {/* Tab Content Panel */}
                <div className="min-h-0 flex-1 overflow-y-auto p-5 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
                  {activeTab === "validation" && <CreativeMemberManagement section="pending" />}
                  {activeTab === "historical" && <CreativeMemberManagement section="historical" />}
                  {activeTab === "aspects" && <AspectsConfiguration />}
                </div>
              </section>
            </>
          ) : (
            /* Warning Akses Terbatas */
            <div className="p-8 text-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500">
              <MaterialIcon name="info" className="text-4xl mx-auto mb-2 opacity-80" />
              <p className="text-sm font-medium">Anda tidak memiliki akses untuk mengelola anggota Creative.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
