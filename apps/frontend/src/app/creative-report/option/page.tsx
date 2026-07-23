"use client";

import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { CreativeMemberManagement } from "@/features/creative-report/creative-member-management";
import { useAuth } from "@/providers/auth-provider";
import { useCreativeReportTheme } from "../theme-context";
import {
  getCollabAspects,
  getPerfAspects,
  saveCollabAspects,
  savePerfAspects,
  type CreativeReportAspect,
} from "../settings";

function AspectsConfiguration({ theme }: { theme: "light" | "dark" | "retro" }) {
  const [collab, setCollab] = useState<CreativeReportAspect[]>([]);
  const [perf, setPerf] = useState<CreativeReportAspect[]>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setCollab(getCollabAspects());
    setPerf(getPerfAspects());
  }, []);

  const totalCollab = collab.reduce((sum, item) => sum + (item.maxPoints || 0), 0);
  const totalPerf = perf.reduce((sum, item) => sum + (item.maxPoints || 0), 0);

  const isCollabValid = totalCollab === 30;
  const isPerfValid = totalPerf === 50;
  const isValid = isCollabValid && isPerfValid;

  const handleSave = () => {
    if (!isValid) return;
    saveCollabAspects(collab);
    savePerfAspects(perf);
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

  return (
    <div className={`mt-8 p-6 rounded-2xl border ${cardBg}`}>
      <h2 className="text-lg font-bold text-[#6d46eb] dark:text-[#b0ff5e] mb-4 flex items-center gap-2">
        <MaterialIcon name="tune" />
        Konfigurasi Aspek Penilaian
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
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
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center justify-between">
            <span>Aspek Penilaian 30% (Kolaborasi)</span>
            <span className={`text-xs ${isCollabValid ? "text-emerald-500" : "text-amber-500"}`}>
              Total: {totalCollab}/30
            </span>
          </h3>
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
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center justify-between">
            <span>Aspek Penilaian 50% (Performa)</span>
            <span className={`text-xs ${isPerfValid ? "text-emerald-500" : "text-amber-500"}`}>
              Total: {totalPerf}/50
            </span>
          </h3>
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

  return (
    <main className="min-w-0 flex-1">
      <div className="w-full">
        <header className="flex min-h-[45px] items-center justify-between gap-6 pb-6">
          <div>
            <h1 className={`text-4xl font-medium leading-none tracking-[-0.72px] ${theme === "dark" ? "text-white" : "text-[#24252b]"}`}>
              Setting
            </h1>
          </div>
        </header>

        <div className="mt-4">
          {canManageMembers ? (
            <>
              <CreativeMemberManagement />
              <AspectsConfiguration theme={theme} />
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
