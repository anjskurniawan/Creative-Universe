"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export type CreativeAiHeroAuroraProps = {
  isFocused: boolean;
  hasMessages: boolean;
  colorEnd?: string;
  className?: string;
};

export function CreativeAiHeroAurora({
  isFocused,
  hasMessages,
  colorEnd = "#000000",
  className = "",
}: CreativeAiHeroAuroraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    let width = 0;
    let height = 0;

    const hexToRgba = (hex: string, alpha: number) => {
      const cleanHex = hex.replace("#", "");
      let r = 0;
      let g = 0;
      let b = 0;
      if (cleanHex.length === 3) {
        r = Number.parseInt(cleanHex[0] + cleanHex[0], 16);
        g = Number.parseInt(cleanHex[1] + cleanHex[1], 16);
        b = Number.parseInt(cleanHex[2] + cleanHex[2], 16);
      } else if (cleanHex.length === 6) {
        r = Number.parseInt(cleanHex.substring(0, 2), 16);
        g = Number.parseInt(cleanHex.substring(2, 4), 16);
        b = Number.parseInt(cleanHex.substring(4, 6), 16);
      }
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const blobs = [
      { x: 0.15, y: 0.25, radius: 0.45, colorStart: "rgba(109, 70, 235, 0.45)", colorEnd: hexToRgba(colorEnd, 0) },
      { x: 0.85, y: 0.75, radius: 0.5, colorStart: "rgba(0, 164, 255, 0.4)", colorEnd: hexToRgba(colorEnd, 0) },
      { x: 0.5, y: 0.5, radius: 0.35, colorStart: "rgba(186, 13, 203, 0.35)", colorEnd: hexToRgba(colorEnd, 0) },
    ];

    const pointerBlob = { x: 0.5, y: 0.5, radius: 0.35, active: 0, colorStart: "rgba(109, 70, 235, 0.4)", colorEnd: hexToRgba(colorEnd, 0) };

    const tweens = new Set<gsap.core.Tween>();

    const updateSize = () => {
      const parent = canvas.parentElement || document.body;
      const bounds = parent.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width || window.innerWidth));
      height = Math.max(1, Math.round(bounds.height || window.innerHeight));
      canvas.width = width * Math.min(window.devicePixelRatio, 2);
      canvas.height = height * Math.min(window.devicePixelRatio, 2);
      ctx2d.resetTransform();
      ctx2d.scale(Math.min(window.devicePixelRatio, 2), Math.min(window.devicePixelRatio, 2));
    };

    updateSize();

    blobs.forEach((blob, idx) => {
      const tx = gsap.to(blob, {
        x: idx % 2 === 0 ? 0.85 : 0.15,
        duration: 15 + idx * 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      tweens.add(tx);

      const ty = gsap.to(blob, {
        y: idx % 2 === 0 ? 0.15 : 0.85,
        duration: 18 + idx * 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      tweens.add(ty);
    });

    const renderAurora = () => {
      ctx2d.clearRect(0, 0, width, height);
      ctx2d.globalCompositeOperation = "screen";

      blobs.forEach((b) => {
        const px = b.x * width;
        const py = b.y * height;
        const pr = b.radius * Math.max(width, height);
        if (pr <= 0) return;

        const grad = ctx2d.createRadialGradient(px, py, 0, px, py, pr);
        grad.addColorStop(0, b.colorStart);
        grad.addColorStop(1, b.colorEnd);
        ctx2d.fillStyle = grad;
        ctx2d.fillRect(0, 0, width, height);
      });
    };

    gsap.ticker.add(renderAurora);
    window.addEventListener("resize", updateSize, { passive: true });

    return () => {
      tweens.forEach((t) => t.kill());
      gsap.ticker.remove(renderAurora);
      window.removeEventListener("resize", updateSize);
    };
  }, [colorEnd]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-0 size-full ${className}`}
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-1000 ease-in-out" 
        style={{ 
          opacity: isFocused || hasMessages ? 1 : 0,
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.9) 100%)"
        }}
      />
    </>
  );
}
