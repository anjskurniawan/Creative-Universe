import { useState } from "react";
import { MaterialIcon } from "@/components/material-icon";

type PerformanceSideSummaryProps = {
  totalTasks: number;
  rating: "GOOD" | "FAIR" | "POOR" | "NO DATA";
  creativeAgentContent: string | null;
  theme: "dark" | "light" | "retro";
};

/** Figma node 27:203: compact performance summary for the right side of the dashboard. */
export function PerformanceSideSummary({ totalTasks, rating, creativeAgentContent, theme }: PerformanceSideSummaryProps) {
  const [copied, setCopied] = useState(false);
  const light = theme !== "dark";
  const retro = theme === "retro";
  const ratingStyle = {
    GOOD: { color: light ? (retro ? "#ba0dcb" : "#00a4ff") : "#b0ff5e", icon: "sentiment_satisfied" },
    FAIR: { color: light ? "#ffcf5e" : "#b0ff5e", icon: "sentiment_neutral" },
    POOR: { color: "#ff5e5e", icon: "sentiment_dissatisfied" },
    "NO DATA": { color: "#b9b9b9", icon: "help_outline" },
  } as const;
  const status = ratingStyle[rating];
  const summary = creativeAgentContent?.replace(/[#*_`]/g, "").replace(/\s+/g, " ").trim();
  const copySummary = async () => {
    if (!summary || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <aside className="flex h-full w-full flex-col gap-2" data-node-id="27:203" aria-label="Ringkasan performa">
      <div className="flex h-[133px] shrink-0 gap-2">
        <article className={`flex min-w-0 flex-1 flex-col gap-2.5 rounded-2xl p-4 ${retro ? "border-2 border-[#24252b] bg-[#ba0dcb] text-white shadow-[0_2px_0_#24252b]" : light ? "bg-gradient-to-br from-[#00e7ef] to-[#00a4ff] text-white shadow-[0_6px_14px_rgba(0,164,255,0.2)]" : "bg-[#b0ff5e] text-[#181818] shadow-[0_5px_14px_rgba(0,0,0,0.24)]"}`}>
          <MaterialIcon name="assignment" size="auto" className="text-[40px]" />
          <div>
            <p className="text-xs leading-4">Total Task</p>
            <p className="text-[28px] font-medium leading-none">{totalTasks} Task</p>
          </div>
        </article>
        <article className="flex min-w-0 flex-1 flex-col items-center justify-center gap-2.5 rounded-2xl p-4 text-center text-[#060606] shadow-[0_5px_14px_rgba(44,42,39,0.06)]" style={{ backgroundColor: status.color }}>
          <MaterialIcon name={status.icon} size="auto" className="text-[40px]" />
          <div>
            <p className="text-[28px] font-medium leading-none">{rating}</p>
            <p className="mt-1 text-xs leading-4">Performance</p>
          </div>
        </article>
      </div>

      <article className={`flex min-h-0 flex-1 flex-col gap-2 rounded-2xl p-4 ${retro ? "border-2 border-[#24252b] bg-[#eceee6] shadow-[inset_0_0_0_2px_#c9ccc0]" : light ? "border border-white/80 bg-white/90 shadow-[0_5px_14px_rgba(44,42,39,0.06)]" : "border border-white/[0.05] bg-[#171717] shadow-[0_5px_14px_rgba(0,0,0,0.24)]"}`}>
        <div className="flex items-center justify-between gap-2"><p className={`text-sm font-medium leading-4 ${retro ? "font-bold uppercase tracking-wide text-[#ba0dcb]" : light ? "text-[#00a4ff]" : "text-[#b0ff5e]"}`}>Creative Agent :</p><button type="button" onClick={() => void copySummary()} disabled={!summary} className={`flex h-6 items-center gap-1 rounded-md px-1.5 text-[10px] transition disabled:cursor-not-allowed disabled:opacity-40 ${light ? "text-[#00a4ff] hover:bg-[#f3faff]" : "text-[#b0ff5e] hover:bg-white/10"}`}><MaterialIcon name={copied ? "check" : "content_copy"} size="auto" className="text-sm" />{copied ? "Tersalin" : "Salin"}</button></div>
        <div className={`min-h-0 flex-1 overflow-y-auto rounded-lg p-2 ${retro ? "border border-[#24252b] bg-[#dfe2d3]" : light ? "bg-[#f3faff]" : "bg-[#0e0e0e]"}`}>
          <p className={`text-xs leading-4 ${retro ? "text-[#24252b]" : light ? "text-[#6e5264]" : "text-[#b9b9b9]"}`}>
            {summary || "Belum ada laporan Creative Agent. Gunakan Generate Agent untuk membuat ringkasan rekomendasi dari data task bulan ini."}
          </p>
        </div>
      </article>
    </aside>
  );
}
