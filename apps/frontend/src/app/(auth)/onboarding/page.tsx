"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { OnboardingCard } from "@/components/onboarding/onboarding-card";
import { playCardEntrance } from "@/components/login/login-animations";
import { Background } from "@/components/ui/background";

/**
 * Halaman Onboarding Utama (Rute "/onboarding")
 * Menggunakan visualisasi background partikel dan form kartu onboarding modular.
 */
export default function OnboardingPage() {
  const cardRef = useRef<HTMLDivElement>(null);

  // Animasi masuk (slide up + fade in + blur) untuk kartu onboarding
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
      className="relative min-h-screen overflow-hidden bg-cu-surface font-sans text-dark"
    >
      {/* Background Image Parallax Zoom */}
      <Background />

      {/* Konten Utama Form Onboarding */}
      <div className="relative z-10 flex min-h-screen w-full items-end justify-center px-0 pt-10 md:items-center md:px-5 md:py-10">
        <div ref={cardRef} className="w-full flex justify-center z-10">
          <Suspense
            fallback={
              <div className="relative z-10 min-h-[368px] w-full rounded-t-[32px] bg-white px-8 pb-[20vh] pt-8 shadow-2xl md:max-w-[430px] md:rounded-[28px] md:px-9 md:py-10" />
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
