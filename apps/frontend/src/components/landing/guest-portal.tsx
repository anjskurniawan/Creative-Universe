"use client";

import { useCallback, useEffect, useState } from "react";
import { HeroHeading } from "@/components/typography/hero-heading";
import { ButtonAction } from "@/components/ui/button-action";
import { Background } from "@/components/ui/background";
import { APP_ROUTES } from "@/core/navigation/routes";

// Halaman Landing/Portal untuk tamu (Guest) yang belum login
export function GuestPortal() {
  const [hasTypingCompleted, setHasTypingCompleted] = useState(false);
  const [isPrimaryActionVisible, setIsPrimaryActionVisible] = useState(false);

  // Selesainya animasi typing judul
  const completeTyping = useCallback(() => setHasTypingCompleted(true), []);

  // Jeda pemunculan tombol aksi utama setelah typing selesai
  useEffect(() => {
    if (!hasTypingCompleted) return;
    const delay = window.setTimeout(() => setIsPrimaryActionVisible(true), 400);
    return () => window.clearTimeout(delay);
  }, [hasTypingCompleted]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#16001f] font-sans text-cu-ink antialiased">
      {/* Background Image Parallax Zoom */}
      <Background />

      {/* Konten Utama */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12 md:gap-10 md:px-16">
        <HeroHeading typing typingDelay={760} onTypingComplete={completeTyping} className="w-full !text-white">
          This is Where Creative Begins
        </HeroHeading>
        {isPrimaryActionVisible && (
          <div className="cu-landing-action-enter">
            <ButtonAction href={APP_ROUTES.login}>Masuk ke Universe</ButtonAction>
          </div>
        )}
      </main>
    </div>
  );
}
