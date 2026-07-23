"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Navbar } from "@/components/navbar";
import { APP_ROUTES } from "@/core/navigation/routes";
import { useAuth } from "@/providers/auth-provider";
import { HeroHeading } from "@/design-system/atoms/typography/hero-heading";
import { PrimaryActionLink } from "@/design-system/atoms/actions/primary-action-link";

export default function GuestLandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [hasTypingCompleted, setHasTypingCompleted] = useState(false);
  const [isPrimaryActionVisible, setIsPrimaryActionVisible] = useState(false);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const completeTyping = useCallback(() => setHasTypingCompleted(true), []);

  useEffect(() => {
    if (!hasTypingCompleted) return;
    const delay = window.setTimeout(() => setIsPrimaryActionVisible(true), 400);
    return () => window.clearTimeout(delay);
  }, [hasTypingCompleted]);

  useEffect(() => {
    const context = gsap.context(() => {
      if (!backgroundRef.current) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(backgroundRef.current, { transformOrigin: "center center", scale: 1 });
        gsap.fromTo(backgroundRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.72, ease: "power2.out" });
        gsap.to(backgroundRef.current, { scale: 1.16, duration: 5.5, delay: 0.72, ease: "sine.inOut", repeat: -1, yoyo: true });
      });
      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(backgroundRef.current, { autoAlpha: 1 });
      });
      return () => media.revert();
    });
    return () => context.revert();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-[url('/images/landing/creative-universe-background.jpg')] bg-cover bg-center bg-no-repeat" />;
  }

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col bg-white font-sans text-cu-ink antialiased">
        <Navbar />
        <main aria-label="Universe landing" className="flex flex-1 flex-col justify-center px-4 md:px-16 lg:px-24">
          <div className="w-full max-w-4xl text-left">
            <h2 className="animate-slide-up text-3xl font-medium leading-[0.95] tracking-[-0.04em] text-cu-ink opacity-0 md:text-5xl lg:text-6xl" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
              Selamat datang di
            </h2>
            <HeroHeading typing typingDelay={700} onTypingComplete={completeTyping} className="w-full !text-left mt-2" align="left">
              Creative Universe
            </HeroHeading>
            {isPrimaryActionVisible && (
              <p className="animate-fade-in mt-6 max-w-3xl text-lg text-cu-muted opacity-0 md:text-xl" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
                Satu ekosistem untuk semua kebutuhan kreatif. Kelola tugas, pantau performance tim, serta terintegrasi dengan Creative AI untuk decision making.
              </p>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#16001f] font-sans text-cu-ink antialiased">
      <div ref={backgroundRef} aria-hidden="true" className="absolute inset-0 bg-[url('/images/landing/creative-universe-background.jpg')] bg-cover bg-center bg-no-repeat opacity-0" />
      <Navbar variant="transparent-dark" session="guest" />
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12 md:gap-10 md:px-16">
        <HeroHeading typing typingDelay={760} onTypingComplete={completeTyping} className="w-full !text-white">This is Where Creative Begins</HeroHeading>
        {isPrimaryActionVisible && <div className="cu-landing-action-enter"><PrimaryActionLink href={APP_ROUTES.login}>Masuk ke Universe</PrimaryActionLink></div>}
      </main>
    </div>
  );
}
