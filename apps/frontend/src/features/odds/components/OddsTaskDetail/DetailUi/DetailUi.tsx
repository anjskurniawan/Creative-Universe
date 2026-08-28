import Link from "next/link";
import type { ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";
import { useOddsTheme } from "@/features/odds/context/OddsThemeContext";

export function DetailShellMessage({ message, muted = false }: { message: string; muted?: boolean }) {
  return <div className="mx-auto w-full max-w-4xl py-10"><div className={`rounded-lg border px-4 py-3 text-sm ${muted ? "border-cu-border text-cu-muted" : "border-cu-danger/20 bg-cu-danger/10 text-cu-danger"}`}>{message}</div><Link href="/odds" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cu-info"><MaterialIcon name="arrow_back" size="xs" />ODDS</Link></div>;
}

export function DetailInfoRow({ label, value }: { label: string; value: string }) {
  const { theme } = useOddsTheme();
  const border = theme === "retro" ? "border-b border-[#24252b] py-2.5 last:border-b-0" : theme === "dark" ? "border-b border-white/5 py-2.5 last:border-b-0" : "border-b border-[#BDEAFF]/40 py-2.5 last:border-b-0";
  const labelClass = theme === "retro" ? "text-xs text-[#24252b] font-medium" : theme === "dark" ? "text-xs text-[#7d827f]" : "text-xs text-[#04044A]/60";
  const valueClass = theme === "retro" ? "text-right text-xs font-bold text-[#24252b]" : theme === "dark" ? "text-right text-xs font-semibold text-[#f1f1f1]" : "text-right text-xs font-semibold text-[#04044A]";
  return <div className={`flex items-center justify-between ${border}`}><span className={labelClass}>{label}</span><span className={valueClass}>{value}</span></div>;
}

export function DetailTimerTile({ label, value }: { label: string; value: string }) {
  const { theme } = useOddsTheme();
  const container = theme === "retro" ? "border-2 border-[#24252b] bg-[#eceee6] min-h-[76px] p-3 flex flex-col items-center justify-center text-center shadow-[3px_3px_0px_#24252b] transition-all duration-200" : theme === "dark" ? "rounded-2xl border border-white/5 bg-[#0e0e0e]/45 min-h-[76px] p-3 flex flex-col items-center justify-center text-center hover:bg-[#0e0e0e]/70 transition-all duration-200" : "rounded-2xl border border-[#BDEAFF]/50 bg-[#F3FAFF]/30 min-h-[76px] p-3 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:bg-[#F3FAFF]/50 transition-all duration-200";
  const labelClass = theme === "retro" ? "text-sm text-[#24252b] font-bold uppercase tracking-wider" : theme === "dark" ? "text-sm text-[#7d827f] font-bold uppercase tracking-wider" : "text-sm text-[#04044A]/50 font-bold uppercase tracking-wider";
  const valueClass = theme === "retro" ? "mt-2 text-base font-extrabold text-black md:text-lg" : theme === "dark" ? "mt-2 text-base font-extrabold text-[#b0ff5e] md:text-lg" : "mt-2 text-base font-bold text-[#00A4FF] md:text-lg";
  return <div className={container}><p className={labelClass}>{label}</p><p className={valueClass}>{value}</p></div>;
}

export function DetailActionButton({ icon, label, danger = false, disabled, onClick }: { icon: string; label: ReactNode; danger?: boolean; disabled?: boolean; onClick: () => void }) {
  const { theme } = useOddsTheme();
  const surface = theme === "retro" ? danger ? "border-2 border-[#24252b] bg-[#ff8080] text-black shadow-[2px_2px_0px_#24252b] hover:bg-[#ff9999]" : "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b] shadow-[2px_2px_0px_#24252b] hover:bg-[#dfe2d3]" : theme === "dark" ? danger ? "border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/15" : "border border-white/10 bg-[#171717] text-[#f1f1f1] hover:bg-white/5" : danger ? "border border-red-200 bg-red-50 text-red-500 hover:bg-red-100/60 shadow-sm" : "border border-[#BDEAFF] bg-white text-[#04044A] hover:bg-[#F3FAFF] hover:text-[#00A4FF] shadow-sm";
  return <button type="button" disabled={disabled} onClick={onClick} className={`inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-xl px-3.5 text-xs font-bold uppercase tracking-wider transition disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98] ${surface}`}><MaterialIcon name={icon} size="sm" />{label}</button>;
}

export function DetailSkeleton() {
  const line = "animate-pulse rounded-md bg-slate-200/80";
  return <div className="flex h-full min-h-0 w-full flex-col gap-4 overflow-hidden p-4 lg:gap-5 lg:p-0"><div className={`${line} h-9 w-2/3 lg:h-10 lg:w-1/2`} /><div className="hidden shrink-0 animate-pulse grid-cols-6 gap-4 rounded-2xl border border-slate-200 bg-white p-5 lg:grid">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="space-y-2"><div className={`${line} h-2 w-16`} /><div className={`${line} h-4 w-24`} /></div>)}</div><div className="flex min-h-0 flex-1 flex-col gap-4"><div className="h-11 animate-pulse rounded-xl border border-slate-200 bg-white lg:h-12" /><div className="flex min-h-0 flex-1 flex-col animate-pulse rounded-2xl border border-slate-200 bg-white p-4 lg:p-6"><div className={`${line} mb-5 h-5 w-32`} /><div className="space-y-3"><div className={`${line} h-4 w-full`} /><div className={`${line} h-4 w-11/12`} /><div className={`${line} h-4 w-4/5`} /></div></div></div></div>;
}
