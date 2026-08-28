"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError, ValidationError } from "@/core/api/client";
import { useAuth } from "@/hooks/auth";
import { Button, Text } from "@react-spectrum/s2/Button";
import { ComboBox, ComboBoxItem } from "@react-spectrum/s2/ComboBox";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import { Switch } from "@react-spectrum/s2/Switch";
import { ToastContainer, ToastQueue } from "@react-spectrum/s2/Toast";

function getErrorMessage(error: unknown): string {
  if (error instanceof ValidationError) {
    return Object.values(error.errors).flat()[0] || "Data yang diberikan tidak valid.";
  }

  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

export default function AccountAppearancePage() {
  const { user, refreshUser } = useAuth();
  const [language, setLanguage] = useState("id");
  const [timezone, setTimezone] = useState("Asia/Bangkok");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
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

    try {
      await apiFetch("/profile", {
        method: "PATCH",
        body: JSON.stringify({
          settings: { language, timezone, reduce_motion: reduceMotion, high_contrast: highContrast },
        }),
      });
      await refreshUser();
      ToastQueue.positive("Preferensi tampilan berhasil disimpan.", { timeout: 5000 });
    } catch (requestError) {
      const message = getErrorMessage(requestError);
      ToastQueue.negative(message, { timeout: 5000 });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="w-full space-y-5">
      <ToastContainer placement="bottom end" />
      <ComboBox label="Bahasa" selectedKey={language} onSelectionChange={(key) => setLanguage(String(key ?? "id"))} size="XL" styles={style({ width: "full" })}>
        <ComboBoxItem id="id">Bahasa Indonesia</ComboBoxItem>
        <ComboBoxItem id="en">English</ComboBoxItem>
      </ComboBox>
      <ComboBox label="Zona waktu" selectedKey={timezone} onSelectionChange={(key) => setTimezone(String(key ?? "Asia/Bangkok"))} size="XL" styles={style({ width: "full" })}>
        <ComboBoxItem id="Asia/Bangkok">WIB (UTC+7)</ComboBoxItem>
        <ComboBoxItem id="Asia/Makassar">WITA (UTC+8)</ComboBoxItem>
        <ComboBoxItem id="Asia/Jayapura">WIT (UTC+9)</ComboBoxItem>
      </ComboBox>
      <Switch size="XL" isSelected={reduceMotion} onChange={setReduceMotion}>Kurangi animasi</Switch>
      <Switch size="XL" isSelected={highContrast} onChange={setHighContrast}>Kontras tinggi</Switch>
      <Button type="submit" variant="primary" size="XL" isDisabled={saving} isPending={saving}>
        <Text>{saving ? "Menyimpan..." : "Simpan Preferensi"}</Text>
      </Button>
    </form>
  );
}
