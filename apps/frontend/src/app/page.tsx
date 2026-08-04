"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/archive/old-navbar";
import { APP_ROUTES } from "@/core/navigation/routes";
import { APPLICATION_ICONS, visibleSubApplications } from "@/core/applications";
import type { AccessibleApplication } from "@/core/applications";
import { useAuth } from "@/providers/auth-provider";
import { HeroHeading } from "@/components/typography/hero-heading";
import { PrimaryActionLink } from "@/components/ui/primary-action-link";
import { MaterialIcon } from "@/components/ui/material-icon";

export default function GuestLandingPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
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
    const creativeRole = user?.roles.find((role) => ["Designer", "Videographer", "Content Creator"].includes(role));
    const accessibleApplications = visibleSubApplications(user?.applications ?? []);
    const firstName = user?.name?.trim().split(/\s+/).slice(0, 2).join(" ") || "Creative";
    const cardImage = user?.card_image_url ?? user?.avatar_url;
    const cardIsVideo = Boolean(cardImage && /\.(mp4|webm|ogg)(?:\?.*)?$/i.test(cardImage));
    return (
      <div className={`flex ${creativeRole ? "h-screen overflow-hidden" : "min-h-screen"} flex-col bg-white font-sans text-cu-ink antialiased`}>
        <Navbar hideBrand />
        <main aria-label="Universe landing" className={`min-h-0 flex-1 ${creativeRole ? "grid lg:grid-cols-2" : "grid lg:grid-cols-3"}`}>
          <div className={creativeRole ? "flex min-h-0 flex-col items-start justify-center px-8 py-8 text-left lg:px-16" : "col-span-2 flex min-h-[42vh] items-center bg-white px-8 py-12 sm:px-12 lg:min-h-0 lg:px-16 xl:px-24"}>
            <HeroHeading key={creativeRole ? firstName : "creative-universe"} typing typingDelay={700} onTypingComplete={completeTyping} gradientSuffix={creativeRole ? firstName : undefined} className="w-full !text-left !text-4xl [&_.hero-heading-gradient-suffix]:bg-gradient-to-r [&_.hero-heading-gradient-suffix]:from-[#7c3aed] [&_.hero-heading-gradient-suffix]:via-[#c084fc] [&_.hero-heading-gradient-suffix]:to-[#22d3ee] [&_.hero-heading-gradient-suffix]:bg-clip-text [&_.hero-heading-gradient-suffix]:text-transparent md:!text-5xl lg:!text-6xl" align="left">
              {creativeRole ? `Hello ${firstName}` : "Creative Universe"}
            </HeroHeading>
          </div>
          {creativeRole && <div className="flex min-h-0 h-full w-full items-end justify-center overflow-hidden bg-white">{cardImage ? cardIsVideo ? <video src={cardImage} muted autoPlay loop playsInline className="h-full w-full object-contain object-bottom" /> : <img src={cardImage} alt={`Card ${user?.name ?? "Creative"}`} className="h-full w-full object-contain object-bottom" /> : <span className="text-sm text-cu-muted">Belum ada image card</span>}</div>}
          {!creativeRole && <ApplicationUniverse applications={accessibleApplications} isReady={hasTypingCompleted} />}
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#16001f] font-sans text-cu-ink antialiased">
      <div ref={backgroundRef} aria-hidden="true" className="absolute inset-0 bg-[url('/images/landing/creative-universe-background.jpg')] bg-cover bg-center bg-no-repeat opacity-0" />
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12 md:gap-10 md:px-16">
        <HeroHeading typing typingDelay={760} onTypingComplete={completeTyping} className="w-full !text-white">This is Where Creative Begins</HeroHeading>
        {isPrimaryActionVisible && <div className="cu-landing-action-enter"><PrimaryActionLink href={APP_ROUTES.login}>Masuk ke Universe</PrimaryActionLink></div>}
      </main>
    </div>
  );
}

type PlanetConfig = { orbit: "outer" | "middle"; position: string; color: string };

const PLANET_CONFIG: Partial<Record<AccessibleApplication["key"], PlanetConfig>> = {
  odds: { orbit: "outer", position: "left-[86.5%] top-[40.5%] size-16 sm:size-[4.75rem]", color: "from-[#d9f3e4] to-[#9bdbbb] text-[#247052]" },
  "kv-retail": { orbit: "outer", position: "left-[-2.7%] top-[56.2%] size-16 sm:size-[4.75rem]", color: "from-[#d9e8ff] to-[#93bbf5] text-[#1f579e]" },
  cai: { orbit: "outer", position: "left-[40.5%] top-[-5.5%] size-16 sm:size-[4.75rem]", color: "from-[#d5f2f4] to-[#8ed3db] text-[#176b78]" },
  "creative-report": { orbit: "middle", position: "left-[19.3%] top-[26.9%] size-9 sm:size-11", color: "from-[#f9d9eb] to-[#eaa2c9] text-[#9d4f78]" },
  generator: { orbit: "middle", position: "left-[66.7%] top-[66.7%] size-9 sm:size-11", color: "from-[#ffebbd] to-[#efbd5d] text-[#9d6516]" },
  "design-assets": { orbit: "middle", position: "left-[22.7%] top-[66.7%] size-9 sm:size-11", color: "from-[#ebddff] to-[#c7a5ed] text-[#68418b]" },
};

function ApplicationUniverse({ applications, isReady }: { applications: AccessibleApplication[]; isReady: boolean }) {
  const universeRef = useRef<HTMLDivElement>(null);
  const orbitTweensRef = useRef<Record<PlanetConfig["orbit"], gsap.core.Tween[]>>({ outer: [], middle: [] });

  const setOrbitPaused = (orbit: PlanetConfig["orbit"], paused: boolean) => {
    orbitTweensRef.current[orbit].forEach((tween) => paused ? tween.pause() : tween.resume());
  };

  useEffect(() => {
    if (!isReady || !universeRef.current) return;

    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(universeRef.current, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: "power2.out" });
        const animatePlanets = (orbit: PlanetConfig["orbit"], duration: number, direction: 1 | -1) => {
          const orbitTween = gsap.to(`[data-orbit="${orbit}"]`, { rotation: direction * 360, duration, delay: 0.45, ease: "none", repeat: -1, transformOrigin: "center center" });
          const planetTween = gsap.to(`[data-planet-orbit="${orbit}"]`, { rotation: direction * -360, duration, delay: 0.45, ease: "none", repeat: -1, transformOrigin: "center center" });
          orbitTweensRef.current[orbit] = [orbitTween, planetTween];
        };

        animatePlanets("outer", 180, 1);
        animatePlanets("middle", 130, -1);
        gsap.to('[data-orbit-spinner="outer"]', { rotation: 360, duration: 150, delay: 0.45, ease: "none", repeat: -1, transformOrigin: "center center" });
        gsap.to('[data-orbit-spinner="middle"]', { rotation: -360, duration: 115, delay: 0.45, ease: "none", repeat: -1, transformOrigin: "center center" });
        gsap.to('[data-orbit-spinner="inner"]', { rotation: 360, duration: 82, delay: 0.45, ease: "none", repeat: -1, transformOrigin: "center center" });
        gsap.to("[data-orbit-track]", { opacity: 0.52, duration: 2.8, delay: 0.45, ease: "sine.inOut", repeat: -1, yoyo: true, stagger: 0.35 });
        gsap.to("[data-universe-core-glow]", { scale: 1.16, opacity: 0.68, duration: 3.6, delay: 0.45, ease: "sine.inOut", repeat: -1, yoyo: true, transformOrigin: "center center" });
        gsap.to("[data-universe-logo]", { scale: 1.07, duration: 2.2, delay: 0.45, ease: "sine.inOut", repeat: -1, yoyo: true, transformOrigin: "center center" });
      });
      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(universeRef.current, { autoAlpha: 1, scale: 1 });
      });
      return () => media.revert();
    }, universeRef);

    return () => {
      orbitTweensRef.current = { outer: [], middle: [] };
      context.revert();
    };
  }, [isReady]);

  return (
    <section aria-label="Aplikasi yang tersedia di Creative Universe" className="relative isolate flex min-h-[28rem] items-center justify-center overflow-hidden bg-white px-6 py-8 lg:min-h-0">
      <div ref={universeRef} className={`relative aspect-square w-[min(82vw,26rem)] lg:w-[min(29vw,26rem)] ${isReady ? "" : "opacity-0"}`}>
        <div data-orbit-track aria-hidden="true" className="absolute inset-[4%] rounded-full border border-[#bfcde0] shadow-[0_0_22px_rgba(128,160,207,0.16)]" />
        <div data-orbit-track aria-hidden="true" className="absolute inset-[19%] rounded-full border border-[#cad5e4] shadow-[0_0_16px_rgba(128,160,207,0.12)]" />
        <div data-orbit-track aria-hidden="true" className="absolute inset-[34%] rounded-full border border-[#d7e0eb] shadow-[0_0_12px_rgba(128,160,207,0.1)]" />
        <div data-orbit-spinner="outer" aria-hidden="true" className="pointer-events-none absolute inset-0"><span className="absolute left-1/2 top-[3.5%] size-1.5 -translate-x-1/2 rounded-full bg-[#8ca9d4] shadow-[0_0_10px_3px_rgba(140,169,212,0.32)]" /></div>
        <div data-orbit-spinner="middle" aria-hidden="true" className="pointer-events-none absolute inset-0"><span className="absolute left-1/2 top-[18.5%] size-1.5 -translate-x-1/2 rounded-full bg-[#a6bbdc] shadow-[0_0_8px_2px_rgba(166,187,220,0.28)]" /></div>
        <div data-orbit-spinner="inner" aria-hidden="true" className="pointer-events-none absolute inset-0"><span className="absolute left-1/2 top-[33.5%] size-1 -translate-x-1/2 rounded-full bg-[#becce1] shadow-[0_0_7px_2px_rgba(190,204,225,0.3)]" /></div>

        {applications.map((application) => {
          const config = PLANET_CONFIG[application.key];
          if (!config) return null;

          return (
          <div key={application.key} data-orbit={config.orbit} className="pointer-events-none absolute inset-0 will-change-transform">
            <Link
              href={application.frontend_path!}
              aria-label={`Buka ${application.display_name}`}
              data-planet-orbit={config.orbit}
              onPointerEnter={() => setOrbitPaused(config.orbit, true)}
              onPointerLeave={() => setOrbitPaused(config.orbit, false)}
              onFocus={() => setOrbitPaused(config.orbit, true)}
              onBlur={() => setOrbitPaused(config.orbit, false)}
              className={`pointer-events-auto group absolute z-10 flex ${config.position} items-center justify-center rounded-full border border-white/75 bg-gradient-to-br ${config.color} shadow-[inset_1px_1px_0_rgba(255,255,255,0.65),0_8px_18px_rgba(62,83,120,0.16)] transition duration-200 hover:scale-110 hover:shadow-[inset_1px_1px_0_rgba(255,255,255,0.7),0_12px_22px_rgba(62,83,120,0.22)] focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7895be]/30`}
            >
              <MaterialIcon name={APPLICATION_ICONS[application.key] ?? "apps"} size="auto" className="text-[clamp(0.95rem,2.5vw,1.45rem)]" />
              <span className="pointer-events-none absolute left-1/2 top-[calc(100%+0.65rem)] w-max max-w-[9rem] -translate-x-1/2 rounded-md bg-[#222]/90 px-2 py-1 text-center text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {application.display_name}
              </span>
            </Link>
          </div>
          );
        })}

        <div data-universe-core-glow aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 z-10 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(53,218,255,0.34)_0%,rgba(143,91,233,0.2)_43%,rgba(251,62,149,0.08)_62%,transparent_76%)] blur-xl sm:size-52" />
        <div className="absolute left-1/2 top-1/2 z-20 grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-[radial-gradient(circle_at_32%_27%,#98efff_0%,#11b8e9_29%,#7651d1_58%,#fa2f8f_100%)] p-3 shadow-[0_12px_26px_rgba(44,96,166,0.28)] sm:size-28">
          <Image data-universe-logo src="/images/landing/logo-navbar.svg" alt="Creative Universe" width={112} height={112} className="size-[74%] object-contain" />
        </div>
      </div>

      {applications.length === 0 && <p className="absolute bottom-7 left-1/2 z-30 w-max max-w-[calc(100%-3rem)] -translate-x-1/2 text-center text-sm text-[#4b4646]">Belum ada sub-aplikasi aktif untuk akun ini.</p>}
    </section>
  );
}
