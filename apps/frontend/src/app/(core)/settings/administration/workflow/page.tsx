"use client";

import { useEffect, useState, type FormEvent } from "react";
import { apiFetch, ApiError, ValidationError } from "@/core/api/client";
import { useAuth } from "@/providers/auth-provider";
import { ComboBox, ComboBoxItem } from "@react-spectrum/s2/ComboBox";
import { TextField } from "@react-spectrum/s2/TextField";
import { Button, Text } from "@react-spectrum/s2/Button";
import { ToastContainer, ToastQueue } from "@react-spectrum/s2/Toast";
import { Content, Heading, InlineAlert } from "@react-spectrum/s2/InlineAlert";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import SaveFloppy from "@react-spectrum/s2/icons/SaveFloppy";

function errorMessage(error: unknown): string {
  if (error instanceof ValidationError)
    return Object.values(error.errors).flat()[0] || "Data tidak valid.";
  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

type WorkflowField =
  | "notify_new_registration"
  | "default_pricetag_expiry_days"
  | "max_prints_per_batch";

export default function WorkflowPage() {
  const { user, hasPermission, refreshUser } = useAuth();
  const [values, setValues] = useState({
    notify_new_registration: "1",
    default_pricetag_expiry_days: "30",
    max_prints_per_batch: "100",
  });
  const [focusedField, setFocusedField] = useState<WorkflowField | null>(null);
  const [saving, setSaving] = useState(false);

  const fieldMessages = {
    notify_new_registration: {
      title: "Notifikasi Registrasi Baru",
      message: "Aktifkan untuk memberi tahu manajer ketika ada registrasi pengguna baru.",
    },
    default_pricetag_expiry_days: {
      title: "Masa Berlaku Pricetag",
      message: "Tentukan berapa hari pricetag tetap berlaku sejak dibuat.",
    },
    max_prints_per_batch: {
      title: "Maksimum Cetak per Batch",
      message: "Tentukan jumlah maksimum pricetag yang dapat dicetak dalam satu batch.",
    },
  };

  useEffect(() => {
    if (!user) return;
    queueMicrotask(() => {
      setValues((current) => ({
        notify_new_registration:
          user.settings?.notify_new_registration == null
            ? current.notify_new_registration
            : String(user.settings.notify_new_registration),
        default_pricetag_expiry_days:
          user.settings?.default_pricetag_expiry_days == null
            ? current.default_pricetag_expiry_days
            : String(user.settings.default_pricetag_expiry_days),
        max_prints_per_batch:
          user.settings?.max_prints_per_batch == null
            ? current.max_prints_per_batch
            : String(user.settings.max_prints_per_batch),
      }));
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
      ToastQueue.positive("Pengaturan alur kerja berhasil disimpan.", { timeout: 5000 });
    } catch (requestError) {
      ToastQueue.negative(errorMessage(requestError), { timeout: 5000 });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <ToastContainer placement="bottom end" />
      <form onSubmit={submit} className="w-full space-y-5">
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {hasPermission("approve-users") && (
              <div className={`${style({ display: "flex", flexDirection: "column", gap: 16 })}`}>
            <ComboBox
              label="Notifikasi Registrasi Baru"
              size="XL"
              selectedKey={values.notify_new_registration}
              onSelectionChange={(key) => update("notify_new_registration", String(key ?? "0"))}
              onFocus={() => setFocusedField("notify_new_registration")}
              onBlur={() => setFocusedField(null)}
            >
              <ComboBoxItem id="0">Nonaktif</ComboBoxItem>
              <ComboBoxItem id="1">Aktif</ComboBoxItem>
            </ComboBox>
            <TextField
              label="Masa Berlaku Pricetag (Hari)"
              size="XL"
              type="number"
              value={values.default_pricetag_expiry_days}
              onChange={(value) => update("default_pricetag_expiry_days", value)}
              onFocus={() => setFocusedField("default_pricetag_expiry_days")}
              onBlur={() => setFocusedField(null)}
            />
            <TextField
              label="Maksimum Cetak per Batch"
              size="XL"
              type="number"
              value={values.max_prints_per_batch}
              onChange={(value) => update("max_prints_per_batch", value)}
              onFocus={() => setFocusedField("max_prints_per_batch")}
              onBlur={() => setFocusedField(null)}
            />
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
