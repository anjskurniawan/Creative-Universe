"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth";
import { coreApi } from "@/core/api";

// Import Modular Components
import { ContentTitle } from "@/components/ui/ContentTitle/ContentTitle";
import { RootStatsGrid } from "@/app/(core)/panel/dashboard/_components/RootStatsGrid/RootStatsGrid";
import { ActivityLogSection } from "@/app/(core)/panel/dashboard/_components/ActivityLogSection/ActivityLogSection";
import { SystemEnvBar } from "@/app/(core)/panel/dashboard/_components/SystemEnvBar/SystemEnvBar";
import { DefaultStatsGrid } from "@/app/(core)/panel/dashboard/_components/DefaultStatsGrid/DefaultStatsGrid";
import { QuickActionsSection } from "@/app/(core)/panel/dashboard/_components/QuickActionsSection/QuickActionsSection";
import { DashboardSystemHealth } from "@/app/(core)/panel/dashboard/_components/DashboardSystemHealth/DashboardSystemHealth";
import { DashboardSystemControl } from "@/app/(core)/panel/dashboard/_components/DashboardSystemControl/DashboardSystemControl";
import type { DashboardStats } from "@/app/(core)/panel/dashboard/_components/Dashboard.types";

export default function PanelDashboardPage() {
  const { user, hasPermission } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    let active = true;
    const loadStats = async () => {
      try {
        const data = await coreApi.dashboard<DashboardStats>();
        if (active) setStats(data);
      } catch {
        if (active) {
          // Trigger global toast notification via window event
          window.dispatchEvent(
            new CustomEvent("show-toast", {
              detail: {
                status: "error",
                message: "Statistik dashboard belum dapat dimuat.",
              },
            })
          );
        }
      }
    };
    void loadStats();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <ContentTitle title="Dashboard" />

      {/* Stats and Panels */}
      {!stats ? (
        <LoadingState />
      ) : (
        <div className="flex flex-col gap-6 w-full">
          {stats.is_root && stats.root_metrics ? (
            <>
              <RootStatsGrid stats={stats} rootMetrics={stats.root_metrics} />
              <DashboardSystemHealth metrics={stats.root_metrics} />
              <DashboardSystemControl />
              <ActivityLogSection activities={stats.root_metrics.latest_activities} />
              <SystemEnvBar metrics={stats.root_metrics} />
            </>
          ) : (
            <DefaultStatsGrid stats={stats} />
          )}

          <QuickActionsSection hasPermission={hasPermission} />
        </div>
      )}
    </div>
  );
}

/**
 * Loading state spinner helper
 */
function LoadingState() {
  return (
    <div className="text-center py-12 text-cu-muted w-full">
      <span className="inline-block w-6 h-6 border-2 border-cu-ink/30 border-t-cu-ink rounded-full animate-spin align-middle mr-2"></span>
      <span>Memuat statistik dashboard...</span>
    </div>
  );
}
