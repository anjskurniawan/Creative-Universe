import { MaterialIcon } from "@/components/ui/material-icon";

export type TaskMetricState = "Total" | "Progress" | "OnTrack" | "Terlambat" | "Done";
export type TaskMetricTheme = "light" | "dark" | "retro";
export type TaskMetric = { title: string; value: number; icon: string; state: TaskMetricState };

const toneClasses: Record<TaskMetricState, { iconBox: string; icon: string }> = {
  Total: { iconBox: "bg-[#f3e8ff]", icon: "text-[#8b5cf6]" },
  Progress: { iconBox: "bg-[#fff4d6]", icon: "text-[#f59e0b]" },
  OnTrack: { iconBox: "bg-[#e5f6fd]", icon: "text-[#0288d1]" },
  Terlambat: { iconBox: "bg-[#ffe2dd]", icon: "text-[#ff5b55]" },
  Done: { iconBox: "bg-[#efffee]", icon: "text-[#2b9915]" },
};

export function TaskKpiMetrics({ metrics, onAddTask, theme, fill = false }: { metrics: TaskMetric[]; onAddTask?: () => void; theme: TaskMetricTheme; fill?: boolean }) {
  if (metrics.length === 0 && !onAddTask) return null;
  const isDark = theme === "dark";
  const isRetro = theme === "retro";
  return <div className={`flex w-full min-w-0 items-stretch overflow-hidden rounded-xl ${isDark ? "border border-white/10 bg-[#171717] shadow-[0_8px_20px_rgba(0,0,0,0.18)]" : isRetro ? "border-2 border-[#24252b] bg-[#eceee6] shadow-[2px_2px_0_#24252b]" : "border border-[#e5e7eb] bg-white shadow-sm"}`}>{onAddTask && <div className={`z-[1] flex shrink-0 items-center justify-center ${isDark ? "border-r border-white/10" : isRetro ? "border-r-2 border-[#24252b]" : "border-r border-[#e5e7eb]"}`}><button type="button" onClick={onAddTask} aria-label="Add Button" className={`flex h-[56px] w-[56px] shrink-0 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 ${isDark ? "bg-[#b0ff5e] text-[#181818] hover:bg-[#c6ff89] focus-visible:ring-[#b0ff5e]/40" : isRetro ? "bg-[#ba0dcb] text-white hover:bg-[#9c0bac] focus-visible:ring-[#ba0dcb]/40" : "bg-[#ec4899] text-white hover:bg-[#db2777] focus-visible:ring-[#ec4899]/40"}`}><MaterialIcon name="add" size="auto" weight={400} className="text-2xl" /></button></div>}<div className={`kv-retail-kpi-scroll flex min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isDark ? "divide-x divide-white/10" : isRetro ? "divide-x divide-[#24252b]/20" : "divide-x divide-[#e5e7eb]"}`}>{metrics.map((metric) => { const tone = toneClasses[metric.state]; return <div key={metric.state} className={`flex h-[56px] min-w-[132px] shrink-0 items-center gap-3 px-3.5 py-2 ${fill ? "flex-1 justify-start" : ""}`}><div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${isDark ? "bg-[#202820]" : isRetro ? "bg-[#dfe2d3]" : tone.iconBox}`}><MaterialIcon name={metric.icon} size="auto" weight={400} filled={false} className={`text-[18px] leading-none ${isDark ? "text-[#b0ff5e]" : isRetro ? "text-[#24252b]" : tone.icon}`} /></div><div className="flex flex-col"><p className={`text-lg font-bold leading-none ${isDark ? "text-[#f1f1f1]" : "text-[#111827]"}`}>{metric.value}</p><p className={`mt-1 whitespace-nowrap text-[11px] font-medium ${isDark ? "text-[#b9b9b9]" : "text-[#6b7280]"}`}>{metric.title}</p></div></div>; })}</div></div>;
}
