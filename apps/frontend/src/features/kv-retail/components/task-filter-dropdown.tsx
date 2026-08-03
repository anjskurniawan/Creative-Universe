import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export type TaskFilterTheme = "light" | "dark" | "retro";

export function TaskFilterDropdown({ icon, label, options, value, onChange, theme, compact = false }: { icon: string; label: string; options: string[]; value: string; onChange: (value: string) => void; theme: TaskFilterTheme; compact?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const isDark = theme === "dark";
  const isRetro = theme === "retro";
  return (
    <div className="relative">
      <button type="button" onClick={() => setIsOpen((open) => !open)} aria-label={`${label}: ${value === options[0] ? label : value}`} className={`flex shrink-0 items-center justify-center gap-2.5 rounded-xl px-4 tracking-[0.32px] transition-colors focus-visible:outline-none focus-visible:ring-2 ${compact ? "size-12 px-0 text-sm" : "h-[58px] text-base"} ${isDark ? "border border-white/10 bg-[#171717] text-[#f1f1f1] hover:bg-[#202820] focus-visible:ring-[#b0ff5e]/30" : isRetro ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b] hover:bg-[#dfe2d3] focus-visible:ring-[#ba0dcb]/30" : "border border-[#cbd5e1] bg-white text-[#525e61] hover:border-[#bfc7c9] hover:bg-[#fbfdff] focus-visible:ring-[#8474f9]/25"}`}>
        <MaterialIcon name={icon} size="auto" weight={300} filled={false} className="text-[24px] leading-none" />
      </button>
      {isOpen && <>
        <button type="button" aria-label="Tutup pilihan" className="fixed inset-0 z-10 cursor-default" onClick={() => setIsOpen(false)} />
        <div className={`absolute right-0 top-[110%] z-20 flex w-48 flex-col rounded-xl p-1 ${isDark ? "border border-white/10 bg-[#171717] shadow-[0_12px_30px_rgba(0,0,0,0.36)]" : isRetro ? "border-2 border-[#24252b] bg-[#eceee6] shadow-[3px_3px_0_#24252b]" : "border border-[#e5e7eb] bg-white shadow-lg"}`}>
          {options.map((option) => <button key={option} type="button" onClick={() => { onChange(option); setIsOpen(false); }} className={`flex w-full items-center justify-start rounded-lg px-3 py-2 text-sm transition-colors ${value === option ? isDark ? "bg-[#b0ff5e] font-medium text-[#181818]" : isRetro ? "bg-[#ba0dcb] font-medium text-white" : "bg-violet-50 font-medium text-[#8474f9]" : isDark ? "text-[#f1f1f1] hover:bg-[#202820]" : isRetro ? "text-[#24252b] hover:bg-[#dfe2d3]" : "text-gray-700 hover:bg-gray-100"}`}>{option}</button>)}
        </div>
      </>}
    </div>
  );
}
