"use client";

import React from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

interface EmergencyMaintenanceCardProps {
  emergencyActive: boolean;
  isEmergencyLoading: boolean;
  isEmergencySaving: boolean;
  onToggle: (active: boolean) => void;
}

export function EmergencyMaintenanceCard({
  emergencyActive,
  isEmergencyLoading,
  isEmergencySaving,
  onToggle,
}: EmergencyMaintenanceCardProps) {
  return (
    <section
      className={`rounded-2xl border p-5 shadow-sm ${
        emergencyActive ? "border-cu-danger/30 bg-cu-danger-soft" : "border-cu-line bg-cu-surface"
      }`}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-3">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
              emergencyActive ? "bg-cu-danger text-white" : "bg-cu-panel-soft text-cu-muted"
            }`}
          >
            <MaterialIcon name="emergency_home" size="sm" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cu-danger">Kontrol Root</p>
            <h2 className="mt-1 text-lg font-bold text-cu-ink">Maintenance Darurat</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-cu-muted">
              Saat aktif, hanya Root yang dapat menggunakan aplikasi. Semua pengguna lain melihat halaman error universal
              dan request API mereka ditolak oleh backend.
            </p>
          </div>
        </div>
        <button
          type="button"
          disabled={isEmergencyLoading || isEmergencySaving}
          onClick={() => void onToggle(!emergencyActive)}
          className={`shrink-0 rounded-full px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
            emergencyActive ? "bg-white text-cu-danger ring-1 ring-cu-danger/20" : "bg-cu-danger text-white"
          }`}
        >
          {isEmergencyLoading
            ? "Memuat status..."
            : isEmergencySaving
            ? "Menyimpan..."
            : emergencyActive
            ? "Nonaktifkan Darurat"
            : "Aktifkan Darurat"}
        </button>
      </div>
    </section>
  );
}
