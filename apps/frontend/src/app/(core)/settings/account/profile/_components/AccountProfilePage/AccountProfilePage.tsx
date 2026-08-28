"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { apiFetch, ApiError, ValidationError } from "@/core/api/client";
import { useAuth } from "@/hooks/auth";
import { Button, Text } from "@react-spectrum/s2/Button";
import { TextField } from "@react-spectrum/s2/TextField";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import { ToastContainer, ToastQueue } from "@react-spectrum/s2/Toast";
import { ProfileCard } from "@/components/spectrum/ProfileCard/ProfileCard";
import { ProfileImageUpload } from "./ProfileImageUpload/ProfileImageUpload";
import { useSettingAside } from "@/features/settings/components/SettingLayout/SettingLayout.logic";

export default function AccountProfilePage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const avatarTriggerRef = useRef<(() => void) | null>(null);
  const bannerTriggerRef = useRef<(() => void) | null>(null);
  const profileRole = user?.roles?.[0] ?? "Creative Universe Member";
  const profileCard = useMemo(() => (
    <ProfileCard
      name={user?.name ?? name}
      role={profileRole}
      avatarSrc={avatarPreview}
      bannerSrc={bannerPreview}
      onChangeAvatar={() => avatarTriggerRef.current?.()}
      onChangeBanner={() => bannerTriggerRef.current?.()}
    />
  ), [avatarPreview, bannerPreview, name, profileRole, user?.name]);

  useSettingAside(profileCard);

  useEffect(() => {
    if (!user) return;
    queueMicrotask(() => {
      setName(user.name);
      setUsername(user.username);
      setEmail(user.email ?? "");
      setWhatsappNumber(user.whatsapp_number ?? "");
      setAvatarPreview(user.avatar_url ?? null);
      setBannerPreview(user.banner_url ?? null);
    });
  }, [user]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await apiFetch("/profile", { method: "PATCH", body: JSON.stringify({
        name, username, email: email || null, whatsapp_number: whatsappNumber || null,
      }) });
      if (avatar) {
        const formData = new FormData();
        formData.append("avatar", avatar);
        await apiFetch("/profile/avatar", { method: "POST", body: formData });
        setAvatar(null);
      }
      await refreshUser();
      ToastQueue.positive("Profil berhasil disimpan.", { timeout: 5000 });
    } catch (requestError) {
      const message = requestError instanceof ValidationError
        ? Object.values(requestError.errors).flat()[0] || "Data tidak valid."
        : requestError instanceof ApiError ? requestError.message : "Terjadi kesalahan. Silakan coba lagi.";
      ToastQueue.negative(message, { timeout: 5000 });
    } finally {
      setSaving(false);
    }
  }

  async function handleBannerCropped(file: File, previewUrl: string) {
    setBannerPreview(previewUrl);
    const formData = new FormData();
    formData.append("banner", file);
    await apiFetch("/profile/banner", { method: "POST", body: formData });
    await refreshUser();
    ToastQueue.positive("Banner berhasil diperbarui.", { timeout: 5000 });
  }

  return (
    <form onSubmit={save} className="w-full space-y-5">
      <ToastContainer placement="bottom end" />
      <TextField label="Nama Lengkap" value={name} onChange={setName} size="XL" styles={style({ width: "full" })} />
      <TextField label="Username" value={username} isDisabled onChange={setUsername} size="XL" styles={style({ width: "full" })} />
      <TextField label="Alamat Email" type="email" value={email} onChange={setEmail} size="XL" styles={style({ width: "full" })} />
      <TextField label="Nomor WhatsApp" prefix="+62" value={whatsappNumber} onChange={setWhatsappNumber} size="XL" styles={style({ width: "full" })} />
      <ProfileImageUpload kind="avatar" triggerRef={avatarTriggerRef} onCropped={(file, previewUrl) => { setAvatar(file); setAvatarPreview(previewUrl); }} />
      <ProfileImageUpload kind="banner" triggerRef={bannerTriggerRef} onCropped={(file, previewUrl) => void handleBannerCropped(file, previewUrl)} />
      <Button type="submit" variant="primary" size="XL" isDisabled={saving} isPending={saving}><Text>{saving ? "Menyimpan..." : "Simpan Profil"}</Text></Button>
    </form>
  );
}
