"use client";

import { useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { MaterialIcon } from "@/components/material-icon";
import {
  getOddsConfigCategories,
  getOddsConfigDesignerProfiles,
  getOddsSystemRules,
  getOddsTasks,
  OddsTask,
} from "@/lib/odds";

type OddsMenuItem = {
  id: string;
  label: string;
  icon: string;
  href: string;
};

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

    if (!canShowConfigSections && !canReviewSpv && !canViewAllTasks) {
      if (canViewAssignedTasks) {
        items.push({
          id: "workspace",
          label: "Tugas Hari Ini",
          icon: "today",
          href: "/odds",
        });
      } else {
        items.push({
          id: "workspace",
          label: "Daftar Request",
          icon: "request_page",
          href: "/odds",
        });
      }
    } else {
      if (canShowConfigSections) {
        items.push(
          { id: "categories", label: "Kategori", icon: "category", href: "/odds?section=categories" },
          { id: "designers", label: "Profil Desainer", icon: "groups", href: "/odds?section=designers" },
          { id: "rules", label: "System Rules", icon: "rule", href: "/odds?section=rules" }
        );
      }
      if (canReviewSpv) {
        items.push({ id: "spv_review", label: "Review SPV", icon: "rate_review", href: "/odds?section=spv_review" });
      }
      if (canReviewSpv || canViewAllTasks) {
        items.push({ id: "client_review", label: "Review Client", icon: "reviews", href: "/odds?section=client_review" });
      }
      if (canApproveExtra || canApproveUrgent) {
        items.push({ id: "special_revisions", label: "Extra / Urgent", icon: "priority_high", href: "/odds?section=special_revisions" });
      }
      if (canManageEscalations) {
        items.push({ id: "cancel_requests", label: "Cancel", icon: "cancel", href: "/odds?section=cancel_requests" });
      }
      if (canViewReports) {
        items.push({ id: "reports", label: "Reports", icon: "monitoring", href: "/odds?section=reports" });
      }
      if (canViewRankings) {
        items.push({ id: "rankings", label: "Rankings", icon: "leaderboard", href: "/odds?section=rankings" });
      }
      if (canViewAllTasks || canReviewSpv) {
        items.push({ id: "all_tasks", label: "Semua Task", icon: "assignment", href: "/odds?section=all_tasks" });
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
    canViewReports,
    canViewRankings,
    canViewAssignedTasks,
  ]);

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
    <div className="flex flex-1 w-full bg-white gap-6">
      {/* Sidebar */}
      <aside className="w-72 bg-white flex flex-col shrink-0 h-[calc(100vh-7rem)] sticky top-20 select-none overflow-y-auto">
        <div className="flex flex-col gap-6 p-5">
          {/* Logo & Header */}
          <div className="flex items-center gap-3.5 mb-1">
            <div className="w-auto h-[56px] text-[#18181b] flex items-center justify-center shrink-0">
              <svg width="40" height="81" viewBox="0 0 40 81" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M39.9999 30.254C39.9999 32.7098 38.9749 34.7649 37.4482 36.4061C35.7772 37.8206 33.7271 38.6778 31.4446 38.6923L21.8079 38.755V0.671387L31.444 0.723983C33.7265 0.736293 35.7766 1.5963 37.4488 3.0052C38.9755 4.64576 39.9959 6.72107 39.9959 9.07448L39.9994 30.254H39.9999ZM34.109 29.6245L34.1033 9.70283C34.1027 7.5503 32.4904 5.99032 30.4138 6.01942L27.716 6.05691V33.3941L30.4932 33.3946C32.5358 33.3946 34.1096 31.8514 34.109 29.6245Z" fill="currentColor"/>
                <path d="M38.9824 75.5446C37.1399 80.1714 31.612 81.1187 26.9883 79.9084C23.9753 79.1195 21.9436 76.7325 21.5318 73.702C21.3339 72.2478 21.3742 70.7986 21.3822 69.2274L27.0603 68.6892L27.1529 72.3799C27.1977 74.1665 28.7681 75.0281 30.3626 75.0556C32.4869 75.0919 33.6132 73.7407 33.7242 71.7773C33.8554 69.4451 33.577 67.2333 31.8013 65.5765L28.1952 62.2114C24.4942 58.758 21.2896 56.0761 21.365 50.238C21.3816 48.9522 21.4518 47.6708 21.7889 46.4516C23.1435 41.5501 28.6306 40.2027 33.4211 41.4454C37.691 42.5533 39.2297 46.3945 38.9772 50.586L33.3112 51.1271L33.1645 48.6019C33.0806 47.1583 31.738 46.4141 30.4207 46.3626C28.6605 46.2938 27.4963 47.3262 27.322 48.9813C26.89 53.0849 29.44 55.3051 32.587 57.9332C36.9806 61.6032 39.8055 64.9078 39.645 70.7399C39.5996 72.3967 39.5933 74.0143 38.9835 75.5446H38.9824Z" fill="currentColor"/>
                <path d="M14.762 38.025C11.4458 39.9033 7.30133 39.8541 4.07662 38.0227C1.58532 36.6071 0.000575225 33.8453 0 30.9491V8.46141C0 5.62234 1.52952 2.903 3.94662 1.46779C7.22655 -0.479388 11.5258 -0.483305 14.827 1.42079C17.3545 2.87894 18.8524 5.71186 18.8519 8.6427L18.8507 30.7684C18.8507 33.6914 17.3781 36.5433 14.7626 38.025H14.762ZM15.5575 17.4766L16.4808 15.5121C16.7552 14.9285 16.6407 14.0154 15.947 13.7177L9.6609 11.0207C9.00285 10.7387 8.24297 10.9329 7.92372 11.6094L6.9608 13.6472C6.68296 14.2358 6.79801 15.1361 7.50956 15.441L13.7876 18.1302C14.4583 18.4178 15.2015 18.2326 15.557 17.4761L15.5575 17.4766ZM5.61477 29.9766C7.88001 27.9797 10.2148 26.5926 12.9771 25.5272C14.7459 25.0253 13.7168 22.2276 13.3947 19.5822L7.37611 16.9613C7.0931 16.8382 6.37292 16.9372 6.12672 17.1113L2.94343 19.3595C2.59772 19.6034 2.39581 20.2402 2.42687 20.7443C3.61414 23.5375 4.16578 26.3122 4.16003 29.3505C4.25264 29.6219 4.44016 30.0041 4.63056 30.1042C4.82096 30.2044 5.33004 30.0958 5.61477 29.9766Z" fill="currentColor"/>
                <path d="M8.28027 24.0904C9.37661 24.0904 10.2654 23.2242 10.2654 22.1556C10.2654 21.087 9.37661 20.2207 8.28027 20.2207C7.18393 20.2207 6.29517 21.087 6.29517 22.1556C6.29517 23.2242 7.18393 24.0904 8.28027 24.0904Z" fill="currentColor"/>
                <path d="M18.9716 71.2462C18.9716 73.702 17.9466 75.7572 16.4199 77.3983C14.7489 78.8128 12.6988 79.67 10.4163 79.6846L0.779541 79.7472V41.6631L10.4157 41.7157C12.6982 41.728 14.7483 42.588 16.4205 43.9969C17.9471 45.6375 18.9676 47.7128 18.9676 50.0662L18.971 71.2457L18.9716 71.2462ZM13.0807 70.6162L13.075 50.6945C13.0744 48.542 11.462 46.982 9.38548 47.0111L6.68768 47.0486V74.3858L9.46486 74.3863C11.5075 74.3863 13.0813 72.8431 13.0807 70.6162Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="flex-1 select-none">
              <h1 className="font-bold text-lg leading-[1.1]  text-slate-900 uppercase">
                ONE DASHBOARD DESIGN SYSTEM
              </h1>
            </div>
          </div>

          {/* New Request Button */}
          {canCreateTask && (
            <Link
              href="/odds/new"
              className="w-full py-2 px-3 rounded-lg bg-[#0085ff] hover:bg-[#0076e4] text-white flex items-center justify-start gap-2.5 font-medium text-[13px] transition-colors shadow-sm"
            >
              <MaterialIcon name="add" size="xs" className="shrink-0" />
              <span>Request Baru</span>
            </Link>
          )}

          {/* Navigation Menu */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-medium text-slate-400 px-3 mb-2">Menu</h3>
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => {
                const active = isSectionActive(item);
                const count = counts[item.id] ?? 0;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-[13px] ${
                      active
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MaterialIcon name={item.icon} size="xs" className="shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {count > 0 && (
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                        active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                      }`}>
                        {count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto max-h-[calc(100vh-7rem)]">
        <div className="bg-white p-6 min-h-full text-slate-800">
          {children}
        </div>
      </main>
    </div>
  );
}
