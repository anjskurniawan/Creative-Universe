"use client";

import React, { useState, useEffect } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { apiFetch } from "@/core/api/client";

export function PanelSystemControl() {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [isEmergencyLoading, setIsEmergencyLoading] = useState(true);
  const [isEmergencySaving, setIsEmergencySaving] = useState(false);
  const [activeCommand, setActiveCommand] = useState<string | null>(null);

  // Fetch current emergency maintenance state
  useEffect(() => {
    apiFetch<{ active: boolean }>("/maintenance/emergency")
      .then((res) => setEmergencyActive(res.active))
      .catch(() => {
        // Silently fail or ignore initial check errors
      })
      .finally(() => setIsEmergencyLoading(false));
  }, []);

  // Update emergency maintenance state
  const toggleEmergencyMode = async () => {
    if (isEmergencySaving) return;
    const nextState = !emergencyActive;
    const confirmation = nextState
      ? "Aktifkan maintenance darurat? Semua pengguna selain Root akan kehilangan akses aplikasi."
      : "Nonaktifkan maintenance darurat dan pulihkan akses seluruh pengguna?";
    if (!window.confirm(confirmation)) return;

    setIsEmergencySaving(true);
    try {
      const response = await apiFetch<{ active: boolean }>("/maintenance/emergency", {
        method: "PUT",
        body: JSON.stringify({ active: nextState }),
      });
      setEmergencyActive(response.active);
      window.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: {
            status: "success",
            message: response.active
              ? "Maintenance darurat diaktifkan."
              : "Maintenance darurat dinonaktifkan.",
          },
        })
      );
    } catch (err) {
      window.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: {
            status: "error",
            message: err instanceof Error ? err.message : "Gagal mengubah mode maintenance.",
          },
        })
      );
    } finally {
      setIsEmergencySaving(false);
    }
  };

  // Run artisan commands (clear-cache, queue-restart)
  const runArtisan = async (commandKey: string, label: string) => {
    if (activeCommand) return;
    setActiveCommand(commandKey);

    try {
      await apiFetch<{ command: string; output: string }>("/maintenance/commands", {
        method: "POST",
        body: JSON.stringify({ command: commandKey }),
      });
      window.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: {
            status: "success",
            message: `Artisan '${label}' berhasil dijalankan.`,
          },
        })
      );
    } catch (err) {
      window.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: {
            status: "error",
            message: err instanceof Error ? err.message : "Gagal mengeksekusi perintah.",
          },
        })
      );
    } finally {
      setActiveCommand(null);
    }
  };

  return (
    <div className="rounded-xl border border-cu-line bg-cu-surface p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] space-y-5">
      <div className="border-b border-cu-line pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-cu-ink flex items-center gap-2">
            <MaterialIcon name="emergency" size="sm" className="text-cu-danger" />
            Pusat Kendali Root
          </h2>
          <p className="text-xs text-cu-muted mt-0.5">Operasi pemeliharaan darurat & perintah utilitas Artisan.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Maintenance Toggle Column */}
        <div className="flex flex-col justify-between p-4 rounded-xl border border-cu-line bg-slate-50/50 gap-4">
          <div>
            <h3 className="text-sm font-bold text-cu-ink">Maintenance Darurat</h3>
            <p className="text-xs text-cu-muted mt-1 leading-relaxed">
              Kunci aplikasi saat perbaikan sistem sedang berlangsung. Hanya akun Root yang diizinkan menggunakan portal saat mode ini aktif.
            </p>
          </div>
          <button
            type="button"
            disabled={isEmergencyLoading || isEmergencySaving}
            onClick={toggleEmergencyMode}
            className={`w-full md:w-auto self-start rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${
              emergencyActive
                ? "bg-white border border-cu-danger/20 text-cu-danger hover:bg-rose-50"
                : "bg-cu-danger hover:bg-rose-600 text-white shadow-sm"
            }`}
          >
            {isEmergencyLoading
              ? "Memeriksa status..."
              : isEmergencySaving
              ? "Menyimpan perubahan..."
              : emergencyActive
              ? "Nonaktifkan Mode Darurat"
              : "Aktifkan Mode Darurat"}
          </button>
        </div>

        {/* Artisan Commands Column */}
        <div className="flex flex-col gap-3 justify-center">
          <div className="flex flex-col gap-2.5">
            {/* Clear Cache Button */}
            <button
              type="button"
              disabled={Boolean(activeCommand)}
              onClick={() => void runArtisan("clear-cache", "Bersihkan Cache")}
              className="flex items-center justify-between border border-cu-line bg-white hover:border-cu-border-hover hover:bg-cu-panel-soft px-4 py-3 rounded-xl transition-all duration-200 active:scale-[0.99] disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-slate-50 text-cu-muted">
                  <MaterialIcon name="cleaning_services" size="xs" />
                </span>
                <div className="text-left">
                  <p className="text-xs font-bold text-cu-ink">Bersihkan Cache</p>
                  <p className="text-[10px] text-cu-muted">optimize:clear (cache, view, config)</p>
                </div>
              </div>
              {activeCommand === "clear-cache" ? (
                <span className="w-4 h-4 border-2 border-cu-ink/30 border-t-cu-ink rounded-full animate-spin"></span>
              ) : (
                <MaterialIcon name="chevron_right" className="text-cu-muted text-lg" />
              )}
            </button>

            {/* Restart Queue Button */}
            <button
              type="button"
              disabled={Boolean(activeCommand)}
              onClick={() => void runArtisan("queue-restart", "Restart Queue")}
              className="flex items-center justify-between border border-cu-line bg-white hover:border-cu-border-hover hover:bg-cu-panel-soft px-4 py-3 rounded-xl transition-all duration-200 active:scale-[0.99] disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-slate-50 text-cu-muted">
                  <MaterialIcon name="autorenew" size="xs" />
                </span>
                <div className="text-left">
                  <p className="text-xs font-bold text-cu-ink">Restart Antrean (Queue)</p>
                  <p className="text-[10px] text-cu-muted">queue:restart (refresh worker daemon)</p>
                </div>
              </div>
              {activeCommand === "queue-restart" ? (
                <span className="w-4 h-4 border-2 border-cu-ink/30 border-t-cu-ink rounded-full animate-spin"></span>
              ) : (
                <MaterialIcon name="chevron_right" className="text-cu-muted text-lg" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
