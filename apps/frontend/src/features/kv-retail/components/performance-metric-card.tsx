import { useState } from "react";
import { MaterialIcon } from "@/components/material-icon";

type PerformanceMetricCardProps = {
  label: string;
  value: number;
  unit?: string;
  increase: number;
  previous?: number;
  icon?: string;
  iconColor?: string;
  decimals?: number;
  theme?: "dark" | "light" | "retro";
  compact?: boolean;
};

/** Figma node 32:383. This card is deliberately data-agnostic for reuse by each metric. */
export function PerformanceMetricCard({ label, value, unit = "task", increase, previous = 0, icon = "check_circle", iconColor = "#e4e4e4", decimals = 0, theme = "dark", compact = false }: PerformanceMetricCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const light = theme !== "dark";
  const retro = theme === "retro";
  const trend = increase > 0 ? { icon: "trending_up", color: light ? (retro ? "text-[#ba0dcb]" : "text-[#00a4ff]") : "text-[#b0ff5e]", copy: "Performance increased by" } : increase < 0 ? { icon: "trending_down", color: "text-[#ff7e87]", copy: "Performance decreased by" } : { icon: "trending_flat", color: "text-[#b9b9b9]", copy: "Performance unchanged" };
  const primaryIconColor = light ? (retro ? "#ba0dcb" : "#00a4ff") : iconColor;

  return (
    <article className={`performance-metric-card relative flex ${compact ? "h-[118px]" : "h-[139px]"} w-full min-w-0 flex-col gap-1 rounded-2xl p-2 ${retro ? "border-2 border-[#24252b] bg-[#eceee6] shadow-[inset_0_0_0_2px_#c9ccc0]" : light ? "border border-white/80 bg-white/90 shadow-[0_5px_14px_rgba(44,42,39,0.06)]" : "border border-white/[0.05] bg-[#171717] shadow-[0_5px_14px_rgba(0,0,0,0.24)]"}`} data-node-id="32:383">
      <div className="flex items-center justify-between px-1">
        <p className={`${compact ? "text-[11px]" : "text-xs"} leading-4 ${retro ? "font-bold uppercase tracking-wide text-[#24252b]" : light ? "text-[#6e5264]" : "text-[#f1f1f1]"}`}>{label}</p>
        <button type="button" aria-label={`Lihat detail ${label}`} aria-expanded={detailsOpen} onClick={() => setDetailsOpen((open) => !open)} className={`flex size-6 items-center justify-center rounded-md transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 ${light ? (retro ? "text-[#ba0dcb] focus-visible:ring-[#ba0dcb]/30" : "text-[#00a4ff] focus-visible:ring-[#00a4ff]/30") : "text-[#b0ff5e] focus-visible:ring-[#b0ff5e]/30"}`}><MaterialIcon name="more_horiz" size="auto" className="text-xl" /></button>
      </div>

      <div className={`flex min-h-0 flex-1 items-center justify-between rounded-xl px-2 py-1 ${retro ? "border border-[#24252b] bg-[#dfe2d3]" : light ? "bg-[#f3faff]" : "bg-[#0e0e0e]"}`}>
        <p className={`flex items-center gap-1.5 ${compact ? "text-2xl" : "text-[28px]"} font-medium leading-none ${light ? "text-[#181818]" : "text-white"}`}>
          <span>{new Intl.NumberFormat("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value)}</span><span>{unit}</span>
        </p>
        <span className={`${compact ? "size-8" : "size-10"} flex items-center justify-center`} style={{ color: primaryIconColor }}>
          <MaterialIcon name={icon} size="auto" className={compact ? "text-[30px]" : "text-[40px]"} />
        </span>
      </div>

      <div className="flex items-center px-1">
        {!compact && <p className={`performance-metric-card__trend-copy text-[8px] leading-4 ${retro ? "text-[#555850]" : light ? "text-[#806272]" : "text-[#b9b9b9]"}`}>{trend.copy}</p>}
        <div className="ml-auto flex items-center gap-[5px]">
          <span className={`flex items-center gap-0.5 text-xs leading-4 ${trend.color}`}>
            <MaterialIcon name={trend.icon} size="auto" className="text-xl" />
            {Math.abs(increase)}%
          </span>
          <span className={`text-[8px] leading-4 ${retro ? "text-[#555850]" : light ? "text-[#806272]" : "text-[#b9b9b9]"}`}>vs Last Month</span>
        </div>
      </div>
      {detailsOpen && <div className={`absolute inset-x-2 top-8 z-20 rounded-xl p-3 text-xs shadow-lg ${retro ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b]" : light ? "border border-[#bdeaff] bg-[#f3fbff] text-[#04044A] shadow-[0_10px_24px_rgba(0,4,117,0.18)]" : "border border-[#b0ff5e]/25 bg-[#121916] text-[#f1f1f1]"}`}><div className="flex items-center justify-between"><span>Bulan lalu</span><b>{new Intl.NumberFormat("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(previous)} {unit}</b></div><div className="mt-2 flex items-center justify-between"><span>Perubahan</span><b className={trend.color}>{increase > 0 ? "+" : ""}{increase}%</b></div></div>}
    </article>
  );
}
