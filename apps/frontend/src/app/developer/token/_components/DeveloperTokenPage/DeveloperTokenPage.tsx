"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

const nebulaTokens = [
  ["1", "#faf6fa"], ["2", "#f8f1f8"], ["3", "#f8e2f9"], ["4", "#f6d4f8"],
  ["5", "#f1c5f5"], ["6", "#eab4f0"], ["7", "#e19ce8"], ["8", "#d57cdf"],
  ["9", "#ba0dcb"], ["10", "#a900b9"], ["11", "#9e00ad"], ["12", "#5e0068"],
] as const;

const blackAlphaTokens = [0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95] as const;
const whiteAlphaTokens = blackAlphaTokens;
const skyTokens = [
  ["1", "#f9feff"], ["2", "#f1fafd"], ["3", "#e1f6fd"], ["4", "#d1f0fa"],
  ["5", "#bee7f5"], ["6", "#a9daed"], ["7", "#8dcae3"], ["8", "#60b3d7"],
  ["9", "#7ce2fe"], ["10", "#74daf8"], ["11", "#00749e"], ["12", "#1d3e56"],
] as const;
const limeAlphaTokens = ["#66990005", "#6b95000c", "#96c80029", "#8fc60042", "#81bb0059", "#72aa006e", "#61990087", "#559200ab", "#93e4009c", "#8fdc00b3", "#375f00d0", "#1e2900e3"] as const;
const limeTokens = [
  ["1", "#fcfdfa"], ["2", "#f8faf3"], ["3", "#eef6d6"], ["4", "#e2f0bd"], ["5", "#d3e7a6"], ["6", "#c2da91"],
  ["7", "#abc978"], ["8", "#8db654"], ["9", "#bdee63"], ["10", "#b0e64c"], ["11", "#5c7c2f"], ["12", "#37401c"],
] as const;
const grayTokens = [["1", "#fcfcfc"], ["2", "#f9f9f9"], ["3", "#f0f0f0"], ["4", "#e8e8e8"], ["5", "#e0e0e0"], ["6", "#d9d9d9"], ["7", "#cecece"], ["8", "#bbbbbb"], ["9", "#8d8d8d"], ["10", "#838383"], ["11", "#646464"], ["12", "#202020"]] as const;
const orangeTokens = [["1", "#fefcfb"], ["2", "#fff7ed"], ["3", "#ffefd6"], ["4", "#ffdfb5"], ["5", "#ffd19a"], ["6", "#ffc182"], ["7", "#f5ae73"], ["8", "#ec9455"], ["9", "#f76b15"], ["10", "#ef5f00"], ["11", "#cc4e00"], ["12", "#582d1d"]] as const;

const emptySections = [
  { icon: "rounded_corner", title: "Radius & Elevation", items: ["Control kecil", "Card / dialog", "Panel utama"] },
  { icon: "format_size", title: "Typography", items: ["Heading / Display", "Heading section", "Body text"] },
  { icon: "rule", title: "Implementation Rules", items: ["Semantic color", "Reusable component", "Compact preview", "No arbitrary token"] },
];

function SectionHeader({ icon, eyebrow, title }: { icon: string; eyebrow: string; title: string }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand/8 text-brand">
        <MaterialIcon name={icon} size="xs" />
      </div>
      <div><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand">{eyebrow}</p><h2 className="mt-0.5 text-sm font-semibold text-cu-ink">{title}</h2></div>
    </div>
  );
}

export default function DeveloperTokenPage() {
  const [activeColorTab, setActiveColorTab] = useState("Nebula");
  const colorTabs = ["Nebula", "Sky", "Lime", "Gray", "Orange", "Black Alpha", "White Alpha", "Lime Alpha", "Semantic Layer"];
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-6 pb-12 lg:px-10 lg:py-10">
      <header className="mb-8 flex flex-col gap-3 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div><div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand"><MaterialIcon name="palette" size="xs" /> Design foundation</div><h1 className="text-3xl font-bold tracking-[-0.04em] text-cu-ink">Design Token</h1><p className="mt-2 max-w-xl text-sm leading-6 text-cu-muted">Satu sumber kebenaran untuk warna, bentuk, dan aturan visual aplikasi.</p></div>
        <span className="w-fit rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-[10px] font-medium text-brand">v0.0 · Draft</span>
      </header>

      <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex gap-1 overflow-x-auto border-b border-slate-100 p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {colorTabs.map((tab) => <button key={tab} type="button" onClick={() => setActiveColorTab(tab)} className={`shrink-0 rounded-lg px-3 py-2 text-[10px] font-semibold transition ${activeColorTab === tab ? "bg-brand text-white shadow-sm" : "text-cu-muted hover:bg-slate-50 hover:text-cu-ink"}`}>{tab}</button>)}
        </div>
      </div>

      <section className={`${activeColorTab === "Nebula" ? "" : "hidden "}mb-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6`}>
        <SectionHeader icon="color_lens" eyebrow="Color family" title="Nebula" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {nebulaTokens.map(([step, value]) => (
            <div key={step} className="group overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 transition hover:-translate-y-0.5 hover:shadow-sm">
              <div className="h-16" style={{ backgroundColor: value }} />
              <div className="flex items-center justify-between px-2.5 py-2"><span className="font-mono text-[10px] font-semibold text-cu-ink">nebula-{step}</span><span className="font-mono text-[9px] text-cu-muted">{value}</span></div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-[10px] text-cu-muted sm:grid-cols-5"><span><b className="text-cu-ink">1–2</b> · Background</span><span><b className="text-cu-ink">3–5</b> · Interactive</span><span><b className="text-cu-ink">6–8</b> · Border / separator</span><span><b className="text-cu-ink">9–10</b> · Solid color</span><span><b className="text-cu-ink">11–12</b> · Accessible text</span></div>
      </section>

      <section className={`${activeColorTab === "Black Alpha" ? "" : "hidden "}mb-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6`}>
        <SectionHeader icon="layers" eyebrow="Overlay family" title="Black Alpha" />
        <p className="mb-4 text-xs leading-5 text-cu-muted">Skala transparansi untuk overlay. Nilainya tetap sama pada light maupun dark theme.</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {blackAlphaTokens.map((alpha, index) => (
            <div key={alpha} className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="h-12 bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%),linear-gradient(-45deg,#f1f5f9_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f1f5f9_75%),linear-gradient(-45deg,transparent_75%,#f1f5f9_75%)] bg-[length:12px_12px] bg-[position:0_0,0_6px,6px_-6px,-6px_0px]" style={{ backgroundColor: `rgba(0, 0, 0, ${alpha})` }} />
              <div className="flex items-center justify-between px-2.5 py-2"><span className="font-mono text-[10px] font-semibold text-cu-ink">black-a{index + 1}</span><span className="font-mono text-[9px] text-cu-muted">{alpha}</span></div>
            </div>
          ))}
        </div>
      </section>

      <section className={`${activeColorTab === "Sky" ? "" : "hidden "}mb-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6`}>
        <SectionHeader icon="water_drop" eyebrow="Color family" title="Sky" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {skyTokens.map(([step, value]) => <div key={step} className="group overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 transition hover:-translate-y-0.5 hover:shadow-sm"><div className="h-16" style={{ backgroundColor: value }} /><div className="flex items-center justify-between px-2.5 py-2"><span className="font-mono text-[10px] font-semibold text-cu-ink">sky-{step}</span><span className="font-mono text-[9px] text-cu-muted">{value}</span></div></div>)}
        </div>
      </section>

      <section className={`${activeColorTab === "Lime Alpha" ? "" : "hidden "}mb-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6`}>
        <SectionHeader icon="eco" eyebrow="Alpha family" title="Lime Alpha" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {limeAlphaTokens.map((value, index) => <div key={value} className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50"><div className="h-12 bg-slate-900" style={{ backgroundColor: value }} /><div className="flex items-center justify-between px-2.5 py-2"><span className="font-mono text-[10px] font-semibold text-cu-ink">lime-a{index + 1}</span><span className="font-mono text-[9px] text-cu-muted">{value}</span></div></div>)}
        </div>
      </section>

      <section className={`${activeColorTab === "Lime" ? "" : "hidden "}mb-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6`}>
        <SectionHeader icon="eco" eyebrow="Color family" title="Lime" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {limeTokens.map(([step, value]) => <div key={step} className="group overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 transition hover:-translate-y-0.5 hover:shadow-sm"><div className="h-16" style={{ backgroundColor: value }} /><div className="flex items-center justify-between px-2.5 py-2"><span className="font-mono text-[10px] font-semibold text-cu-ink">lime-{step}</span><span className="font-mono text-[9px] text-cu-muted">{value}</span></div></div>)}
        </div>
      </section>

      <div className={`${activeColorTab === "Gray" || activeColorTab === "Orange" ? "" : "hidden "}grid gap-5 md:grid-cols-2`}>
        {[['Gray', grayTokens, 'contrast'], ['Orange', orangeTokens, 'local_fire_department']].map(([title, tokens, icon]) => (
          <section key={title as string} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeader icon={icon as string} eyebrow="Color family" title={title as string} />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">{(tokens as readonly (readonly [string, string])[]).map(([step, value]) => <div key={step} className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50"><div className="h-12" style={{ backgroundColor: value }} /><div className="flex items-center justify-between px-2 py-1.5"><span className="font-mono text-[10px] font-semibold text-cu-ink">{(title as string).toLowerCase()}-{step}</span><span className="font-mono text-[9px] text-cu-muted">{value}</span></div></div>)}</div>
          </section>
        ))}
      </div>

      <section className={`${activeColorTab === "White Alpha" ? "" : "hidden "}mb-5 rounded-2xl border border-slate-200/80 bg-slate-900 p-5 shadow-sm sm:p-6`}>
        <SectionHeader icon="layers_clear" eyebrow="Overlay family" title="White Alpha" />
        <p className="mb-4 text-xs leading-5 text-slate-300">Skala transparansi putih untuk overlay dan permukaan gelap. Nilainya tetap sama pada light maupun dark theme.</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {whiteAlphaTokens.map((alpha, index) => (
            <div key={alpha} className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <div className="h-12" style={{ backgroundColor: `rgba(255, 255, 255, ${alpha})` }} />
              <div className="flex items-center justify-between px-2.5 py-2"><span className="font-mono text-[10px] font-semibold text-white">white-a{index + 1}</span><span className="font-mono text-[9px] text-slate-300">{alpha}</span></div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-3">
        {emptySections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <SectionHeader icon={section.icon} eyebrow="To be defined" title={section.title} />
            <div className="space-y-1.5">{section.items.map((item) => <div key={item} className="flex items-center justify-between rounded-lg border border-dashed border-slate-200 px-3 py-2 text-[10px] text-slate-400"><span>{item}</span><span className="font-mono">—</span></div>)}</div>
          </section>
        ))}
      </div>

      <section className={`${activeColorTab === "Semantic Layer" ? "" : "hidden "}mt-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6`}>
        <SectionHeader icon="contrast" eyebrow="Semantic mapping" title="Light & Dark theme example" />
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { theme: "Light", family: "Nebula + Sky", background: "sky-1", surface: "sky-2", border: "sky-6", text: "nebula-12", action: "nebula-9" },
            { theme: "Dark", family: "Lime", background: "lime-12", surface: "lime-11", border: "lime-8", text: "lime-1", action: "lime-9" },
          ].map((mapping) => (
            <div key={mapping.theme} style={{ backgroundColor: mapping.theme === "Dark" ? "var(--lime-12)" : "var(--sky-1)" }} className="rounded-xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between"><div><h3 className={`text-sm font-semibold ${mapping.theme === "Dark" ? "text-white" : "text-cu-ink"}`}>{mapping.theme}</h3><p className={`text-[10px] ${mapping.theme === "Dark" ? "text-white/60" : "text-cu-muted"}`}>{mapping.family}</p></div><span className="rounded-full border border-brand/15 bg-brand/5 px-2 py-0.5 text-[9px] font-medium text-brand">Example</span></div>
              <div className="grid grid-cols-2 gap-2 text-[10px]"><span className={mapping.theme === "Dark" ? "text-white/60" : "text-cu-muted"}>Background <b className={mapping.theme === "Dark" ? "text-white" : "text-cu-ink"}>{mapping.background}</b></span><span className={mapping.theme === "Dark" ? "text-white/60" : "text-cu-muted"}>Surface <b className={mapping.theme === "Dark" ? "text-white" : "text-cu-ink"}>{mapping.surface}</b></span><span className={mapping.theme === "Dark" ? "text-white/60" : "text-cu-muted"}>Border <b className={mapping.theme === "Dark" ? "text-white" : "text-cu-ink"}>{mapping.border}</b></span><span className={mapping.theme === "Dark" ? "text-white/60" : "text-cu-muted"}>Text <b className={mapping.theme === "Dark" ? "text-white" : "text-cu-ink"}>{mapping.text}</b></span><span className={mapping.theme === "Dark" ? "text-white/60" : "text-cu-muted"}>Action <b className={mapping.theme === "Dark" ? "text-white" : "text-cu-ink"}>{mapping.action}</b></span></div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-6 flex items-center gap-2 text-[10px] text-cu-muted"><MaterialIcon name="info" size="xs" className="text-brand" />Token semantic digunakan melalui primitive UI dan alias `bg-brand` / `text-brand`.</footer>
    </main>
  );
}
