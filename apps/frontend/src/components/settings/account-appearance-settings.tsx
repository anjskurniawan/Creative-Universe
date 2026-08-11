"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError, ValidationError } from "@/core/api/client";
import { useAuth } from "@/providers/auth-provider";
import { Button, Text } from "@/components/spectrum/Button";
import { ComboBox, ComboBoxItem } from "@/components/spectrum/ComboBox";
import { InlineAlert, Content, Heading } from "@/components/spectrum/InlineAlert";
import { Switch } from "@/components/spectrum/Switch";
import { Toast, ToastQueue } from "@/components/spectrum/Toast";

function message(error: unknown): string {
  if (error instanceof ValidationError) return Object.values(error.errors).flat()[0] || "Data yang diberikan tidak valid.";
  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

export default function AccountAppearanceSettings() {
  const { user, refreshUser } = useAuth();
  const [language, setLanguage] = useState("id");
  const [timezone, setTimezone] = useState("Asia/Bangkok");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    queueMicrotask(() => {
      setLanguage(String(user.settings?.language ?? "id"));
      setTimezone(String(user.settings?.timezone ?? "Asia/Bangkok"));
      setReduceMotion(user.settings?.reduce_motion === true || user.settings?.reduce_motion === "1");
      setHighContrast(user.settings?.high_contrast === true || user.settings?.high_contrast === "1");
    });
  }, [user]);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus(null);
    setError(null);
    try {
      await apiFetch("/profile", {
        method: "PATCH",
        body: JSON.stringify({ settings: { language, timezone, reduce_motion: reduceMotion, high_contrast: highContrast } }),
      });
      await refreshUser();
      setStatus("Preferensi tampilan berhasil disimpan.");
      ToastQueue.positive("Preferensi tampilan berhasil disimpan.", { timeout: 5000 });
    } catch (requestError) {
      setError(message(requestError));
      ToastQueue.negative(message(requestError), { timeout: 5000 });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="max-w-xl space-y-4">
      <Toast placement="bottom end" />
      {status && <InlineAlert variant="positive" fillStyle="subtleFill"><Heading>Berhasil</Heading><Content>{status}</Content></InlineAlert>}
      {error && <InlineAlert variant="negative" fillStyle="subtleFill"><Heading>Gagal menyimpan</Heading><Content>{error}</Content></InlineAlert>}
      <div className="grid gap-4 sm:grid-cols-2">
        <ComboBox label="Bahasa" selectedKey={language} onSelectionChange={(key) => setLanguage(String(key ?? "id"))}>
          <ComboBoxItem id="id">Bahasa Indonesia</ComboBoxItem><ComboBoxItem id="en">English</ComboBoxItem>
        </ComboBox>
        <ComboBox label="Zona waktu" selectedKey={timezone} onSelectionChange={(key) => setTimezone(String(key ?? "Asia/Bangkok"))}>
          <ComboBoxItem id="Asia/Bangkok">WIB (UTC+7)</ComboBoxItem><ComboBoxItem id="Asia/Makassar">WITA (UTC+8)</ComboBoxItem><ComboBoxItem id="Asia/Jayapura">WIT (UTC+9)</ComboBoxItem>
        </ComboBox>
      </div>
      <Switch isSelected={reduceMotion} onChange={setReduceMotion}>Kurangi animasi</Switch>
      <Switch isSelected={highContrast} onChange={setHighContrast}>Kontras tinggi</Switch>
      <Button type="submit" variant="primary" size="XL" isDisabled={saving} isPending={saving}><Text>{saving ? "Menyimpan..." : "Simpan Preferensi"}</Text></Button>
    </form>
  );
}
