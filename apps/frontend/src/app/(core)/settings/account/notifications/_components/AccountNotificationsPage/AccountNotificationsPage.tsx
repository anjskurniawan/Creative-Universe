"use client";

import { useEffect, useState, type FormEvent } from "react";
import { apiFetch, ApiError, ValidationError } from "@/core/api/client";
import { useAuth } from "@/hooks/auth";
import { Button, Text } from "@react-spectrum/s2/Button";
import { Switch } from "@react-spectrum/s2/Switch";
import { TextField } from "@react-spectrum/s2/TextField";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import { ToastContainer, ToastQueue } from "@react-spectrum/s2/Toast";

function getErrorMessage(error: unknown): string {
  if (error instanceof ValidationError) return Object.values(error.errors).flat()[0] || "Data tidak valid.";
  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

export default function AccountNotificationsPage() {
  const { user, refreshUser } = useAuth();
  const [inApp, setInApp] = useState(true);
  const [whatsapp, setWhatsapp] = useState(false);
  const [taskUpdates, setTaskUpdates] = useState(true);
  const [mentions, setMentions] = useState(true);
  const [deadlines, setDeadlines] = useState(true);
  const [quietStart, setQuietStart] = useState("");
  const [quietEnd, setQuietEnd] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    queueMicrotask(() => {
      const setting = (key: string, fallback: string) => String(user.settings?.[key] ?? fallback);
      const enabled = (key: string, fallback: boolean) => [true, "1", 1].includes(user.settings?.[key] as boolean | string | number) ? true : user.settings?.[key] == null ? fallback : false;
      setInApp(enabled("notification_in_app", true));
      setWhatsapp(enabled("notification_whatsapp", false));
      setTaskUpdates(enabled("notification_task_updates", true));
      setMentions(enabled("notification_mentions", true));
      setDeadlines(enabled("notification_deadlines", true));
      setQuietStart(setting("notification_quiet_start", ""));
      setQuietEnd(setting("notification_quiet_end", ""));
    });
  }, [user]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await apiFetch("/profile", { method: "PATCH", body: JSON.stringify({ settings: {
        notification_in_app: inApp, notification_whatsapp: whatsapp, notification_task_updates: taskUpdates,
        notification_mentions: mentions, notification_deadlines: deadlines,
        notification_quiet_start: quietStart || null, notification_quiet_end: quietEnd || null,
      } }) });
      await refreshUser();
      ToastQueue.positive("Preferensi notifikasi berhasil disimpan.", { timeout: 5000 });
    } catch (requestError) {
      ToastQueue.negative(getErrorMessage(requestError), { timeout: 5000 });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="w-full space-y-5">
      <ToastContainer placement="bottom end" />
      <div className="space-y-5 rounded-2xl border border-cu-line bg-cu-surface p-5">
        <Switch size="XL" isSelected={inApp} onChange={setInApp}>Notifikasi dalam aplikasi</Switch>
        <p className="text-sm text-cu-muted">Tampilkan notifikasi pada Creative Universe.</p>
        <Switch size="XL" isSelected={whatsapp} onChange={setWhatsapp}>Notifikasi WhatsApp</Switch>
        <p className="text-sm text-cu-muted">Simpan preferensi kanal WhatsApp untuk integrasi berikutnya.</p>
      </div>
      <div className="space-y-5 rounded-2xl border border-cu-line bg-cu-surface p-5">
        <h3 className="text-sm font-semibold text-cu-ink">Peristiwa yang ingin diterima</h3>
        <Switch size="XL" isSelected={taskUpdates} onChange={setTaskUpdates}>Update tugas</Switch>
        <p className="text-sm text-cu-muted">Task baru, perubahan status, dan assignment.</p>
        <Switch size="XL" isSelected={mentions} onChange={setMentions}>Mention dan pesan</Switch>
        <p className="text-sm text-cu-muted">Saat Anda disebut atau menerima aktivitas percakapan.</p>
        <Switch size="XL" isSelected={deadlines} onChange={setDeadlines}>Deadline</Switch>
        <p className="text-sm text-cu-muted">Pengingat tenggat waktu dan keterlambatan.</p>
      </div>
      <div className="space-y-5 rounded-2xl border border-cu-line bg-cu-surface p-5">
        <div>
          <h3 className="text-sm font-semibold text-cu-ink">Jam hening</h3>
          <p className="mt-1 text-sm text-cu-muted">Disimpan sebagai preferensi untuk aturan pengiriman mendatang.</p>
        </div>
        <TextField label="Mulai" type="time" value={quietStart} onChange={setQuietStart} size="XL" styles={style({ width: "full" })} />
        <TextField label="Selesai" type="time" value={quietEnd} onChange={setQuietEnd} size="XL" styles={style({ width: "full" })} />
      </div>
      <Button type="submit" variant="primary" size="XL" isDisabled={saving} isPending={saving}><Text>{saving ? "Menyimpan..." : "Simpan Preferensi"}</Text></Button>
    </form>
  );
}
