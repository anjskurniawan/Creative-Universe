"use client";

import { useEffect, useState, type FormEvent } from "react";
import { apiFetch, ApiError, ValidationError } from "@/core/api/client";
import { MaterialIcon } from "@/components/ui/material-icon";
import { useAuth } from "@/providers/auth-provider";

function errorMessage(error: unknown): string {
  if (error instanceof ValidationError) return Object.values(error.errors).flat()[0] || "Data tidak valid.";
  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

export default function RoleSettingPage() {
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
    setValues((current) => Object.fromEntries(Object.keys(current).map((key) => [key, user.settings?.[key] == null ? current[key] : String(user.settings[key])] )));
  }, [user]);

  if (!hasPermission("manage-settings")) return <p className="text-sm text-cu-danger">Anda tidak memiliki permission manage-settings.</p>;

  const update = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setError(null); setStatus(null);
    try {
      await apiFetch("/profile", { method: "PATCH", body: JSON.stringify({ settings: values }) });
      await refreshUser(); setStatus("Pengaturan peran berhasil disimpan.");
    } catch (requestError) { setError(errorMessage(requestError)); } finally { setSaving(false); }
  };

  const fields = [
    ["maintenance_mode", "Mode Pemeliharaan", "select"], ["global_debug_mode", "Pemberitahuan Debug", "select"],
    ["google_apps_script_url", "Google Apps Script Pricetag URL", "text"], ["fonnte_token", "Fonnte API Token (WA)", "password"],
    ["fonnte_sender", "Fonnte Sender (Nomor WA)", "text"], ["pusher_app_id", "Pusher App ID", "text"], ["pusher_app_key", "Pusher App Key", "text"],
    ["pusher_app_secret", "Pusher Secret", "text"], ["pusher_app_cluster", "Pusher Cluster", "text"], ["notify_new_registration", "Notifikasi Registrasi Baru", "text"],
    ["default_pricetag_expiry_days", "Masa Berlaku Pricetag (Hari)", "number"], ["max_prints_per_batch", "Maksimum Cetak per Batch", "number"],
    ["default_pricetag_layout", "Layout Pricetag Default", "text"], ["default_pricetag_paper_size", "Ukuran Kertas Default", "text"],
  ] as const;

  return <div className="space-y-8 animate-fade-in">
    <div className="border-b border-cu-line pb-3"><h2 className="text-2xl font-semibold text-cu-ink">Pengaturan Khusus Peran</h2></div>
    {status && <div className="rounded-lg border border-cu-success/20 bg-cu-success-soft p-4 text-sm text-cu-success">{status}</div>}
    {error && <div className="rounded-lg border border-cu-danger/20 bg-cu-danger-soft p-4 text-sm text-cu-danger">{error}</div>}
    <form onSubmit={submit} className="grid gap-5 lg:grid-cols-2">
      {fields.map(([key, label, type]) => <label key={key} className="block text-sm font-medium text-cu-ink">{label}{type === "select" ? <select value={values[key]} onChange={(event) => update(key, event.target.value)} className="mt-1.5 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm"><option value="0">Nonaktif</option><option value="1">Aktif</option></select> : <input type={type} value={values[key]} onChange={(event) => update(key, event.target.value)} className="mt-1.5 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink" />}</label>)}
      <label className="flex items-center gap-3 text-sm font-medium text-cu-ink"><input type="checkbox" checked={values.auto_save_checklist === "1"} onChange={(event) => update("auto_save_checklist", event.target.checked ? "1" : "0")} /> Simpan otomatis status checklist pencarian</label>
      <button type="submit" disabled={saving} className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-cu-ink px-5 text-sm font-medium text-cu-surface disabled:opacity-50 lg:col-span-2"><MaterialIcon name="save" size="sm" />{saving ? "Menyimpan..." : "Simpan Pengaturan"}</button>
    </form>
  </div>;
}
