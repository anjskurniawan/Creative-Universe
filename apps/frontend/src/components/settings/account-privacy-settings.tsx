"use client";

import { useEffect, useState, type FormEvent } from "react";
import { apiFetch, ApiError, ValidationError } from "@/core/api/client";
import { useAuth } from "@/providers/auth-provider";
import { Button, Text } from "@react-spectrum/s2/Button";
import { Content, Heading, InlineAlert } from "@react-spectrum/s2/InlineAlert";
import { Switch } from "@react-spectrum/s2/Switch";
import { ToastContainer, ToastQueue } from "@react-spectrum/s2/Toast";

export default function AccountPrivacySettings() {
  const { user, refreshUser } = useAuth();
  const [showApplications, setShowApplications] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    queueMicrotask(() => setShowApplications(user.settings?.profile_show_applications == null || user.settings.profile_show_applications === true || user.settings.profile_show_applications === "1"));
  }, [user]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setStatus(null); setError(null);
    try {
      await apiFetch("/profile", { method: "PATCH", body: JSON.stringify({ settings: { profile_show_applications: showApplications } }) });
      await refreshUser(); setStatus("Preferensi privasi berhasil disimpan."); ToastQueue.positive("Preferensi privasi berhasil disimpan.", { timeout: 5000 });
    } catch (requestError) {
      const nextError = requestError instanceof ValidationError ? Object.values(requestError.errors).flat()[0] || "Data tidak valid." : requestError instanceof ApiError ? requestError.message : "Terjadi kesalahan. Silakan coba lagi.";
      setError(nextError); ToastQueue.negative(nextError, { timeout: 5000 });
    } finally { setSaving(false); }
  }

  return <form onSubmit={save} className="max-w-2xl space-y-5"><ToastContainer placement="bottom end" />{status && <InlineAlert variant="positive" fillStyle="subtleFill"><Heading>Berhasil</Heading><Content>{status}</Content></InlineAlert>}{error && <InlineAlert variant="negative" fillStyle="subtleFill"><Heading>Gagal menyimpan</Heading><Content>{error}</Content></InlineAlert>}<div className="rounded-2xl border border-cu-line bg-cu-surface p-5"><Switch isSelected={showApplications} onChange={setShowApplications}>Tampilkan daftar aplikasi saya</Switch><p className="mt-2 text-sm text-cu-muted">Izinkan daftar aplikasi yang Anda akses terlihat pada profil pengguna lain.</p></div><Button type="submit" variant="primary" size="XL" isDisabled={saving} isPending={saving}><Text>{saving ? "Menyimpan..." : "Simpan Preferensi"}</Text></Button></form>;
}
