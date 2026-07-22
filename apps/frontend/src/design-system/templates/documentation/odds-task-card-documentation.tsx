"use client";

import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";

export type OddsTaskCardView = "admin" | "client" | "designer";

type PreviewTheme = "light" | "dark" | "retro";

const viewLabels: Record<OddsTaskCardView, string> = {
  admin: "Admin",
  client: "Client",
  designer: "Designer",
};

const themeSurface: Record<PreviewTheme, string> = {
  light: "bg-white",
  dark: "bg-[#111827]",
  retro: "bg-[#dfe2d3]",
};

function TaskCardPreview({ view, theme }: { view: OddsTaskCardView; theme: PreviewTheme }) {
  const isOverdue = view === "admin";
  const accent = isOverdue ? "#ff5e5e" : theme === "dark" ? "#b0ff5e" : theme === "retro" ? "#ba0dcb" : "#00a4ff";
  const headerClass = isOverdue
    ? "bg-[#ff5e5e] text-white"
    : theme === "dark"
    ? "bg-[#b0ff5e] text-[#181818]"
    : theme === "retro"
    ? "border-b-2 border-[#24252b] bg-[#ba0dcb] text-white"
    : "bg-[#00a4ff] text-white";
  const bodyClass =
    theme === "dark"
      ? "bg-[#171717] text-[#f1f1f1]"
      : theme === "retro"
      ? "border-x-2 border-b-2 border-[#24252b] bg-[#eceee6] text-[#24252b]"
      : "bg-white/90 text-[#3b4446]";
  const dividerClass = theme === "retro" ? "border-[#24252b]" : theme === "dark" ? "border-white/10" : "border-[#e6edf2]";
  const role = view === "client" ? "Requester" : view === "admin" ? "SPV" : "Client";
  const status = view === "client" ? "Menunggu Review" : view === "admin" ? "Overdue" : "Cek Brief";
  const shellClass = theme === "retro" ? "min-w-[900px] rounded-none border-2 border-[#24252b]" : "min-w-[900px] overflow-hidden rounded-lg";
  const retroTextClass = theme === "retro" ? "font-mono font-black uppercase tracking-[0.08em]" : "";
  const retroSmallTextClass = theme === "retro" ? "font-mono font-black uppercase tracking-[0.1em]" : "";

  return (
    <article className={`${shellClass} ${theme === "retro" ? "font-mono shadow-[3px_3px_0_#777a72]" : "shadow-[0_5px_14px_rgba(44,42,39,0.06)]"}`}>
      <div className={`flex items-center px-4 py-2 ${headerClass}`}>
        <p className={`truncate leading-none ${theme === "retro" ? "text-[11px] font-black uppercase tracking-[0.12em]" : "text-base"}`}>Q3 - Feed Promo JETE Festive</p>
      </div>
      <div className={`flex items-center justify-between px-4 py-2 ${bodyClass}`}>
        <div className="flex items-center gap-[22px]">
          <div className="flex min-w-[600px] items-center gap-2">
            <div className="flex w-24 shrink-0 flex-col items-start gap-0.5 leading-none">
              <p className={`w-full text-sm font-medium ${retroSmallTextClass}`}>Rabu</p>
              <p className={`w-full text-sm font-medium ${retroSmallTextClass}`}>22/07/2026</p>
              <p className={`w-full text-2xl font-bold leading-none tracking-[-0.24px] ${theme === "retro" ? "font-black tracking-[0.02em]" : ""}`} style={{ color: accent }}>10:29</p>
            </div>
            <div className={`flex h-full min-h-[54px] w-[180px] shrink-0 flex-col justify-center border-l px-4 ${dividerClass}`}>
              <p className={`truncate text-lg font-semibold leading-none ${retroTextClass}`}>Rohmat Emha</p>
              <p className={`mt-1 text-sm font-medium leading-none ${retroSmallTextClass}`}>{role}</p>
            </div>
            <div className={`flex h-full min-h-[54px] shrink-0 items-center border-l px-4 ${dividerClass}`}>
              <span className={`whitespace-nowrap text-sm font-medium leading-none ${retroSmallTextClass}`} style={{ color: accent }}>Lihat Detail Brief</span>
            </div>
            <div className={`flex h-full min-h-[54px] shrink-0 flex-col justify-center border-l px-4 ${dividerClass}`}>
              <p className={`text-sm font-medium leading-none ${retroSmallTextClass}`}>Sabtu</p>
              <p className={`mt-0.5 text-sm font-medium leading-none ${retroSmallTextClass}`}>25/07/2026</p>
              <p className={`mt-1 whitespace-nowrap text-lg font-semibold leading-none ${retroTextClass}`} style={{ color: accent }}>2 Hari 11 Jam</p>
            </div>
          </div>
          <div className="flex h-full items-center gap-2">
            <span title="Chat belum bisa dijalankan pada proses Cek Brief" aria-label="Chat task disabled" className="flex size-6 items-center justify-center cursor-not-allowed opacity-30">
              <MaterialIcon name="chat_bubble" size="auto" className="text-2xl" />
            </span>
            <span title="Brief" aria-label="Buka brief task" className="flex size-6 items-center justify-center">
              <MaterialIcon name="description" size="auto" className="text-2xl" />
            </span>
            <span title="Start" aria-label="Start task" className="flex size-6 items-center justify-center">
              <MaterialIcon name="play_circle" size="auto" className="text-2xl opacity-40" />
            </span>
            <span title="Cek Brief" aria-label="Cek brief task" className="flex size-6 items-center justify-center">
              <MaterialIcon name="fact_check" size="auto" className="text-2xl" />
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center p-2.5">
          <p className={`whitespace-nowrap text-sm font-medium leading-none ${retroSmallTextClass}`}>{status}</p>
        </div>
      </div>
    </article>
  );
}

function codeFor(view: OddsTaskCardView) {
  return `<OddsTaskCard
  view="${view}"
  task={task}
  theme={theme}
  onChat={openTaskChat}
  actions={["chat", "brief", "start", "cek-brief"]}
/>`;
}

function TaskCardPlayground({ view }: { view: OddsTaskCardView }) {
  const [theme, setTheme] = useState<PreviewTheme>("light");
  const code = useMemo(() => codeFor(view), [view]);

  return (
    <div className="overflow-hidden rounded-xl border border-[#d7dde5] bg-white">
      <div className="flex min-h-16 items-center justify-between gap-3 border-b border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">{viewLabels[view]} view</span>
        <div className="flex items-center gap-2">
          {(["light", "dark", "retro"] as PreviewTheme[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTheme(item)}
              className={`h-9 rounded-lg border px-3 text-xs font-medium capitalize ${theme === item ? "border-[#00A4FF] bg-[#eff8ff] text-[#00A4FF]" : "border-[#d7dde5] bg-white text-[#475569]"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className={`overflow-x-auto p-8 transition-colors ${themeSurface[theme]}`}>
        <TaskCardPreview view={view} theme={theme} />
      </div>
      <div className="flex items-center justify-between border-y border-[#d7dde5] bg-white">
        <span className="border-r border-[#d7dde5] px-4 py-2 text-sm font-medium text-[#0f172a]">TSX</span>
      </div>
      <pre className="m-0 overflow-auto bg-[#1f242b] p-5 text-[12px] leading-6 text-[#e5edf5]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function OddsTaskCardDocumentation({ view }: { view?: OddsTaskCardView }) {
  if (view) {
    return (
      <article className="space-y-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cu-muted">Design System / ODDS / Task Card</p>
          <h1 className="mt-2 text-3xl font-bold text-cu-ink">ODDS Task Card - {viewLabels[view]}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-cu-muted">
            Variant task card untuk view {viewLabels[view]}. Anatomy dasarnya sama, tetapi metadata, action, dan status disesuaikan dengan role.
          </p>
        </header>
        <section className="rounded-2xl border border-cu-line bg-white p-5">
          <h2 className="text-lg font-semibold text-cu-ink">Playground</h2>
          <div className="mt-4">
            <TaskCardPlayground view={view} />
          </div>
        </section>
      </article>
    );
  }

  return (
    <article className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cu-muted">Design System / ODDS</p>
        <h1 className="mt-2 text-3xl font-bold text-cu-ink">ODDS Task Card</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-cu-muted">
          Library guide task card ODDS. Komponen ini disiapkan untuk tiga view: Admin, Client, dan Designer.
        </p>
      </header>
      <section className="grid gap-3 sm:grid-cols-3">
        {(["admin", "client", "designer"] as OddsTaskCardView[]).map((item) => (
          <a key={item} href={`?section=components/odds-task-card-${item}`} className="rounded-xl border border-cu-line p-4 transition hover:border-[#00A4FF] hover:bg-[#F3FAFF]">
            <p className="font-semibold text-cu-ink">{viewLabels[item]}</p>
            <p className="mt-2 text-sm leading-6 text-cu-muted">Task card untuk role {viewLabels[item]}.</p>
          </a>
        ))}
      </section>
      <TaskCardPlayground view="designer" />
    </article>
  );
}
