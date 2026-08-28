"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { DEFAULT_PARALLAX_BACKGROUND_CONFIG } from "./ParallaxBackground.config";

export function useParallaxBackground(options?: { duration?: number; scale?: number }) {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = backgroundRef.current;
    if (!element) return;

    const context = gsap.context(() => {
      gsap.set(element, { transformOrigin: "center center", scale: 1, opacity: 0 });
      gsap.to(element, {
        opacity: 1,
        duration: DEFAULT_PARALLAX_BACKGROUND_CONFIG.fadeInDuration,
        ease: "power2.out",
      });
      gsap.to(element, {
        scale: options?.scale ?? DEFAULT_PARALLAX_BACKGROUND_CONFIG.zoomScale,
        duration: options?.duration ?? DEFAULT_PARALLAX_BACKGROUND_CONFIG.zoomDuration,
        delay: DEFAULT_PARALLAX_BACKGROUND_CONFIG.fadeInDuration,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, element);

    return () => context.revert();
  }, [options?.duration, options?.scale]);

  return { backgroundRef };
}
