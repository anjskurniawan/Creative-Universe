"use client";

import { useEffect, useState, type FormEvent } from "react";
import { apiFetch, ApiError, ValidationError } from "@/core/api/client";
import { useAuth } from "@/providers/auth-provider";
import { ComboBox, ComboBoxItem } from "@react-spectrum/s2/ComboBox";
import { Button, Text } from "@react-spectrum/s2/Button";
import { Content, Heading, InlineAlert } from "@react-spectrum/s2/InlineAlert";
import { ToastContainer, ToastQueue } from "@react-spectrum/s2/Toast";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import SaveFloppy from "@react-spectrum/s2/icons/SaveFloppy";

function errorMessage(error: unknown): string {
  if (error instanceof ValidationError) return Object.values(error.errors).flat()[0] || "Data tidak valid.";
  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

export default function GeneratorPreferencesPage() {
  const { user, hasPermission, refreshUser } = useAuth();
  const [values, setValues] = useState({
    default_pricetag_layout: "classic",
    default_pricetag_paper_size: "A4",
    auto_save_checklist: "0",
  });
  const [focusedField, setFocusedField] = useState<keyof typeof values | null>(null);
  const [saving, setSaving] = useState(false);

  const fieldMessages = {
    default_pricetag_layout: {
      title: "Layout Pricetag Default",
      message: "Pilih layout yang akan digunakan secara otomatis saat membuat pricetag baru.",
    },
    default_pricetag_paper_size: {
      title: "Ukuran Kertas Default",
      message: "Pilih ukuran kertas default untuk hasil generator pricetag.",
    },
    auto_save_checklist: {
      title: "Simpan Otomatis Checklist",
      message: "Aktifkan agar perubahan status checklist pencarian tersimpan secara otomatis.",
    },
  };

  useEffect(() => {
    if (!user) return;
    queueMicrotask(() => {
      setValues((current) => ({
        default_pricetag_layout: user.settings?.default_pricetag_layout == null ? current.default_pricetag_layout : String(user.settings.default_pricetag_layout),
        default_pricetag_paper_size: user.settings?.default_pricetag_paper_size == null ? current.default_pricetag_paper_size : String(user.settings.default_pricetag_paper_size),
        auto_save_checklist: user.settings?.auto_save_checklist == null ? current.auto_save_checklist : String(user.settings.auto_save_checklist),
      }));
    });
  }, [user]);

  if (!user) return null;
  if (!hasPermission("manage-settings")) return <p className="text-sm text-cu-danger">Anda tidak memiliki permission manage-settings.</p>;

  const update = (key: keyof typeof values, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await apiFetch("/profile", { method: "PATCH", body: JSON.stringify({ settings: values }) });
      await refreshUser();
      ToastQueue.positive("Preferensi generator berhasil disimpan.", { timeout: 5000 });
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
            {hasPermission("access-pricetag") && (
              <div className="space-y-4 border-t border-cu-line/60 pt-6 first:border-t-0 first:pt-0">
                <div className={style({ display: "flex", flexDirection: "column", gap: 16 })}>
                  <ComboBox
                    label="Layout Pricetag Default"
                    size="XL"
                    selectedKey={values.default_pricetag_layout}
                    onSelectionChange={(key) => update("default_pricetag_layout", String(key ?? "classic"))}
                    onFocus={() => setFocusedField("default_pricetag_layout")}
                    onBlur={() => setFocusedField(null)}
                  >
                    <ComboBoxItem id="classic">Classic</ComboBoxItem>
                    <ComboBoxItem id="modern">Modern</ComboBoxItem>
                  </ComboBox>
                  <ComboBox
                    label="Ukuran Kertas Default"
                    size="XL"
                    selectedKey={values.default_pricetag_paper_size}
                    onSelectionChange={(key) => update("default_pricetag_paper_size", String(key ?? "A4"))}
                    onFocus={() => setFocusedField("default_pricetag_paper_size")}
                    onBlur={() => setFocusedField(null)}
                  >
                    <ComboBoxItem id="A4">A4</ComboBoxItem>
                    <ComboBoxItem id="A5">A5</ComboBoxItem>
                    <ComboBoxItem id="Letter">Letter</ComboBoxItem>
                  </ComboBox>
                  <ComboBox
                    label="Status Simpan Otomatis Checklist"
                    size="XL"
                    selectedKey={values.auto_save_checklist}
                    onSelectionChange={(key) => update("auto_save_checklist", String(key ?? "0"))}
                    onFocus={() => setFocusedField("auto_save_checklist")}
                    onBlur={() => setFocusedField(null)}
                  >
                    <ComboBoxItem id="0">Nonaktif</ComboBoxItem>
                    <ComboBoxItem id="1">Aktif</ComboBoxItem>
                  </ComboBox>
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
