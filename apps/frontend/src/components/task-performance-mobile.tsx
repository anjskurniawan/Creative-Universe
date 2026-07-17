"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/material-icon";

export type TaskPerformanceTask = {
  id: number;
  task_name?: string | null;
  status: string;
  task_given_date?: string | null;
  deadline_date?: string | null;
  task_timestamps?: Record<string, string> | null;
  timing_evaluation?: {
    bottleneck?: boolean;
    late?: boolean;
    violations?: Record<string, { late?: boolean }>;
  } | null;
};

type MetricCardProps = {
  title: string;
  value: string;
  detail: string;
  icon: string;
  tone: "green" | "red" | "purple" | "blue" | "pink" | "orange";
};

const toneClass: Record<MetricCardProps["tone"], string> = {
  green: "bg-[#e8f5e9] text-[#2b9915]", red: "bg-[#ffebee] text-[#d32f2f]", purple: "bg-[#eeebff] text-[#8474f9]",
  blue: "bg-[#e8f3ff] text-[#2563eb]", pink: "bg-[#fff0f6] text-[#ea4c89]", orange: "bg-[#fff3e8] text-[#f18728]",
};

function MetricCard({ title, value, detail, icon, tone }: MetricCardProps) {
  return <article className="rounded-2xl bg-white p-3 shadow-[0_2px_10px_rgba(59,68,70,0.10)]">
    <div className="flex items-start justify-between gap-2"><span className={["flex size-9 items-center justify-center rounded-xl", toneClass[tone]].join(" ")}><MaterialIcon name={icon} size="auto" weight={400} className="text-xl leading-none" /></span><span className="text-right text-lg font-semibold leading-6 text-[#222]">{value}</span></div>
    <p className="mt-3 text-xs font-medium leading-4 text-[#3b4446]">{title}</p><p className="mt-1 text-[10px] leading-3 text-[#7b868a]">{detail}</p>
  </article>;
}

function parseTaskDate(value?: string | null): Date | null {
  if (!value) return null;
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2})$/);
  if (match) return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]), Number(match[4]), Number(match[5]));
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function inMonth(task: TaskPerformanceTask, month: Date) {
  const date = parseTaskDate(task.task_given_date);
  return date?.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear();
}

function isFinalLate(task: TaskPerformanceTask) { return Boolean(task.timing_evaluation?.late); }
function isBottleneck(task: TaskPerformanceTask) { return ["ACC Draft", "Progress Design", "Approval Design"].some((stage) => task.timing_evaluation?.violations?.[stage]?.late); }
function isTimelyDone(task: TaskPerformanceTask) { return task.status === "Done" && !isFinalLate(task); }

export function TaskPerformanceMobile({ tasks }: { tasks: TaskPerformanceTask[] }) {
  const [selectedIndicator, setSelectedIndicator] = useState(0);
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const currentTasks = tasks.filter((task) => inMonth(task, thisMonth));
  const previousTasks = tasks.filter((task) => inMonth(task, lastMonth));
  const timelyCount = currentTasks.filter(isTimelyDone).length;
  const lateCount = currentTasks.filter(isFinalLate).length;
  const bottleneckCount = currentTasks.filter(isBottleneck).length;
  const currentRate = currentTasks.length ? Math.round((timelyCount / currentTasks.length) * 100) : 0;
  const previousRate = previousTasks.length ? Math.round((previousTasks.filter(isTimelyDone).length / previousTasks.length) * 100) : 0;
  const percentageDelta = currentRate - previousRate;
  const completedDurations = currentTasks.flatMap((task) => {
    const start = parseTaskDate(task.task_given_date); const end = parseTaskDate(task.task_timestamps?.Email);
    return task.status === "Done" && start && end ? [(end.getTime() - start.getTime()) / 86_400_000] : [];
  });
  const averageDays = completedDurations.length ? completedDurations.reduce((sum, days) => sum + days, 0) / completedDurations.length : 0;
  const previousCompletedDurations = previousTasks.flatMap((task) => {
    const start = parseTaskDate(task.task_given_date); const end = parseTaskDate(task.task_timestamps?.Email);
    return task.status === "Done" && start && end ? [(end.getTime() - start.getTime()) / 86_400_000] : [];
  });
  const previousAverageDays = previousCompletedDurations.length ? previousCompletedDurations.reduce((sum, days) => sum + days, 0) / previousCompletedDurations.length : 0;
  const previousTimelyCount = previousTasks.filter(isTimelyDone).length;
  const previousLateCount = previousTasks.filter(isFinalLate).length;
  const allDone = tasks.filter((task) => task.status === "Done").length;
  const allInProgress = tasks.filter((task) => task.status !== "0" && task.status !== "Done").length;
  const allBottleneck = tasks.filter(isBottleneck).length;
  const comparisonIndicators = [
    { label: "Tepat waktu", current: timelyCount, previous: previousTimelyCount },
    { label: "Telat", current: lateCount, previous: previousLateCount },
    { label: "Rata-rata hari", current: averageDays, previous: previousAverageDays },
    { label: "Total tugas", current: currentTasks.length, previous: previousTasks.length },
  ];
  const comparisonMaximum = Math.max(1, ...comparisonIndicators.flatMap((item) => [item.current, item.previous]));
  const activeIndicator = comparisonIndicators[selectedIndicator] ?? comparisonIndicators[0];
  const totalDistribution = Math.max(1, currentTasks.length);
  const timelyPercent = Math.round((timelyCount / totalDistribution) * 100);
  const latePercent = Math.round((lateCount / totalDistribution) * 100);
  const bottleneckPercent = Math.round((bottleneckCount / totalDistribution) * 100);
  const lateEnd = Math.min(100, timelyPercent + latePercent);

  return <section className="mt-5 grid grid-cols-1 gap-3 pb-20 lg:grid-cols-12 lg:gap-5 lg:[&>article:nth-of-type(1)]:col-span-4 lg:[&>article:nth-of-type(2)]:col-span-8 lg:[&>article:nth-of-type(3)]:col-span-12" aria-label="Ringkasan performa task">
    <div className="grid grid-cols-2 gap-3 lg:col-span-12 lg:grid-cols-4 lg:gap-5">
      <MetricCard title="Tugas Selesai Tepat Waktu" value={`${currentRate}%`} detail={`${percentageDelta >= 0 ? "Naik" : "Turun"} ${Math.abs(percentageDelta)}% dari bulan lalu`} icon="task_alt" tone="green" />
      <MetricCard title="Tugas Telat" value={String(lateCount)} detail="Kirim Email melewati deadline" icon="warning_amber" tone="red" />
      <MetricCard title="Rata-rata Waktu Penyelesaian" value={`${averageDays.toFixed(1).replace(".", ",")} hari`} detail="Dari tugas selesai bulan ini" icon="schedule" tone="purple" />
      <MetricCard title="Tugas Bulan Ini" value={String(currentTasks.length)} detail="Berdasarkan tanggal tugas diberikan" icon="calendar_month" tone="blue" />
    </div>
    <article className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(59,68,70,0.10)]"><h2 className="text-sm font-semibold leading-5 text-[#222]">Status Seluruh Tugas</h2><div className="mt-4 grid grid-cols-3 gap-2"><div className="rounded-xl bg-[#e8f5e9] p-2.5"><p className="text-lg font-semibold leading-6 text-[#2b9915]">{allDone}</p><p className="mt-1 text-[10px] leading-3 text-[#388e3c]">Selesai</p></div><div className="rounded-xl bg-[#eeebff] p-2.5"><p className="text-lg font-semibold leading-6 text-[#8474f9]">{allInProgress}</p><p className="mt-1 text-[10px] leading-3 text-[#8474f9]">In Progress</p></div><div className="rounded-xl bg-[#fff3e8] p-2.5"><p className="text-lg font-semibold leading-6 text-[#f18728]">{allBottleneck}</p><p className="mt-1 text-[10px] leading-3 text-[#c75f0b]">Bottle Neck</p></div></div></article>
    <article className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(59,68,70,0.10)]"><div className="flex items-start justify-between gap-3"><div><h2 className="text-sm font-semibold leading-5 text-[#222]">Performa Bulan Ini</h2><p className="mt-0.5 text-[10px] leading-3 text-[#7b868a]">Head-to-head dengan bulan lalu</p></div><span className="rounded-lg bg-[#e8f5e9] px-2 py-1 text-[10px] font-semibold text-[#2b9915]">{percentageDelta >= 0 ? "+" : ""}{percentageDelta}%</span></div><div className="mt-3 flex gap-3 text-[10px] text-[#7b868a]"><span className="flex items-center gap-1"><i className="size-2 rounded-full bg-[#8474f9]" />Bulan ini</span><span className="flex items-center gap-1"><i className="size-2 rounded-full bg-[#c7c2ff]" />Bulan lalu</span></div><div className="mt-3 flex h-32 items-end justify-between gap-2 border-b border-[#e5e7eb] px-1">{comparisonIndicators.map((item, index) => <button key={item.label} type="button" onClick={() => setSelectedIndicator(index)} aria-pressed={selectedIndicator === index} className={["flex h-full flex-1 items-end justify-center gap-1 rounded-t-md px-0.5 outline-none transition focus-visible:ring-2 focus-visible:ring-[#8474f9]", selectedIndicator === index ? "bg-[#f6f4ff]" : "hover:bg-[#fafafa]"].join(" ")}><span className="w-full max-w-3 rounded-t-sm bg-[#8474f9] transition-[height] duration-300" style={{ height: `${Math.max(6, Math.round((item.current / comparisonMaximum) * 112))}px` }} /><span className="w-full max-w-3 rounded-t-sm bg-[#c7c2ff] transition-[height] duration-300" style={{ height: `${Math.max(6, Math.round((item.previous / comparisonMaximum) * 112))}px` }} /></button>)}</div><div className="mt-2 grid grid-cols-4 gap-2 text-center text-[9px] leading-3 text-[#7b868a]">{comparisonIndicators.map((item, index) => <button key={item.label} type="button" onClick={() => setSelectedIndicator(index)} className={selectedIndicator === index ? "font-semibold text-[#8474f9]" : "text-[#7b868a]"}>{item.label}</button>)}</div><div className="mt-3 rounded-xl bg-[#f6f4ff] px-3 py-2 text-xs text-[#525e61]"><div className="flex items-center justify-between gap-3"><span className="font-semibold text-[#3b4446]">{activeIndicator.label}</span><span><b className="text-[#8474f9]">{Number.isInteger(activeIndicator.current) ? activeIndicator.current : activeIndicator.current.toFixed(1)}</b> bulan ini · <b className="text-[#756fd1]">{Number.isInteger(activeIndicator.previous) ? activeIndicator.previous : activeIndicator.previous.toFixed(1)}</b> bulan lalu</span></div></div></article>
    <article className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(59,68,70,0.10)]"><h2 className="text-sm font-semibold leading-5 text-[#222]">Distribusi Performa Tugas</h2><p className="mt-0.5 text-[10px] leading-3 text-[#7b868a]">Bulan ini</p><div className="mt-4 flex items-center gap-5"><div className="relative size-28 shrink-0 rounded-full" style={{ background: `conic-gradient(#2b9915 0 ${timelyPercent}%, #fd6d6d ${timelyPercent}% ${lateEnd}%, #f18728 ${lateEnd}% 100%)` }}><div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-white"><span className="text-lg font-semibold leading-5 text-[#222]">{currentTasks.length}</span><span className="text-[9px] leading-3 text-[#7b868a]">Task</span></div></div><div className="flex flex-1 flex-col gap-2 text-[11px] leading-4 text-[#525e61]"><span className="flex items-center justify-between gap-3"><i className="size-2 rounded-full bg-[#2b9915]" />Selesai tepat waktu <b className="ml-auto font-semibold text-[#222]">{timelyPercent}%</b></span><span className="flex items-center justify-between gap-3"><i className="size-2 rounded-full bg-[#fd6d6d]" />Telat / Overlate <b className="ml-auto font-semibold text-[#222]">{latePercent}%</b></span><span className="flex items-center justify-between gap-3"><i className="size-2 rounded-full bg-[#f18728]" />Botleneck <b className="ml-auto font-semibold text-[#222]">{bottleneckPercent}%</b></span></div></div></article>
  </section>;
}
