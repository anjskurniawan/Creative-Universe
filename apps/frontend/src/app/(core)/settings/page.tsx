"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsIndexPage() {
  const router = useRouter();

  // Desktop (lg+): langsung ke pengaturan profil agar sidebar aktif dengan konten
  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (isDesktop) {
      router.replace("/settings/account/profile");
    }
  }, [router]);

  // Mobile: SettingsLayout sudah handle tampilan nav list vs content panel
  // isMobileDetail = false di /settings → nav list tampil, content hidden
  return null;
}
