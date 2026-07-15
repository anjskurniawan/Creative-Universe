"use client";

import { useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { MaterialIcon } from "@/components/material-icon";
import { SubAppShell } from "@/shared/layouts/sub-app-shell";
import {
  getOddsConfigCategories,
  getOddsConfigDesignerProfiles,
  getOddsSystemRules,
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

const ODDS_MENU_GROUPS: Array<{
  id: OddsMenuItem["group"];
  label: string;
}> = [
  { id: "tasks", label: "TUGAS" },
  { id: "manage", label: "KELOLA ODDS" },
  { id: "reports", label: "LAPORAN" },
];

function getMenuItemClass(active: boolean) {
  return [
    "group flex min-h-11 w-full max-w-[240px] items-center gap-3 rounded-2xl px-5 py-3",
    "text-sm font-medium leading-5 transition-[background-color,color,box-shadow] duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3aed] focus-visible:ring-offset-2",
    active
      ? "bg-gradient-to-r from-[#7c3aed] to-[#db2777] text-white shadow-sm"
      : "text-[#374151] hover:bg-[#ede9fe] hover:text-[#7c3aed] hover:shadow-[0_4px_6px_rgba(124,58,237,0.13)]",
  ].join(" ");
}

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

      if (canShowConfigSections) {
        const [categories, designers, rules] = await Promise.all([
          getOddsConfigCategories(),
          getOddsConfigDesignerProfiles(),
          getOddsSystemRules(),
        ]);
        newCounts.categories = categories.length;
        newCounts.designers = designers.length;
        newCounts.rules = rules.length;
      }
      setCounts(newCounts);
    } catch (err) {
      console.error("Error loading counts for sidebar:", err);
    }
  }, [canShowConfigSections]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadCounts();
    });
    const interval = setInterval(loadCounts, 15000);
    return () => clearInterval(interval);
  }, [loadCounts]);

  const activeSection = searchParams.get("section");

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

  const groupedMenuItems = useMemo(() => {
    const taskOrder = ["spv_review", "client_review", "skip_requests", "cancel_requests", "all_tasks", "special_revisions"];
    const reportOrder = ["rankings", "reports"];

    return ODDS_MENU_GROUPS.map((group) => {
      const items = menuItems.filter((item) => item.group === group.id);
      const order = group.id === "tasks" ? taskOrder : group.id === "reports" ? reportOrder : [];

      if (order.length > 0) {
        items.sort((a, b) => {
          const aIndex = order.indexOf(a.id);
          const bIndex = order.indexOf(b.id);
          return (aIndex === -1 ? -1 : aIndex) - (bIndex === -1 ? -1 : bIndex);
        });
      }

      return { ...group, items };
    }).filter((group) => group.items.length > 0);
  }, [menuItems]);

  const isSectionActive = (item: typeof menuItems[0]) => {
    if (pathname === "/odds/new" || pathname === "/odds/detail") {
      return false;
    }
    if (activeSection) {
      return item.id === activeSection;
    }

    return item.id === menuItems[0]?.id;
  };

  return (
    <SubAppShell mainClassName="w-full mx-auto pt-0 pb-8 px-6 md:px-16 relative z-10">
      <div className="flex w-full flex-1 gap-6 bg-white">
      {/* Sidebar */}
      <aside className="sticky top-20 flex h-[calc(100vh-7rem)] w-[275px] shrink-0 select-none flex-col overflow-hidden bg-white">
        <header className="border-b border-[rgba(156,163,175,0.5)] px-8 py-4">
          <p className="text-sm font-semibold leading-5 text-[#111827]">
            <span className="block">One Dashboard</span>
            <span className="block">Design System</span>
          </p>
        </header>

        <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-2">
          {canCreateTask && (
            <Link
              href="/odds/new"
              aria-current={pathname === "/odds/new" ? "page" : undefined}
              className={getMenuItemClass(pathname === "/odds/new")}
            >
              <MaterialIcon name="add" size="sm" weight={300} filled={false} className="shrink-0" />
              <span>Request Baru</span>
            </Link>
          )}

          <Link href="/messages" className={getMenuItemClass(false)}>
            <MaterialIcon name="mail" size="sm" weight={300} filled={false} className="shrink-0" />
            <span>Inbox</span>
          </Link>

          {groupedMenuItems.map((group) => (
            <section key={group.id} aria-labelledby={`odds-menu-${group.id}`} className="flex flex-col gap-2">
              <h2
                id={`odds-menu-${group.id}`}
                className="flex items-center gap-1 text-sm font-medium leading-5 text-[#898787]"
              >
                <MaterialIcon name="keyboard_arrow_down" size="sm" weight={300} filled={false} className="shrink-0" />
                <span>{group.label}</span>
              </h2>

              <nav aria-label={group.label} className="flex flex-col gap-2">
                {group.items.map((item) => {
                  const active = isSectionActive(item);
                  const count = counts[item.id] ?? 0;

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={getMenuItemClass(active)}
                    >
                      <MaterialIcon name={item.icon} size="sm" weight={300} filled={false} className="shrink-0" />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {count > 0 && (
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium leading-4 ${
                            active
                              ? "bg-white/20 text-white"
                              : "bg-[#ede9fe] text-[#7c3aed] group-hover:bg-white/70"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </section>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto max-h-[calc(100vh-7rem)]">
        <div className="bg-white p-6 min-h-full text-slate-800">
          {children}
        </div>
      </main>
      </div>
    </SubAppShell>
  );
}
