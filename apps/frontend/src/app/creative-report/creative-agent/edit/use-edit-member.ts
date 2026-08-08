import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resolveStorageUrl } from "@/core/api/client";
import { creativeReportApi } from "@/features/creative-report/api";
import { getOddsCategories, type OddsCategory } from "@/features/odds/api";
import type { CreativeMemberProfile } from "@/features/creative-report/types";
import { useAuth } from "@/providers/auth-provider";

export function useEditMember() {
  const memberId = useSearchParams().get("memberId");
  const router = useRouter();
  const { hasRole } = useAuth();

  // Data profil anggota kreatif
  const [member, setMember] = useState<CreativeMemberProfile | null>(null);
  // Daftar kategori spesialisasi ODDS dari database
  const [categories, setCategories] = useState<OddsCategory[]>([]);
  // File gambar/video kartu yang diunggah
  const [image, setImage] = useState<File | null>(null);
  // Status loading tombol simpan
  const [saving, setSaving] = useState(false);
  // Pesan galat/error
  const [error, setError] = useState<string | null>(null);
  // Tab aktif ("identity" = Data Diri, "specialties" = Spesialisasi ODDS)
  const [activeTab, setActiveTab] = useState<"identity" | "specialties">("identity");

  // Auto-clear pesan error
  useEffect(() => {
    if (!error) return;
    const timeout = window.setTimeout(() => setError(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [error]);

  // --- DATA LOADING & AUTHORIZATION ---
  useEffect(() => {
    // Validasi Akses: Hanya pengguna dengan Role "Root" atau "Manajer" yang boleh masuk
    if (!hasRole("Root") && !hasRole("Manajer")) {
      void router.replace("/creative-report/creative-agent");
      return;
    }

    // Pastikan ID anggota dikirim via query params
    if (!memberId) {
      setError("Anggota Creative tidak dipilih.");
      return;
    }

    // Memuat profil anggota beserta seluruh kategori spesialisasi dari database
    void Promise.all([
      creativeReportApi.members.detail(memberId),
      getOddsCategories(),
    ])
      .then(([profile, odds]) => {
        setMember(profile);
        setCategories(odds);
      })
      .catch((cause) =>
        setError(
          cause instanceof Error ? cause.message : "Gagal memuat profil.",
        ),
      );
  }, [hasRole, memberId, router]);

  // Set representasi spesialisasi ODDS aktif untuk pencocokan checkbox
  const selected = new Set(
    (member?.odds_profile?.specializations ?? []).map(String),
  );

  // --- SUBMIT / SAVE FUNCTION ---
  const save = async () => {
    if (!member) return;
    setSaving(true);
    setError(null);
    const body = new FormData();

    // Normalisasi format Nomor WhatsApp ke format Internasional (+62)
    const whatsappDigits = (member.whatsapp_number ?? "").replace(/\D/g, "");
    const whatsappNumber = whatsappDigits.startsWith("62")
      ? whatsappDigits
      : whatsappDigits.startsWith("0")
        ? `62${whatsappDigits.slice(1)}`
        : whatsappDigits.startsWith("8")
          ? `62${whatsappDigits}`
          : whatsappDigits;

    // Menyusun muatan data formulir
    body.set("name", member.name);
    body.set("email", member.email ?? "");
    body.set("whatsapp_number", whatsappNumber);
    body.set("roles", JSON.stringify(member.roles ?? []));
    body.set("position_name", member.position_name);
    body.set("joined_at", member.joined_at ?? "");
    body.set("resigned_at", member.resigned_at ?? "");
    body.set(
      "specializations",
      JSON.stringify(member.odds_profile?.specializations ?? []),
    );
    body.set("odds_status", member.odds_profile?.status ?? "available");
    body.set("odds_is_active", member.odds_profile?.is_active ? "1" : "0");
    if (image) body.set("card_image", image);

    try {
      // Mengirim pembaruan data anggota ke API
      await creativeReportApi.members.update(member.id, body);
      router.push("/creative-report/creative-agent");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Gagal menyimpan profil.",
      );
    } finally {
      setSaving(false);
    }
  };

  // Menentukan sumber media preview (apakah dari local upload atau path database)
  const photo = image
    ? URL.createObjectURL(image)
    : member
      ? resolveStorageUrl(member.card_image_path)
      : null;
  const photoIsVideo = Boolean(
    image?.type.startsWith("video/") ||
      (photo && /\.(mp4|webm|ogg)(?:\?.*)?$/i.test(photo)),
  );

  return {
    member,
    setMember,
    categories,
    image,
    setImage,
    saving,
    error,
    setError,
    activeTab,
    setActiveTab,
    selected,
    photo,
    photoIsVideo,
    save,
  };
}
