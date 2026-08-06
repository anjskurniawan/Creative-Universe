"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Komponen Latar Belakang Parallax Zoom (Background)
 * Menampilkan gambar latar belakang dengan efek parallax zoom lembut menggunakan GSAP.
 */
export function Background() {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!backgroundRef.current) return;

    gsap.set(backgroundRef.current, { transformOrigin: "center center", scale: 1, opacity: 0 });
    gsap.to(backgroundRef.current, { opacity: 1, duration: 0.72, ease: "power2.out" });
    gsap.to(backgroundRef.current, { scale: 1.16, duration: 5.5, delay: 0.72, ease: "sine.inOut", repeat: -1, yoyo: true });
  }, []);

  return (
    <div
      ref={backgroundRef}
      aria-hidden="true"
      style={{
        backgroundImage: "url('/images/landing/creative-universe-background.jpg')",
        opacity: 0,
      }}
      className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
    />
  );
}
