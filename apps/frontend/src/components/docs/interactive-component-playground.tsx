"use client";

import { useState, type ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export type PlaygroundBreakpoint = "responsive" | "sm" | "md" | "lg" | "xl" | "2xl";

const breakpointWidths: Record<PlaygroundBreakpoint, string> = {
  responsive: "100%",
  sm: "370px",
  md: "508px",
  lg: "764px",
  xl: "1020px",
  "2xl": "1276px",
};

type InteractiveComponentPlaygroundProps = {
  componentName: string;
  componentPath: string;
  children: ReactNode;
  code: string;
  controls?: ReactNode;
  initialBreakpoint?: PlaygroundBreakpoint;
  minHeight?: number;
};

export function InteractiveComponentPlayground({ componentName, componentPath, children, code, controls, initialBreakpoint = "responsive", minHeight = 400 }: InteractiveComponentPlaygroundProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [breakpoint, setBreakpoint] = useState<PlaygroundBreakpoint>(initialBreakpoint);
  const [zoom, setZoom] = useState(100);

  return (
    <section>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-slate-900">{componentName}</h1>
        <p className="mt-1 font-mono text-xs text-slate-500">{componentPath}</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_4px_24px_-12px_rgba(0,0,0,0.1)]">
      <div className="flex border-b border-slate-200">
        {(["preview", "code"] as const).map((tab) => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 text-sm font-medium capitalize ${activeTab === tab ? "border-b-2 border-blue-500 text-blue-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "preview" && (
        controls ? <div className="flex flex-wrap items-center gap-2.5 border-b border-slate-200 bg-slate-50 p-3">{controls}</div> : null
      )}

      {activeTab === "preview" ? (
        <div className="flex justify-center overflow-auto p-8" style={{ minHeight, backgroundImage: "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
          <div className="h-fit overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl transition-all duration-300" style={{ width: breakpointWidths[breakpoint], transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
            <div className="flex h-8 items-center justify-center border-b border-slate-100 bg-slate-50 font-mono text-[10px] text-slate-400">
              {breakpoint === "responsive" ? "Responsive (100%)" : `${breakpoint.toUpperCase()} — ${breakpointWidths[breakpoint]}`}
            </div>
            <div className="w-full p-4">{children}</div>
          </div>
        </div>
      ) : (
        <div className="w-full overflow-x-auto bg-[#0f172a] p-6 text-sm text-slate-50">
          <pre><code>{code}</code></pre>
        </div>
      )}
      {activeTab === "preview" && <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-3 py-2">
        <div className="flex items-center rounded-md border border-slate-200/60 bg-slate-100 p-1">
          {(Object.keys(breakpointWidths) as PlaygroundBreakpoint[]).map((value) => (
            <button key={value} type="button" onClick={() => setBreakpoint(value)} className={`rounded px-3 py-1 text-xs font-medium uppercase ${breakpoint === value ? "border border-slate-200/50 bg-white text-slate-800 shadow-sm" : "border border-transparent text-slate-500 hover:bg-slate-200/50"}`}>
              {value === "responsive" ? "Responsive" : value}
            </button>
          ))}
        </div>
        <div className="flex items-center rounded-md border border-slate-200/60 bg-slate-100 p-1">
          <button type="button" onClick={() => setZoom((value) => Math.max(25, value - 25))} className="rounded p-1.5 text-slate-500 hover:bg-slate-200/50" aria-label="Zoom out"><MaterialIcon name="zoom_out" size="xs" /></button>
          <button type="button" onClick={() => setZoom(100)} className="min-w-14 px-2 text-xs font-medium text-slate-600">{zoom}%</button>
          <button type="button" onClick={() => setZoom((value) => Math.min(200, value + 25))} className="rounded p-1.5 text-slate-500 hover:bg-slate-200/50" aria-label="Zoom in"><MaterialIcon name="zoom_in" size="xs" /></button>
        </div>
      </footer>}
      </div>
    </section>
  );
}
