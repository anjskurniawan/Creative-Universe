"use client";

import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";

export type OddsDesignerDashboardCardId =
  | "total-tugas-hari-ini"
  | "total-dalam-antrian"
  | "tugas-selesai"
  | "antrian-revisi"
  | "request-terbaru"
  | "calendar"
  | "need-review-brief"
  | "notification"
  | "message"
  | "score-kamu"
  | "grafik-performa"
  | "queue-jobs";

type CardDoc = {
  id: OddsDesignerDashboardCardId;
  name: string;
  source: string;
  usage: string;
  implementation: string;
  runtime: "rendered" | "hidden";
};

type PreviewWidth = "desktop" | "tablet" | "mobile";
type PreviewTheme = "light" | "dark" | "retro";

const cardDocs: CardDoc[] = [
  {
    id: "total-tugas-hari-ini",
    name: "Total Tugas Hari Ini",
    source: "tasks status in_progress",
    usage: "Jumlah task aktif hari ini dan indikator perubahan performa.",
    implementation: "Summary metric card memakai DesignerMetric dengan icon assignment, value 30px, icon filled 40px, dan footer performa.",
    runtime: "rendered",
  },
  {
    id: "total-dalam-antrian",
    name: "Total Dalam Antrian",
    source: "tasks status queued",
    usage: "Jumlah task yang masih berada dalam antrean.",
    implementation: "Summary metric card memakai DesignerMetric dengan icon schedule dan footer Data Update.",
    runtime: "rendered",
  },
  {
    id: "tugas-selesai",
    name: "Tugas Selesai",
    source: "tasks status done",
    usage: "Jumlah task selesai pada periode berjalan.",
    implementation: "Summary metric card memakai DesignerMetric dengan icon check_circle dan footer periode bulan berjalan.",
    runtime: "rendered",
  },
  {
    id: "antrian-revisi",
    name: "Antrian Revisi",
    source: "tasks status revision",
    usage: "Jumlah task revisi yang menunggu pengerjaan.",
    implementation: "Summary metric card memakai DesignerMetric dengan icon rate_review dan footer Data Update.",
    runtime: "rendered",
  },
  {
    id: "request-terbaru",
    name: "Request Terbaru",
    source: "5 latest tasks by created_at",
    usage: "Daftar request terbaru dengan scroll internal.",
    implementation: "Card Last Request setinggi 211px, inner panel #F3FAFF, row putih 72px, padding 16px, dan status outline biru.",
    runtime: "rendered",
  },
  {
    id: "calendar",
    name: "Calendar",
    source: "browser local date",
    usage: "Kartu tanggal hari ini.",
    implementation: "Kartu aspect-square biru dengan hari, tanggal besar, bulan, dan tahun.",
    runtime: "rendered",
  },
  {
    id: "need-review-brief",
    name: "Need Review Brief",
    source: "tasks status spv_review or client_review",
    usage: "Task yang menunggu review brief dengan scroll internal.",
    implementation: "Compact list card setinggi row dashboard bawah, list item scroll internal, action icon menuju detail brief.",
    runtime: "rendered",
  },
  {
    id: "notification",
    name: "Notification",
    source: "active tasks, max 8",
    usage: "Ringkasan update status task aktif.",
    implementation: "Compact list card untuk status feed dengan item aktif dan action menuju detail task.",
    runtime: "rendered",
  },
  {
    id: "message",
    name: "Message",
    source: "active tasks, max 8",
    usage: "Pintasan diskusi brief/task.",
    implementation: "Compact list card untuk pesan task dengan action menuju detail atau chat task.",
    runtime: "rendered",
  },
  {
    id: "score-kamu",
    name: "Score Kamu",
    source: "done tasks category score_weight",
    usage: "Menampilkan skor output designer dari task selesai.",
    implementation: "Square accent card dengan label kecil dan angka skor besar. Saat ini tidak dirender di runtime dashboard.",
    runtime: "hidden",
  },
  {
    id: "grafik-performa",
    name: "Grafik Performa",
    source: "done tasks updated_at over last 6 days",
    usage: "Menampilkan tren skor performa beberapa hari terakhir.",
    implementation: "Panel chart compact dengan inner chart surface. Saat ini tidak dirender di runtime dashboard.",
    runtime: "hidden",
  },
  {
    id: "queue-jobs",
    name: "Queue Jobs",
    source: "tasks status queued",
    usage: "Menampilkan task antrean berikutnya beserta shortcut chat dan mulai.",
    implementation: "Compact list card dengan row task, kategori, detail brief, dan action icon. Saat ini tidak dirender di runtime dashboard.",
    runtime: "hidden",
  },
];

const sampleRequests = [
  { title: "Feed Promo JETE Festive", meta: "Instagram JETE Indonesia - Designer Test", status: "Progress" },
  { title: "Banner Marketplace Juli", meta: "Marketplace - Alicia Creative", status: "Queued" },
  { title: "Story Launching Produk", meta: "Social Media - Doran Studio", status: "Review" },
  { title: "KV Campaign Asset", meta: "Key Visual - Designer Test", status: "Done" },
  { title: "Thumbnail Product Video", meta: "Video - Alicia Creative", status: "Revision" },
];

const sampleBriefs = [
  { title: "Review Brief Promo Festive", sub: "Instagram - Detail Brief" },
  { title: "ACC Visual Marketplace", sub: "Marketplace - Detail Brief" },
  { title: "Cek Revisi Copy Banner", sub: "Banner - Detail Brief" },
];

const sampleFeed = [
  { title: "Tugas ODDS-2407 diperbarui", sub: "Feed Promo JETE Festive - sedang dikerjakan" },
  { title: "Tugas ODDS-2406 masuk review", sub: "Banner Marketplace Juli - review SPV" },
  { title: "Tugas ODDS-2405 selesai", sub: "Story Launching Produk - done" },
];

const previewWidthClass: Record<PreviewWidth, string> = {
  desktop: "max-w-full",
  tablet: "max-w-[520px]",
  mobile: "max-w-[320px]",
};

const previewThemeClass: Record<PreviewTheme, string> = {
  light: "bg-white",
  dark: "bg-[#111827]",
  retro: "bg-[#dfe2d3]",
};

function SummaryPreviewCard({ label, value, icon, footer }: { label: string; value: string; icon: string; footer: React.ReactNode }) {
  return (
    <article className="flex h-[211px] min-h-[130px] w-full max-w-[240px] min-w-[200px] flex-col items-center justify-center gap-2 rounded-lg bg-white/90 p-2 shadow-[0_5px_14px_rgba(44,42,39,0.06)]">
      <div className="flex w-full shrink-0 items-center justify-between">
        <p className="whitespace-nowrap text-sm font-medium leading-none text-[#3B4446]">{label}</p>
        <button type="button" aria-label={`Detail ${label}`} className="flex size-5 items-center justify-center rounded-md text-[#00A4FF]">
          <MaterialIcon name="more_horiz" size="auto" className="text-xl" />
        </button>
      </div>
      <div className="flex min-h-0 w-full flex-1 items-center justify-between rounded bg-[#F3FAFF] px-4">
        <p className="whitespace-nowrap text-[30px] font-semibold leading-none tracking-[-0.6px] text-[#3B4446]">{value}</p>
        <span className="flex size-10 shrink-0 items-center justify-center text-[#00A4FF]">
          <MaterialIcon name={icon} size="lg" style={{ fontSize: "40px", lineHeight: 1 }} />
        </span>
      </div>
      <div className="flex min-h-5 w-full shrink-0 items-center justify-between text-xs leading-none tracking-[0.24px] text-[#7D7C7C]">{footer}</div>
    </article>
  );
}

function LastRequestPreviewCard() {
  return (
    <article className="flex h-[211px] min-h-[130px] w-full max-w-[620px] min-w-[200px] flex-col gap-2 rounded-lg bg-white/90 p-2 shadow-[0_5px_14px_rgba(44,42,39,0.06)]">
      <div className="flex w-full shrink-0 items-center justify-between px-2">
        <p className="whitespace-nowrap text-sm font-medium leading-none text-[#3B4446]">Request Terbaru</p>
        <button type="button" aria-label="Detail Request Terbaru" className="flex size-5 items-center justify-center rounded-md text-[#00A4FF]">
          <MaterialIcon name="more_horiz" size="auto" className="text-xl" />
        </button>
      </div>
      <div className="flex min-h-0 w-full flex-1 flex-col gap-2 overflow-y-auto rounded bg-[#F3FAFF] p-2 pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sampleRequests.map((item) => (
          <div key={item.title} className="flex min-h-[72px] w-full shrink-0 items-center justify-between gap-3 rounded-lg bg-white p-4 shadow-[0_5px_7px_rgba(44,42,39,0.06)]">
            <div className="min-w-0 flex flex-col gap-1 text-sm font-medium leading-[18px]">
              <p className="truncate leading-[18px] text-[#3B4446]">{item.title}</p>
              <p className="truncate leading-[18px] text-[#7D7C7C]">{item.meta}</p>
            </div>
            <span className="shrink-0 rounded-lg border border-[#00A4FF] px-4 py-1 text-xs leading-none tracking-[0.24px] text-[#00A4FF]">{item.status}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function CalendarPreviewCard({ theme = "light" }: { theme?: PreviewTheme }) {
  const themeClass =
    theme === "retro"
      ? "border-2 border-[#24252b] bg-[#ba0dcb] text-white shadow-[0_3px_0_#24252b]"
      : theme === "dark"
      ? "bg-[#b0ff5e] text-[#181818]"
      : "bg-[#00A4FF] text-white shadow-[0_5px_14px_rgba(44,42,39,0.06)]";

  return (
    <article className={`flex h-[211px] aspect-square flex-col items-center justify-center gap-1 rounded-2xl p-5 text-center ${themeClass}`}>
      <p className="text-[13px] font-bold uppercase leading-none tracking-[0.12em] opacity-85">Rabu</p>
      <p className="text-[92px] font-black leading-[0.86] tracking-[-2px]">22</p>
      <p className="text-xl font-bold leading-none">Juli</p>
      <p className="text-[13px] font-semibold leading-none opacity-85">2026</p>
    </article>
  );
}

function ScorePreviewCard() {
  return (
    <article className="flex aspect-square h-[139px] flex-col items-center justify-center rounded-2xl bg-[#00A4FF] p-4 text-center text-white shadow-[0_5px_14px_rgba(44,42,39,0.06)]">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white opacity-90">Score Kamu</p>
      <h3 className="mt-1 text-3xl font-black leading-none text-white">860</h3>
    </article>
  );
}

function PerformanceChartPreviewCard() {
  return (
    <article className="flex h-[139px] w-full max-w-[350px] flex-col gap-1 rounded-2xl border border-white/80 bg-white/90 p-2 shadow-[0_5px_14px_rgba(44,42,39,0.06)]">
      <div className="flex items-center justify-between px-1">
        <p className="text-xs leading-4 text-[#6e5264]">Grafik Performa</p>
        <span className="flex size-6 items-center justify-center text-[#00A4FF]">
          <MaterialIcon name="show_chart" size="auto" className="text-xl" />
        </span>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl bg-[#F3FAFF]">
        <svg viewBox="0 0 260 72" className="h-full w-full overflow-visible px-2 py-2" fill="none">
          <path d="M12 56 C42 48, 52 32, 78 36 C104 40, 112 18, 140 24 C168 30, 176 48, 204 34 C226 23, 238 20, 248 14" stroke="#00A4FF" strokeWidth="3" strokeLinecap="round" />
          {[ [12,56], [78,36], [140,24], [204,34], [248,14] ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="#00A4FF" />
          ))}
        </svg>
      </div>
      <div className="px-1 text-[8px] leading-4 text-[#806272]">Last <span className="font-bold text-[#00A4FF]">Six Day Ago</span></div>
    </article>
  );
}

function CompactListPreviewCard({ title, items }: { title: string; items: Array<{ title: string; sub: string }> }) {
  return (
    <article className="flex h-[211px] w-full max-w-[360px] min-w-[240px] flex-col gap-1 rounded-2xl border border-white/80 bg-white/90 p-2 shadow-[0_5px_14px_rgba(44,42,39,0.06)]">
      <div className="flex w-full items-center justify-between px-1 py-0.5">
        <p className="text-[14px] font-normal leading-5 text-[#6d7880]">{title}</p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto rounded-xl pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <div key={item.title} className="flex items-center justify-between rounded-xl bg-[#F3FAFF] p-2">
            <div className="min-w-0 flex flex-col gap-[3px]">
              <p className="truncate text-xs font-semibold leading-4 text-[#181818]">{item.title}</p>
              <p className="truncate text-[10px] leading-3 text-[#6d7880]">{item.sub}</p>
            </div>
            <span className="ml-2 flex size-6 shrink-0 items-center justify-center rounded-lg text-[#00A4FF]">
              <MaterialIcon name="play_circle" size="auto" className="text-[16px]" />
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

function renderPreview(cardId: OddsDesignerDashboardCardId, theme: PreviewTheme = "light") {
  if (cardId === "total-tugas-hari-ini") {
    return (
      <SummaryPreviewCard
        label="Total Tugas Hari Ini"
        value="10 task"
        icon="assignment"
        footer={<span className="flex items-center gap-1 text-[#00A4FF]"><MaterialIcon name="trending_up" size="auto" className="text-sm" />15% <span className="text-[#7D7C7C]">vs Yesterday</span></span>}
      />
    );
  }
  if (cardId === "total-dalam-antrian") return <SummaryPreviewCard label="Total Dalam Antrian" value="4 task" icon="schedule" footer={<span>Data Update <strong className="text-[#00A4FF]">7/22/2026</strong></span>} />;
  if (cardId === "tugas-selesai") return <SummaryPreviewCard label="Tugas Selesai" value="18 task" icon="check_circle" footer={<span>Periode <strong className="text-[#00A4FF]">Juli 2026</strong></span>} />;
  if (cardId === "antrian-revisi") return <SummaryPreviewCard label="Antrian Revisi" value="2 task" icon="rate_review" footer={<span>Data Update <strong className="text-[#00A4FF]">7/22/2026</strong></span>} />;
  if (cardId === "request-terbaru") return <LastRequestPreviewCard />;
  if (cardId === "calendar") return <CalendarPreviewCard theme={theme} />;
  if (cardId === "need-review-brief") return <CompactListPreviewCard title="Need Review Brief" items={sampleBriefs} />;
  if (cardId === "notification") return <CompactListPreviewCard title="Notification" items={sampleFeed} />;
  if (cardId === "message") return <CompactListPreviewCard title="Message" items={sampleFeed.map((item) => ({ title: item.title.replace("Tugas", "Pesan"), sub: item.sub }))} />;
  if (cardId === "score-kamu") return <ScorePreviewCard />;
  if (cardId === "grafik-performa") return <PerformanceChartPreviewCard />;
  return <CompactListPreviewCard title="Queue Jobs" items={sampleRequests.slice(0, 3).map((item) => ({ title: item.title, sub: item.meta }))} />;
}

function resolveCodeSnippet(card: CardDoc) {
  if (["total-tugas-hari-ini", "total-dalam-antrian", "tugas-selesai", "antrian-revisi"].includes(card.id)) {
    return `<DesignerMetric
  label="${card.name}"
  value="10 task"
  icon="assignment"
  bottomLeft="Data Update"
/>`;
  }

  if (card.id === "request-terbaru") {
    return `<DesignerLastRequestCard tasks={tasks} />`;
  }

  if (card.id === "calendar") {
    return `<CalendarCard date={new Date()} />`;
  }

  if (card.id === "score-kamu") {
    return `<ScoreCard score={designerScore} />`;
  }

  if (card.id === "grafik-performa") {
    return `<PerformanceChartCard points={performancePoints} />`;
  }

  return `<CompactListCard
  title="${card.name}"
  items={items}
  maxHeight={211}
/>`;
}

function FlowbiteStylePlayground({ card }: { card: CardDoc }) {
  const [width, setWidth] = useState<PreviewWidth>("desktop");
  const [theme, setTheme] = useState<PreviewTheme>("light");
  const [copied, setCopied] = useState(false);
  const code = useMemo(() => resolveCodeSnippet(card), [card]);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#d7dde5] bg-white">
      <div className="grid min-h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
        <div aria-hidden="true" />
        <div className="flex items-center gap-2">
          {(["desktop", "tablet", "mobile"] as PreviewWidth[]).map((item) => (
            <button
              key={item}
              type="button"
              aria-label={`${item} preview`}
              onClick={() => setWidth(item)}
              className={`flex size-9 items-center justify-center rounded-lg border text-[#475569] ${width === item ? "border-[#00A4FF] bg-[#eff8ff] text-[#00A4FF]" : "border-[#d7dde5] bg-white"}`}
            >
              <MaterialIcon name={item === "desktop" ? "desktop_windows" : item === "tablet" ? "tablet_mac" : "phone_iphone"} size="auto" style={{ fontSize: "20px", lineHeight: 1 }} />
            </button>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2">
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

      <div className={`flex min-h-[220px] items-center justify-center p-8 transition-colors ${previewThemeClass[theme]}`} data-theme={theme === "dark" ? "dark" : undefined}>
        <div className={`flex w-full justify-center transition-all ${previewWidthClass[width]}`}>
          {renderPreview(card.id, theme)}
        </div>
      </div>

      <div className="flex items-center justify-between border-y border-[#d7dde5] bg-white">
        <span className="border-r border-[#d7dde5] px-4 py-2 text-sm font-medium text-[#0f172a]">TSX</span>
        <button type="button" onClick={() => void copyCode()} className="inline-flex items-center gap-2 border-l border-[#d7dde5] px-4 py-2 text-xs font-medium text-[#475569]">
          <MaterialIcon name={copied ? "check" : "content_copy"} size="auto" className="text-sm" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="m-0 max-h-[180px] overflow-auto bg-[#1f242b] p-5 text-[12px] leading-6 text-[#e5edf5] [scrollbar-width:thin]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function CardDetailDocumentation({ card }: { card: CardDoc }) {
  return (
    <article className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cu-muted">Design System / ODDS / Card Component</p>
        <h1 className="mt-2 text-3xl font-bold text-cu-ink">{card.name}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-cu-muted">{card.usage}</p>
      </header>

      <section className="rounded-2xl border border-cu-line bg-white p-5">
        <h2 className="text-lg font-semibold text-cu-ink">Playground</h2>
        <div className="mt-4">
          <FlowbiteStylePlayground card={card} />
        </div>
      </section>

      <section className="rounded-2xl border border-cu-line bg-white p-5">
        <h2 className="text-lg font-semibold text-cu-ink">Detail</h2>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-cu-ink">Runtime</dt>
            <dd className="mt-1 text-cu-muted">{card.runtime === "rendered" ? "Rendered in dashboard" : "Hidden in dashboard, available in library guide"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-cu-ink">Source</dt>
            <dd className="mt-1 font-mono text-xs text-cu-muted">{card.source}</dd>
          </div>
          <div>
            <dt className="font-semibold text-cu-ink">Implementation</dt>
            <dd className="mt-1 leading-6 text-cu-muted">{card.implementation}</dd>
          </div>
        </dl>
      </section>
    </article>
  );
}

export function OddsDesignerDashboardCardsDocumentation({ cardId }: { cardId?: OddsDesignerDashboardCardId }) {
  const selectedCard = cardId ? cardDocs.find((card) => card.id === cardId) : null;
  if (selectedCard) return <CardDetailDocumentation card={selectedCard} />;

  return (
    <article className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cu-muted">Design System / ODDS / Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-cu-ink">ODDS Card Component</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-cu-muted">
          Library guide seluruh card Dashboard Designer ODDS. Buka item card di bawah menu ini untuk melihat playground dan detail per card, termasuk card yang sedang tidak dirender di runtime.
        </p>
      </header>

      <section className="rounded-2xl border border-cu-line bg-white p-5">
        <h2 className="text-lg font-semibold text-cu-ink">Card List</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {cardDocs.map((card) => (
            <a key={card.id} href={`?section=components/odds-designer-dashboard-cards-${card.id}`} className="rounded-xl border border-cu-line p-4 transition hover:border-[#00A4FF] hover:bg-[#F3FAFF]">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-cu-ink">{card.name}</p>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${card.runtime === "rendered" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  {card.runtime}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-cu-muted">{card.usage}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-cu-line bg-white p-5">
        <h2 className="text-lg font-semibold text-cu-ink">Implementation Contract</h2>
        <p className="mt-3 text-sm leading-6 text-cu-muted">
          Source render utama berada di <code>apps/frontend/src/app/odds/page.tsx</code>. Title halaman memakai komponen global <code>HeaderTitle</code> dengan alignment kiri.
        </p>
      </section>
    </article>
  );
}
