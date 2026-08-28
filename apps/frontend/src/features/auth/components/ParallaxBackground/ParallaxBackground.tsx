"use client";

import React from "react";
import { DEFAULT_PARALLAX_BACKGROUND_CONFIG } from "./ParallaxBackground.config";
import { useParallaxBackground } from "./ParallaxBackground.logic";
import type { ParallaxBackgroundProps } from "./ParallaxBackground.types";

export type { ParallaxBackgroundProps } from "./ParallaxBackground.types";

/**
 * Komponen Latar Belakang Parallax Zoom (ParallaxBackground)
 * Menampilkan gambar latar belakang dengan efek parallax zoom lembut menggunakan GSAP.
 */
export function ParallaxBackground({
  imageUrl = DEFAULT_PARALLAX_BACKGROUND_CONFIG.imageUrl,
  className = "",
  duration,
  scale,
}: ParallaxBackgroundProps) {
  const { backgroundRef } = useParallaxBackground({ duration, scale });

  return (
    <div
      ref={backgroundRef}
      aria-hidden="true"
      style={{
        backgroundImage: `url('${imageUrl}')`,
        opacity: 0,
      }}
      className={`cu-style pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat ${className}`.trim()}
    />
  );
}

// Backward-compatible alias
export const Background = ParallaxBackground;

export default ParallaxBackground;
