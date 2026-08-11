"use client";

import { useEffect, useState, type FormEvent } from "react";
import { apiFetch, ApiError, ValidationError } from "@/core/api/client";
import { MaterialIcon } from "@/components/ui/material-icon";
import { useAuth } from "@/providers/auth-provider";

function errorMessage(error: unknown): string {
  if (error instanceof ValidationError) return Object.values(error.errors).flat()[0] || "Data tidak valid.";
  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

interface RoleSettingPageProps {
  scope?: "all" | "system" | "workflow" | "generator" | "access";
}

export default function RoleSettingPage({ scope = "all" }: RoleSettingPageProps) {
  const { user, hasPermission, refreshUser } = useAuth();
  const [values, setValues] = useState<Record<string, string>>({
    maintenance_mode: "0", global_debug_mode: "0", google_apps_script_url: "", fonnte_token: "", fonnte_sender: "",
    pusher_app_id: "", pusher_app_key: "", pusher_app_secret: "", pusher_app_cluster: "", notify_new_registration: "1",
    default_pricetag_expiry_days: "30", max_prints_per_batch: "100", default_pricetag_layout: "classic", default_pricetag_paper_size: "A4", auto_save_checklist: "0",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    queueMicrotask(() => {
      setValues((current) =>
        Object.fromEntries(
          Object.keys(current).map((key) => [
            key,
            user.settings?.[key] == null ? current[key] : String(user.settings[key]),
          ]),
        ),
      );
    });
  }, [user]);

  if (!user) return null;
  if (!hasPermission("manage-settings")) return <p className="text-sm text-cu-danger">Anda tidak memiliki permission manage-settings.</p>;

  const update = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setError(null); setStatus(null);
    try {
      await apiFetch("/profile", { method: "PATCH", body: JSON.stringify({ settings: values }) });
      await refreshUser(); setStatus("Pengaturan peran berhasil disimpan.");
    } catch (requestError) { setError(errorMessage(requestError)); } finally { setSaving(false); }
  };

  const sections = [
    { permission: "run-artisan", title: "Konfigurasi Sistem (Root)", icon: "admin_panel_settings", fields: [["maintenance_mode", "Mode Pemeliharaan", "select"], ["global_debug_mode", "Pemberitahuan Debug", "select"], ["google_apps_script_url", "Google Apps Script Pricetag URL", "text"], ["fonnte_token", "Fonnte API Token (WA)", "password"], ["fonnte_sender", "Fonnte Sender (Nomor WA)", "text"], ["pusher_app_id", "Pusher App ID", "text"], ["pusher_app_key", "Pusher App Key", "text"], ["pusher_app_secret", "Pusher Secret", "password"], ["pusher_app_cluster", "Pusher Cluster", "text"]] as const },
    { permission: "approve-users", title: "Manajemen Alur Kerja (Manajer)", icon: "groups", fields: [["notify_new_registration", "Notifikasi Registrasi Baru", "select"], ["default_pricetag_expiry_days", "Masa Berlaku Pricetag (Hari)", "number"], ["max_prints_per_batch", "Maksimum Cetak per Batch", "number"]] as const },
    { permission: "access-pricetag", title: "Preferensi Studio Pricetag (Designer)", icon: "verified", fields: [["default_pricetag_layout", "Layout Pricetag Default", "select"], ["default_pricetag_paper_size", "Ukuran Kertas Default", "select"]] as const },
  ] as const;
  const visibleSections = sections.filter((section) => {
    if (scope === "system") return section.permission === "run-artisan";
    if (scope === "workflow") return section.permission === "approve-users";
    if (scope === "generator") return section.permission === "access-pricetag";
    if (scope === "access") return false;
    return true;
  });
  const showAccessPanel = scope === "access";

  return (
    <div className="space-y-8 animate-fade-in">
      {status && <div className="rounded-lg border border-cu-success/20 bg-cu-success-soft p-4 text-sm text-cu-success">{status}</div>}
      {error && <div className="rounded-lg border border-cu-danger/20 bg-cu-danger-soft p-4 text-sm text-cu-danger">{error}</div>}
      <div className="flex flex-col items-start gap-8 lg:flex-row">
        {visibleSections.length > 0 && <form onSubmit={submit} className="w-full max-w-xl flex-1 space-y-5">
          {visibleSections.map((section) => hasPermission(section.permission) && (
            <section key={section.permission} className="space-y-4 border-t border-cu-line/60 pt-6 first:border-t-0 first:pt-0">
              <h3 className="flex items-center gap-2 border-b border-cu-line pb-2 text-sm font-semibold text-cu-ink">
                <MaterialIcon name={section.icon} size="sm" className="text-cu-muted" />
                {section.title}
              </h3>
              {section.fields.map(([key, label, type]) => (
                <label key={key} className="block text-sm font-medium text-cu-ink">
                  {label}
                  {type === "select" ? (
                    <select value={values[key]} onChange={(event) => update(key, event.target.value)} className="mt-1.5 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm">
                      <option value="0">Nonaktif</option><option value="1">Aktif</option>
                    </select>
                  ) : <input type={type} value={values[key]} onChange={(event) => update(key, event.target.value)} className="mt-1.5 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink" />}
                </label>
              ))}
              {section.permission === "access-pricetag" && <label className="flex items-center gap-3 text-sm font-medium text-cu-ink"><input type="checkbox" checked={values.auto_save_checklist === "1"} onChange={(event) => update("auto_save_checklist", event.target.checked ? "1" : "0")} />Simpan otomatis status checklist pencarian</label>}
            </section>
          ))}
          <button type="submit" disabled={saving} className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-cu-ink px-5 text-sm font-medium text-cu-surface disabled:opacity-50">
            <MaterialIcon name="save" size="sm" />
            {saving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </form>}

        {showAccessPanel && <aside className="w-full shrink-0 space-y-4 lg:w-80">
          <div>
            <h3 className="flex items-center gap-2 border-b border-cu-line pb-2 text-sm font-semibold text-cu-ink">
              <MaterialIcon name="badge" size="sm" className="text-cu-muted" />
              Hak Akses Anda
            </h3>
            <p className="mt-3 text-xs text-cu-muted">Daftar peran dan izin langsung yang melekat pada akun Anda.</p>
          </div>
          <div className="space-y-4 rounded-xl border border-cu-line bg-cu-surface p-4">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wide text-cu-muted">Peran Anda</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {user.roles?.length ? user.roles.map((role) => <span key={role} className="inline-flex rounded-full border border-cu-line bg-cu-panel-soft px-2.5 py-0.5 text-[10px] font-bold text-cu-ink">{role}</span>) : <span className="text-xs italic text-cu-muted">Tidak ada peran</span>}
              </div>
            </div>
            <div className="border-t border-cu-line/60 pt-3">
              <span className="block text-[10px] font-bold uppercase tracking-wide text-cu-muted">Izin Langsung</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {user.permissions?.length ? user.permissions.map((permission) => <span key={permission} className="inline-flex rounded-full border border-cu-line/60 bg-cu-surface px-2.5 py-0.5 text-[10px] font-medium text-cu-muted">+{permission}</span>) : <span className="text-xs italic text-cu-muted">Tidak ada izin langsung</span>}
              </div>
            </div>
          </div>
        </aside>}
      </div>
    </div>
  );
}
