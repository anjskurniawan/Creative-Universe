"use client";

import React from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export interface SystemStatus {
  app_env: string;
  cache_driver: string;
  queue_connection: string;
  failed_jobs_count: number;
  disk_free_space: string;
  log_file_size: string;
}

interface SystemStatusGridProps {
  status: SystemStatus | null;
  isLoading: boolean;
}

export function SystemStatusGrid({ status, isLoading }: SystemStatusGridProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-cu-line bg-cu-surface p-12 text-center text-sm text-cu-muted">
        Memuat status sistem...
      </div>
    );
  }

  if (!status) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatusCard
        label="Environment"
        value={status.app_env.toUpperCase()}
        icon="dns"
        highlight={status.app_env === "production" ? "danger" : "info"}
      />
      <StatusCard label="Cache Driver" value={status.cache_driver} icon="storage" />
      <StatusCard label="Queue Connection" value={status.queue_connection} icon="sync_alt" />
      <StatusCard
        label="Failed Jobs"
        value={status.failed_jobs_count}
        icon="report"
        highlight={status.failed_jobs_count > 0 ? "danger" : "success"}
      />
      <StatusCard label="Disk Space Free" value={status.disk_free_space} icon="disc_full" />
      <StatusCard label="Laravel Log Size" value={status.log_file_size} icon="description" />
    </div>
  );
}

function StatusCard({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: string | number;
  icon: string;
  highlight?: "success" | "danger" | "info";
}) {
  const highlightClasses = {
    success: "text-cu-success",
    danger: "text-cu-danger font-bold animate-pulse",
    info: "text-cu-primary",
  };

  return (
    <div className="rounded-2xl border border-cu-line bg-cu-surface p-4 shadow-sm flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-cu-panel-soft text-cu-muted">
        <MaterialIcon name={icon} size="xs" />
      </span>
      <div className="min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-wide text-cu-muted">{label}</span>
        <span
          className={`block truncate text-sm font-extrabold ${
            highlight ? highlightClasses[highlight] : "text-cu-ink"
          }`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
