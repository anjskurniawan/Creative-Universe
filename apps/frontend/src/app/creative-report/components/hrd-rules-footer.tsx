"use client";

import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";

const rules = [
  ["Cuti", "0"],
  ["Izin App", "0"],
  ["Bolos", "−3"],
  ["Bolos >2", "−5"],
  ["Telat", "−1"],
  ["Telat >2", "−2"],
];

export function HrdRulesFooter({ theme }: { theme: "light" | "dark" | "retro" }) {
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    if (window.innerWidth >= 1024) setPinned(true);
  }, []);
  const dark = theme === "dark";
  const retro = theme === "retro";
  const cardClass = dark
    ? "border-white/10 bg-white/5 text-slate-200"
    : retro
      ? "border-[#24252b] bg-[#eceee6] text-[#24252b]"
      : "border-[#6d46eb] bg-[#6d46eb] text-white";
  const mutedClass = dark ? "text-slate-400" : retro ? "text-[#525e61]" : "text-white/80";
  const iconClass = dark ? "text-[#b0ff5e]" : retro ? "text-[#24252b]" : "text-white";
  const itemClass = dark
    ? "border-white/10 bg-white/5"
    : retro
      ? "border-[#24252b] bg-[#eceee6]"
      : "border-white/25 bg-white/10";

  return (
    <footer className={`relative ${pinned ? "sticky bottom-0 z-20 shadow-[0_8px_24px_rgba(45,31,120,0.28)]" : "mt-auto"} rounded-xl border p-4 ${cardClass}`}>
      <div className="flex items-center gap-2 lg:hidden">
        <MaterialIcon name="info" size="sm" className={iconClass} />
        <h2 className="text-sm font-semibold text-white">Aturan Penilaian HRD</h2>
      </div>
      <button
        type="button"
        aria-label={pinned ? "Lepas pin aturan HRD" : "Pin aturan HRD"}
        aria-pressed={pinned}
        title={pinned ? "Lepas pin" : "Pin aturan"}
        onClick={() => setPinned((current) => !current)}
        className={`absolute right-4 top-4 flex size-7 items-center justify-center rounded-lg transition-colors ${pinned ? "bg-white text-[#6d46eb]" : "text-white/80 hover:bg-white/15 hover:text-white"}`}
      >
        <MaterialIcon name="push_pin" size="sm" />
      </button>
      <div className="lg:flex lg:items-center lg:gap-4">
        <div className="hidden shrink-0 items-center gap-3 border-r border-white/20 pr-4 lg:flex lg:w-[270px]">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10">
            <MaterialIcon name="verified_user" size="md" className="text-white" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-white">Penilaian HRD Review</h2>
            <p className={`mt-1 text-[11px] leading-4 ${mutedClass}`}>Panduan & Ketentuan Pengurangan Nilai</p>
          </div>
        </div>
        <div className="min-w-0 lg:flex-1">
          <div className="mt-3 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 lg:mt-0 lg:flex">
            {rules.map(([label, value]) => (
              <div key={label} className={`min-w-[82px] shrink-0 rounded-lg border px-2 py-2 text-center sm:min-w-0 sm:shrink lg:flex-1 ${itemClass}`}>
                <p className={`border-b border-white/20 pb-1 text-xs font-semibold ${mutedClass}`}>{label}</p>
                <p className="mt-1 text-xl font-bold leading-none">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 hidden border-l border-white/20 pl-4 lg:mt-0 lg:block lg:w-[310px] lg:shrink-0">
          <ul className={`space-y-2 text-xs leading-5 ${mutedClass}`}>
            <li>− Pengurangan nilai dihitung per hari</li>
            <li>− Persentase HRD 20%</li>
            <li>− Nilai di bawah 75 otomatis berwarna merah</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
