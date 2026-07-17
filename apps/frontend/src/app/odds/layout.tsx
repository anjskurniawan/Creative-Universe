"use client";

import { useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { SideMenu, type SideMenuItem, type SideMenuVariant } from "@/components/side-menu";
import {
  getOddsTasks,
  OddsTask,
} from "@/features/odds/api";

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
  const [mobileSidebarVariant, setMobileSidebarVariant] = useState<SideMenuVariant>("Collaps");
  const [desktopSidebarVariant, setDesktopSidebarVariant] = useState<SideMenuVariant>("Expand");

  // Load counts for menu badges
  const loadCounts = useCallback(async () => {
    try {
      const taskPage = await getOddsTasks();
      const newCounts: Record<string, number> = {
        workspace: taskPage.data.length,
        all_tasks: taskPage.data.length,
        spv_review: taskPage.data.filter((t: OddsTask) => t.status === "spv_review").length,
        client_review: taskPage.data.filter((t: OddsTask) => t.status === "client_review").length,
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
  const usesContainedScroll = normalizedPathname === "/odds/new"
    || (normalizedPathname === "/odds" && activeSection === "all_tasks");
  const sidebarClassName = usesContainedScroll
    ? "!static !m-0 !h-full !min-h-0 !p-4"
    : "!m-0 !h-screen !p-4";

  const menuItems = useMemo<OddsMenuItem[]>(() => {
    const items: OddsMenuItem[] = [];

    if (!canShowConfigSections && !canReviewSpv && !canViewAllTasks && !canReviewQueueSkip) {
      if (canViewAssignedTasks) {
        items.push({
          id: "workspace",
          label: "Tugas Hari Ini",
          icon: "today",
          href: "/odds",
          group: "tasks",
        });
      } else {
        items.push({
          id: "workspace",
          label: "Daftar Request",
          icon: "request_page",
          href: "/odds",
          group: "tasks",
        });
      }
    } else {
      if (canShowConfigSections) {
        items.push(
          { id: "categories", label: "Kategori", icon: "category", href: "/odds?section=categories", group: "manage" },
          { id: "rules", label: "System Rules", icon: "rule", href: "/odds?section=rules", group: "manage" },
          { id: "designers", label: "Profil Designer", icon: "groups", href: "/odds?section=designers", group: "manage" }
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

    return item.id === menuItems[0]?.id;
  }, [activeSection, menuItems, normalizedPathname]);

  const sidebarItems = useMemo<SideMenuItem[]>(() => [
    ...(canCreateTask ? [{
      label: "Request Baru",
      icon: "add",
      href: "/odds/new",
      group: ODDS_GROUP_LABELS.tasks,
      status: "Highlight" as const,
      isActive: normalizedPathname === "/odds/new",
    }] : []),
    ...ODDS_GROUP_ORDER.flatMap((group) => menuItems
      .filter((item) => item.group === group)
      .map((item) => ({
        label: item.label,
        icon: item.icon,
        href: item.href,
        group: ODDS_GROUP_LABELS[group],
        badge: item.group === "manage" ? undefined : counts[item.id] > 0 ? counts[item.id] : undefined,
        status: isSectionActive(item) ? "Active" as const : "Default" as const,
        isActive: isSectionActive(item),
      }))),
  ], [canCreateTask, counts, isSectionActive, menuItems, normalizedPathname]);

  return (
    <div className={`${usesContainedScroll ? "h-screen overflow-hidden" : "min-h-screen"} bg-[#f6faff] font-sans text-cu-ink antialiased`}>
      <div className={`grid ${usesContainedScroll ? "h-full" : "min-h-screen"} grid-cols-[auto_minmax(0,1fr)]`}>
        <SideMenu variant={mobileSidebarVariant} primaryItems={sidebarItems} onVariantChange={setMobileSidebarVariant} className={`${sidebarClassName} lg:hidden`} />
        <SideMenu variant={desktopSidebarVariant} primaryItems={sidebarItems} onVariantChange={setDesktopSidebarVariant} className={`${sidebarClassName} hidden lg:flex`} />
        <main className={`min-w-0 px-4 py-6 sm:px-8 lg:px-12 lg:py-8 ${usesContainedScroll ? "h-full overflow-hidden" : ""}`}>
        <div className={`${usesContainedScroll ? "h-full min-h-0" : "min-h-full"} text-slate-800`}>
          {children}
        </div>
      </main>
      </div>
    </div>
  );
}
