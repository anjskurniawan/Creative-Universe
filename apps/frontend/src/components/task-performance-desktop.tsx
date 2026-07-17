"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MaterialIcon } from "@/components/material-icon";
import { kvRetailApi } from "@/features/kv-retail/api";
import type { TaskPerformanceTask } from "./task-performance-mobile";

const BOTTLENECK_STAGES = ["ACC Draft", "Progress Design", "Approval Design"] as const;

function toDate(value?: string | null) {
  if (!value) return null;
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2})$/);
  if (match) return new Date(+match[3], +match[2] - 1, +match[1], +match[4], +match[5]);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isInMonth(task: TaskPerformanceTask, month: Date) {
  const date = toDate(task.task_given_date);
  return Boolean(date && date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear());
}

function isLate(task: TaskPerformanceTask) { return Boolean(task.timing_evaluation?.violations?.["Kirim Email"]?.late); }
function isBottleneck(task: TaskPerformanceTask) { return BOTTLENECK_STAGES.some((stage) => task.timing_evaluation?.violations?.[stage]?.late); }
function isTimely(task: TaskPerformanceTask) { return task.status === "Done" && !isLate(task); }
function percent(value: number, total: number) { return total ? Math.round((value / total) * 1000) / 10 : 0; }

function PerformanceNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  return <span data-performance-count data-value={value} data-decimals={decimals}>{new Intl.NumberFormat("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value)}</span>;
}

function MetricCard({ icon, label, value, comparison, tone, decimals = 0 }: { icon: string; label: string; value: number; comparison: string; tone: "violet" | "green" | "rose" | "amber"; decimals?: number }) {
  const tones = {
    violet: "bg-[#f0edff] text-[#7058e8]", green: "bg-[#eaf8ed] text-[#269a4a]", rose: "bg-[#fff0f3] text-[#d94a73]", amber: "bg-[#fff6e8] text-[#d87b18]",
  };
  return <article className="rounded-2xl border border-[#edf0f4] bg-white p-5 shadow-[0_8px_30px_rgba(40,50,72,0.04)]"><div className="flex items-start justify-between gap-4"><span className={["flex size-10 items-center justify-center rounded-xl", tones[tone]].join(" ")}><MaterialIcon name={icon} size="auto" className="text-xl" /></span><span className="text-xs text-[#8a929f]">{comparison}</span></div><p className="mt-5 text-sm font-medium text-[#667085]">{label}</p><b className="mt-1 block text-[32px] font-semibold leading-none tracking-[-1px] text-[#20242c]"><PerformanceNumber value={value} decimals={decimals} /></b></article>;
}

function BottleneckMetricCard({ total, percentage, tasks, isOpen, onToggle }: { total: number; percentage: number; tasks: TaskPerformanceTask[]; isOpen: boolean; onToggle: () => void }) {
  return <article className="relative rounded-2xl border border-[#edf0f4] bg-white p-5 shadow-[0_8px_30px_rgba(40,50,72,0.04)]"><div className="flex items-start justify-between gap-4"><span className="flex size-10 items-center justify-center rounded-xl bg-[#fff5e8] text-[#d87b18]"><MaterialIcon name="warning_amber" size="auto" className="text-xl" /></span><span className="text-xs text-[#8a929f]"><PerformanceNumber value={percentage} />% dari total</span></div><p className="mt-5 text-sm font-medium text-[#667085]">Bottleneck</p><div className="mt-1 flex items-end justify-between gap-3"><b className="text-[32px] font-semibold leading-none tracking-[-1px] text-[#20242c]"><PerformanceNumber value={total} /></b><button type="button" aria-expanded={isOpen} onClick={onToggle} className="inline-flex items-center gap-1 rounded-lg bg-[#fff6e9] px-2.5 py-1.5 text-xs font-semibold text-[#c97518] hover:bg-[#ffedd2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e69b3b]">Detail<MaterialIcon name={isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"} size="auto" className="text-base" /></button></div>{isOpen && <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-full min-w-[300px] rounded-2xl border border-[#f0dfc8] bg-white p-3 shadow-[0_14px_35px_rgba(48,39,25,0.14)]"><p className="px-1 pb-2 text-xs font-semibold text-[#454b55]">Daftar task bottleneck</p><div className="max-h-56 space-y-1 overflow-y-auto">{tasks.length ? tasks.map((task) => { const stages = BOTTLENECK_STAGES.filter((stage) => task.timing_evaluation?.violations?.[stage]?.late); return <div key={task.id} className="rounded-xl bg-[#fffaf4] px-3 py-2"><p className="truncate text-xs font-semibold text-[#454b55]">{task.task_name || `Task #${task.id}`}</p><p className="mt-1 text-[11px] text-[#9a6a31]">{stages.join(" • ")}</p></div>; }) : <p className="px-1 py-3 text-xs text-[#8a929f]">Tidak ada bottleneck bulan ini.</p>}</div></div>}</article>;
}

function AiReportContent({ content }: { content: string }) {
  const normalizedContent = content
    .replace(/^\*\*(Laporan[^*]+)\*\*$/gm, "# $1")
    .replace(/^\*\*(Ringkasan|Temuan|Prioritas|Rekomendasi)\*\*$/gm, "## $1");

  return <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      h1: ({ children }) => <h3 className="mb-5 text-lg font-semibold tracking-[-0.2px] text-[#272040]">{children}</h3>,
      h2: ({ children }) => <h4 className="mt-5 border-t border-[#eceafd] pt-4 text-sm font-semibold text-[#5f4cc4] first:mt-0 first:border-0 first:pt-0">{children}</h4>,
      p: ({ children }) => <p className="mt-2 text-sm leading-6 text-[#525b6a]">{children}</p>,
      ul: ({ children }) => <ul className="mt-2 space-y-1.5 pl-5 text-sm leading-6 text-[#525b6a] marker:text-[#765ee8]">{children}</ul>,
      ol: ({ children }) => <ol className="mt-2 space-y-1.5 pl-5 text-sm leading-6 text-[#525b6a] marker:font-semibold marker:text-[#765ee8]">{children}</ol>,
      li: ({ children }) => <li className="pl-1">{children}</li>,
      strong: ({ children }) => <strong className="font-semibold text-[#2e3440]">{children}</strong>,
    }}
  >
    {normalizedContent}
  </ReactMarkdown>;
}

export function TaskPerformanceDesktop({ tasks, showToolbar = true }: { tasks: TaskPerformanceTask[]; showToolbar?: boolean }) {
  const dashboardRef = useRef<HTMLElement>(null);
  const [isBottleneckDetailOpen, setIsBottleneckDetailOpen] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const current = tasks.filter((task) => isInMonth(task, currentMonth));
  const previous = tasks.filter((task) => isInMonth(task, previousMonth));
  const timely = current.filter(isTimely).length;
  const previousTimely = previous.filter(isTimely).length;
  const late = current.filter(isLate).length;
  const previousLate = previous.filter(isLate).length;
  const bottleneck = current.filter(isBottleneck).length;
  const bottleneckTasks = current.filter(isBottleneck);
  const inProgress = current.filter((task) => task.status !== "0" && task.status !== "Done").length;
  const averageDuration = (items: TaskPerformanceTask[]) => {
    const durations = items.flatMap((task) => {
      const start = toDate(task.task_given_date); const end = toDate(task.task_timestamps?.Email);
      return task.status === "Done" && start && end ? [(end.getTime() - start.getTime()) / 86_400_000] : [];
    });
    return durations.length ? durations.reduce((sum, days) => sum + days, 0) / durations.length : 0;
  };
  const average = averageDuration(current);
  const previousAverage = averageDuration(previous);
  const bottleneckByStage = BOTTLENECK_STAGES.map((stage) => ({ label: stage, total: current.filter((task) => Boolean(task.timing_evaluation?.violations?.[stage]?.late)).length }));
  const timelyPercent = percent(timely, current.length);
  const latePercent = percent(late, current.length);
  const bottleneckPercent = percent(bottleneck, current.length);
  const completed = tasks.filter((task) => task.status === "Done").length;
  const comparisonRows = [
    { label: "Tepat waktu", current: timely, previous: previousTimely },
    { label: "Terlambat", current: late, previous: previousLate },
    { label: "Bottleneck", current: bottleneck, previous: previous.filter(isBottleneck).length },
  ];
  const comparisonMax = Math.max(1, ...comparisonRows.flatMap((item) => [item.current, item.previous]));
  const animationKey = [tasks.length, timely, late, bottleneck, average, previousTimely, previousLate, previousAverage].join(":");

  useEffect(() => {
    const dashboard = dashboardRef.current;
    if (!dashboard || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power2.out", overwrite: "auto" } });
      const counters = Array.from(dashboard.querySelectorAll<HTMLElement>("[data-performance-count]"));
      counters.forEach((counter, index) => {
        const target = Number(counter.dataset.value ?? 0); const decimals = Number(counter.dataset.decimals ?? 0); const value = { current: 0 };
        counter.textContent = new Intl.NumberFormat("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(0);
        timeline.to(value, { current: target, duration: 0.55, onUpdate: () => { counter.textContent = new Intl.NumberFormat("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value.current); } }, index * 0.045);
      });
    }, dashboard);
    return () => context.revert();
  }, [animationKey]);

  useEffect(() => {
    let isMounted = true;
    const loadLatestCreativeAgent = async () => {
      try {
        const report = await kvRetailApi.tasks.latestPerformanceAiReport();
        if (isMounted && report?.content) {
          setAiReport(report.content);
        }
      } catch (error) {
        console.error("Gagal memuat Creative Agent terbaru:", error);
      }
    };

    void loadLatestCreativeAgent();
    const intervalId = window.setInterval(() => void loadLatestCreativeAgent(), 15_000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return <section ref={dashboardRef} className="mt-8 space-y-5 pb-12" aria-label="Rekap performa desktop">
    {showToolbar && <div className="flex items-center justify-end gap-3"><button type="button" className="flex h-11 items-center gap-2 rounded-xl border border-[#e2e6e9] bg-white px-4 text-sm font-medium text-[#3b4446]"><MaterialIcon name="calendar_month" size="auto" className="text-xl" />Bulan Ini<MaterialIcon name="keyboard_arrow_down" size="auto" className="text-xl" /></button><button type="button" className="flex h-11 items-center gap-2 rounded-xl bg-[#6d46eb] px-4 text-sm font-semibold text-white shadow-sm"><MaterialIcon name="download" size="auto" className="text-xl" />Export Report</button></div>}

    <article className="overflow-hidden rounded-3xl border border-[#e9e6ff] bg-[linear-gradient(120deg,#f7f5ff_0%,#fbfbff_55%,#f3f8ff_100%)] px-7 py-6"><div className="flex items-center justify-between gap-6"><div><p className="text-sm font-semibold text-[#715ddb]">Ringkasan bulan ini</p><h2 className="mt-1 text-2xl font-semibold tracking-[-0.5px] text-[#252535]">Performa tim KV Retail</h2><p className="mt-2 text-sm text-[#707787]">Pantau penyelesaian tugas dan proses yang perlu perhatian.</p></div><div className="flex items-center gap-3"><div className="rounded-2xl bg-white/90 px-4 py-3 shadow-sm"><p className="text-xs text-[#7c8490]">Total task</p><b className="mt-1 block text-xl text-[#252535]"><PerformanceNumber value={current.length} /></b></div><div className="rounded-2xl bg-white/90 px-4 py-3 shadow-sm"><p className="text-xs text-[#7c8490]">Sedang berjalan</p><b className="mt-1 block text-xl text-[#252535]"><PerformanceNumber value={inProgress} /></b></div></div></div></article>

    <div className="grid grid-cols-[minmax(0,3fr)_minmax(300px,1fr)] items-start gap-5"><div className="min-w-0 space-y-5"><div className="grid grid-cols-4 gap-4"><MetricCard icon="task_alt" tone="green" label="Selesai tepat waktu" value={timely} comparison={`${previousTimely} bulan lalu`} /><MetricCard icon="timer_off" tone="rose" label="Terlambat" value={late} comparison={`${previousLate} bulan lalu`} /><BottleneckMetricCard total={bottleneck} percentage={bottleneckPercent} tasks={bottleneckTasks} isOpen={isBottleneckDetailOpen} onToggle={() => setIsBottleneckDetailOpen((open) => !open)} /><MetricCard icon="schedule" tone="violet" label="Rata-rata selesai" value={average} decimals={1} comparison={`${previousAverage.toFixed(1)} hari bulan lalu`} /></div>

    <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(390px,0.95fr)] gap-5"><article className="min-h-[330px] rounded-3xl border border-[#edf0f4] bg-white p-6 shadow-[0_8px_30px_rgba(40,50,72,0.04)]"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-[#252535]">Diagram performa</p><p className="mt-1 text-xs text-[#858d9b]">Bulan ini dibanding bulan sebelumnya</p></div><div className="flex gap-3 text-xs text-[#747d8b]"><span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-[#6d58df]" />Bulan ini</span><span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-[#d7dbe4]" />Bulan lalu</span></div></div><div className="mt-6 grid h-36 grid-cols-3 gap-6 border-b border-[#edf0f4] px-5">{comparisonRows.map((item) => <div key={item.label} className="flex min-w-0 items-end justify-center gap-3"><div className="flex h-full flex-1 flex-col justify-end"><span className="mb-2 text-center text-xs font-semibold text-[#424a57]"><PerformanceNumber value={item.current} /></span><div className="w-full rounded-t-xl bg-[#6d58df]" style={{ height: `${Math.max(8, (item.current / comparisonMax) * 100)}px` }} /></div><div className="flex h-full flex-1 flex-col justify-end"><span className="mb-2 text-center text-xs font-medium text-[#9aa2af]"><PerformanceNumber value={item.previous} /></span><div className="w-full rounded-t-xl bg-[#d7dbe4]" style={{ height: `${Math.max(8, (item.previous / comparisonMax) * 100)}px` }} /></div></div>)}</div><div className="mt-3 grid grid-cols-3 gap-6 px-5 text-center text-xs font-medium text-[#667085]">{comparisonRows.map((item) => <span key={item.label}>{item.label}</span>)}</div></article>

      <article className="flex min-h-[330px] flex-col rounded-3xl border border-[#edf0f4] bg-white p-6 shadow-[0_8px_30px_rgba(40,50,72,0.04)]"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-[#252535]">Distribusi task</p><p className="mt-1 text-xs text-[#858d9b]">Status keseluruhan bulan ini</p></div><span className="text-2xl font-semibold tracking-[-1px] text-[#252535]"><PerformanceNumber value={current.length} /></span></div><div className="mt-5 flex flex-1 items-center gap-7"><div className="relative size-36 shrink-0 rounded-full" style={{ "--timely": timelyPercent, "--late": latePercent, background: "conic-gradient(#49b955 0 calc(var(--timely) * 1%), #dc5d81 calc(var(--timely) * 1%) calc((var(--timely) + var(--late)) * 1%), #e69b3b calc((var(--timely) + var(--late)) * 1%) 100%)" } as CSSProperties}><div className="absolute inset-6 flex flex-col items-center justify-center rounded-full bg-white"><b className="text-xl text-[#252535]"><PerformanceNumber value={current.length} /></b><span className="text-[10px] text-[#8b93a0]">total task</span></div></div><div className="min-w-0 flex-1 space-y-3 text-xs text-[#646d7b]"><p className="flex items-center gap-2"><i className="size-2 rounded-full bg-[#49b955]" />Tepat waktu <b className="ml-auto text-[#252535]"><PerformanceNumber value={timely} /> <span className="font-normal text-[#9ba2ad]">(<PerformanceNumber value={timelyPercent} />%)</span></b></p><p className="flex items-center gap-2"><i className="size-2 rounded-full bg-[#dc5d81]" />Terlambat <b className="ml-auto text-[#252535]"><PerformanceNumber value={late} /> <span className="font-normal text-[#9ba2ad]">(<PerformanceNumber value={latePercent} />%)</span></b></p><p className="flex items-center gap-2"><i className="size-2 rounded-full bg-[#e69b3b]" />Bottleneck <b className="ml-auto text-[#252535]"><PerformanceNumber value={bottleneck} /> <span className="font-normal text-[#9ba2ad]">(<PerformanceNumber value={bottleneckPercent} />%)</span></b></p></div></div></article></div>

    <article className="rounded-3xl border border-[#edf0f4] bg-white p-6 shadow-[0_8px_30px_rgba(40,50,72,0.04)]"><div className="flex items-start justify-between gap-6"><div><p className="text-sm font-semibold text-[#252535]">Proses yang perlu perhatian</p><p className="mt-1 text-xs text-[#858d9b]">Total bottleneck pada tiap tahap proses.</p></div><div className="rounded-xl bg-[#fff6e8] px-3 py-2 text-right"><b className="block text-lg leading-none text-[#c97719]"><PerformanceNumber value={bottleneck} /></b><span className="text-[11px] text-[#a66a29]">task terdampak</span></div></div><div className="mt-5 grid grid-cols-3 gap-4 border-t border-[#f0f1f4] pt-5">{bottleneckByStage.map((stage) => <div key={stage.label} className="rounded-2xl border border-[#f1f2f5] bg-[#fcfcfe] px-5 py-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-[#596273]">{stage.label}</p><span className="size-2 rounded-full bg-[#e69b3b]" /></div><b className="mt-4 block text-[28px] leading-none tracking-[-0.75px] text-[#262a33]"><PerformanceNumber value={stage.total} /></b><span className="mt-1 block text-xs text-[#969eaa]">task bottleneck</span></div>)}</div><div className="mt-5 flex items-center gap-4"><div className="h-2 flex-1 overflow-hidden rounded-full bg-[#f1f2f5]"><div className="h-full rounded-full bg-[#e69b3b]" style={{ width: `${bottleneckPercent}%` }} /></div><p className="shrink-0 text-xs text-[#737d8d]"><PerformanceNumber value={bottleneck} /> dari <PerformanceNumber value={current.length} /> task</p></div></article>

    <p className="text-right text-xs text-[#98a0ac]">Total penyelesaian seluruh periode: <PerformanceNumber value={completed} /> task</p></div><aside className="sticky top-6 rounded-3xl border border-[#e2ddff] bg-[linear-gradient(180deg,#faf9ff_0%,#ffffff_100%)] p-5 shadow-[0_8px_30px_rgba(61,50,112,0.06)]"><div className="flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded-xl bg-[#eeeaff] text-[#6d58df]"><MaterialIcon name="auto_awesome" size="auto" className="text-lg" /></span><div><p className="text-sm font-semibold text-[#3c356c]">Creative Agent</p><p className="text-[11px] text-[#8c85ad]">Saran task bulan ini</p></div></div>{aiReport ? <div className="mt-5 border-t border-[#e8e5f6] pt-4"><AiReportContent content={aiReport} /></div> : <p className="mt-5 text-xs leading-5 text-[#7c8490]">Saran akan diperbarui otomatis saat data task KV Retail berubah.</p>}</aside></div>
  </section>;
}
