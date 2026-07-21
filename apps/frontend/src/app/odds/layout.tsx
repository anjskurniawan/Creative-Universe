"use client";

import { useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { type SideMenuItem } from "@/components/side-menu";
import { PerformanceNavbar } from "@/features/kv-retail/components/performance-navbar";
import { PerformanceSidebar, type PerformanceSidebarItem } from "@/features/kv-retail/components/performance-sidebar";
import { useKvRetailDesktopSidebar } from "@/features/kv-retail/hooks/use-kv-retail-desktop-sidebar";
import {
  getOddsTasks,
  OddsTask,
} from "@/features/odds/api";
import { OddsThemeContext } from "./odds-theme-context";

type OddsMenuItem = {
  id: string;
  label: string;
  icon: string;
  href: string;
  group: "tasks" | "manage" | "reports";
};

const ODDS_GROUP_LABELS: Record<OddsMenuItem["group"], string> = {
  tasks: "Tugas",
  manage: "Kelola ODDS",
  reports: "Laporan",
};

const ODDS_GROUP_ORDER: OddsMenuItem["group"][] = ["tasks", "manage", "reports"];

export default function OddsLayout({ children }: { children: ReactNode }) {
  const { hasPermission } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const canManageConfig = hasPermission("manage-odds-config");
  const canManageUsers = hasPermission("manage-users");
  const canShowConfigSections = canManageConfig && canManageUsers;
  const canReviewSpv = hasPermission("review-odds-spv");
  const canViewAllTasks = hasPermission("view-all-odds-tasks");
  const canApproveExtra = hasPermission("approve-odds-extra-revisions");
  const canApproveUrgent = hasPermission("approve-odds-urgent-revisions");
  const canManageEscalations = hasPermission("manage-odds-escalations");
  const canReviewQueueSkip = hasPermission("review-odds-queue-skip");
  const canViewReports = hasPermission("view-odds-reports");
  const canViewRankings = hasPermission("view-odds-rankings");
  const canCreateTask = hasPermission("create-odds-tasks");
  const canViewAssignedTasks = hasPermission("view-assigned-odds-tasks");

  // State to hold counts
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [desktopTheme, setDesktopTheme] = useState<"light" | "dark" | "retro">("light");
  const { expanded: desktopShellExpanded, toggleExpanded: toggleDesktopShellExpanded } = useKvRetailDesktopSidebar();

  // Load counts for menu badges
  const loadCounts = useCallback(async () => {
    try {
      const taskPage = await getOddsTasks();
      const newCounts: Record<string, number> = {
        workspace: taskPage.data.length,
        all_tasks: taskPage.data.length,
        spv_review: taskPage.data.filter((t: OddsTask) => t.status === "spv_review").length,
        client_review: taskPage.data.filter((t: OddsTask) => t.status === "client_review").length,
        client_all_requests: taskPage.data.length,
        client_action_required: taskPage.data.filter((t: OddsTask) => t.status === "client_review").length,
        client_in_progress: taskPage.data.filter((t: OddsTask) => ["queued", "in_progress", "spv_review", "revision"].includes(t.status)).length,
        client_archive: taskPage.data.filter((t: OddsTask) => ["done", "cancelled", "cancelled_by_spv", "revision_rejected_by_spv"].includes(t.status)).length,
        special_revisions: taskPage.data
          .flatMap((t: OddsTask) => t.revisions ?? [])
          .filter((r: { status: string; revision_type: string }) => r.status === "pending_spv" && ["extra", "urgent_final"].includes(r.revision_type)).length,
        cancel_requests: taskPage.data
          .flatMap((t: OddsTask) => (t.cancel_requests ?? t.cancelRequests ?? []))
          .filter((r: { status: string }) => r.status === "pending").length,
        skip_requests: taskPage.data
          .flatMap((t: OddsTask) => (t.skip_requests ?? t.skipRequests ?? []))
          .filter((r: { status: string }) => r.status === "pending").length,
      };

      setCounts(newCounts);
    } catch (err) {
      console.error("Error loading counts for sidebar:", err);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadCounts();
    });
    const interval = setInterval(loadCounts, 15000);
    return () => clearInterval(interval);
  }, [loadCounts]);

  const activeSection = searchParams.get("section");
  // Next can preserve a trailing slash in the local URL. Normalize it so the
  // request page consistently receives its contained-scroll shell.
  const normalizedPathname = pathname.replace(/\/$/, "") || "/";
  const usesContainedScroll = normalizedPathname === "/odds" && (
    activeSection === "all_tasks"
    || (!activeSection && (canViewAllTasks || canReviewSpv))
  );
  const sidebarClassName = usesContainedScroll
    ? "!static !m-0 !h-full !min-h-0 !p-4"
    : "!m-0 !h-screen !p-4";

  const menuItems = useMemo<OddsMenuItem[]>(() => {
    const items: OddsMenuItem[] = [];

    if (!canShowConfigSections && !canReviewSpv && !canViewAllTasks && !canReviewQueueSkip) {
      if (canViewAssignedTasks) {
        items.push(
          { id: "workspace", label: "Dashboard", icon: "dashboard", href: "/odds", group: "tasks" },
          { id: "designer_today_tasks", label: "Tugas Hari Ini", icon: "today", href: "/odds?section=designer_today_tasks", group: "tasks" },
          { id: "designer_all_tasks", label: "Semua Tugas", icon: "assignment", href: "/odds?section=designer_all_tasks", group: "tasks" },
          { id: "designer_review", label: "Menunggu Review", icon: "pending_actions", href: "/odds?section=designer_review", group: "tasks" },
          { id: "designer_revisions", label: "Revisi", icon: "error", href: "/odds?section=designer_revisions", group: "tasks" },
          { id: "designer_done", label: "Selesai", icon: "task_alt", href: "/odds?section=designer_done", group: "tasks" },
          { id: "designer_report", label: "Laporan Kinerja", icon: "monitoring", href: "/odds?section=designer_report", group: "reports" },
          { id: "designer_settings", label: "Pengaturan & Jadwal", icon: "manage_accounts", href: "/odds?section=designer_settings", group: "manage" }
        );
      } else {
        items.push(
          { id: "workspace", label: "Dashboard", icon: "dashboard", href: "/odds", group: "tasks" },
          { id: "client_all_requests", label: "Semua Request", icon: "assignment", href: "/odds?section=client_all_requests", group: "tasks" },
          { id: "client_action_required", label: "Perlu Review", icon: "pending_actions", href: "/odds?section=client_action_required", group: "tasks" },
          { id: "client_in_progress", label: "Sedang Diproses", icon: "autorenew", href: "/odds?section=client_in_progress", group: "tasks" },
          { id: "client_archive", label: "Arsip", icon: "archive", href: "/odds?section=client_archive", group: "reports" }
        );
      }
    } else {
      if (canShowConfigSections) {
        items.push(
          { id: "categories", label: "Kategori", icon: "category", href: "/odds?section=categories", group: "manage" },
          { id: "rules", label: "System Rules", icon: "rule", href: "/odds?section=rules", group: "manage" },
          { id: "designers", label: "Profil Designer", icon: "groups", href: "/odds?section=designers", group: "manage" },
          { id: "schedules", label: "Jadwal & Libur", icon: "calendar_month", href: "/odds?section=schedules", group: "manage" }
        );
      }
      if (canReviewSpv) {
        items.push({ id: "spv_review", label: "Review SPV", icon: "rate_review", href: "/odds?section=spv_review", group: "tasks" });
      }
      if (canReviewSpv || canViewAllTasks) {
        items.push({ id: "client_review", label: "Review Client", icon: "reviews", href: "/odds?section=client_review", group: "tasks" });
      }
      if (canApproveExtra || canApproveUrgent) {
        items.push({ id: "special_revisions", label: "Extra / Urgent", icon: "priority_high", href: "/odds?section=special_revisions", group: "tasks" });
      }
      if (canManageEscalations) {
        items.push({ id: "cancel_requests", label: "Cancel", icon: "cancel", href: "/odds?section=cancel_requests", group: "tasks" });
      }
      if (canReviewQueueSkip) {
        items.push({ id: "skip_requests", label: "Skip Antrean", icon: "skip_next", href: "/odds?section=skip_requests", group: "tasks" });
      }
      if (canViewReports) {
        items.push({ id: "reports", label: "Report", icon: "monitoring", href: "/odds?section=reports", group: "reports" });
      }
      if (canViewRankings) {
        items.push({ id: "rankings", label: "Ranking", icon: "leaderboard", href: "/odds?section=rankings", group: "reports" });
      }
      if (canViewAllTasks || canReviewSpv) {
        items.push({ id: "all_tasks", label: "Semua Tugas", icon: "assignment", href: "/odds?section=all_tasks", group: "tasks" });
      }
    }
    return items;
  }, [
    canShowConfigSections,
    canReviewSpv,
    canViewAllTasks,
    canApproveExtra,
    canApproveUrgent,
    canManageEscalations,
    canReviewQueueSkip,
    canViewReports,
    canViewRankings,
    canViewAssignedTasks,
  ]);

  const isSectionActive = useCallback((item: typeof menuItems[0]) => {
    if (normalizedPathname === "/odds/new" || normalizedPathname === "/odds/detail") {
      return false;
    }
    if (activeSection) {
      return item.id === activeSection;
    }

    const defaultItem = menuItems.find((menuItem) => menuItem.id === "all_tasks") ?? menuItems[0];
    return item.id === defaultItem?.id;
  }, [activeSection, menuItems, normalizedPathname]);

  const sidebarItems = useMemo<PerformanceSidebarItem[]>(() => [
    ...(canCreateTask ? [{
      label: "Request Baru",
      icon: "add",
      href: "/odds/new",
      group: ODDS_GROUP_LABELS.tasks,
      isActive: normalizedPathname === "/odds/new",
      isHighlighted: true,
    }] : []),
    ...ODDS_GROUP_ORDER.flatMap((group) => menuItems
      .filter((item) => item.group === group)
      .map((item) => ({
        label: item.label,
        icon: item.icon,
        href: item.href,
        group: ODDS_GROUP_LABELS[group],
        badge: item.group === "manage" || item.id === "workspace" ? undefined : counts[item.id] > 0 ? counts[item.id] : undefined,
        isActive: isSectionActive(item),
        isHighlighted: false,
      }))),
  ], [canCreateTask, counts, isSectionActive, menuItems, normalizedPathname]);

  const activeMobileLabel = sidebarItems.find((item) => item.isActive)?.label;

  const navigationTitle = sidebarItems.find((item) => item.isActive)?.label ?? "Dashboard";
  const activeHref = sidebarItems.find((item) => item.isActive)?.href ?? pathname;
  const compactMobileMenuItems = useMemo(
    () => sidebarItems.map(({ label, href }) => ({ label, href })),
    [sidebarItems]
  );

  return (
    <OddsThemeContext.Provider value={{ theme: desktopTheme, setTheme: setDesktopTheme }}>
      {/* Mobile view */}
      <div
        className={`h-dvh overflow-hidden p-3 lg:hidden ${desktopTheme === "dark" ? "bg-[radial-gradient(circle_at_8%_6%,#294c3b_0,transparent_28%),radial-gradient(circle_at_91%_4%,#242a27_0,transparent_38%),linear-gradient(135deg,#111513_0%,#0b0d0c_58%,#1a1e1c_100%)]" : desktopTheme === "retro" ? "bg-[#dfe2d3] font-mono" : "bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)]"}`}
        data-kv-retail-mobile-theme={desktopTheme}
      >
        <div className={`flex h-[calc(100dvh-24px)] flex-col overflow-hidden rounded-[22px] ${desktopTheme === "dark" ? "border border-white/10 bg-[#111413]/90 shadow-[0_12px_32px_rgba(0,0,0,0.34)]" : desktopTheme === "retro" ? "border-[3px] border-[#24252b] bg-[#c9ccc0] shadow-[0_6px_0_#24252b]" : "border border-white/80 bg-white/80 shadow-[0_12px_32px_rgba(0,4,117,0.2)] backdrop-blur-md"}`}>
          <PerformanceNavbar
            theme={desktopTheme}
            title={navigationTitle}
            parentTitle="ODDS"
            compact
            compactMenuItems={compactMobileMenuItems}
          />
          <main aria-label="ODDS mobile" className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-6 pt-6">
            <div className={`flex-1 min-h-0 ${usesContainedScroll ? "h-full overflow-hidden flex flex-col w-full" : "overflow-y-auto"} text-slate-800`}>
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Desktop view */}
      <div className={`hidden h-screen min-h-0 flex-col text-[#222] lg:flex ${desktopTheme === "dark" ? "bg-[radial-gradient(circle_at_8%_6%,#294c3b_0,transparent_28%),radial-gradient(circle_at_91%_4%,#242a27_0,transparent_38%),linear-gradient(135deg,#111513_0%,#0b0d0c_58%,#1a1e1c_100%)] p-6" : desktopTheme === "retro" ? "bg-[#dfe2d3] p-6" : "bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)] p-6"}`}>
        <div className={`flex min-h-0 flex-1 flex-col overflow-hidden ${desktopTheme === "light" ? "rounded-[26px] border border-white/80 bg-white/80 shadow-[0_14px_42px_rgba(44,42,39,0.16)] backdrop-blur-md" : desktopTheme === "dark" ? "rounded-[26px] border border-white/10 bg-[#111413]/90 shadow-[0_14px_42px_rgba(0,0,0,0.45)] backdrop-blur-md" : "rounded-[30px] border-[3px] border-[#24252b] bg-[#c9ccc0] font-mono shadow-[0_8px_0_#24252b]"}`}>
          <PerformanceNavbar theme={desktopTheme} title={navigationTitle} parentTitle="ODDS" />
          <div className="flex min-h-0 flex-1">
            <PerformanceSidebar
              theme={desktopTheme}
              primaryItems={sidebarItems}
              activeHref={activeHref}
              settingsHref=""
              ariaLabel="Navigasi ODDS"
              onToggleTheme={() => setDesktopTheme((t) => t === "dark" ? "light" : "dark")}
              onToggleRetro={() => setDesktopTheme((t) => t === "retro" ? "light" : "retro")}
              expanded={desktopShellExpanded}
              onToggleExpanded={toggleDesktopShellExpanded}
            />
            <main className={`relative min-w-0 flex min-h-0 flex-1 flex-col ${usesContainedScroll ? "h-full" : "overflow-y-auto"}`}>
              <div className={`${usesContainedScroll ? "h-full min-h-0 flex flex-col flex-1 w-full" : "min-h-full flex flex-col flex-1 w-full"} text-slate-800`}>
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </OddsThemeContext.Provider>
  );
}
