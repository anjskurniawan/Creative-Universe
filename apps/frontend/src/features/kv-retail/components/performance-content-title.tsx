"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { KV_RETAIL_PERFORMANCE_PAGE } from "@/features/kv-retail/performance-page-config";

/** Title bar based on Figma node 27:357, used only by the performance page. */
export function PerformanceContentTitle({ theme }: { theme: "dark" | "light" | "retro" }) {
  const [periodOpen, setPeriodOpen] = useState(false);
  const dark = theme === "dark";
  const retro = theme === "retro";

  return (
    <header className="flex min-h-[45px] items-center justify-between gap-6" data-node-id="27:357">
      <h1 className={`whitespace-nowrap text-4xl font-medium leading-none tracking-[-0.72px] ${dark ? "text-white" : "text-[#24252b]"}`}>
        {KV_RETAIL_PERFORMANCE_PAGE.title}
      </h1>

      <div className="flex shrink-0 items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setPeriodOpen((open) => !open)}
            aria-expanded={periodOpen}
            className={`flex items-center gap-4 rounded-lg border p-2 text-sm font-medium leading-4 ${dark ? "border border-[#b0ff5e]/30 bg-[#121916] text-[#f1f1f1]" : retro ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b] shadow-[0_2px_0_#24252b]" : "border border-[#bdeaff] bg-[#f3fbff] text-[#04044A]"}`}
          >
            <span className="flex items-center gap-1"><MaterialIcon name="calendar_month" size="auto" className="text-xl" />Bulan Ini</span>
            <MaterialIcon name="keyboard_arrow_down" size="auto" className="text-xl" />
          </button>
          {periodOpen && (
            <div className={`absolute right-0 top-[calc(100%+8px)] z-20 w-40 rounded-xl p-1.5 text-sm ${dark ? "border border-[#b0ff5e]/25 bg-[#121916] text-[#f1f1f1] shadow-[0_12px_28px_rgba(0,0,0,0.34)]" : retro ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b] shadow-[0_3px_0_#24252b]" : "border border-[#bdeaff] bg-[#f3fbff]/95 text-[#04044A] shadow-[0_10px_24px_rgba(0,4,117,0.18)] backdrop-blur-md"}`}>
              <button type="button" onClick={() => setPeriodOpen(false)} className={`flex w-full rounded-lg px-3 py-2 text-left ${dark ? "hover:bg-[#b0ff5e]/10" : retro ? "hover:bg-[#dfe2d3]" : "hover:bg-[#dff6ff]"}`}>Bulan ini</button>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className={`flex items-center gap-1 rounded-lg border p-2 text-sm font-medium leading-4 ${dark ? "border-[rgba(123,123,123,0.25)] bg-[#b0ff5e] text-[#181818]" : retro ? "border-2 border-[#24252b] bg-[#ba0dcb] text-white shadow-[0_2px_0_#24252b]" : "border-[rgba(123,123,123,0.25)] bg-[#00a4ff] text-white"}`}
        >
          <MaterialIcon name="picture_as_pdf" size="auto" className="text-xl" />
          Export PDF
        </button>
      </div>
    </header>
  );
}
