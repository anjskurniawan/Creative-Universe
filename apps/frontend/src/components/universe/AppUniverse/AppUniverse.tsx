"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import { APPLICATION_ICONS } from "@/core/applications";
import type { AccessibleApplication } from "@/core/applications";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { AppUniverseProps, PlanetConfig } from "./AppUniverse.types";

export type { AppUniverseProps, PlanetConfig } from "./AppUniverse.types";

// Tipe konfigurasi koordinat dan styling planet aplikasi pada orbit
// Konfigurasi posisi orbit dan styling gradien warna planet untuk setiap sub-aplikasi
// Menggunakan posisi pusat (center-based) agar planet berada pas di tengah garis orbit
const PLANET_CONFIG: Partial<Record<AccessibleApplication["key"], PlanetConfig>> = {
  odds: { orbit: "outer", position: "left-[96%] top-[50%] size-16 sm:size-[4.75rem]", color: "from-[#d9f3e4] to-[#9bdbbb] text-[#247052]" },
  "kv-retail": { orbit: "outer", position: "left-[4%] top-[50%] size-16 sm:size-[4.75rem]", color: "from-[#d9e8ff] to-[#93bbf5] text-[#1f579e]" },
  cai: { orbit: "outer", position: "left-[50%] top-[4%] size-16 sm:size-[4.75rem]", color: "from-[#d5f2f4] to-[#8ed3db] text-[#176b78]" },
  "creative-report": { orbit: "middle", position: "left-[24.6%] top-[32.2%] size-9 sm:size-11", color: "from-[#f9d9eb] to-[#eaa2c9] text-[#9d4f78]" },
  generator: { orbit: "middle", position: "left-[71.9%] top-[71.9%] size-9 sm:size-11", color: "from-[#ffebbd] to-[#efbd5d] text-[#9d6516]" },
  "design-assets": { orbit: "middle", position: "left-[27.8%] top-[71.6%] size-9 sm:size-11", color: "from-[#ebddff] to-[#c7a5ed] text-[#68418b]" },
};

/**
 * Komponen Visualisasi Orbit Planet/Sub-Aplikasi
 */
export function ApplicationUniverse({ applications, isReady, className = "", isExiting = false }: AppUniverseProps) {
  const universeRef = useRef<HTMLDivElement>(null);
  const orbitTweensRef = useRef<Record<PlanetConfig["orbit"], gsap.core.Tween[]>>({ outer: [], middle: [] });
  const animationKey = `${isReady}-${isExiting}`;

  // Fungsi untuk memberhentikan / melanjutkan rotasi orbit saat hover planet
  const setOrbitPaused = (orbit: PlanetConfig["orbit"], paused: boolean) => {
    orbitTweensRef.current[orbit].forEach((tween) => (paused ? tween.pause() : tween.resume()));
  };

  // Setup animasi interaktif orbit, logo, dan efek glow menggunakan GSAP
  useEffect(() => {
    if (!isReady || !universeRef.current) return;

    const context = gsap.context(() => {
      if (isExiting) {
        const coreElements = gsap.utils.toArray<HTMLElement>("[data-universe-core-glow], [data-universe-logo], [data-universe-core]");
        const orbitTracks = gsap.utils.toArray<HTMLElement>("[data-orbit-track]");
        const planets = gsap.utils.toArray<HTMLElement>("[data-planet]");

        gsap.timeline()
          .to(planets, { autoAlpha: 0, scale: 0.55, duration: 0.45, ease: "power2.in", stagger: 0.12 })
          .to(orbitTracks, { autoAlpha: 0, scale: 0.92, duration: 0.5, ease: "power2.in", stagger: 0.12 }, "-=0.1")
          .to(coreElements, { autoAlpha: 0, scale: 0.7, duration: 0.55, ease: "power2.in", stagger: 0.08 }, "-=0.1");
        return;
      }

      // Kemunculan bertahap: inti, lintasan dari dalam ke luar, lalu planet acak.
        const coreElements = gsap.utils.toArray<HTMLElement>("[data-universe-core-glow], [data-universe-logo], [data-universe-core]");
        const orbitTracks = gsap.utils.toArray<HTMLElement>("[data-orbit-track]").reverse();
        const planets = gsap.utils.toArray<HTMLElement>("[data-planet]");
        gsap.utils.shuffle(planets);

        gsap.set(universeRef.current, { autoAlpha: 1, scale: 1 });
        gsap.set(coreElements, { autoAlpha: 0, scale: 0.7 });
        gsap.set(orbitTracks, { autoAlpha: 0, scale: 0.92, transformOrigin: "center center" });
        gsap.set(planets, { autoAlpha: 0, scale: 0.55 });

        const appearanceTimeline = gsap.timeline();
        appearanceTimeline.to(coreElements, { autoAlpha: 1, scale: 1, duration: 0.55, ease: "back.out(1.7)", stagger: 0.08 });
        appearanceTimeline.to(orbitTracks, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power2.out", stagger: 0.2 }, "+=0.15");
        appearanceTimeline.to(planets, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.8)", stagger: 0.16 }, "+=0.15");

      // Fungsi pemicu rotasi melingkar berlawanan arah
      const animatePlanets = (orbit: PlanetConfig["orbit"], duration: number, direction: 1 | -1) => {
          const orbitTween = gsap.to(`[data-orbit="${orbit}"]`, {
            rotation: direction * 360,
            duration,
            delay: 0.45,
            ease: "none",
            repeat: -1,
            transformOrigin: "center center",
          });
          const planetTween = gsap.to(`[data-planet-orbit="${orbit}"]`, {
            rotation: direction * -360,
            duration,
            delay: 0,
            ease: "none",
            repeat: -1,
            transformOrigin: "center center",
          });
          orbitTweensRef.current[orbit] = [orbitTween, planetTween];
        };

      animatePlanets("outer", 180, 1);
      animatePlanets("middle", 130, -1);

        // Animasi perputaran titik pemanis lintasan orbit
        gsap.to('[data-orbit-spinner="outer"]', { rotation: 360, duration: 150, delay: 0.45, ease: "none", repeat: -1, transformOrigin: "center center" });
        gsap.to('[data-orbit-spinner="middle"]', { rotation: -360, duration: 115, delay: 0.45, ease: "none", repeat: -1, transformOrigin: "center center" });
        gsap.to('[data-orbit-spinner="inner"]', { rotation: 360, duration: 82, delay: 0.45, ease: "none", repeat: -1, transformOrigin: "center center" });

        // Animasi denyut opacity lintasan dan logo di tengah
        gsap.to("[data-orbit-track]", { opacity: 0.52, duration: 2.8, delay: 0.45, ease: "sine.inOut", repeat: -1, yoyo: true, stagger: 0.35 });
        gsap.to("[data-universe-core-glow]", {
          scale: 1.16,
          opacity: 0.68,
          duration: 3.6,
          delay: 0.45,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          transformOrigin: "center center",
        });
        gsap.to("[data-universe-logo]", {
          scale: 1.07,
          duration: 2.2,
          delay: 0.45,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          transformOrigin: "center center",
        });
    }, universeRef);

    return () => {
      orbitTweensRef.current = { outer: [], middle: [] };
      context.revert();
    };
  // animationKey intentionally groups both animation state flags into one stable dependency.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationKey]);

  return (
    <section aria-label="Aplikasi yang tersedia di Creative Universe" className={`relative isolate flex min-h-[28rem] items-center justify-center overflow-hidden px-6 py-8 lg:min-h-0 ${className}`}>
      {/* Container Utama Lintasan Orbit (Lebar Responsif Diperbesar untuk Layout 2 Kolom) */}
      <div ref={universeRef} className={`relative aspect-square w-[min(82vw,32rem)] lg:w-[min(44vw,38rem)] ${isReady ? "" : "opacity-0"}`}>
        {/* Lingkaran Lintasan Orbit */}
        <div data-orbit-track aria-hidden="true" className="absolute inset-[4%] rounded-full border border-[#bfcde0] shadow-[0_0_22px_rgba(128,160,207,0.16)]" />
        <div data-orbit-track aria-hidden="true" className="absolute inset-[19%] rounded-full border border-[#cad5e4] shadow-[0_0_16px_rgba(128,160,207,0.12)]" />
        <div data-orbit-track aria-hidden="true" className="absolute inset-[34%] rounded-full border border-[#d7e0eb] shadow-[0_0_12px_rgba(128,160,207,0.1)]" />

        {/* Titik Pemanis Lintasan Orbit */}
        <div data-orbit-spinner="outer" aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="absolute left-1/2 top-[3.5%] size-1.5 -translate-x-1/2 rounded-full bg-[#8ca9d4] shadow-[0_0_10px_3px_rgba(140,169,212,0.32)]" />
        </div>
        <div data-orbit-spinner="middle" aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="absolute left-1/2 top-[18.5%] size-1.5 -translate-x-1/2 rounded-full bg-[#a6bbdc] shadow-[0_0_8px_2px_rgba(166,187,220,0.28)]" />
        </div>
        <div data-orbit-spinner="inner" aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="absolute left-1/2 top-[33.5%] size-1 -translate-x-1/2 rounded-full bg-[#becce1] shadow-[0_0_7px_2px_rgba(190,204,225,0.3)]" />
        </div>

        {/* Rendering Planet / Link Sub-Aplikasi */}
        {applications.map((application) => {
          const config = PLANET_CONFIG[application.key];
          if (!config) return null;

          return (
            <div key={application.key} data-orbit={config.orbit} className="pointer-events-none absolute inset-0 will-change-transform">
              <div data-planet className={`absolute ${config.position} -translate-x-1/2 -translate-y-1/2`}>
                <Link
                  href={application.frontend_path!}
                  aria-label={`Buka ${application.display_name}`}
                  data-planet-orbit={config.orbit}
                  onPointerEnter={() => setOrbitPaused(config.orbit, true)}
                  onPointerLeave={() => setOrbitPaused(config.orbit, false)}
                  onFocus={() => setOrbitPaused(config.orbit, true)}
                  onBlur={() => setOrbitPaused(config.orbit, false)}
                  className={`pointer-events-auto group flex size-full items-center justify-center rounded-full border border-white/75 bg-gradient-to-br ${config.color} shadow-[inset_1px_1px_0_rgba(255,255,255,0.65),0_8px_18px_rgba(62,83,120,0.16)] transition duration-200 hover:scale-110 hover:shadow-[inset_1px_1px_0_rgba(255,255,255,0.7),0_12px_22px_rgba(62,83,120,0.22)] focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7895be]/30`}
                >
                  <MaterialIcon name={APPLICATION_ICONS[application.key] ?? "apps"} size="auto" className="text-[clamp(0.95rem,2.5vw,1.45rem)]" />
                  <span className="pointer-events-none absolute left-1/2 top-[calc(100%+0.65rem)] w-max max-w-[9rem] -translate-x-1/2 rounded-md bg-[#222]/90 px-2 py-1 text-center text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    {application.display_name}
                  </span>
                </Link>
              </div>
            </div>
          );
        })}

        {/* Inti Cahaya Glow & Logo Creative Universe di Tengah Orbit */}
        <div
          data-universe-core-glow
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(53,218,255,0.34)_0%,rgba(143,91,233,0.2)_43%,rgba(251,62,149,0.08)_62%,transparent_76%)] blur-xl sm:size-52"
        />
        <div data-universe-core className="absolute left-1/2 top-1/2 z-20 grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-[radial-gradient(circle_at_32%_27%,#98efff_0%,#11b8e9_29%,#7651d1_58%,#fa2f8f_100%)] p-3 shadow-[0_12px_26px_rgba(44,96,166,0.28)] sm:size-28">
          <Image data-universe-logo src="/images/landing/logo-navbar.svg" alt="Creative Universe" width={112} height={112} className="size-[74%] object-contain" />
        </div>
      </div>

    </section>
  );
}
