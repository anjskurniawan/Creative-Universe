"use client";

import React from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

interface CommandConfig {
  key: string;
  label: string;
  desc: string;
  icon: string;
  confirm?: string;
}

interface CommandCategory {
  title: string;
  icon: string;
  commands: CommandConfig[];
}

interface MaintenanceActionsGridProps {
  runCommand: (commandKey: string, label: string) => void;
  isExecuting: boolean;
  activeCommand: string | null;
}

export function MaintenanceActionsGrid({
  runCommand,
  isExecuting,
  activeCommand,
}: MaintenanceActionsGridProps) {
  const categories: CommandCategory[] = [
    {
      title: "Database & Migrasi",
      icon: "schema",
      commands: [
        {
          key: "migrate",
          label: "Migrasi Database",
          desc: "migrate --force (jalankan migrasi database)",
          icon: "database",
        },
        {
          key: "migrate-fresh",
          label: "Migrasi Fresh (Reset)",
          desc: "migrate:fresh --force (RESET & migrasi database)",
          icon: "history",
          confirm: "PERINGATAN! Tindakan ini akan MENGHAPUS semua tabel & data database Anda. Lanjutkan?",
        },
        {
          key: "seed-permissions",
          label: "Seed Permissions",
          desc: "db:seed --class=RolePermissionSeeder",
          icon: "rule",
        },
        {
          key: "seed-production",
          label: "Seed Hosting (Aman)",
          desc: "fondasi sistem + Root, tanpa data demo/transaksi",
          icon: "verified_user",
          confirm: "Jalankan seeder fondasi hosting? Seeder ini tidak menghapus data transaksi atau membuat data demo.",
        },
        {
          key: "restore-hosting-data",
          label: "Pulihkan Data Hosting",
          desc: "restore user nyata + KV Retail Task dari backup privat",
          icon: "restore_page",
          confirm: "Pulihkan user nyata dan KV Retail Task dari file backup privat? Data dengan identitas legacy yang sama akan diperbarui, bukan diduplikasi.",
        },
        {
          key: "seed",
          label: "Seed Database (Full)",
          desc: "db:seed --force (data default & test)",
          icon: "fact_check",
        },
      ],
    },
    {
      title: "Sistem & Optimasi",
      icon: "settings_suggest",
      commands: [
        {
          key: "clear-cache",
          label: "Bersihkan Cache",
          desc: "optimize:clear (cache, view, config)",
          icon: "cleaning_services",
        },
        {
          key: "optimize",
          label: "Optimasi Cache",
          desc: "optimize (cache config, route, view)",
          icon: "bolt",
        },
        {
          key: "queue-restart",
          label: "Restart Antrean (Queue)",
          desc: "queue:restart (refresh worker daemon)",
          icon: "autorenew",
        },
        {
          key: "queue-work",
          label: "Jalankan Queue (Work)",
          desc: "queue:work --stop-when-empty (proses antrean)",
          icon: "play_arrow",
        },
        {
          key: "storage-link",
          label: "Tautkan Storage",
          desc: "storage:link (buat simbolik link public)",
          icon: "link",
        },
      ],
    },
    {
      title: "Pembersihan Log & Data",
      icon: "delete_sweep",
      commands: [
        {
          key: "clean-activity-log",
          label: "Bersihkan Log Aktivitas",
          desc: "clean:activity-log (> 24 bulan)",
          icon: "history_toggle_off",
        },
        {
          key: "clean-notifications",
          label: "Bersihkan Notifikasi",
          desc: "clean:notifications (> 12 bulan)",
          icon: "notification_important",
        },
        {
          key: "clean-failed-jobs",
          label: "Bersihkan Failed Jobs",
          desc: "clean:failed-jobs (> 30 hari)",
          icon: "report_off",
        },
        {
          key: "clean-temp-uploads",
          label: "Bersihkan Temp Uploads",
          desc: "clean:temp-uploads (> 7 hari)",
          icon: "folder_delete",
        },
        {
          key: "clean-stale-records",
          label: "Bersihkan Stale Records",
          desc: "clean:stale-records (pemeliharaan internal)",
          icon: "auto_delete",
        },
        {
          key: "auth-clear-resets",
          label: "Bersihkan Token Reset",
          desc: "auth:clear-resets (token password kedaluwarsa)",
          icon: "vpn_key_off",
        },
      ],
    },
  ];

  const handleCommandClick = (cmd: CommandConfig) => {
    if (cmd.confirm) {
      if (!window.confirm(cmd.confirm)) return;
    }
    runCommand(cmd.key, cmd.label);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
      {categories.map((cat, idx) => (
        <section
          key={idx}
          className="rounded-2xl border border-cu-line bg-cu-surface p-5 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-cu-line pb-3">
            <span className="text-cu-primary flex items-center justify-center">
              <MaterialIcon name={cat.icon} size="xs" />
            </span>
            <h3 className="text-sm font-bold text-cu-ink">{cat.title}</h3>
          </div>
          <div className="flex flex-col gap-2">
            {cat.commands.map((cmd) => (
              <CommandButton
                key={cmd.key}
                label={cmd.label}
                desc={cmd.desc}
                icon={cmd.icon}
                loading={isExecuting && activeCommand === cmd.key}
                disabled={isExecuting}
                onClick={() => handleCommandClick(cmd)}
              />
            ))}
          </div>
        </section>
      ))}
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
