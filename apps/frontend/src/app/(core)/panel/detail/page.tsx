"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { coreApi } from "@/core/api";

// Import Modular Components
import { ContentTitle } from "@/components/ui/content-title";
import { RootStatsGrid } from "@/components/panel/root-stats-grid";
import { ActivityLogSection } from "@/components/panel/activity-log-section";
import { SystemEnvBar } from "@/components/panel/system-env-bar";
import { DefaultStatsGrid } from "@/components/panel/default-stats-grid";
import { QuickActionsSection } from "@/components/panel/quick-actions-section";
import { PanelSystemHealth } from "@/components/panel/panel-system-health";
import { PanelSystemControl } from "@/components/panel/panel-system-control";
import type { PanelStats } from "@/components/panel/panel.types";

export default function PanelDetailPage() {
  const { user, hasPermission } = useAuth();
  const [stats, setStats] = useState<PanelStats | null>(null);

  useEffect(() => {
    let active = true;
    const loadStats = async () => {
      try {
        const data = await coreApi.dashboard<PanelStats>();
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
              <PanelSystemHealth metrics={stats.root_metrics} />
              <PanelSystemControl />
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
