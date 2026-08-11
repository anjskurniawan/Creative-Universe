"use client";

import { useEffect, useState, type FormEvent } from "react";
import { apiFetch, ApiError, ValidationError } from "@/core/api/client";
import { useAuth } from "@/providers/auth-provider";
import { Button, Text } from "@/components/spectrum/Button";
import { ComboBox, ComboBoxItem } from "@/components/spectrum/ComboBox";
import { TextField } from "@/components/spectrum/TextField";
import { Toast, ToastQueue } from "@/components/spectrum/Toast";
import { Content, Heading, InlineAlert } from "@/components/spectrum/InlineAlert";
import SaveFloppy from "@react-spectrum/s2/icons/SaveFloppy";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };

function errorMessage(error: unknown): string {
  if (error instanceof ValidationError)
    return Object.values(error.errors).flat()[0] || "Data tidak valid.";
  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

type SystemConfigurationField =
  | "maintenance_mode"
  | "global_debug_mode"
  | "google_apps_script_url"
  | "fonnte_token"
  | "fonnte_sender"
  | "pusher_app_id"
  | "pusher_app_key"
  | "pusher_app_secret"
  | "pusher_app_cluster";

export default function SystemConfigurationPage() {
  const { user, hasPermission, refreshUser } = useAuth();
  const [values, setValues] = useState({
    maintenance_mode: "0",
    global_debug_mode: "0",
    google_apps_script_url: "",
    fonnte_token: "",
    fonnte_sender: "",
    pusher_app_id: "",
    pusher_app_key: "",
    pusher_app_secret: "",
    pusher_app_cluster: "",
  });
  const [saving, setSaving] = useState(false);
  const [focusedField, setFocusedField] = useState<SystemConfigurationField | null>(null);

  const fieldMessages = {
    maintenance_mode: {
      title: "Mode Pemeliharaan",
      message: "Aktifkan untuk membatasi akses aplikasi saat pemeliharaan berlangsung.",
    },
    global_debug_mode: {
      title: "Pemberitahuan Debug",
      message: "Gunakan mode debug hanya saat melakukan pemeriksaan atau pengembangan sistem.",
    },
    google_apps_script_url: {
      title: "Google Apps Script Pricetag URL",
      message: "URL ini digunakan untuk menghubungkan sistem dengan Google Apps Script Pricetag.",
    },
    fonnte_token: {
      title: "Fonnte API Token",
      message: "Token autentikasi untuk mengirim pesan WhatsApp melalui Fonnte.",
    },
    fonnte_sender: {
      title: "Fonnte Sender",
      message: "Nomor WhatsApp pengirim yang terdaftar pada layanan Fonnte.",
    },
    pusher_app_id: {
      title: "Pusher App ID",
      message: "ID aplikasi Pusher yang digunakan untuk koneksi realtime.",
    },
    pusher_app_key: {
      title: "Pusher App Key",
      message: "Kunci publik aplikasi Pusher untuk koneksi realtime.",
    },
    pusher_app_secret: {
      title: "Pusher Secret",
      message: "Secret aplikasi Pusher. Simpan nilai ini secara aman.",
    },
    pusher_app_cluster: {
      title: "Pusher Cluster",
      message: "Cluster regional Pusher tempat aplikasi realtime terdaftar.",
    },
  };

  useEffect(() => {
    if (!user) return;
    queueMicrotask(() => {
      setValues(
        (current) =>
          Object.fromEntries(
            Object.keys(current).map((key) => [
              key,
              user.settings?.[key] == null
                ? current[key as keyof typeof current]
                : String(user.settings[key]),
            ]),
          ) as typeof current,
      );
    });
  }, [user]);

  if (!user) return null;
  if (!hasPermission("manage-settings"))
    return (
      <p className="text-sm text-cu-danger">Anda tidak memiliki permission manage-settings.</p>
    );

  const update = (key: keyof typeof values, value: string) =>
    setValues((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await apiFetch("/profile", { method: "PATCH", body: JSON.stringify({ settings: values }) });
      await refreshUser();
      ToastQueue.positive("Konfigurasi sistem berhasil disimpan.", { timeout: 5000 });
    } catch (requestError) {
      ToastQueue.negative(errorMessage(requestError), { timeout: 5000 });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Toast placement="bottom end" />
      <form onSubmit={submit} className="w-full space-y-5">
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {hasPermission("run-artisan") && (
              <div className="space-y-4 border-t border-cu-line/60 pt-6 first:border-t-0 first:pt-0">
                <div className={style({ display: "flex", flexDirection: "column", gap: 16 })}>
                <ComboBox
                  label="Mode Pemeliharaan"
                  size="XL"
                  selectedKey={values.maintenance_mode}
                  onSelectionChange={(key) => update("maintenance_mode", String(key ?? "0"))}
                  onFocus={() => setFocusedField("maintenance_mode")}
                  onBlur={() => setFocusedField(null)}
                >
                  <ComboBoxItem id="0">Nonaktif</ComboBoxItem>
                  <ComboBoxItem id="1">Aktif</ComboBoxItem>
                </ComboBox>
                <ComboBox
                  label="Pemberitahuan Debug"
                  size="XL"
                  selectedKey={values.global_debug_mode}
                  onSelectionChange={(key) => update("global_debug_mode", String(key ?? "0"))}
                  onFocus={() => setFocusedField("global_debug_mode")}
                  onBlur={() => setFocusedField(null)}
                >
                  <ComboBoxItem id="0">Nonaktif</ComboBoxItem>
                  <ComboBoxItem id="1">Aktif</ComboBoxItem>
                </ComboBox>
                <TextField
                  label="Google Apps Script Pricetag URL"
                  size="XL"
                  type="url"
                  value={values.google_apps_script_url}
                  onChange={(value) => update("google_apps_script_url", value)}
                  onFocus={() => setFocusedField("google_apps_script_url")}
                  onBlur={() => setFocusedField(null)}
                />
                <TextField
                  label="Fonnte API Token (WA)"
                  size="XL"
                  type="password"
                  value={values.fonnte_token}
                  onChange={(value) => update("fonnte_token", value)}
                  onFocus={() => setFocusedField("fonnte_token")}
                  onBlur={() => setFocusedField(null)}
                />
                <TextField
                  label="Fonnte Sender (Nomor WA)"
                  size="XL"
                  value={values.fonnte_sender}
                  onChange={(value) => update("fonnte_sender", value)}
                  onFocus={() => setFocusedField("fonnte_sender")}
                  onBlur={() => setFocusedField(null)}
                />
                <TextField
                  label="Pusher App ID"
                  size="XL"
                  value={values.pusher_app_id}
                  onChange={(value) => update("pusher_app_id", value)}
                  onFocus={() => setFocusedField("pusher_app_id")}
                  onBlur={() => setFocusedField(null)}
                />
                <TextField
                  label="Pusher App Key"
                  size="XL"
                  value={values.pusher_app_key}
                  onChange={(value) => update("pusher_app_key", value)}
                  onFocus={() => setFocusedField("pusher_app_key")}
                  onBlur={() => setFocusedField(null)}
                />
                <TextField
                  label="Pusher Secret"
                  size="XL"
                  type="password"
                  value={values.pusher_app_secret}
                  onChange={(value) => update("pusher_app_secret", value)}
                  onFocus={() => setFocusedField("pusher_app_secret")}
                  onBlur={() => setFocusedField(null)}
                />
                <TextField
                  label="Pusher Cluster"
                  size="XL"
                  value={values.pusher_app_cluster}
                  onChange={(value) => update("pusher_app_cluster", value)}
                  onFocus={() => setFocusedField("pusher_app_cluster")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              </div>
            )}
            <div className="mt-6">
              <Button type="submit" variant="primary" size="XL" isDisabled={saving} isPending={saving}>
                <SaveFloppy />
                <Text>{saving ? "Menyimpan..." : "Simpan Pengaturan"}</Text>
              </Button>
            </div>
          </div>
          <div className="hidden lg:col-span-1 lg:block">
            {focusedField && (
              <InlineAlert variant="informative" fillStyle="subtleFill">
                <Heading>{fieldMessages[focusedField].title}</Heading>
                <Content>{fieldMessages[focusedField].message}</Content>
              </InlineAlert>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
