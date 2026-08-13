"use client";

import { useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import Container from "@/components/universe/Layouts/Container/Container";
import {
  getOddsTasks,
  OddsTask,
} from "@/features/odds/api";
import { TaskFeedbackToast, TaskFeedbackToastHost } from "@/components/odds/TaskCard";
import { OddsThemeContext } from "./odds-theme-context";
import { getEchoClient } from "@/core/realtime/client";
import { shouldHideOddsCancelSkipMenus } from "@/features/odds/menu-visibility";

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
  const { hasPermission, user } = useAuth();
  const hideCancelSkipMenus = shouldHideOddsCancelSkipMenus(user);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const canManageConfig = hasPermission("manage-odds-config");
  const canManageUsers = hasPermission("manage-users");
  const canShowConfigSections = canManageConfig && canManageUsers;
  const canReviewSpv = hasPermission("review-odds-leader");
  const canViewAllTasks = hasPermission("view-all-odds-tasks");
  const canApproveExtra = hasPermission("approve-odds-extra-revisions");
  const canApproveUrgent = hasPermission("approve-odds-urgent-revisions");
  const canManageEscalations = hasPermission("manage-odds-escalations");
  const canReviewQueueSkip = hasPermission("review-odds-queue-skip");
  const canViewReports = hasPermission("view-odds-reports");
  const canViewRankings = hasPermission("view-odds-rankings");
  const canCreateTask = hasPermission("create-odds-tasks");
  const canViewAssignedTasks = hasPermission("view-assigned-odds-tasks");
  const isRoot = user?.roles.some((role) => role.trim().toLowerCase() === "root") ?? false;

  // State to hold counts
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [countsError, setCountsError] = useState<string | null>(null);
  const [desktopTheme, setDesktopTheme] = useState<"light" | "dark" | "retro">("light");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [viewport, setViewport] = useState<"Mobile" | "Desktop">("Mobile");

  useEffect(() => {
    const updateViewport = () => setViewport(window.innerWidth >= 1024 ? "Desktop" : "Mobile");
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  // Load counts for menu badges
  const loadCounts = useCallback(async () => {
    try {
      const taskPage = await getOddsTasks({ skipAuthRedirect: true });
      const newCounts: Record<string, number> = {
        workspace: taskPage.data.length,
        all_tasks: taskPage.data.length,
        spv_review: taskPage.data.filter((t: OddsTask) => t.status === "spv_review").length,
        client_review: taskPage.data.filter((t: OddsTask) => t.status === "client_review").length,
        client_drafts: 0,
        client_all_requests: taskPage.data.length,
        client_queue: taskPage.data.filter((t: OddsTask) => t.status === "queued").length,
        client_working: taskPage.data.filter((t: OddsTask) => t.status === "in_progress").length,
        client_action_required: taskPage.data.filter((t: OddsTask) => t.status === "client_review").length,
        client_revisions: taskPage.data.filter((t: OddsTask) => t.task_type === "client_revision" && !["done", "cancelled", "cancelled_by_spv", "revision_rejected_by_spv"].includes(t.status)).length,
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
      setCountsError(err instanceof Error ? err.message : "Gagal memuat informasi ODDS.");
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadCounts();
    });

    if (!user?.id) return;

    const echo = getEchoClient();
    if (!echo) return;

    const channelName = `App.Models.Core.User.${user.id}`;
    const channel = echo.private(channelName);
    const handleTaskUpdated = (event: { task?: OddsTask }) => {
      void loadCounts();
      if (event.task) window.dispatchEvent(new CustomEvent("odds:task-updated", { detail: event.task }));
    };
    const handleTaskDeleted = (event: { task_id?: number | string }) => {
      void loadCounts();
      if (event.task_id !== undefined) window.dispatchEvent(new CustomEvent("odds:task-deleted", { detail: event.task_id }));
    };
    channel.listen(".odds.task.updated", handleTaskUpdated);
    channel.listen(".odds.task.deleted", handleTaskDeleted);

    return () => {
      channel.stopListening(".odds.task.updated");
      channel.stopListening(".odds.task.deleted");
      echo.leave(channelName);
    };
  }, [loadCounts, user?.id]);

  const activeSection = searchParams.get("section");
  // Next can preserve a trailing slash in the local URL. Normalize it so the
  // request page consistently receives its contained-scroll shell.
  const normalizedPathname = pathname.replace(/\/$/, "") || "/";
  const menuItems = useMemo<OddsMenuItem[]>(() => {
    const items: OddsMenuItem[] = [];

    if (!canShowConfigSections && !canReviewSpv && !canViewAllTasks && !canReviewQueueSkip) {
      if (canViewAssignedTasks) {
        items.push(
          { id: "workspace", label: "Dashboard", icon: "dashboard", href: "/odds", group: "tasks" },
          { id: "designer_today_tasks", label: "Tugas Hari Ini", icon: "today", href: "/odds?section=designer_today_tasks", group: "tasks" },
          { id: "designer_queue", label: "Dalam Antrean", icon: "hourglass_top", href: "/odds?section=designer_queue", group: "tasks" },
          { id: "designer_all_tasks", label: "Semua Tugas", icon: "assignment", href: "/odds?section=designer_all_tasks", group: "tasks" },
          { id: "designer_spv_review", label: "Review Leader", icon: "rate_review", href: "/odds?section=designer_spv_review", group: "tasks" },
          { id: "designer_client_review", label: "Review Client", icon: "reviews", href: "/odds?section=designer_client_review", group: "tasks" },
          { id: "designer_revisions", label: "Revisi", icon: "error", href: "/odds?section=designer_revisions", group: "tasks" },
          { id: "designer_done", label: "Selesai", icon: "task_alt", href: "/odds?section=designer_done", group: "tasks" },
          { id: "designer_report", label: "Report", icon: "monitoring", href: "/odds?section=designer_report", group: "reports" },
        );
      } else {
        items.push(
          { id: "workspace", label: "Dashboard", icon: "dashboard", href: "/odds", group: "tasks" },
          { id: "client_drafts", label: "Draft", icon: "draft", href: "/odds?section=client_drafts", group: "tasks" },
          { id: "client_all_requests", label: "Semua Request", icon: "assignment", href: "/odds?section=client_all_requests", group: "tasks" },
          { id: "client_queue", label: "Dalam Antrean", icon: "hourglass_top", href: "/odds?section=client_queue", group: "tasks" },
          { id: "client_working", label: "Sedang Dikerjakan", icon: "autorenew", href: "/odds?section=client_working", group: "tasks" },
          { id: "client_action_required", label: "Perlu Review", icon: "pending_actions", href: "/odds?section=client_action_required", group: "tasks" },
          { id: "client_revisions", label: "Revisi", icon: "error", href: "/odds?section=client_revisions", group: "tasks" },
          { id: "client_archive", label: "Selesai", icon: "task_alt", href: "/odds?section=client_archive", group: "tasks" }
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
        items.push({ id: "spv_review", label: "Review Leader", icon: "rate_review", href: "/odds?section=spv_review", group: "tasks" });
      }
      if (canReviewSpv || canViewAllTasks) {
        items.push({ id: "client_review", label: "Review Client", icon: "reviews", href: "/odds?section=client_review", group: "tasks" });
      }
      if (canApproveExtra || canApproveUrgent) {
        items.push({ id: "special_revisions", label: "Extra / Urgent", icon: "priority_high", href: "/odds?section=special_revisions", group: "tasks" });
      }
      if (canManageEscalations && !hideCancelSkipMenus) {
        items.push({ id: "cancel_requests", label: "Cancel", icon: "cancel", href: "/odds?section=cancel_requests", group: "tasks" });
      }
      if (canReviewQueueSkip && !hideCancelSkipMenus) {
        items.push({ id: "skip_requests", label: "Skip Antrean", icon: "skip_next", href: "/odds?section=skip_requests", group: "tasks" });
      }
      if (canViewReports) {
        items.push({ id: "reports", label: "Report", icon: "monitoring", href: "/odds?section=reports", group: "reports" });
      }
      if (canViewRankings) {
        items.push({ id: "rankings", label: "Ranking", icon: "leaderboard", href: "/odds?section=rankings", group: "reports" });
      }
      if (isRoot) {
        items.push({ id: "option", label: "Pengaturan", icon: "settings", href: "/odds/option", group: "manage" });
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
    hideCancelSkipMenus,
    canViewReports,
    canViewRankings,
    canViewAssignedTasks,
    isRoot,
  ]);

  const isSectionActive = useCallback((item: typeof menuItems[0]) => {
    if (normalizedPathname === "/odds/new" || normalizedPathname === "/odds/detail") {
      return false;
    }
    if (item.href === normalizedPathname) return true;
    if (activeSection) {
      return item.id === activeSection;
    }
    if (normalizedPathname !== "/odds") return false;

    const defaultItem = menuItems.find((menuItem) => menuItem.id === "all_tasks") ?? menuItems[0];
    return item.id === defaultItem?.id;
  }, [activeSection, menuItems, normalizedPathname]);

  const isNoPaddingPage = normalizedPathname === "/odds/new" || normalizedPathname === "/odds/detail";

  const sidebarItems = useMemo(() => [
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
        badge: item.group === "manage" || item.id === "workspace" || item.id === "client_all_requests" ? undefined : counts[item.id] > 0 ? counts[item.id] : undefined,
        isActive: isSectionActive(item),
        isHighlighted: false,
      }))),
  ], [canCreateTask, counts, isSectionActive, menuItems, normalizedPathname]);

  const activeHref = sidebarItems.find((item) => item.isActive)?.href ?? pathname;

  return (
    <OddsThemeContext.Provider value={{ theme: desktopTheme, setTheme: setDesktopTheme }}>
      <TaskFeedbackToast
        toast={countsError ? { status: "error", message: countsError } : null}
        onClose={() => setCountsError(null)}
      />
      <TaskFeedbackToastHost />
      <div className={`h-screen w-screen overflow-hidden ${desktopTheme === "dark" ? "bg-[#111413]" : desktopTheme === "retro" ? "bg-[#dfe2d3]" : "bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)]"}`}>
        <div id="odds-shell-modal-root" className="h-full">
          <Container
            viewport={viewport}
            contentProps={{
              className: `flex h-full w-full flex-col overflow-hidden rounded-[16px] shadow-[0px_14px_42px_0px_rgba(44,42,39,0.16)] ${desktopTheme === "dark" ? "bg-[#111413] text-white" : desktopTheme === "retro" ? "bg-[#c9ccc0] font-mono" : "bg-[#f3fbff]"}`,
              sidebarTheme: desktopTheme,
              sidebarExpanded,
              onToggleSidebarExpanded: () => setSidebarExpanded((current) => !current),
              onToggleSidebarTheme: () => setDesktopTheme((current) => current === "dark" ? "light" : "dark"),
              onToggleSidebarRetro: () => setDesktopTheme((current) => current === "retro" ? "light" : "retro"),
              contentProps: {
                className: isNoPaddingPage
                  ? "flex h-full min-h-0 w-full flex-1 flex-col items-stretch overflow-hidden p-4"
                  : "flex h-full min-h-0 w-full flex-1 flex-col items-start overflow-y-auto p-4 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden",
              },
            }}
            menuItems={sidebarItems}
            activeMenuHref={activeHref}
            menuTitle="ODDS"
          >
            <main aria-label="ODDS" className="flex h-full min-h-0 w-full flex-1 flex-col text-slate-800">
              {children}
            </main>
          </Container>
        </div>
      </div>
    </OddsThemeContext.Provider>
  );
}
