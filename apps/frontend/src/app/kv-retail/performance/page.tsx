"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { SideMenu, type SideMenuItem, type SideMenuVariant } from "@/components/side-menu";
import { TaskMobileNavigation, type TaskMobileNavigationItem } from "@/components/task-mobile-navigation";
import { TaskPerformanceMobile, type TaskPerformanceTask } from "@/components/task-performance-mobile";
import { TaskPerformanceDesktop } from "@/components/task-performance-desktop";
import { ApiError } from "@/core/api/client";
import { kvRetailApi } from "@/features/kv-retail/api";
import { useAuth } from "@/providers/auth-provider";
import { MaterialIcon } from "@/components/material-icon";
import { TaskDesktopPageTransition } from "@/components/task-desktop-page-transition";

const TASK_NAVIGATION_ITEMS: TaskMobileNavigationItem[] = [
  { label: "Tugas Hari Ini", icon: "today", href: "/kv-retail" },
  { label: "Tugas Belum Selesai", icon: "assignment_late", href: "/kv-retail/unfinished" },
  { label: "Tugas Bulan Ini", icon: "calendar_month", href: "/kv-retail/month" },
  { label: "Rekap Performa", icon: "analytics", href: "/kv-retail/performance" },
  { label: "Option Page", icon: "settings", href: "/kv-retail/option" },
];

const DESKTOP_PRIMARY_MENU: SideMenuItem[] = TASK_NAVIGATION_ITEMS.map((item) => ({
  ...item,
  status: item.label === "Rekap Performa" ? "Active" : undefined,
}));

export default function TaskPerformancePage() {
  const [tasks, setTasks] = useState<TaskPerformanceTask[]>([]);
  const [desktopSidebarVariant, setDesktopSidebarVariant] = useState<SideMenuVariant>("Collaps");
  const { user, hasPermission } = useAuth();

  useEffect(() => {
    void kvRetailApi.tasks.list()
      .then((data) => setTasks(data as TaskPerformanceTask[]))
      .catch((error) => {
        if (error instanceof ApiError && error.status === 403) {
          window.location.replace("/dashboard");
          return;
        }
        console.error("Gagal memuat performa task:", error);
      });
  }, []);

  useEffect(() => {
    if (user && !hasPermission("kv-retail.tasks.create")) {
      window.location.replace("/kv-retail");
    }
  }, [hasPermission, user]);

  return (
    <>
      <div className="lg:hidden">
        <Navbar />
      </div>

      <main className="min-h-[calc(100dvh-72px)] bg-white px-4 pt-3 lg:hidden">
        <h1 className="text-lg font-semibold leading-6 text-black">Rekap Performa</h1>
        <p className="mt-0.5 text-xs leading-4 text-[#7b868a]">
          Ringkasan performa seluruh task.
        </p>
        <TaskPerformanceMobile tasks={tasks} />
      </main>

      <div className="lg:hidden">
        <TaskMobileNavigation items={TASK_NAVIGATION_ITEMS} activeLabel="Rekap Performa" />
      </div>

      <div className="hidden min-h-screen grid-cols-[auto_minmax(0,1fr)] bg-[#f6faff] text-[#222] lg:grid">
        <SideMenu variant={desktopSidebarVariant} primaryItems={DESKTOP_PRIMARY_MENU} onVariantChange={setDesktopSidebarVariant} />
        <TaskDesktopPageTransition className="relative min-w-0 overflow-y-auto px-4 py-8 sm:px-8 lg:pl-12 lg:pr-16">
          <header className="relative min-h-[140px] gap-6 2xl:flex 2xl:items-center 2xl:justify-between">
            <div className="w-full max-w-[590px] shrink-0"><h1 className="text-[44px] font-semibold leading-[52px] tracking-[-0.96px] text-[#222] sm:text-[48px] sm:leading-[60px]">Rekap Performa</h1><p className="mt-3 text-base leading-5 tracking-[0.32px] text-[#6b7280]">Ringkasan performa seluruh task.</p></div>
            <div className="absolute right-0 top-1/2 flex -translate-y-1/2 shrink-0 items-center gap-3"><button type="button" className="flex h-11 items-center gap-2 rounded-xl border border-[#e2e6e9] bg-white px-4 text-sm font-medium text-[#3b4446]"><MaterialIcon name="calendar_month" size="auto" className="text-xl" />Bulan Ini<MaterialIcon name="keyboard_arrow_down" size="auto" className="text-xl" /></button><button type="button" className="flex h-11 items-center gap-2 rounded-xl bg-[#6d46eb] px-4 text-sm font-semibold text-white shadow-sm"><MaterialIcon name="download" size="auto" className="text-xl" />Export Report</button></div>
          </header>
          <TaskPerformanceDesktop tasks={tasks} showToolbar={false} />
        </TaskDesktopPageTransition>
      </div>
    </>
  );
}
