import React from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";
import { Table, type Column } from "@/components/ui/Table/Table";
import type { ActivityItem } from "../Dashboard.types";

interface ActivityLogSectionProps {
  activities: ActivityItem[];
}

const formatRelativeTime = (dateStr: string | null) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "Baru saja";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit yang lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam yang lalu`;
    return date.toLocaleDateString("id-ID");
  } catch {
    return "";
  }
};

export function ActivityLogSection({ activities }: ActivityLogSectionProps) {
  const columns: Column<ActivityItem>[] = [
    {
      header: "Operator",
      render: (act) => act.causer_name,
      className: "font-semibold text-cu-ink",
    },
    {
      header: "Kategori",
      render: (act) => (
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 font-medium ring-1 ring-inset uppercase text-[10px] ${
            act.log_name === "auth"
              ? "bg-cu-info-soft text-cu-info ring-cu-info/20"
              : act.log_name === "rbac"
              ? "bg-purple-50 text-purple-700 ring-purple-700/20"
              : "bg-cu-warning-soft text-cu-warning ring-cu-warning/20"
          }`}
        >
          {act.log_name || "system"}
        </span>
      ),
    },
    {
      header: "Aktivitas",
      render: (act) => act.description,
      className: "text-cu-muted font-mono max-w-xs truncate",
    },
    {
      header: "Waktu",
      render: (act) => formatRelativeTime(act.created_at),
      className: "text-right text-cu-muted whitespace-nowrap",
      headerClassName: "text-right",
    },
  ];

  return (
    <div className="rounded-xl border border-cu-line bg-cu-surface p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-cu-line pb-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-cu-ink flex items-center gap-2">
            <MaterialIcon name="history" size="sm" className="text-cu-muted" />
            Log Aktivitas Sistem Terbaru
          </h2>
          <p className="text-xs text-cu-muted mt-0.5">Memantau tindakan administratif dan aktivitas keamanan global.</p>
        </div>
        <div className="text-[10px] uppercase font-bold text-cu-muted tracking-wider bg-cu-panel-soft px-2.5 py-1 rounded-full">
          Real-time (30s)
        </div>
      </div>

      <Table
        data={activities}
        columns={columns}
        keyExtractor={(act) => act.id}
        emptyState="Belum ada aktivitas tercatat di sistem."
      />
    </div>
  );
}
