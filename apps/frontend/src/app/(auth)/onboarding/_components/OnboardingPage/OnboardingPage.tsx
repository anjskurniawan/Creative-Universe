"use client";

import React, { Suspense, useLayoutEffect, useRef } from "react";
import { OnboardingCard } from "@/features/auth/components/Onboarding";
import { playCardEntrance } from "@/features/auth/components/Login";
import { ParallaxBackground } from "@/features/auth/components/ParallaxBackground";

/**
 * Halaman Onboarding Utama (Rute "/onboarding")
 * Menggunakan visualisasi background partikel dan form kartu onboarding modular.
 */
export default function OnboardingPage() {
  const cardRef = useRef<HTMLDivElement>(null);

  // Animasi masuk (slide up + fade in + blur) untuk kartu onboarding
  useLayoutEffect(() => {
    let tween: gsap.core.Tween | undefined;
    const frame = window.requestAnimationFrame(() => {
      if (cardRef.current) {
        tween = playCardEntrance(cardRef.current);
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
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

      {/* Konten Utama Form Onboarding */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-5 py-10">
        <div ref={cardRef} className="w-full flex justify-center z-10 will-change-transform">
          <Suspense
            fallback={
              <div className="cu-style relative z-10 min-h-[368px] w-full rounded-t-[32px] bg-white px-8 pb-[20vh] pt-8 shadow-2xl md:max-w-[430px] md:rounded-[28px] md:px-9 md:py-10" />
            }
          >
            <OnboardingCard />
          </Suspense>
        </div>
      </div>

      {/* Global Transition Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(4px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
              animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @keyframes logoFadeIn {
              0% { opacity: 0; transform: scale(0.9) translateY(12px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            .animate-logo-fade-in {
              animation: logoFadeIn 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `,
        }}
      />
    </main>
  );
}
