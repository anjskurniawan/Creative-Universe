import { useEffect, useRef, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";

type Comparison = { label: string; current: number; previous: number };
type Stage = { label: string; total: number };
type PriorityAction = { id: number; title: string; reason: string; deadline: string; givenAt: string; emailAt: string; status: string; icon: string };

function formatPriorityDate(value: string) {
  if (!value || ["Tanpa deadline", "Tidak tercatat", "Belum dikirim"].includes(value)) return value;
  const localMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s(\d{2}):(\d{2}))?$/);
  const date = localMatch
    ? new Date(+localMatch[3], +localMatch[2] - 1, +localMatch[1], +(localMatch[4] || 0), +(localMatch[5] || 0))
    : new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(date);
}

type PerformanceChartIndicatorsProps = {
  total: number;
  timely: number;
  late: number;
  bottleneck: number;
  completed: number;
  inProgress: number;
  comparisons: Comparison[];
  stages: Stage[];
  priorities: PriorityAction[];
  theme: "dark" | "light" | "retro";
};

function PriorityActionsCard({ priorities, panel, heading, muted, surface, accentColor, selectedId, onSelect }: { priorities: PriorityAction[]; panel: string; heading: string; muted: string; surface: string; accentColor: string; selectedId: number | null; onSelect: (id: number) => void }) {
  const cardRef = useRef<HTMLElement>(null);
  const [detailLevel, setDetailLevel] = useState<"none" | "basic" | "full">("none");

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const updateDensity = () => setDetailLevel(card.clientHeight >= 250 ? "full" : card.clientHeight >= 145 ? "basic" : "none");
    updateDensity();
    const observer = new ResizeObserver(updateDensity);
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return <article ref={cardRef} className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl p-4 ${panel}`}>
    <div className="flex items-center justify-between"><div><h2 className={`text-sm font-medium ${heading}`}>Prioritas tindakan</h2><p className={`mt-1 text-xs ${muted}`}>Task yang perlu ditindaklanjuti lebih dulu.</p></div><MaterialIcon name="priority_high" size="auto" className="text-2xl" style={{ color: accentColor }} /></div>
    <div className="mt-4 grid min-h-0 flex-1 grid-cols-3 gap-3 overflow-hidden">{priorities.length ? priorities.map((task, index) => <button type="button" key={task.id} onClick={() => onSelect(task.id)} aria-pressed={selectedId === task.id} className={`flex min-w-0 items-start gap-3 overflow-hidden rounded-lg p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 ${surface} ${selectedId === task.id ? "ring-2" : "hover:brightness-95"}`} style={selectedId === task.id ? { boxShadow: `inset 0 0 0 2px ${accentColor}` } : undefined}><span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium text-[#181818]" style={{ backgroundColor: accentColor }}>{index + 1}</span><div className="min-w-0 overflow-hidden"><p className={`truncate text-xs font-medium ${heading}`}>{task.title}</p>{detailLevel !== "none" || selectedId === task.id ? <div className={`mt-1.5 space-y-1 text-[10px] ${muted}`}><p className="flex items-center gap-1"><MaterialIcon name={task.icon} size="auto" className="text-sm" />{task.reason}</p><p className="flex items-center gap-1"><MaterialIcon name="assignment" size="auto" className="text-sm" />{task.status}</p><p className="flex items-center gap-1"><MaterialIcon name="calendar_month" size="auto" className="text-sm" />Deadline: {formatPriorityDate(task.deadline)}</p>{detailLevel === "full" ? <><p className="flex items-center gap-1"><MaterialIcon name="event" size="auto" className="text-sm" />Diberikan: {formatPriorityDate(task.givenAt)}</p><p className="flex items-center gap-1"><MaterialIcon name="mail" size="auto" className="text-sm" />Email: {formatPriorityDate(task.emailAt)}</p></> : null}</div> : null}</div></button>) : <p className={`col-span-3 flex items-center rounded-lg p-3 text-xs ${muted} ${surface}`}>Belum ada task yang memerlukan tindakan khusus.</p>}</div>
  </article>;
}

/** Three compact indicators with a full-width bottleneck detail panel underneath. */
export function PerformanceChartIndicators({ total, timely, late, bottleneck, completed, inProgress, comparisons, stages, priorities, theme }: PerformanceChartIndicatorsProps) {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<number | null>(null);
  const [selectedComparison, setSelectedComparison] = useState<string | null>(null);
  const light = theme !== "dark";
  const retro = theme === "retro";
  const panel = retro ? "border-2 border-[#24252b] bg-[#eceee6] shadow-[inset_0_0_0_2px_#c9ccc0]" : light ? "border border-white/80 bg-white/90 shadow-[0_5px_14px_rgba(44,42,39,0.06)]" : "border border-white/[0.05] bg-[#171717] shadow-[0_5px_14px_rgba(0,0,0,0.24)]";
  const heading = light ? "text-[#181818]" : "text-white";
  const muted = retro ? "text-[#555850]" : light ? "text-[#806272]" : "text-[#b9b9b9]";
  const previousBar = retro ? "bg-[#b5b9ad]" : light ? "bg-[#c9eaff]" : "bg-[#535353]";
  const surface = retro ? "border border-[#24252b] bg-[#dfe2d3]" : light ? "bg-[#f3faff]" : "bg-[#0e0e0e]";
  const max = Math.max(1, ...comparisons.flatMap((item) => [item.current, item.previous]));
  const timelyPercent = total ? (timely / total) * 100 : 0;
  const latePercent = total ? (late / total) * 100 : 0;
  const completePercent = total ? (completed / total) * 100 : 0;
  const accentColor = retro ? "#ba0dcb" : light ? "#00a4ff" : "#b0ff5e";
  const bottleneckColor = accentColor;

  return (
    <section className="flex h-full min-h-0 flex-col gap-4" aria-label="Indikator grafik performa">
      <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_220px_280px] items-start gap-4">
        <article className={`h-[220px] rounded-2xl p-4 ${panel}`}>
          <div className="flex items-start justify-between gap-3"><div><h2 className={`text-sm font-medium ${heading}`}>Diagram performa</h2><p className={`mt-1 text-xs ${muted}`}>Bulan ini vs bulan lalu</p></div><MaterialIcon name="bar_chart" size="auto" className="text-2xl" style={{ color: accentColor }} /></div>
          <div className="mt-6 grid h-28 gap-3 border-b border-white/10 pb-0" style={{ gridTemplateColumns: `repeat(${comparisons.length}, minmax(0, 1fr))` }}>{comparisons.map((item) => <button type="button" key={item.label} onClick={() => setSelectedComparison((current) => current === item.label ? null : item.label)} aria-pressed={selectedComparison === item.label} className={`flex items-end justify-center gap-1.5 rounded-t transition focus-visible:outline-none focus-visible:ring-2 ${selectedComparison === item.label ? "bg-black/5" : "hover:bg-black/[0.03]"}`}><div className="flex h-full flex-1 flex-col justify-end"><span className={`mb-1 text-center text-[10px] ${heading}`}>{item.current}</span><i className="w-full rounded-t" style={{ height: `${Math.max(8, item.current / max * 100)}%`, backgroundColor: accentColor }} /></div><div className="flex h-full flex-1 flex-col justify-end"><span className={`mb-1 text-center text-[10px] ${muted}`}>{item.previous}</span><i className={`w-full rounded-t ${previousBar}`} style={{ height: `${Math.max(8, item.previous / max * 100)}%` }} /></div></button>)}</div>
          <div className={`mt-2 grid gap-3 text-center text-[10px] ${muted}`} style={{ gridTemplateColumns: `repeat(${comparisons.length}, minmax(0, 1fr))` }}>{comparisons.map((item) => <span key={item.label}>{selectedComparison === item.label ? `${item.label}: ${item.current} vs ${item.previous}` : item.label}</span>)}</div>
        </article>

        <article className={`flex aspect-square flex-col rounded-2xl p-4 ${panel}`}>
          <div className="flex items-start justify-between"><div><h2 className={`text-sm font-medium ${heading}`}>Penyelesaian task</h2><p className={`mt-1 text-xs ${muted}`}>Progress bulan ini</p></div><MaterialIcon name="task_alt" size="auto" className="text-2xl" style={{ color: accentColor }} /></div>
          <div className="mt-5 flex flex-1 flex-col items-center justify-center"><div className="relative flex size-24 items-center justify-center rounded-full" style={{ background: `conic-gradient(${accentColor} 0 ${completePercent}%, ${retro ? "#dfe2d3" : light ? "#f3faff" : "#0e0e0e"} ${completePercent}% 100%)` }}><div className={`flex size-[68px] flex-col items-center justify-center rounded-full ${retro ? "border border-[#24252b] bg-[#eceee6]" : light ? "bg-white" : "bg-[#171717]"}`}><b className={`text-lg ${heading}`}>{Math.round(completePercent)}%</b><span className={`text-[9px] ${muted}`}>selesai</span></div></div><p className={`mt-3 text-xs ${muted}`}><b className={heading}>{completed}</b> selesai · <b className={heading}>{inProgress}</b> berjalan</p></div>
        </article>

        <article className={`flex h-[220px] flex-col rounded-2xl p-4 ${panel}`}>
          <div><h2 className={`text-sm font-medium ${heading}`}>Distribusi task</h2><p className={`mt-1 text-xs ${muted}`}>Status bulan ini</p></div>
          <div className="mt-4 flex flex-1 items-center justify-center gap-5"><div className="relative flex size-[116px] shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(${accentColor} 0 ${timelyPercent}%, #ff5e5e ${timelyPercent}% ${timelyPercent + latePercent}%, ${bottleneckColor} ${timelyPercent + latePercent}% 100%)` }}><div className={`flex size-[80px] flex-col items-center justify-center rounded-full ${retro ? "border border-[#24252b] bg-[#eceee6]" : light ? "bg-white" : "bg-[#171717]"}`}><b className={`text-2xl font-medium ${heading}`}>{total}</b><span className={`text-[9px] ${muted}`}>total task</span></div></div><div className={`min-w-0 space-y-3 text-xs ${muted}`}><p className="flex items-center gap-2 whitespace-nowrap"><i className="size-2 rounded-full" style={{ backgroundColor: accentColor }} /><span>Tepat waktu</span><b className={`ml-auto ${heading}`}>{timely}</b></p><p className="flex items-center gap-2 whitespace-nowrap"><i className="size-2 rounded-full bg-[#ff5e5e]" /><span>Terlambat</span><b className={`ml-auto ${heading}`}>{late}</b></p><p className="flex items-center gap-2 whitespace-nowrap"><i className="size-2 rounded-full" style={{ backgroundColor: bottleneckColor }} /><span>Bottleneck</span><b className={`ml-auto ${heading}`}>{bottleneck}</b></p></div></div>
        </article>
      </div>

      <article className={`shrink-0 rounded-2xl p-4 ${panel}`}>
        <div className="flex items-center justify-between"><div><h2 className={`text-sm font-medium ${heading}`}>Detail bottleneck</h2><p className={`mt-1 text-xs ${muted}`}>{selectedStage ? `${selectedStage} dipilih. Klik lagi untuk membatalkan pilihan.` : "Pilih tahap untuk menyorot bottleneck proses."}</p></div><MaterialIcon name="warning_amber" size="auto" className="text-2xl" style={{ color: bottleneckColor }} /></div>
        <div className="mt-5 grid grid-cols-3 gap-4">{stages.map((stage) => <button type="button" key={stage.label} onClick={() => setSelectedStage((current) => current === stage.label ? null : stage.label)} aria-pressed={selectedStage === stage.label} className={`rounded-lg p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 ${surface} ${selectedStage === stage.label ? "ring-2" : "hover:brightness-95"}`} style={selectedStage === stage.label ? { boxShadow: `inset 0 0 0 2px ${bottleneckColor}` } : undefined}><div className={`flex justify-between text-xs ${muted}`}><span>{stage.label}</span><b className={heading}>{stage.total} task</b></div><div className={`mt-2 h-1.5 overflow-hidden rounded-full ${retro ? "bg-[#b5b9ad]" : light ? "bg-[#c9eaff]" : "bg-[#171717]"}`}><i className="block h-full rounded-full" style={{ width: `${total ? Math.min(100, stage.total / total * 100) : 0}%`, backgroundColor: bottleneckColor }} /></div></button>)}</div>
      </article>

      <PriorityActionsCard priorities={priorities} panel={panel} heading={heading} muted={muted} surface={surface} accentColor={accentColor} selectedId={selectedPriority} onSelect={(id) => setSelectedPriority((current) => current === id ? null : id)} />
    </section>
  );
}
