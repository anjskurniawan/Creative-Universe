"use client";

import React, { useCallback, useEffect, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";

interface SystemStatus {
  app_env: string;
  cache_driver: string;
  queue_connection: string;
  failed_jobs_count: number;
  disk_free_space: string;
  log_file_size: string;
}

export default function MaintenancePage() {
  const { hasPermission } = useAuth();

  // State
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Command Execution State
  const [isExecuting, setIsExecuting] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string>("Console siap. Pilih perintah pemeliharaan di atas.");
  const [activeCommand, setActiveCommand] = useState<string | null>(null);

  // ----------------------------------------------------
  // Load System Status
  // ----------------------------------------------------
  const loadSystemStatus = useCallback(async (silent = false) => {
    if (!hasPermission("run-artisan")) return;
    if (!silent) setIsLoading(true);
    setError(null);

    try {
      const res = await apiFetch<SystemStatus>("/maintenance/status");
      setStatus(res);
    } catch (err) {
      if (!silent) {
        setError(err instanceof Error ? err.message : "Gagal mengambil status sistem.");
      }
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [hasPermission]);

  useEffect(() => {
    queueMicrotask(() => void loadSystemStatus());
  }, [loadSystemStatus]);

  if (!hasPermission("run-artisan")) {
    return <AccessDenied />;
  }

  // ----------------------------------------------------
  // Run Artisan Command
  // ----------------------------------------------------
  const runCommand = async (commandKey: string, label: string) => {
    if (isExecuting) return;
    setIsExecuting(true);
    setActiveCommand(commandKey);
    setError(null);
    setNotice(null);
    setConsoleOutput(`[SYS] Menjalankan perintah: ${label}...\n[SYS] Silakan tunggu...`);

    try {
      const res = await apiFetch<{ command: string; output: string }>("/maintenance/commands", {
        method: "POST",
        body: JSON.stringify({ command: commandKey }),
      });

      setConsoleOutput(res.output || `[SYS] Perintah '${commandKey}' berhasil diselesaikan tanpa output.`);
      setNotice(`Perintah '${label}' berhasil dieksekusi.`);
      // Refresh status info (such as failed jobs count or cache driver status)
      await loadSystemStatus(true);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Gagal mengeksekusi perintah.";
      setError(errMsg);
      setConsoleOutput(`[ERR] Gagal mengeksekusi perintah:\n${errMsg}`);
    } finally {
      setIsExecuting(false);
      setActiveCommand(null);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cu-muted">Sistem Admin</p>
        <h1 className="mt-1 text-2xl font-semibold text-cu-ink">Operasi & Pemeliharaan</h1>
        <p className="mt-1 text-sm text-cu-muted">
          Kelola status internal Laravel, cache, antrean queue, dan database seeder permission secara aman tanpa terminal SSH.
        </p>
      </header>

      {notice && <Alert tone="success" message={notice} onClose={() => setNotice(null)} />}
      {error && <Alert tone="error" message={error} onClose={() => setError(null)} />}

      {/* System status cards */}
      {isLoading ? (
        <div className="rounded-2xl border border-cu-line bg-cu-surface p-12 text-center text-sm text-cu-muted">
          Memuat status sistem...
        </div>
      ) : status ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatusCard label="Environment" value={status.app_env.toUpperCase()} icon="dns" highlight={status.app_env === "production" ? "danger" : "info"} />
          <StatusCard label="Cache Driver" value={status.cache_driver} icon="storage" />
          <StatusCard label="Queue Connection" value={status.queue_connection} icon="sync_alt" />
          <StatusCard label="Failed Jobs" value={status.failed_jobs_count} icon="report" highlight={status.failed_jobs_count > 0 ? "danger" : "success"} />
          <StatusCard label="Disk Space Free" value={status.disk_free_space} icon="disc_full" />
          <StatusCard label="Laravel Log Size" value={status.log_file_size} icon="description" />
        </div>
      ) : null}

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {/* Kategori 1: Database & Migrasi */}
        <section className="rounded-2xl border border-cu-line bg-cu-surface p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-cu-line pb-3">
            <span className="text-cu-primary flex items-center justify-center">
              <MaterialIcon name="schema" size="xs" />
            </span>
            <h3 className="text-sm font-bold text-cu-ink">Database & Migrasi</h3>
          </div>
          <div className="flex flex-col gap-2">
            <CommandButton
              label="Migrasi Database"
              desc="migrate --force (jalankan migrasi database)"
              icon="database"
              loading={isExecuting && activeCommand === "migrate"}
              disabled={isExecuting}
              onClick={() => void runCommand("migrate", "Migrasi Database")}
            />
            <CommandButton
              label="Migrasi Fresh (Reset)"
              desc="migrate:fresh --force (RESET & migrasi database)"
              icon="history"
              loading={isExecuting && activeCommand === "migrate-fresh"}
              disabled={isExecuting}
              onClick={() => {
                if (window.confirm("PERINGATAN! Tindakan ini akan MENGHAPUS semua tabel & data database Anda. Lanjutkan?")) {
                  void runCommand("migrate-fresh", "Migrasi Fresh (Reset)");
                }
              }}
            />
            <CommandButton
              label="Seed Permissions"
              desc="db:seed --class=RolePermissionSeeder"
              icon="rule"
              loading={isExecuting && activeCommand === "seed-permissions"}
              disabled={isExecuting}
              onClick={() => void runCommand("seed-permissions", "Seed Permissions")}
            />
            <CommandButton
              label="Seed Database (Full)"
              desc="db:seed --force (data default & test)"
              icon="fact_check"
              loading={isExecuting && activeCommand === "seed"}
              disabled={isExecuting}
              onClick={() => void runCommand("seed", "Seed Database (Full)")}
            />
          </div>
        </section>

        {/* Kategori 2: Sistem & Optimasi */}
        <section className="rounded-2xl border border-cu-line bg-cu-surface p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-cu-line pb-3">
            <span className="text-cu-primary flex items-center justify-center">
              <MaterialIcon name="settings_suggest" size="xs" />
            </span>
            <h3 className="text-sm font-bold text-cu-ink">Sistem & Optimasi</h3>
          </div>
          <div className="flex flex-col gap-2">
            <CommandButton
              label="Bersihkan Cache"
              desc="optimize:clear (cache, view, config)"
              icon="cleaning_services"
              loading={isExecuting && activeCommand === "clear-cache"}
              disabled={isExecuting}
              onClick={() => void runCommand("clear-cache", "Bersihkan Cache")}
            />
            <CommandButton
              label="Optimasi Cache"
              desc="optimize (cache config, route, view)"
              icon="bolt"
              loading={isExecuting && activeCommand === "optimize"}
              disabled={isExecuting}
              onClick={() => void runCommand("optimize", "Optimasi Cache")}
            />
            <CommandButton
              label="Restart Antrean (Queue)"
              desc="queue:restart (refresh worker daemon)"
              icon="autorenew"
              loading={isExecuting && activeCommand === "queue-restart"}
              disabled={isExecuting}
              onClick={() => void runCommand("queue-restart", "Restart Antrean")}
            />
            <CommandButton
              label="Jalankan Queue (Work)"
              desc="queue:work --stop-when-empty (proses antrean)"
              icon="play_arrow"
              loading={isExecuting && activeCommand === "queue-work"}
              disabled={isExecuting}
              onClick={() => void runCommand("queue-work", "Jalankan Queue (Work)")}
            />
            <CommandButton
              label="Tautkan Storage"
              desc="storage:link (buat simbolik link public)"
              icon="link"
              loading={isExecuting && activeCommand === "storage-link"}
              disabled={isExecuting}
              onClick={() => void runCommand("storage-link", "Tautkan Storage")}
            />
          </div>
        </section>

        {/* Kategori 3: Pembersihan Log & Data */}
        <section className="rounded-2xl border border-cu-line bg-cu-surface p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-cu-line pb-3">
            <span className="text-cu-primary flex items-center justify-center">
              <MaterialIcon name="delete_sweep" size="xs" />
            </span>
            <h3 className="text-sm font-bold text-cu-ink">Pembersihan Log & Data</h3>
          </div>
          <div className="flex flex-col gap-2">
            <CommandButton
              label="Bersihkan Log Aktivitas"
              desc="clean:activity-log (> 24 bulan)"
              icon="history_toggle_off"
              loading={isExecuting && activeCommand === "clean-activity-log"}
              disabled={isExecuting}
              onClick={() => void runCommand("clean-activity-log", "Bersihkan Log Aktivitas")}
            />
            <CommandButton
              label="Bersihkan Notifikasi"
              desc="clean:notifications (> 12 bulan)"
              icon="notification_important"
              loading={isExecuting && activeCommand === "clean-notifications"}
              disabled={isExecuting}
              onClick={() => void runCommand("clean-notifications", "Bersihkan Notifikasi")}
            />
            <CommandButton
              label="Bersihkan Failed Jobs"
              desc="clean:failed-jobs (> 30 hari)"
              icon="report_off"
              loading={isExecuting && activeCommand === "clean-failed-jobs"}
              disabled={isExecuting}
              onClick={() => void runCommand("clean-failed-jobs", "Bersihkan Failed Jobs")}
            />
            <CommandButton
              label="Bersihkan Temp Uploads"
              desc="clean:temp-uploads (> 7 hari)"
              icon="folder_delete"
              loading={isExecuting && activeCommand === "clean-temp-uploads"}
              disabled={isExecuting}
              onClick={() => void runCommand("clean-temp-uploads", "Bersihkan Temp Uploads")}
            />
            <CommandButton
              label="Bersihkan Stale Records"
              desc="clean:stale-records (pemeliharaan internal)"
              icon="auto_delete"
              loading={isExecuting && activeCommand === "clean-stale-records"}
              disabled={isExecuting}
              onClick={() => void runCommand("clean-stale-records", "Bersihkan Stale Records")}
            />
            <CommandButton
              label="Bersihkan Token Reset"
              desc="auth:clear-resets (token password kedaluwarsa)"
              icon="vpn_key_off"
              loading={isExecuting && activeCommand === "auth-clear-resets"}
              disabled={isExecuting}
              onClick={() => void runCommand("auth-clear-resets", "Bersihkan Token Reset")}
            />
          </div>
        </section>
      </div>

      {/* Terminal output console */}
      <section className="rounded-2xl border border-cu-line bg-cu-surface p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-cu-line pb-3">
          <div className="flex items-center gap-2">
            <span className="text-cu-primary flex items-center justify-center">
              <MaterialIcon name="terminal" size="xs" />
            </span>
            <h3 className="text-sm font-bold text-cu-ink">Output Konsol</h3>
          </div>
          <button
            type="button"
            onClick={() => setConsoleOutput("Console dibersihkan.")}
            className="text-xs text-cu-muted hover:text-cu-ink transition flex items-center gap-1"
          >
            <MaterialIcon name="backspace" size="xs" /> Bersihkan
          </button>
        </div>

        <div className="rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-200 min-h-[250px] max-h-[450px] overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
          {consoleOutput}
        </div>
      </section>

    </div>
  );
}

// ----------------------------------------------------
// UI Sub-components
// ----------------------------------------------------
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
        <span className={`block truncate text-sm font-extrabold ${highlight ? highlightClasses[highlight] : "text-cu-ink"}`}>
          {value}
        </span>
      </div>
    </div>
  );
}

function CommandButton({
  label,
  desc,
  icon,
  loading,
  disabled,
  onClick,
}: {
  label: string;
  desc: string;
  icon: string;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex w-full items-center justify-between gap-4 rounded-xl border border-cu-line bg-cu-surface p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60 disabled:hover:translate-y-0 disabled:shadow-sm"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-cu-panel-soft text-cu-muted group-hover:text-cu-ink">
          <MaterialIcon name={icon} size="xs" />
        </span>
        <div className="min-w-0">
          <span className="block text-sm font-bold text-cu-ink">{label}</span>
          <span className="block text-[10px] text-cu-muted truncate">{desc}</span>
        </div>
      </div>
      <span className="shrink-0 text-cu-muted group-hover:text-cu-ink">
        {loading ? (
          <div className="size-4 animate-spin rounded-full border-2 border-cu-line border-t-cu-ink" />
        ) : (
          <MaterialIcon name="chevron_right" size="xs" />
        )}
      </span>
    </button>
  );
}

function Alert({ tone, message, onClose }: { tone: "success" | "error"; message: string; onClose: () => void }) {
  const borderClass = tone === "success" ? "border-cu-success/20 bg-cu-success-soft text-cu-success" : "border-cu-danger/20 bg-cu-danger-soft text-cu-danger";
  return (
    <div className={`flex justify-between rounded-xl border px-4 py-3 text-sm ${borderClass}`}>
      <span className="font-semibold">{message}</span>
      <button type="button" onClick={onClose} aria-label="Tutup" className="ml-3 self-start shrink-0">
        <MaterialIcon name="close" size="xs" />
      </button>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="rounded-2xl border border-cu-danger/20 bg-cu-danger-soft p-8 text-center max-w-lg mx-auto mt-12">
      <MaterialIcon name="lock" size="lg" className="mx-auto text-cu-danger" />
      <h1 className="mt-3 text-lg font-semibold">Akses ditolak</h1>
      <p className="mt-1 text-sm text-cu-muted">
        Anda tidak memiliki permission <code>run-artisan</code> yang diperlukan untuk membuka halaman pemeliharaan sistem.
      </p>
    </div>
  );
}
