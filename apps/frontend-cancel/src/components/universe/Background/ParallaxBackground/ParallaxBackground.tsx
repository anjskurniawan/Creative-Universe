"use client";

import { DEFAULT_PARALLAX_BACKGROUND_CONFIG } from "./ParallaxBackground.config";
import { useParallaxBackground } from "./ParallaxBackground.logic";
import type { ParallaxBackgroundProps } from "./ParallaxBackground.types";

export type { ParallaxBackgroundProps } from "./ParallaxBackground.types";

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
      style={{ backgroundImage: `url('${imageUrl}')`, opacity: 0 }}
      className={`cu-style pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat ${className}`.trim()}
    />
  );
}

export const Background = ParallaxBackground;
export default ParallaxBackground;
