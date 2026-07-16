"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { coreApi } from "@/core/api";
import { useAuth } from "@/providers/auth-provider";
import { MaterialIcon } from "@/components/material-icon";

interface ActivityItem {
  id: number;
  log_name: string | null;
  description: string;
  causer_name: string;
  created_at: string | null;
}

interface RootMetrics {
  total_sessions: number;
  suspended_users: number;
  pending_jobs: number;
  failed_jobs: number;
  database_driver: string;
  database_size: string;
  laravel_version: string;
  php_version: string;
  latest_activities: ActivityItem[];
}

interface DashboardStats {
  active_users: number;
  pending_users: number | null;
  roles: string[];
  is_root: boolean;
  root_metrics: RootMetrics | null;
}

export default function DashboardPage() {
  const { user, hasPermission } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadStats = async () => {
      try {
        const data = await coreApi.dashboard<DashboardStats>();
        if (active) setStats(data);
      } catch {
        if (active) setError("Statistik dashboard belum dapat dimuat.");
      }
    };
    void loadStats();
    return () => {
      active = false;
    };
  }, []);

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

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="border-b border-cu-line bg-cu-surface -mx-4 -mt-6 mb-6 px-4 py-5 md:-mx-16 md:px-16">
        <div>
          <h1 className="text-2xl font-semibold text-cu-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-cu-muted">Selamat datang kembali, {user?.name}.</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-cu-danger">
          {error}
        </div>
      )}

      {!stats ? (
        !error && (
          <div className="text-center py-12 text-cu-muted">
            <span className="inline-block w-6 h-6 border-2 border-cu-ink/30 border-t-cu-ink rounded-full animate-spin align-middle mr-2"></span>
            <span>Memuat statistik dashboard...</span>
          </div>
        )
      ) : (
        <>
          {stats.is_root && stats.root_metrics ? (
            <>
              {/* Root-Specific Stats Grid */}
              <div className="mb-2 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* 1. Active & Suspended Users */}
                <div className="rounded-xl border border-cu-line bg-cu-surface p-6 shadow-sm transition-all duration-200 hover:scale-[1.01] hover:border-cu-info/30 flex items-center justify-between gap-4">
                  <div>
                    <p className="mb-1 text-sm text-cu-muted">Pengguna Sistem</p>
                    <p className="text-3xl font-bold text-cu-ink">
                      {stats.active_users}{" "}
                      <span className="text-sm font-normal text-cu-muted">Aktif</span>
                    </p>
                    {stats.root_metrics.suspended_users > 0 ? (
                      <p className="mt-1.5 text-xs font-semibold text-cu-danger flex items-center gap-1">
                        <span className="inline-block size-1.5 rounded-full bg-cu-danger animate-pulse"></span>
                        {stats.root_metrics.suspended_users} Terbanned
                      </p>
                    ) : (
                      <p className="mt-1.5 text-xs text-cu-muted">Semua akun terverifikasi aktif</p>
                    )}
                  </div>
                  <div className="flex size-12 items-center justify-center rounded-xl bg-cu-info-soft text-cu-info">
                    <MaterialIcon name="groups" size="md" />
                  </div>
                </div>

                {/* 2. Global Active Sessions */}
                <div className="rounded-xl border border-cu-line bg-cu-surface p-6 shadow-sm transition-all duration-200 hover:scale-[1.01] hover:border-purple-500/30 flex items-center justify-between gap-4">
                  <div>
                    <p className="mb-1 text-sm text-cu-muted">Sesi Perangkat Aktif</p>
                    <p className="text-3xl font-bold text-cu-ink">{stats.root_metrics.total_sessions}</p>
                    <p className="mt-1.5 text-xs text-cu-muted">Perangkat terhubung saat ini</p>
                  </div>
                  <div className="flex size-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <MaterialIcon name="devices" size="md" />
                  </div>
                </div>

                {/* 3. Queue Health */}
                {stats.root_metrics.failed_jobs > 0 ? (
                  <div className="rounded-xl border border-cu-danger/45 bg-cu-danger-soft/20 p-6 shadow-sm transition-all duration-200 hover:scale-[1.01] flex items-center justify-between gap-4">
                    <div>
                      <p className="mb-1 text-sm text-cu-danger">Antrean Pekerjaan</p>
                      <p className="text-3xl font-bold text-cu-danger">
                        {stats.root_metrics.pending_jobs}{" "}
                        <span className="text-sm font-normal text-cu-muted">Pending</span>
                      </p>
                      <p className="mt-1.5 text-xs font-semibold text-cu-danger flex items-center gap-1">
                        <MaterialIcon name="error" size="xs" className="text-cu-danger" />
                        {stats.root_metrics.failed_jobs} Pekerjaan Gagal
                      </p>
                    </div>
                    <div className="flex size-12 items-center justify-center rounded-xl bg-cu-danger-soft text-cu-danger">
                      <MaterialIcon name="error_outline" size="md" />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-cu-line bg-cu-surface p-6 shadow-sm transition-all duration-200 hover:scale-[1.01] hover:border-cu-success/30 flex items-center justify-between gap-4">
                    <div>
                      <p className="mb-1 text-sm text-cu-muted">Antrean Pekerjaan</p>
                      <p className="text-3xl font-bold text-cu-ink">
                        {stats.root_metrics.pending_jobs}{" "}
                        <span className="text-sm font-normal text-cu-muted">Pending</span>
                      </p>
                      <p className="mt-1.5 text-xs text-cu-success flex items-center gap-1">
                        <MaterialIcon name="check_circle" size="xs" className="text-cu-success" />
                        Semua berjalan lancar
                      </p>
                    </div>
                    <div className="flex size-12 items-center justify-center rounded-xl bg-cu-success-soft text-cu-success">
                      <MaterialIcon name="queue" size="md" />
                    </div>
                  </div>
                )}

                {/* 4. Database Info */}
                <div className="rounded-xl border border-cu-line bg-cu-surface p-6 shadow-sm transition-all duration-200 hover:scale-[1.01] hover:border-cu-warning/30 flex items-center justify-between gap-4">
                  <div>
                    <p className="mb-1 text-sm text-cu-muted">Ukuran Basis Data</p>
                    <p className="text-3xl font-bold text-cu-ink">{stats.root_metrics.database_size}</p>
                    <p className="mt-1.5 text-xs text-cu-muted uppercase font-mono">
                      {stats.root_metrics.database_driver} connection
                    </p>
                  </div>
                  <div className="flex size-12 items-center justify-center rounded-xl bg-cu-warning-soft text-cu-warning">
                    <MaterialIcon name="storage" size="md" />
                  </div>
                </div>
              </div>

              {/* System Activities (Root) */}
              <div className="rounded-xl border border-cu-line bg-cu-surface p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-cu-line pb-4 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-cu-ink flex items-center gap-2">
                      <MaterialIcon name="history" size="sm" className="text-cu-muted" />
                      Log Aktivitas Sistem Terbaru
                    </h2>
                    <p className="text-xs text-cu-muted mt-0.5">
                      Memantau tindakan administratif dan aktivitas keamanan global.
                    </p>
                  </div>
                  <div className="text-[10px] uppercase font-bold text-cu-muted tracking-wider bg-cu-panel-soft px-2.5 py-1 rounded-full">
                    Real-time (30s)
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-cu-line text-xs font-bold uppercase tracking-wider text-cu-muted bg-cu-panel-soft/50">
                        <th className="py-3 px-4">Operator</th>
                        <th className="py-3 px-4">Kategori</th>
                        <th className="py-3 px-4">Aktivitas</th>
                        <th className="py-3 px-4 text-right">Waktu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cu-line text-xs">
                      {stats.root_metrics.latest_activities.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center italic text-cu-muted">
                            Belum ada aktivitas tercatat di sistem.
                          </td>
                        </tr>
                      ) : (
                        stats.root_metrics.latest_activities.map((act) => (
                          <tr key={act.id} className="hover:bg-cu-panel-soft/20 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-cu-ink">{act.causer_name}</td>
                            <td className="py-3.5 px-4">
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
                            </td>
                            <td
                              className="py-3.5 px-4 text-cu-muted font-mono max-w-xs truncate"
                              title={act.description}
                            >
                              {act.description}
                            </td>
                            <td className="py-3.5 px-4 text-right text-cu-muted whitespace-nowrap">
                              {formatRelativeTime(act.created_at)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* System Env Bar */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 bg-cu-surface border border-cu-line rounded-xl p-4 text-xs shadow-sm">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-cu-muted uppercase tracking-wider">
                    Laravel Version
                  </span>
                  <span className="font-mono font-semibold text-cu-ink">
                    {stats.root_metrics.laravel_version}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-cu-muted uppercase tracking-wider">
                    PHP Version
                  </span>
                  <span className="font-mono font-semibold text-cu-ink">
                    {stats.root_metrics.php_version}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-cu-muted uppercase tracking-wider">
                    Database Connection
                  </span>
                  <span className="font-mono font-semibold text-cu-ink uppercase">
                    {stats.root_metrics.database_driver}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-cu-muted uppercase tracking-wider">
                    Database Size
                  </span>
                  <span className="font-mono font-semibold text-cu-ink">
                    {stats.root_metrics.database_size}
                  </span>
                </div>
              </div>
            </>
          ) : (
            /* Non-Root Default Grid */
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* 1. Active Users */}
              <div className="rounded-xl border border-cu-line bg-cu-surface p-6 shadow-sm transition-colors hover:border-cu-info/30 flex items-center justify-between gap-4">
                <div>
                  <p className="mb-1 text-sm text-cu-muted">User Aktif</p>
                  <p className="text-3xl font-semibold text-cu-ink">{stats.active_users}</p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-lg bg-cu-info-soft text-cu-info">
                  <MaterialIcon name="groups" size="md" />
                </div>
              </div>

              {/* 2. Your Role */}
              <div className="rounded-xl border border-cu-line bg-cu-surface p-6 shadow-sm transition-colors hover:border-cu-success/30 flex items-center justify-between gap-4">
                <div>
                  <p className="mb-1 text-sm text-cu-muted">Role Kamu</p>
                  <p className="text-xl font-semibold text-cu-ink capitalize">
                    {stats.roles.join(", ") || "User"}
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-lg bg-cu-success-soft text-cu-success">
                  <MaterialIcon name="verified_user" size="md" />
                </div>
              </div>

              {/* 3. Core Feature - Pricetag Generator */}
              <Link
                href="/generator/pricetag"
                className="rounded-xl border border-cu-line bg-cu-surface p-6 shadow-sm transition-all duration-200 hover:scale-[1.01] hover:border-purple-500/30 flex items-center justify-between gap-4 group"
              >
                <div>
                  <p className="mb-1 text-sm text-cu-muted">Pricetag Generator</p>
                  <p className="text-xl font-semibold text-cu-ink group-hover:text-purple-600 transition-colors">
                    Cetak Label Baru
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <MaterialIcon name="local_offer" size="md" />
                </div>
              </Link>
            </div>
          )}

          {/* Quick Actions (All authenticated users) */}
          <div className="rounded-xl border border-cu-line bg-cu-surface p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-cu-ink">Aksi Cepat</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {/* Pricetag Apps */}
              <Link
                href="/generator/pricetag"
                className="flex items-center gap-3 rounded-lg border border-cu-line bg-cu-surface px-4 py-3 transition-all duration-200 hover:border-cu-border-hover hover:bg-cu-panel-soft"
              >
                <MaterialIcon name="print" size="sm" className="text-purple-600" />
                <span className="text-sm font-medium text-cu-ink">Buat Pricetag</span>
              </Link>

              <Link
                href="/generator/pricetag/search"
                className="flex items-center gap-3 rounded-lg border border-cu-line bg-cu-surface px-4 py-3 transition-all duration-200 hover:border-cu-border-hover hover:bg-cu-panel-soft"
              >
                <MaterialIcon name="search" size="sm" className="text-cu-info" />
                <span className="text-sm font-medium text-cu-ink">Cari Barcode</span>
              </Link>

              <Link
                href="/generator/pricetag/catalog"
                className="flex items-center gap-3 rounded-lg border border-cu-line bg-cu-surface px-4 py-3 transition-all duration-200 hover:border-cu-border-hover hover:bg-cu-panel-soft"
              >
                <MaterialIcon name="database" size="sm" className="text-cu-warning" />
                <span className="text-sm font-medium text-cu-ink">Data Produk</span>
              </Link>

              <Link
                href="/generator/pricetag/history"
                className="flex items-center gap-3 rounded-lg border border-cu-line bg-cu-surface px-4 py-3 transition-all duration-200 hover:border-cu-border-hover hover:bg-cu-panel-soft"
              >
                <MaterialIcon name="history" size="sm" className="text-cu-muted" />
                <span className="text-sm font-medium text-cu-ink">Riwayat Cetak</span>
              </Link>

              {/* Core Profile */}
              <Link
                href="/profile"
                className="flex items-center gap-3 rounded-lg border border-cu-line bg-cu-surface px-4 py-3 transition-all duration-200 hover:border-cu-border-hover hover:bg-cu-panel-soft"
              >
                <MaterialIcon name="person" size="sm" className="text-cu-muted" />
                <span className="text-sm font-medium text-cu-ink">Edit Profil</span>
              </Link>

              {/* Admin Actions */}
              {hasPermission("manage-users") && (
                <Link
                  href="/users"
                  className="flex items-center gap-3 rounded-lg border border-cu-line bg-cu-surface px-4 py-3 transition-all duration-200 hover:border-cu-border-hover hover:bg-cu-panel-soft"
                >
                  <MaterialIcon name="group" size="sm" className="text-cu-muted" />
                  <span className="text-sm font-medium text-cu-ink">Kelola User</span>
                </Link>
              )}

              {hasPermission("manage-roles") && (
                <Link
                  href="/roles"
                  className="flex items-center gap-3 rounded-lg border border-cu-line bg-cu-surface px-4 py-3 transition-all duration-200 hover:border-cu-border-hover hover:bg-cu-panel-soft"
                >
                  <MaterialIcon name="admin_panel_settings" size="sm" className="text-cu-muted" />
                  <span className="text-sm font-medium text-cu-ink">Kelola Role</span>
                </Link>
              )}

              {hasPermission("run-artisan") && (
                <Link
                  href="/maintenance"
                  className="flex items-center gap-3 rounded-lg border border-cu-line bg-cu-surface px-4 py-3 transition-all duration-200 hover:border-cu-border-hover hover:bg-cu-panel-soft"
                >
                  <MaterialIcon name="build" size="sm" className="text-cu-muted" />
                  <span className="text-sm font-medium text-cu-ink">Maintenance</span>
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
