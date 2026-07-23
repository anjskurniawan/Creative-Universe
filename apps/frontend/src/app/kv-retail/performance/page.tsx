"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { type TaskPerformanceTask } from "@/components/task-performance-mobile";
import { ApiError } from "@/core/api/client";
import { kvRetailApi, type KvRetailTaskDeletedEvent, type KvRetailTaskEvent } from "@/features/kv-retail/api";
import { getEchoClient } from "@/core/realtime";
import { useAuth } from "@/providers/auth-provider";
import { MaterialIcon } from "@/components/material-icon";
import { TaskDesktopPageTransition } from "@/components/task-desktop-page-transition";
import { PerformanceNavbar } from "@/features/kv-retail/components/performance-navbar";
import { PerformanceSidebar } from "@/features/kv-retail/components/performance-sidebar";
import { PerformanceContentTitle } from "@/features/kv-retail/components/performance-content-title";
import { PerformanceMetricCard } from "@/features/kv-retail/components/performance-metric-card";
import { KV_RETAIL_PERFORMANCE_PAGE } from "@/features/kv-retail/performance-page-config";
import { PerformanceSideSummary } from "@/features/kv-retail/components/performance-side-summary";
import { PerformanceChartIndicators } from "@/features/kv-retail/components/performance-chart-indicators";
import { useKvRetailDesktopSidebar } from "@/features/kv-retail/hooks";

const TASK_NAVIGATION_ITEMS = [
  { label: "Daftar Tugas", icon: "list_alt_check", href: "/kv-retail" },
  { label: "Segera Selesaikan", icon: "alarm", href: "/kv-retail/unfinished" },
  { label: "Tugas Bulan Ini", icon: "calendar_month", href: "/kv-retail/month" },
  { label: KV_RETAIL_PERFORMANCE_PAGE.navLabel, icon: "analytics", href: "/kv-retail/performance" },
  { label: "Setting", icon: "settings", href: "/kv-retail/option" },
];



function toDate(value?: string | null) {
  if (!value) return null;
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2})$/);
  if (match) return new Date(+match[3], +match[2] - 1, +match[1], +match[4], +match[5]);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function taskIsLate(task: TaskPerformanceTask) {
  if (task.timing_evaluation?.late) return true;
  if (task.task_timestamps?.Email) return false;
  const deadline = toDate(task.deadline_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Boolean(deadline && deadline.setHours(0, 0, 0, 0) < today.getTime());
}

function taskIsBottleneck(task: TaskPerformanceTask) {
  return ["ACC Draft", "Progress Design", "Approval Design"].some((stage) => task.timing_evaluation?.violations?.[stage]?.late);
}

function bottleneckStagesForTask(task: TaskPerformanceTask) {
  return ["ACC Draft", "Progress Design", "Approval Design"].filter((stage) => task.timing_evaluation?.violations?.[stage]?.late);
}

function tasksInMonth(tasks: TaskPerformanceTask[], month: Date) {
  return tasks.filter((task) => {
    const date = toDate(task.task_given_date);
    return Boolean(date && date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear());
  });
}

function MobilePerformanceDiagram({ comparisons, theme }: { comparisons: Array<{ label: string; current: number; previous: number }>; theme: "dark" | "light" | "retro" }) {
  const dark = theme === "dark";
  const retro = theme === "retro";
  const accent = dark ? "#b0ff5e" : retro ? "#ba0dcb" : "#00a4ff";
  const maximum = Math.max(1, ...comparisons.flatMap((item) => [item.current, item.previous]));
  const panel = dark ? "border border-white/10 bg-[#171717] text-[#f1f1f1]" : retro ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b] shadow-[3px_3px_0_#24252b]" : "border border-white/80 bg-white/90 text-[#181818] shadow-[0_5px_14px_rgba(44,42,39,0.06)]";
  const muted = dark ? "text-[#a7ada8]" : retro ? "text-[#687065]" : "text-[#6d7880]";
  const previous = dark ? "#535353" : retro ? "#b5b9ad" : "#c9eaff";

  return (
    <section className={`rounded-2xl p-4 ${panel}`} aria-label="Diagram performa">
      <div className="flex items-start justify-between gap-3">
        <div><h2 className="text-sm font-semibold">Diagram performa</h2><p className={`mt-1 text-xs ${muted}`}>Bulan ini vs bulan lalu</p></div>
        <MaterialIcon name="bar_chart" size="auto" className="text-2xl" style={{ color: accent }} />
      </div>
      <div className="mt-4 flex items-center justify-end gap-3 text-[10px]">
        <span className={`flex items-center gap-1 ${muted}`}><i className="size-2 rounded-sm" style={{ backgroundColor: accent }} />Bulan ini</span>
        <span className={`flex items-center gap-1 ${muted}`}><i className="size-2 rounded-sm" style={{ backgroundColor: previous }} />Bulan lalu</span>
      </div>
      <div className={`mt-2 grid h-36 grid-cols-4 gap-3 border-b ${dark ? "border-white/10" : retro ? "border-[#24252b]/25" : "border-[#e6edf2]"}`}>
        {comparisons.map((item) => <div key={item.label} className="flex min-w-0 items-end justify-center gap-1.5"><div className="flex h-full flex-1 flex-col justify-end"><span className="mb-1 text-center text-[10px] font-medium">{item.current}</span><i className="block w-full rounded-t-md" style={{ height: `${Math.max(8, item.current / maximum * 100)}%`, backgroundColor: accent }} /></div><div className="flex h-full flex-1 flex-col justify-end"><span className={`mb-1 text-center text-[10px] ${muted}`}>{item.previous}</span><i className="block w-full rounded-t-md" style={{ height: `${Math.max(8, item.previous / maximum * 100)}%`, backgroundColor: previous }} /></div></div>)}
      </div>
      <div className={`mt-2 grid grid-cols-4 gap-3 text-center text-[10px] ${muted}`}>{comparisons.map((item) => <span key={item.label}>{item.label}</span>)}</div>
    </section>
  );
}

function MobilePerformanceSummary({ totalTasks, rating, theme }: { totalTasks: number; rating: "GOOD" | "FAIR" | "POOR" | "NO DATA"; theme: "dark" | "light" | "retro" }) {
  const dark = theme === "dark";
  const retro = theme === "retro";
  const accent = dark ? "#b0ff5e" : retro ? "#ba0dcb" : "#00a4ff";
  const ratingColor = rating === "POOR" ? "#ff5e5e" : rating === "FAIR" ? "#ffcf5e" : rating === "NO DATA" ? "#b9b9b9" : accent;
  const panel = dark ? "border border-white/10 bg-[#171717] text-[#f1f1f1]" : retro ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b] shadow-[3px_3px_0_#24252b]" : "border border-white/80 bg-white/90 text-[#181818] shadow-[0_5px_14px_rgba(44,42,39,0.06)]";
  const muted = dark ? "text-[#a7ada8]" : retro ? "text-[#687065]" : "text-[#6d7880]";

  return (
    <section className="grid shrink-0 grid-cols-2 gap-3" aria-label="Ringkasan task">
      <article className={`flex h-[116px] flex-col justify-between rounded-2xl p-3 ${panel}`}>
        <MaterialIcon name="assignment" size="auto" className="text-3xl" style={{ color: accent }} />
        <div><p className={`text-xs ${muted}`}>Total task</p><p className="mt-1 text-2xl font-medium leading-none">{totalTasks} task</p></div>
      </article>
      <article className={`flex h-[116px] flex-col items-center justify-center gap-1 rounded-2xl p-3 text-center ${panel}`} style={{ boxShadow: `inset 0 0 0 1px ${ratingColor}33` }}>
        <MaterialIcon name={rating === "GOOD" ? "sentiment_satisfied" : rating === "FAIR" ? "sentiment_neutral" : rating === "POOR" ? "sentiment_dissatisfied" : "help_outline"} size="auto" className="text-3xl" style={{ color: ratingColor }} />
        <p className="text-xl font-medium leading-none" style={{ color: ratingColor }}>{rating}</p>
        <p className={`text-[10px] ${muted}`}>Performance</p>
      </article>
    </section>
  );
}

function MobileBottleneckCard({ stages, totalTasks, theme }: { stages: Array<{ label: string; total: number }>; totalTasks: number; theme: "dark" | "light" | "retro" }) {
  const dark = theme === "dark";
  const retro = theme === "retro";
  const accent = dark ? "#b0ff5e" : retro ? "#ba0dcb" : "#00a4ff";
  const panel = dark ? "border border-white/10 bg-[#171717] text-[#f1f1f1]" : retro ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b] shadow-[3px_3px_0_#24252b]" : "border border-white/80 bg-white/90 text-[#181818] shadow-[0_5px_14px_rgba(44,42,39,0.06)]";
  const muted = dark ? "text-[#a7ada8]" : retro ? "text-[#687065]" : "text-[#6d7880]";
  const heading = dark ? "text-[#f1f1f1]" : retro ? "text-[#24252b]" : "text-[#181818]";
  const track = dark ? "bg-white/10" : retro ? "bg-[#b5b9ad]" : "bg-[#e6edf2]";
  return <section className={`shrink-0 rounded-2xl p-4 ${panel}`} aria-label="Detail bottleneck"><div className="flex items-start justify-between gap-3"><div><h2 className={`text-sm font-semibold ${heading}`}>Detail bottleneck</h2><p className={`mt-1 text-xs ${muted}`}>Jumlah task yang melewati batas per tahap.</p></div><MaterialIcon name="warning_amber" size="auto" className="text-2xl" style={{ color: accent }} /></div><div className="mt-4 space-y-3">{stages.map((stage) => <div key={stage.label}><div className={`mb-1.5 flex justify-between text-xs ${muted}`}><span>{stage.label}</span><b className={heading}>{stage.total} task</b></div><div className={`h-1.5 overflow-hidden rounded-full ${track}`}><i className="block h-full rounded-full" style={{ width: `${totalTasks ? Math.min(100, stage.total / totalTasks * 100) : 0}%`, backgroundColor: accent }} /></div></div>)}</div></section>;
}

function MobileCreativeAgentCard({ content, theme }: { content: string | null; theme: "dark" | "light" | "retro" }) {
  const dark = theme === "dark";
  const retro = theme === "retro";
  const accent = dark ? "#b0ff5e" : retro ? "#ba0dcb" : "#00a4ff";
  const panel = dark ? "border border-white/10 bg-[#171717] text-[#f1f1f1]" : retro ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b] shadow-[3px_3px_0_#24252b]" : "border border-white/80 bg-white/90 text-[#181818] shadow-[0_5px_14px_rgba(44,42,39,0.06)]";
  const muted = dark ? "text-[#b9b9b9]" : retro ? "text-[#555850]" : "text-[#6d7880]";
  const heading = dark ? "text-[#f1f1f1]" : retro ? "text-[#24252b]" : "text-[#181818]";
  const summary = content?.replace(/[#*_`]/g, "").replace(/\s+/g, " ").trim();
  return <section className={`shrink-0 rounded-2xl p-4 ${panel}`} aria-label="Creative Agent"><div className="flex items-center gap-2"><MaterialIcon name="auto_awesome" size="auto" className="text-2xl" style={{ color: accent }} /><div><h2 className={`text-sm font-semibold ${heading}`}>Creative Agent</h2><p className={`text-xs ${muted}`}>Rekomendasi terbaru berdasarkan task.</p></div></div><p className={`mt-3 rounded-xl p-3 text-xs leading-5 ${dark ? "bg-[#101211] text-[#e1e5e1]" : retro ? "border border-[#24252b] bg-[#dfe2d3] text-[#4b514a]" : "bg-[#f3faff] text-[#4e6475]"}`}>{summary || "Belum ada laporan Creative Agent untuk periode ini."}</p></section>;
}

function formatPriorityDate(value: string) {
  const date = toDate(value);
  if (!date) return value;
  return new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(date);
}

function MobilePriorityActionsCard({ priorities, theme }: { priorities: Array<{ id: number; title: string; reason: string; deadline: string; givenAt: string; emailAt: string; status: string; icon: string }>; theme: "dark" | "light" | "retro" }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const dark = theme === "dark";
  const retro = theme === "retro";
  const accent = dark ? "#b0ff5e" : retro ? "#ba0dcb" : "#00a4ff";
  const panel = dark ? "border border-white/10 bg-[#171717] text-[#f1f1f1]" : retro ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b] shadow-[3px_3px_0_#24252b]" : "border border-white/80 bg-white/90 text-[#181818] shadow-[0_5px_14px_rgba(44,42,39,0.06)]";
  const muted = dark ? "text-[#a7ada8]" : retro ? "text-[#687065]" : "text-[#6d7880]";
  const heading = dark ? "text-[#f1f1f1]" : retro ? "text-[#24252b]" : "text-[#181818]";
  const itemSurface = dark ? "bg-[#101211]" : retro ? "border border-[#24252b] bg-[#dfe2d3]" : "bg-[#f8fbff]";
  const moveToSlide = (index: number) => {
    const nextIndex = Math.max(0, Math.min(priorities.length - 1, index));
    carouselRef.current?.scrollTo({ left: carouselRef.current.clientWidth * nextIndex, behavior: "smooth" });
    setActiveSlide(nextIndex);
  };
  const controlClass = dark ? "border border-white/10 bg-[#101211] text-[#f1f1f1]" : retro ? "border-2 border-[#24252b] bg-[#dfe2d3] text-[#24252b]" : "border border-[#bdeaff] bg-[#f3faff] text-[#0077bf]";

  return <section className={`shrink-0 rounded-2xl p-4 ${panel}`} aria-label="Prioritas tindakan"><div className="flex items-start justify-between gap-3"><div><h2 className={`text-sm font-semibold ${heading}`}>Prioritas tindakan</h2><p className={`mt-1 text-xs ${muted}`}>Geser untuk melihat task berikutnya.</p></div><MaterialIcon name="priority_high" size="auto" className="text-2xl" style={{ color: accent }} /></div><div ref={carouselRef} onScroll={(event) => { const width = event.currentTarget.clientWidth; if (width) setActiveSlide(Math.round(event.currentTarget.scrollLeft / width)); }} className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{priorities.length ? priorities.map((task) => <article key={task.id} className={`min-w-full snap-center rounded-xl p-3 ${itemSurface}`}><div className="min-w-0"><p className={`truncate text-sm font-semibold ${heading}`}>{task.title}</p><p className={`mt-1 flex items-center gap-1 text-[11px] ${muted}`}><MaterialIcon name={task.icon} size="auto" className="text-sm" />{task.reason}</p></div><div className={`mt-3 grid grid-cols-1 gap-1.5 border-t pt-3 text-[11px] ${dark ? "border-white/10" : retro ? "border-[#24252b]/20" : "border-[#e6edf2]"} ${muted}`}><p><b className={heading}>Status:</b> {task.status}</p><p><b className={heading}>Deadline:</b> {formatPriorityDate(task.deadline)}</p><p><b className={heading}>Diberikan:</b> {formatPriorityDate(task.givenAt)}</p><p><b className={heading}>Email:</b> {task.emailAt === "Belum dikirim" ? task.emailAt : formatPriorityDate(task.emailAt)}</p></div></article>) : <p className={`min-w-full rounded-xl p-3 text-xs ${itemSurface} ${muted}`}>Belum ada task yang perlu ditindaklanjuti.</p>}</div>{priorities.length > 1 && <div className="mt-3 flex items-center justify-between"><button type="button" aria-label="Task sebelumnya" disabled={activeSlide === 0} onClick={() => moveToSlide(activeSlide - 1)} className={`flex size-8 items-center justify-center rounded-lg disabled:opacity-35 ${controlClass}`}><MaterialIcon name="arrow_back" size="auto" className="text-lg" /></button><div className="flex items-center gap-1.5">{priorities.map((task, index) => <button key={task.id} type="button" aria-label={`Buka task ${index + 1}`} aria-current={activeSlide === index ? "true" : undefined} onClick={() => moveToSlide(index)} className={`h-1.5 rounded-full transition-all ${activeSlide === index ? "w-5" : "w-1.5"}`} style={{ backgroundColor: activeSlide === index ? accent : dark ? "#4d554e" : retro ? "#b5b9ad" : "#c9eaff" }} />)}</div><button type="button" aria-label="Task berikutnya" disabled={activeSlide === priorities.length - 1} onClick={() => moveToSlide(activeSlide + 1)} className={`flex size-8 items-center justify-center rounded-lg disabled:opacity-35 ${controlClass}`}><MaterialIcon name="arrow_forward" size="auto" className="text-lg" /></button></div>}</section>;
}

export default function TaskPerformancePage() {
  const [tasks, setTasks] = useState<TaskPerformanceTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [performanceTheme, setPerformanceTheme] = useState<"dark" | "light" | "retro">("light");
  const [mobilePeriodOpen, setMobilePeriodOpen] = useState(false);
  const mobileReportScrollRef = useRef<HTMLDivElement>(null);
  const [showMobileReportFade, setShowMobileReportFade] = useState(false);
  const { expanded: performanceSidebarExpanded, toggleExpanded: togglePerformanceSidebarExpanded } = useKvRetailDesktopSidebar();
  const [creativeAgentContent, setCreativeAgentContent] = useState<string | null>(null);
  const { user, hasPermission } = useAuth();
  const currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  const currentTasks = tasksInMonth(tasks, currentMonth);
  const previousTasks = tasksInMonth(tasks, previousMonth);
  const currentTimely = currentTasks.filter((task) => task.status === "Done" && !taskIsLate(task)).length;
  const previousTimely = previousTasks.filter((task) => task.status === "Done" && !taskIsLate(task)).length;
  const currentLate = currentTasks.filter(taskIsLate).length;
  const previousLate = previousTasks.filter(taskIsLate).length;
  const currentBottleneck = currentTasks.filter(taskIsBottleneck).length;
  const previousBottleneck = previousTasks.filter(taskIsBottleneck).length;
  const bottleneckStages = ["ACC Draft", "Progress Design", "Approval Design"].map((label) => ({ label, total: currentTasks.filter((task) => Boolean(task.timing_evaluation?.violations?.[label]?.late)).length }));
  const averageDuration = (items: TaskPerformanceTask[]) => {
    const durations = items.flatMap((task) => {
      const start = toDate(task.task_given_date);
      const finish = toDate(task.task_timestamps?.Email);
      return task.status === "Done" && start && finish ? [(finish.getTime() - start.getTime()) / 86_400_000] : [];
    });
    return durations.length ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length : 0;
  };
  const currentAverage = averageDuration(currentTasks);
  const previousAverage = averageDuration(previousTasks);
  const increase = (current: number, previous: number) => previous > 0 ? Math.round(((current - previous) / previous) * 100) : current > 0 ? 100 : 0;
  const completedTasks = currentTasks.filter((task) => task.status === "Done");
  const inProgressTasks = currentTasks.length - completedTasks.length;
  const completedTimely = completedTasks.filter((task) => !taskIsLate(task)).length;
  const completedLate = completedTasks.filter(taskIsLate).length;
  // The rating intentionally excludes in-progress work. A task only affects this
  // indicator after it has been completed and its email timestamp is evaluated.
  const performanceRating = completedTasks.length === 0
    ? "NO DATA"
    : completedLate > completedTimely
      ? "POOR"
      : completedLate === completedTimely
        ? "FAIR"
        : "GOOD";
  const skeletonSurface = performanceTheme === "dark" ? "bg-[#202820]" : performanceTheme === "retro" ? "border-2 border-[#24252b] bg-[#dfe2d3]" : "bg-white/75";
  const priorityActions = currentTasks.flatMap((task) => {
    const bottleneckStages = bottleneckStagesForTask(task);
    const reasons = [
      taskIsLate(task) ? task.status === "Done" ? "Selesai melewati deadline" : "Deadline telah lewat" : null,
      bottleneckStages.length ? `Bottleneck pada ${bottleneckStages.join(", ")}` : null,
    ].filter((reason): reason is string => Boolean(reason));
    if (!reasons.length) return [];
    return [{
      id: task.id,
      title: task.task_name || `Task #${task.id}`,
      reason: reasons.join(" · "),
      deadline: task.deadline_date || "Tanpa deadline",
      givenAt: task.task_given_date || "Tidak tercatat",
      emailAt: task.task_timestamps?.Email || "Belum dikirim",
      status: task.status === "0" ? "Belum dimulai" : task.status,
      icon: bottleneckStages.length ? "warning_amber" : task.status === "Done" ? "timer_off" : "event_busy",
    }];
  }).slice(0, 3);

  const refreshTasks = useCallback(async () => {
    try {
      const data = await kvRetailApi.tasks.list();
      setTasks(data as TaskPerformanceTask[]);
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        window.location.replace("/dashboard");
        return;
      }
      console.error("Gagal memuat performa task:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshCreativeAgent = useCallback(async () => {
    try {
      const report = await kvRetailApi.tasks.latestPerformanceAiReport();
      setCreativeAgentContent(report?.content ?? null);
    } catch (error) {
      console.error("Gagal memuat Creative Agent terbaru:", error);
    }
  }, []);

  useEffect(() => {
    const initialRefresh = window.setTimeout(() => {
      void refreshTasks();
      void refreshCreativeAgent();
    }, 0);
    return () => window.clearTimeout(initialRefresh);
  }, [refreshCreativeAgent, refreshTasks]);

  useEffect(() => {
    const scrollArea = mobileReportScrollRef.current;
    if (!scrollArea) return;
    const updateFade = () => {
      const hasMoreContent = scrollArea.scrollHeight - scrollArea.clientHeight > 2;
      const isAtBottom = scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 2;
      setShowMobileReportFade(hasMoreContent && !isAtBottom);
    };
    updateFade();
    scrollArea.addEventListener("scroll", updateFade, { passive: true });
    const observer = new ResizeObserver(updateFade);
    observer.observe(scrollArea);
    return () => {
      scrollArea.removeEventListener("scroll", updateFade);
      observer.disconnect();
    };
  }, [tasks.length]);

  useEffect(() => {
    if (user && !hasPermission("kv-retail.tasks.create")) {
      window.location.replace("/kv-retail");
    }
  }, [hasPermission, user]);

  useEffect(() => {
    if (!user?.id) return;

    const echo = getEchoClient();
    if (!echo) return;

    const channel = echo.private(`App.Models.Core.User.${user.id}`);
    const refreshReport = (event: KvRetailTaskEvent) => {
      if (event.task) {
        setTasks((current) => {
          const exists = current.some((task) => task.id === event.task?.id);
          return exists
            ? current.map((task) => task.id === event.task?.id ? event.task as TaskPerformanceTask : task)
            : [...current, event.task as TaskPerformanceTask];
        });
      } else {
        void refreshTasks();
      }
      void refreshCreativeAgent();
    };

    channel.listen(".kv-retail.task.assigned", refreshReport);
    channel.listen(".kv-retail.task.updated", refreshReport);
    channel.listen(".kv-retail.task.deleted", (event: KvRetailTaskDeletedEvent) => {
      setTasks((current) => current.filter((task) => task.id !== event.task_id));
      void refreshCreativeAgent();
    });

    return () => {
      channel.stopListening(".kv-retail.task.assigned");
      channel.stopListening(".kv-retail.task.updated");
      channel.stopListening(".kv-retail.task.deleted");
    };
  }, [refreshCreativeAgent, refreshTasks, user?.id]);

  return (
    <>
      <div className={`h-dvh overflow-hidden p-3 lg:hidden ${performanceTheme === "dark" ? "bg-[radial-gradient(circle_at_8%_6%,#294c3b_0,transparent_28%),radial-gradient(circle_at_91%_4%,#242a27_0,transparent_38%),linear-gradient(135deg,#111513_0%,#0b0d0c_58%,#1a1e1c_100%)]" : performanceTheme === "retro" ? "bg-[#dfe2d3] font-mono" : "bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)]"}`}>
        <div className={`flex h-[calc(100dvh-24px)] flex-col overflow-hidden rounded-[22px] ${performanceTheme === "dark" ? "border border-white/10 bg-[#111413]/90" : performanceTheme === "retro" ? "border-[3px] border-[#24252b] bg-[#c9ccc0] shadow-[0_6px_0_#24252b]" : "border border-white/80 bg-white/80 shadow-[0_12px_32px_rgba(0,4,117,0.2)] backdrop-blur-md"}`}>
          <PerformanceNavbar theme={performanceTheme} title={KV_RETAIL_PERFORMANCE_PAGE.title} compact compactMenuItems={TASK_NAVIGATION_ITEMS} />
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-6 pt-6">
            <div className="flex shrink-0 items-center justify-between gap-3">
              <h1 className={`text-4xl font-medium leading-none tracking-[-0.05em] ${performanceTheme === "dark" ? "text-[#f1f1f1]" : "text-[#181818]"}`}>{KV_RETAIL_PERFORMANCE_PAGE.title}</h1>
              <div className="flex shrink-0 items-center gap-2">
                <div className="relative">
                  <button type="button" aria-label="Pilih periode" aria-expanded={mobilePeriodOpen} onClick={() => setMobilePeriodOpen((open) => !open)} className={`flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold ${performanceTheme === "dark" ? "border border-[#b0ff5e]/30 bg-[#121916] text-[#f1f1f1]" : performanceTheme === "retro" ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b]" : "border border-[#bdeaff] bg-[#f3fbff] text-[#04044a]"}`}><MaterialIcon name="calendar_month" size="auto" className="text-lg" /><span>Bulan ini</span><MaterialIcon name="keyboard_arrow_down" size="auto" className="text-lg" /></button>
                  {mobilePeriodOpen && <div className={`absolute right-0 top-[calc(100%+6px)] z-20 w-32 rounded-xl p-1.5 text-xs ${performanceTheme === "dark" ? "border border-[#b0ff5e]/25 bg-[#121916] text-[#f1f1f1]" : performanceTheme === "retro" ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b]" : "border border-[#bdeaff] bg-[#f3fbff] text-[#04044a]"}`}><button type="button" onClick={() => setMobilePeriodOpen(false)} className="w-full rounded-lg px-2 py-2 text-left">Bulan ini</button></div>}
                </div>
                <button type="button" aria-label="Export PDF" onClick={() => window.print()} className={`flex size-10 items-center justify-center rounded-xl ${performanceTheme === "dark" ? "bg-[#b0ff5e] text-[#181818]" : performanceTheme === "retro" ? "border-2 border-[#24252b] bg-[#ba0dcb] text-white" : "bg-[#00a4ff] text-white"}`}><MaterialIcon name="picture_as_pdf" size="auto" className="text-xl" /></button>
              </div>
            </div>
            <div
              ref={mobileReportScrollRef}
              className="mt-5 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-2 pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={showMobileReportFade ? { maskImage: "linear-gradient(to bottom, #000 0, #000 calc(100% - 28px), transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, #000 0, #000 calc(100% - 28px), transparent 100%)" } : undefined}
            >
              <div className="grid shrink-0 grid-cols-2 gap-3">
                <PerformanceMetricCard compact theme={performanceTheme} label="Selesai tepat waktu" value={currentTimely} previous={previousTimely} increase={increase(currentTimely, previousTimely)} />
                <PerformanceMetricCard compact theme={performanceTheme} label="Terlambat" value={currentLate} previous={previousLate} increase={increase(currentLate, previousLate)} icon="timer_off" />
                <PerformanceMetricCard compact theme={performanceTheme} label="Bottleneck" value={currentBottleneck} previous={previousBottleneck} increase={increase(currentBottleneck, previousBottleneck)} icon="warning_amber" />
                <PerformanceMetricCard compact theme={performanceTheme} label="Rata-rata selesai" value={currentAverage} previous={previousAverage} unit="hari" decimals={1} increase={increase(currentAverage, previousAverage)} icon="schedule" />
              </div>
              <div className="shrink-0"><MobilePerformanceDiagram theme={performanceTheme} comparisons={[{ label: "Total task", current: currentTasks.length, previous: previousTasks.length }, { label: "Tepat waktu", current: currentTimely, previous: previousTimely }, { label: "Terlambat", current: currentLate, previous: previousLate }, { label: "Bottleneck", current: currentBottleneck, previous: previousBottleneck }]} /></div>
              <MobilePerformanceSummary totalTasks={currentTasks.length} rating={performanceRating} theme={performanceTheme} />
              <MobileBottleneckCard stages={bottleneckStages} totalTasks={currentTasks.length} theme={performanceTheme} />
              <MobileCreativeAgentCard content={creativeAgentContent} theme={performanceTheme} />
              <MobilePriorityActionsCard priorities={priorityActions} theme={performanceTheme} />
            </div>
          </main>
        </div>
      </div>

      <div className={`hidden h-screen min-h-0 flex-col text-[#222] lg:flex ${performanceTheme === "dark" ? "bg-[radial-gradient(circle_at_8%_6%,#294c3b_0,transparent_28%),radial-gradient(circle_at_91%_4%,#242a27_0,transparent_38%),linear-gradient(135deg,#111513_0%,#0b0d0c_58%,#1a1e1c_100%)] p-6" : performanceTheme === "retro" ? "bg-[#dfe2d3] p-6" : "bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)] p-6"}`}>
        <div className={`flex min-h-0 flex-1 flex-col overflow-hidden ${performanceTheme === "light" ? "rounded-[26px] border border-white/80 bg-white/80 shadow-[0_14px_42px_rgba(44,42,39,0.16)] backdrop-blur-md" : performanceTheme === "dark" ? "rounded-[26px] border border-white/10 bg-[#111413]/90 shadow-[0_14px_42px_rgba(0,0,0,0.45)] backdrop-blur-md" : "rounded-[30px] border-[3px] border-[#24252b] bg-[#c9ccc0] font-mono shadow-[0_8px_0_#24252b]"}`}>
        <PerformanceNavbar theme={performanceTheme} />
        <div className="flex min-h-0 flex-1">
        <PerformanceSidebar theme={performanceTheme} onToggleTheme={() => setPerformanceTheme((theme) => theme === "dark" ? "light" : "dark")} onToggleRetro={() => setPerformanceTheme((theme) => theme === "retro" ? "light" : "retro")} expanded={performanceSidebarExpanded} onToggleExpanded={togglePerformanceSidebarExpanded} />
        <TaskDesktopPageTransition className={`relative m-4 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-transparent`}>
          <PerformanceContentTitle theme={performanceTheme} />
          {isLoading ? (
            <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4">
              <div className="grid shrink-0 grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, index) => <div key={index} className={`h-[139px] animate-pulse rounded-2xl ${skeletonSurface}`} />)}
              </div>
              <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_321px] gap-4">
                <div className="flex min-h-0 flex-col gap-4">
                  <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_220px_280px] gap-4">
                    <div className={`h-[220px] animate-pulse rounded-2xl ${skeletonSurface}`} />
                    <div className={`h-[220px] animate-pulse rounded-2xl ${skeletonSurface}`} />
                    <div className={`h-[220px] animate-pulse rounded-2xl ${skeletonSurface}`} />
                  </div>
                  <div className={`h-[126px] shrink-0 animate-pulse rounded-2xl ${skeletonSurface}`} />
                  <div className={`min-h-0 flex-1 animate-pulse rounded-2xl ${skeletonSurface}`} />
                </div>
                <div className="flex min-h-0 flex-col gap-2">
                  <div className="grid h-[133px] shrink-0 grid-cols-2 gap-2">
                    <div className={`animate-pulse rounded-2xl ${skeletonSurface}`} />
                    <div className={`animate-pulse rounded-2xl ${skeletonSurface}`} />
                  </div>
                  <div className={`min-h-0 flex-1 animate-pulse rounded-2xl ${skeletonSurface}`} />
                </div>
              </div>
            </div>
          ) : <>
          <div className="mt-4 grid w-full grid-cols-5 gap-4">
            <PerformanceMetricCard theme={performanceTheme} label="Total task" value={currentTasks.length} previous={previousTasks.length} increase={increase(currentTasks.length, previousTasks.length)} icon="assignment" />
            <PerformanceMetricCard theme={performanceTheme} label="Selesai tepat waktu" value={currentTimely} previous={previousTimely} increase={increase(currentTimely, previousTimely)} />
            <PerformanceMetricCard theme={performanceTheme} label="Terlambat" value={currentLate} previous={previousLate} increase={increase(currentLate, previousLate)} icon="timer_off" />
            <PerformanceMetricCard theme={performanceTheme} label="Bottleneck" value={currentBottleneck} previous={previousBottleneck} increase={increase(currentBottleneck, previousBottleneck)} icon="warning_amber" />
            <PerformanceMetricCard theme={performanceTheme} label="Rata-rata selesai" value={currentAverage} previous={previousAverage} unit="hari" decimals={1} increase={increase(currentAverage, previousAverage)} icon="schedule" />
          </div>
          <div className="mt-4 grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_321px] items-stretch gap-4">
            <PerformanceChartIndicators total={currentTasks.length} timely={currentTimely} late={currentLate} bottleneck={currentBottleneck} completed={completedTasks.length} inProgress={inProgressTasks} comparisons={[{ label: "Total task", current: currentTasks.length, previous: previousTasks.length }, { label: "Tepat waktu", current: currentTimely, previous: previousTimely }, { label: "Terlambat", current: currentLate, previous: previousLate }, { label: "Bottleneck", current: currentBottleneck, previous: previousBottleneck }]} stages={bottleneckStages} priorities={priorityActions} theme={performanceTheme} />
            <PerformanceSideSummary totalTasks={currentTasks.length} rating={performanceRating} creativeAgentContent={creativeAgentContent} theme={performanceTheme} />
          </div>
          </>}
        </TaskDesktopPageTransition>
        </div>
        </div>
      </div>
    </>
  );
}
