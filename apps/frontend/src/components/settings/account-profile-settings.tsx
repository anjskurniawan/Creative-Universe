"use client";

import { useEffect, useRef, useState, type FormEvent, type PointerEvent, type WheelEvent } from "react";
import { apiFetch, ApiError, ValidationError } from "@/core/api/client";
import { useAuth } from "@/providers/auth-provider";
import { Avatar } from "@react-spectrum/s2/Avatar";
import { Button, Text } from "@react-spectrum/s2/Button";
import { InlineAlert, Content, Heading } from "@react-spectrum/s2/InlineAlert";
import { Slider } from "@react-spectrum/s2/Slider";
import { TextField } from "@react-spectrum/s2/TextField";
import { ToastContainer, ToastQueue } from "@react-spectrum/s2/Toast";

export default function AccountProfileSettings() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cropSource, setCropSource] = useState<string | null>(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const cropImageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cropDragRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    queueMicrotask(() => {
      setName(user.name);
      setUsername(user.username);
      setEmail(user.email ?? "");
      setWhatsappNumber(user.whatsapp_number ?? "");
      setAvatarPreview(user.avatar_url ?? null);
    });
  }, [user]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus(null);
    setError(null);
    try {
      await apiFetch("/profile", {
        method: "PATCH",
        body: JSON.stringify({ name, username, email: email || null, whatsapp_number: whatsappNumber || null }),
      });
      if (avatar) {
        const formData = new FormData();
        formData.append("avatar", avatar);
        await apiFetch("/profile/avatar", { method: "POST", body: formData });
        setAvatar(null);
      }
      await refreshUser();
      setStatus("Profil berhasil disimpan.");
      ToastQueue.positive("Profil berhasil disimpan.", { timeout: 5000 });
    } catch (requestError) {
      const nextError = requestError instanceof ValidationError ? Object.values(requestError.errors).flat()[0] || "Data tidak valid." : requestError instanceof ApiError ? requestError.message : "Terjadi kesalahan. Silakan coba lagi.";
      setError(nextError);
      ToastQueue.negative(nextError, { timeout: 5000 });
    } finally {
      setSaving(false);
    }
  }

  function openCrop(file: File) {
    setCropSource(URL.createObjectURL(file));
    setCropZoom(1);
    setCropOffset({ x: 0, y: 0 });
  }

  function updateCropOffset(x: number, y: number) {
    setCropOffset({ x: Math.max(-100, Math.min(100, x)), y: Math.max(-100, Math.min(100, y)) });
  }

  function handleCropPointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    cropDragRef.current = { x: event.clientX, y: event.clientY, offsetX: cropOffset.x, offsetY: cropOffset.y };
  }

  function handleCropPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = cropDragRef.current;
    if (drag) updateCropOffset(drag.offsetX + (event.clientX - drag.x) / 1.6, drag.offsetY + (event.clientY - drag.y) / 1.6);
  }

  function handleCropPointerUp() { cropDragRef.current = null; }

  function handleCropWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    setCropZoom((value) => Math.max(1, Math.min(3, value + (event.deltaY > 0 ? -0.08 : 0.08))));
  }

  async function applyCrop() {
    const image = cropImageRef.current;
    if (!image || !cropSource) return;
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    if (!context) return;
    const scale = Math.max(size / image.naturalWidth, size / image.naturalHeight) * cropZoom;
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    context.drawImage(image, (size - width) / 2 + (cropOffset.x / 100) * Math.max(0, (width - size) / 2), (size - height) / 2 + (cropOffset.y / 100) * Math.max(0, (height - size) / 2), width, height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
    if (!blob) return;
    const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(blob));
    setCropSource(null);
  }

  return (
    <form onSubmit={save} className="max-w-3xl space-y-5">
      <ToastContainer placement="bottom end" />
      {status && <InlineAlert variant="positive" fillStyle="subtleFill"><Heading>Berhasil</Heading><Content>{status}</Content></InlineAlert>}
      {error && <InlineAlert variant="negative" fillStyle="subtleFill"><Heading>Gagal menyimpan</Heading><Content>{error}</Content></InlineAlert>}
      <section className="overflow-hidden rounded-2xl border border-cu-line bg-cu-surface shadow-sm">
        <div className="h-28 bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899]" />
        <div className="flex items-end gap-4 px-5 pb-5">
          <Avatar src={avatarPreview ?? undefined} alt={`Foto profil ${user?.name ?? ""}`} size={96} />
          <div className="min-w-0 pb-1"><h2 className="truncate text-xl font-semibold text-cu-ink">{user?.name}</h2><p className="text-sm text-cu-muted">{user?.roles?.[0] ?? "Creative Universe Member"}</p></div>
        </div>
      </section>
      <TextField label="Nama Lengkap" value={name} onChange={setName} size="L" />
      <TextField label="Username" value={username} isDisabled onChange={setUsername} size="L" />
      <TextField label="Alamat Email" type="email" value={email} onChange={setEmail} size="L" />
      <TextField label="Nomor WhatsApp" value={whatsappNumber} onChange={setWhatsappNumber} size="L" />
      <div className="rounded-xl border border-cu-line bg-cu-surface p-4"><p className="text-sm font-semibold text-cu-ink">Foto Profil</p><div className="mt-3 flex items-center gap-4"><Avatar src={avatarPreview ?? undefined} alt="Foto profil" size={64} /><Button type="button" variant="secondary" onPress={() => fileInputRef.current?.click()}>Ganti Avatar</Button><input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) openCrop(file); }} /></div><p className="mt-2 text-xs text-cu-muted">Format JPEG, PNG, JPG, WEBP. Maksimal file 2MB.</p></div>
      <Button type="submit" variant="primary" size="XL" isDisabled={saving} isPending={saving}><Text>{saving ? "Menyimpan..." : "Simpan Profil"}</Text></Button>
      {cropSource && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><div className="w-full max-w-md rounded-2xl bg-cu-surface p-5 shadow-2xl"><h3 className="text-lg font-semibold text-cu-ink">Sesuaikan Avatar</h3><div className="mx-auto mt-4 aspect-square max-w-xs overflow-hidden rounded-full bg-cu-panel-soft" onPointerDown={handleCropPointerDown} onPointerMove={handleCropPointerMove} onPointerUp={handleCropPointerUp} onPointerCancel={handleCropPointerUp} onWheel={handleCropWheel}><img ref={cropImageRef} src={cropSource} alt="Preview crop avatar" className="size-full select-none object-cover" style={{ transform: `scale(${cropZoom}) translate(${cropOffset.x / 2}%, ${cropOffset.y / 2}%)` }} draggable={false} /></div><Slider label="Zoom" minValue={1} maxValue={3} step={0.01} value={cropZoom} onChange={(value) => setCropZoom(Number(value))} /><div className="mt-5 flex justify-end gap-2"><Button type="button" variant="secondary" onPress={() => setCropSource(null)}>Batal</Button><Button type="button" variant="primary" onPress={() => void applyCrop()}>Gunakan Avatar</Button></div></div></div>}
    </form>
  );
}
