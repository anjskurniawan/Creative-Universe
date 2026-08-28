"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { LoginCard, playCardEntrance } from "@/features/auth/components/Login";
import { ParallaxBackground } from "@/features/auth/components/ParallaxBackground";

/**
 * Halaman Login Utama (Rute "/login")
 * Menggunakan visualisasi background 3D dan form kartu login modular.
 */
export default function LoginPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const whiteOverlayRef = useRef<HTMLDivElement>(null);

  // Animasi masuk (slide up + fade in + blur) untuk kartu login
  useEffect(() => {
    let tween: gsap.core.Tween | undefined;

    if (cardRef.current) {
      tween = playCardEntrance(cardRef.current);
    }

    return () => {
      tween?.kill();
    };
  }, []);

  return (
    <main
      data-login-hero
      className="cu-style relative min-h-screen overflow-hidden bg-cu-surface font-sans text-dark"
    >
      {/* Background Image Parallax Zoom */}
      <ParallaxBackground />

      {/* Konten Utama Form Login */}
      <div className="relative z-10 flex min-h-screen w-full items-end justify-center px-0 pt-10 md:items-center md:px-5 md:pt-0">
        <div ref={cardRef} className="w-full flex justify-center z-10">
          <Suspense
            fallback={
              <div className="relative z-10 min-h-[368px] w-full rounded-t-[32px] bg-white px-8 pb-14 pt-8 shadow-2xl md:h-[612px] md:w-[200px] md:rounded-[16px] md:p-0 md:shadow-[0px_8px_12px_rgba(0,0,0,0.15)]" />
            }
          >
            <LoginCard whiteOverlayRef={whiteOverlayRef} />
          </Suspense>
        </div>
      </div>

      {/* Overlay Putih untuk Animasi Transisi Masuk ke Universe */}
      <div
        ref={whiteOverlayRef}
        className="fixed inset-0 pointer-events-none z-[9999] bg-white opacity-0"
      />
    </main>
  );
}
