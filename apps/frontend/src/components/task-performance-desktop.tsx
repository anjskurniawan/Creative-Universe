"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { MaterialIcon } from "@/components/material-icon";
import type { TaskPerformanceTask } from "./task-performance-mobile";

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
function isBottleneck(task: TaskPerformanceTask) { return ["ACC Draft", "Progress Design", "Approval Design"].some((stage) => task.timing_evaluation?.violations?.[stage]?.late); }
function isTimely(task: TaskPerformanceTask) { return task.status === "Done" && !isLate(task); }
function averageDuration(tasks: TaskPerformanceTask[]) {
  const values = tasks.flatMap((task) => { const start = toDate(task.task_given_date); const end = toDate(task.task_timestamps?.Email); return task.status === "Done" && start && end ? [(end.getTime() - start.getTime()) / 86_400_000] : []; });
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function percent(value: number, total: number) { return total ? Math.round((value / total) * 1000) / 10 : 0; }

function PerformanceNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  return <span data-performance-count data-value={value} data-decimals={decimals}>{new Intl.NumberFormat("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value)}</span>;
}

function KpiCard({ icon, tone, label, current, previous, suffix = "" }: { icon: string; tone: string; label: string; current: number; previous: number; suffix?: string }) {
  const decimals = suffix ? 1 : 0;
  return <article className="rounded-2xl border border-[#edf0f3] bg-white p-5 shadow-[0_2px_10px_rgba(59,68,70,0.06)]"><div className="flex items-center gap-4"><span className={["flex size-16 shrink-0 items-center justify-center rounded-2xl", tone].join(" ")}><MaterialIcon name={icon} size="auto" className="text-3xl" /></span><div><p className="text-sm font-medium text-[#525e61]">{label}</p><div className="mt-1 flex items-end gap-2"><b className="text-3xl leading-none text-[#222]"><PerformanceNumber value={current} decimals={decimals} />{suffix}</b></div><p className="mt-2 text-xs text-[#7b868a]">vs. bulan lalu <PerformanceNumber value={previous} decimals={decimals} />{suffix}</p></div></div></article>;
}

export function TaskPerformanceDesktop({ tasks, showToolbar = true }: { tasks: TaskPerformanceTask[]; showToolbar?: boolean }) {
  const dashboardRef = useRef<HTMLElement>(null);
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const current = tasks.filter((task) => isInMonth(task, currentMonth));
  const previous = tasks.filter((task) => isInMonth(task, previousMonth));
  const timely = current.filter(isTimely).length; const previousTimely = previous.filter(isTimely).length;
  const late = current.filter(isLate).length; const previousLate = previous.filter(isLate).length;
  const bottleneck = current.filter(isBottleneck).length;
  const average = averageDuration(current); const previousAverage = averageDuration(previous);
  const inProgress = current.filter((task) => task.status !== "0" && task.status !== "Done").length;
  const metrics = [
    { label: "Selesai Tepat Waktu", current: timely, previous: previousTimely },
    { label: "Telat / Overlate", current: late, previous: previousLate },
    { label: "Rata-rata Waktu", current: average, previous: previousAverage },
    { label: "Total Tugas", current: current.length, previous: previous.length },
  ];
  const max = Math.max(1, ...metrics.flatMap((metric) => [metric.current, metric.previous]));
  const timelyPercent = percent(timely, current.length); const latePercent = percent(late, current.length); const bottleneckPercent = percent(bottleneck, current.length);
  const lateEnd = Math.min(100, timelyPercent + latePercent);
  const animationKey = [timely, previousTimely, late, previousLate, average, previousAverage, current.length, previous.length, inProgress, bottleneck, bottleneckPercent, timelyPercent, latePercent, lateEnd, tasks.length].join(":");

  useEffect(() => {
    const dashboard = dashboardRef.current;
    if (!dashboard || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power2.out", overwrite: "auto" } });
      const counters = Array.from(dashboard.querySelectorAll<HTMLElement>("[data-performance-count]"));
      const bars = dashboard.querySelectorAll<HTMLElement>("[data-performance-bar]");
      const donut = dashboard.querySelector<HTMLElement>("[data-performance-donut]");

      counters.forEach((counter, index) => {
        const target = Number(counter.dataset.value ?? 0);
        const decimals = Number(counter.dataset.decimals ?? 0);
        const value = { current: 0 };
        counter.textContent = new Intl.NumberFormat("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(0);
        timeline.to(value, {
          current: target,
          duration: 0.72,
          onUpdate: () => {
            counter.textContent = new Intl.NumberFormat("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value.current);
          },
        }, 0.08 + index * 0.035);
      });

      timeline.from(bars, {
        autoAlpha: 0,
        scaleY: 0,
        transformOrigin: "bottom center",
        duration: 0.66,
        stagger: 0.07,
      }, 0.18);

      if (donut) {
        timeline.fromTo(donut, {
          "--timely": 0,
          "--late-end": 0,
        }, {
          "--timely": timelyPercent,
          "--late-end": lateEnd,
          duration: 0.9,
          ease: "power2.out",
        }, 0.26);
      }
    }, dashboard);

    return () => context.revert();
  }, [animationKey, lateEnd, timelyPercent]);

  return <section ref={dashboardRef} className="mt-8 space-y-5 pb-12" aria-label="Rekap performa desktop">
    {showToolbar && <div className="flex items-center justify-end gap-3"><button type="button" className="flex h-11 items-center gap-2 rounded-xl border border-[#e2e6e9] bg-white px-4 text-sm font-medium text-[#3b4446]"><MaterialIcon name="calendar_month" size="auto" className="text-xl" />Bulan Ini<MaterialIcon name="keyboard_arrow_down" size="auto" className="text-xl" /></button><button type="button" className="flex h-11 items-center gap-2 rounded-xl bg-[#6d46eb] px-4 text-sm font-semibold text-white shadow-sm"><MaterialIcon name="download" size="auto" className="text-xl" />Export Report</button></div>}
    <div className="grid grid-cols-4 gap-4"><KpiCard icon="task_alt" tone="bg-[#e8f7ea] text-[#34a853]" label="Tugas Selesai Tepat Waktu" current={timely} previous={previousTimely} /><KpiCard icon="timer_off" tone="bg-[#ffedef] text-[#f05b66]" label="Tugas Telat / Overlate" current={late} previous={previousLate} /><KpiCard icon="schedule" tone="bg-[#eeeaff] text-[#7b5bf2]" label="Rata-rata Waktu Penyelesaian" current={average} previous={previousAverage} suffix=" hari" /><KpiCard icon="assignment" tone="bg-[#f0ebff] text-[#7855ee]" label="Total Tugas Bulan Ini" current={current.length} previous={previous.length} /></div>
    <article className="grid grid-cols-3 divide-x divide-[#edf0f3] rounded-2xl border border-[#edf0f3] bg-white p-5 shadow-[0_2px_10px_rgba(59,68,70,0.06)]"><div className="flex items-center gap-4"><span className="flex size-20 items-center justify-center rounded-full border-[9px] border-[#49b955] text-[#49b955]"><MaterialIcon name="task_alt" size="auto" className="text-3xl" /></span><div><p className="text-sm font-medium text-[#525e61]">Selesai</p><b className="text-3xl text-[#36a546]"><PerformanceNumber value={percent(tasks.filter((task) => task.status === "Done").length, tasks.length)} />%</b><p className="text-xs text-[#7b868a]"><PerformanceNumber value={tasks.filter((task) => task.status === "Done").length} /> dari <PerformanceNumber value={tasks.length} /> tugas</p></div></div><div className="flex items-center gap-4 pl-7"><span className="flex size-20 items-center justify-center rounded-full bg-[#fff5e8] text-[#f18728]"><MaterialIcon name="hourglass_bottom" size="auto" className="text-3xl" /></span><div><p className="text-sm font-medium text-[#525e61]">In Progress</p><b className="text-3xl text-[#f18728]"><PerformanceNumber value={percent(inProgress, current.length)} />%</b><p className="text-xs text-[#7b868a]"><PerformanceNumber value={inProgress} /> dari <PerformanceNumber value={current.length} /> tugas</p></div></div><div className="flex items-center gap-4 pl-7"><span className="flex size-20 items-center justify-center rounded-full bg-[#ffedf1] text-[#ea4c89]"><MaterialIcon name="warning" size="auto" className="text-3xl" /></span><div><p className="text-sm font-medium text-[#525e61]">Bottleneck</p><b className="text-3xl text-[#ea4c89]"><PerformanceNumber value={bottleneckPercent} />%</b><p className="text-xs text-[#7b868a]"><PerformanceNumber value={bottleneck} /> dari <PerformanceNumber value={current.length} /> tugas</p></div></div></article>
    <div className="grid grid-cols-2 gap-5"><article className="rounded-2xl border border-[#edf0f3] bg-white p-5 shadow-[0_2px_10px_rgba(59,68,70,0.06)]"><h2 className="text-base font-semibold text-[#222]">Performa Bulan Ini vs Bulan Sebelumnya</h2><div className="mt-3 flex gap-4 text-xs text-[#7b868a]"><span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-[#6d46eb]" />Bulan Ini</span><span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-[#d9d3ff]" />Bulan Lalu</span></div><div className="mt-5 flex h-56 items-end gap-7 border-b border-l border-[#edf0f3] px-6">{metrics.map((metric) => <div key={metric.label} className="flex h-full flex-1 items-end justify-center gap-2"><div data-performance-bar className="w-8 rounded-t-md bg-[#6d46eb]" style={{ height: `${Math.max(8, Math.round((metric.current / max) * 190))}px` }} /><div data-performance-bar className="w-8 rounded-t-md bg-[#d9d3ff]" style={{ height: `${Math.max(8, Math.round((metric.previous / max) * 190))}px` }} /></div>)}</div><div className="mt-3 grid grid-cols-4 gap-3 text-center text-xs text-[#525e61]">{metrics.map((metric) => <span key={metric.label}>{metric.label}</span>)}</div></article><article className="rounded-2xl border border-[#edf0f3] bg-white p-5 shadow-[0_2px_10px_rgba(59,68,70,0.06)]"><h2 className="text-base font-semibold text-[#222]">Distribusi Performa Tugas</h2><div className="mt-6 flex items-center gap-8"><div data-performance-donut className="relative size-48 shrink-0 rounded-full" style={{ "--timely": timelyPercent, "--late-end": lateEnd, background: "conic-gradient(#49b955 0 calc(var(--timely) * 1%), #f18728 calc(var(--timely) * 1%) calc(var(--late-end) * 1%), #ea4c89 calc(var(--late-end) * 1%) 100%)" } as CSSProperties}><div className="absolute inset-9 flex flex-col items-center justify-center rounded-full bg-white"><span className="text-sm text-[#7b868a]">Total</span><b className="text-3xl text-[#222]"><PerformanceNumber value={current.length} /></b><span className="text-xs text-[#7b868a]">Tugas</span></div></div><div className="flex flex-1 flex-col gap-5 text-sm text-[#525e61]"><p className="flex justify-between gap-4"><span><i className="mr-2 inline-block size-2 rounded-full bg-[#49b955]" />Selesai Tepat Waktu</span><b><PerformanceNumber value={timely} /> (<PerformanceNumber value={timelyPercent} />%)</b></p><p className="flex justify-between gap-4"><span><i className="mr-2 inline-block size-2 rounded-full bg-[#f18728]" />Telat / Overlate</span><b><PerformanceNumber value={late} /> (<PerformanceNumber value={latePercent} />%)</b></p><p className="flex justify-between gap-4"><span><i className="mr-2 inline-block size-2 rounded-full bg-[#ea4c89]" />Bottleneck</span><b><PerformanceNumber value={bottleneck} /> (<PerformanceNumber value={bottleneckPercent} />%)</b></p></div></div></article></div>
  </section>;
}
