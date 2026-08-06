import React from "react";
import { StatCard } from "@/components/ui/stat-card";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { PanelStats, RootMetrics } from "./panel.types";

interface RootStatsGridProps {
  stats: PanelStats;
  rootMetrics: RootMetrics;
}

export function RootStatsGrid({ stats, rootMetrics }: RootStatsGridProps) {
  const hasFailedJobs = rootMetrics.failed_jobs > 0;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {/* 1. Active & Suspended Users */}
      <StatCard
        title="Pengguna Sistem"
        value={
          <>
            {stats.active_users}{" "}
            <span className="text-sm font-normal text-cu-muted">Aktif</span>
          </>
        }
        subtitle={
          rootMetrics.suspended_users > 0 ? (
            <span className="font-semibold text-cu-danger flex items-center gap-1">
              <span className="inline-block size-1.5 rounded-full bg-cu-danger animate-pulse" />
              {rootMetrics.suspended_users} Terbanned
            </span>
          ) : (
            <span className="text-cu-muted">Semua akun aktif terverifikasi</span>
          )
        }
        icon="groups"
        iconBgClass="bg-cu-info-soft"
        iconColorClass="text-cu-info"
        borderHoverClass="hover:border-cu-info/30"
      />

      {/* 2. Global Active Sessions */}
      <StatCard
        title="Sesi Perangkat Aktif"
        value={rootMetrics.total_sessions}
        subtitle={<span className="text-cu-muted">Perangkat terhubung saat ini</span>}
        icon="devices"
        iconBgClass="bg-purple-50"
        iconColorClass="text-purple-600"
        borderHoverClass="hover:border-purple-500/30"
      />

      {/* 3. Queue Health */}
      <StatCard
        title="Antrean Pekerjaan"
        value={
          <>
            {rootMetrics.pending_jobs}{" "}
            <span className="text-sm font-normal text-cu-muted">Pending</span>
          </>
        }
        subtitle={
          hasFailedJobs ? (
            <span className="font-semibold text-cu-danger flex items-center gap-1">
              <MaterialIcon name="error" size="xs" className="text-cu-danger" />
              {rootMetrics.failed_jobs} Pekerjaan Gagal
            </span>
          ) : (
            <span className="text-cu-success flex items-center gap-1">
              <MaterialIcon name="check_circle" size="xs" className="text-cu-success" />
              Semua berjalan lancar
            </span>
          )
        }
        icon={hasFailedJobs ? "error_outline" : "queue"}
        iconBgClass={hasFailedJobs ? "bg-cu-danger-soft" : "bg-cu-success-soft"}
        iconColorClass={hasFailedJobs ? "text-cu-danger" : "text-cu-success"}
        borderHoverClass={hasFailedJobs ? "hover:border-cu-danger/45" : "hover:border-cu-success/30"}
        className={hasFailedJobs ? "border-cu-danger/45 bg-cu-danger-soft/20" : ""}
      />

      {/* 4. Database Info */}
      <StatCard
        title="Ukuran Basis Data"
        value={rootMetrics.database_size}
        subtitle={
          <span className="text-cu-muted uppercase font-mono">
            {rootMetrics.database_driver} connection
          </span>
        }
        icon="storage"
        iconBgClass="bg-cu-warning-soft"
        iconColorClass="text-cu-warning"
        borderHoverClass="hover:border-cu-warning/30"
      />

      {/* 5. Git Repository Info */}
      <StatCard
        title="Repositori Git"
        value={rootMetrics.git_branch}
        subtitle={
          <span className="text-cu-muted font-mono block truncate max-w-[180px]" title={rootMetrics.git_commit}>
            {rootMetrics.git_commit}
          </span>
        }
        icon="account_tree"
        iconBgClass="bg-slate-100"
        iconColorClass="text-slate-600"
        borderHoverClass="hover:border-slate-300"
      />
    </div>
  );
}
