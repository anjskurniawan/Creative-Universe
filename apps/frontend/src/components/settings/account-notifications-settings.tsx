"use client";

import { useEffect, useState, type FormEvent } from "react";
import { apiFetch, ApiError, ValidationError } from "@/core/api/client";
import { useAuth } from "@/providers/auth-provider";
import { Button, Text } from "@react-spectrum/s2/Button";
import { InlineAlert, Content, Heading } from "@react-spectrum/s2/InlineAlert";
import { Switch } from "@react-spectrum/s2/Switch";
import { TextField } from "@react-spectrum/s2/TextField";
import { ToastContainer, ToastQueue } from "@react-spectrum/s2/Toast";

export default function AccountNotificationsSettings() {
  const { user, refreshUser } = useAuth();
  const [inApp, setInApp] = useState(true);
  const [whatsapp, setWhatsapp] = useState(false);
  const [taskUpdates, setTaskUpdates] = useState(true);
  const [mentions, setMentions] = useState(true);
  const [deadlines, setDeadlines] = useState(true);
  const [quietStart, setQuietStart] = useState("");
  const [quietEnd, setQuietEnd] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    queueMicrotask(() => {
      const setting = (key: string, fallback: string) => String(user.settings?.[key] ?? fallback);
      const enabled = (key: string, fallback: boolean) => [true, "1", 1].includes(user.settings?.[key] as boolean | string | number) ? true : user.settings?.[key] == null ? fallback : false;
      setInApp(enabled("notification_in_app", true)); setWhatsapp(enabled("notification_whatsapp", false)); setTaskUpdates(enabled("notification_task_updates", true)); setMentions(enabled("notification_mentions", true)); setDeadlines(enabled("notification_deadlines", true)); setQuietStart(setting("notification_quiet_start", "")); setQuietEnd(setting("notification_quiet_end", ""));
    });
  }, [user]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setStatus(null); setError(null);
    try {
      await apiFetch("/profile", { method: "PATCH", body: JSON.stringify({ settings: { notification_in_app: inApp, notification_whatsapp: whatsapp, notification_task_updates: taskUpdates, notification_mentions: mentions, notification_deadlines: deadlines, notification_quiet_start: quietStart || null, notification_quiet_end: quietEnd || null } }) });
      await refreshUser(); setStatus("Preferensi notifikasi berhasil disimpan."); ToastQueue.positive("Preferensi notifikasi berhasil disimpan.", { timeout: 5000 });
    } catch (requestError) {
      const nextError = requestError instanceof ValidationError ? Object.values(requestError.errors).flat()[0] || "Data tidak valid." : requestError instanceof ApiError ? requestError.message : "Terjadi kesalahan. Silakan coba lagi.";
      setError(nextError); ToastQueue.negative(nextError, { timeout: 5000 });
    } finally { setSaving(false); }
  }

  return <form onSubmit={save} className="max-w-2xl space-y-5"><ToastContainer placement="bottom end" />{status && <InlineAlert variant="positive" fillStyle="subtleFill"><Heading>Berhasil</Heading><Content>{status}</Content></InlineAlert>}{error && <InlineAlert variant="negative" fillStyle="subtleFill"><Heading>Gagal menyimpan</Heading><Content>{error}</Content></InlineAlert>}<div className="space-y-3 rounded-2xl border border-cu-line bg-cu-surface p-5"><Switch isSelected={inApp} onChange={setInApp}>Notifikasi dalam aplikasi</Switch><p className="text-sm text-cu-muted">Tampilkan notifikasi pada Creative Universe.</p><Switch isSelected={whatsapp} onChange={setWhatsapp}>Notifikasi WhatsApp</Switch><p className="text-sm text-cu-muted">Simpan preferensi kanal WhatsApp untuk integrasi berikutnya.</p></div><div className="space-y-3 rounded-2xl border border-cu-line bg-cu-surface p-5"><h3 className="text-sm font-semibold text-cu-ink">Peristiwa yang ingin diterima</h3><Switch isSelected={taskUpdates} onChange={setTaskUpdates}>Update tugas</Switch><p className="text-sm text-cu-muted">Task baru, perubahan status, dan assignment.</p><Switch isSelected={mentions} onChange={setMentions}>Mention dan pesan</Switch><p className="text-sm text-cu-muted">Saat Anda disebut atau menerima aktivitas percakapan.</p><Switch isSelected={deadlines} onChange={setDeadlines}>Deadline</Switch><p className="text-sm text-cu-muted">Pengingat tenggat waktu dan keterlambatan.</p></div><div className="rounded-2xl border border-cu-line bg-cu-surface p-5"><h3 className="text-sm font-semibold text-cu-ink">Jam hening</h3><p className="mt-1 text-sm text-cu-muted">Disimpan sebagai preferensi untuk aturan pengiriman mendatang.</p><div className="mt-4 grid gap-4 sm:grid-cols-2"><TextField label="Mulai" type="time" value={quietStart} onChange={setQuietStart} /><TextField label="Selesai" type="time" value={quietEnd} onChange={setQuietEnd} /></div></div><Button type="submit" variant="primary" size="XL" isDisabled={saving} isPending={saving}><Text>{saving ? "Menyimpan..." : "Simpan Preferensi"}</Text></Button></form>;
}
