"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { DEFAULT_PARALLAX_BACKGROUND_CONFIG } from "./ParallaxBackground.config";
import type { ParallaxBackgroundProps } from "./ParallaxBackground.types";

export function useParallaxBackground(options?: {
  duration?: number;
  scale?: number;
}) {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!backgroundRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(backgroundRef.current, {
        transformOrigin: "center center",
        scale: 1,
        opacity: 0,
      });

      gsap.to(backgroundRef.current, {
        opacity: 1,
        duration: DEFAULT_PARALLAX_BACKGROUND_CONFIG.fadeInDuration,
        ease: "power2.out",
      });

      gsap.to(backgroundRef.current, {
        scale: options?.scale ?? DEFAULT_PARALLAX_BACKGROUND_CONFIG.zoomScale,
        duration: options?.duration ?? DEFAULT_PARALLAX_BACKGROUND_CONFIG.zoomDuration,
        delay: DEFAULT_PARALLAX_BACKGROUND_CONFIG.fadeInDuration,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, backgroundRef);

    return () => ctx.revert();
  }, [options?.duration, options?.scale]);

  return { backgroundRef };
}
