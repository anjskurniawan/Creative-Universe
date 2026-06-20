"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import * as THREE from "three";
import { gsap } from "gsap";
import { MaterialIcon } from "@/components/material-icon";

const CAMERA_Z = 8;
const PARTICLE_OPACITY = 0.78;

export default function AIAgentPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textTargetRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const typewriterText = "AI Agent akan segera hadir";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const hero = canvas.closest("[data-interactive-hero]") as HTMLElement;
    if (!hero) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      canvas.style.display = "none";
      if (textTargetRef.current) {
        textTargetRef.current.textContent = typewriterText;
      }
      return;
    }

    const textTarget = textTargetRef.current;
    const cursor = cursorRef.current;
    const actions = actionsRef.current;

    const tweens = new Set<gsap.core.Tween | gsap.core.Timeline>();

    if (textTarget && cursor) {
      const splitCharacters = (text: string) => {
        if ("Segmenter" in Intl) {
          const segmenter = new Intl.Segmenter("id", { granularity: "grapheme" });
          return Array.from(segmenter.segment(text), ({ segment }) => segment);
        }
        return Array.from(text);
      };

      const characters = splitCharacters(typewriterText);
      const progress = { count: 0 };

      textTarget.textContent = "";
      gsap.set(cursor, { opacity: 1 });

      if (actions) {
        gsap.set(actions, {
          opacity: 0,
          filter: "blur(8px)",
          y: 14,
        });
      }

      const blink = gsap.to(cursor, {
        opacity: 0.2,
        duration: 0.55,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
      tweens.add(blink);

      const typewriterTween = gsap.to(progress, {
        count: characters.length,
        duration: Math.max(2.0, characters.length * 0.08),
        ease: "none",
        onUpdate: () => {
          textTarget.textContent = characters.slice(0, Math.round(progress.count)).join("");
        },
        onComplete: () => {
          textTarget.textContent = typewriterText;

          if (actions) {
            const actionsFade = gsap.to(actions, {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              duration: 1.2,
              ease: "power2.out",
            });
            tweens.add(actionsFade);
          }

          const cursorFadeDelay = gsap.delayedCall(1.5, () => {
            blink.kill();
            gsap.to(cursor, {
              opacity: 0,
              duration: 0.25,
              ease: "power1.out",
            });
          });
          tweens.add(cursorFadeDelay);
        },
      });
      tweens.add(typewriterTween);
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const particleCount = isMobile ? 120 : 300;

    const createParticlePosition = () => {
      const zone = Math.random();
      let normalizedX;
      let normalizedY;

      if (zone < 0.48) {
        normalizedX = 0.01 + Math.random() * 0.34;
        normalizedY = 0.02 + Math.pow(Math.random(), 1.45) * 0.93;
      } else if (zone < 0.76) {
        normalizedX = 0.08 + Math.random() * 0.84;
        normalizedY = 0.01 + Math.pow(Math.random(), 1.8) * 0.29;
      } else {
        normalizedX = 0.68 + Math.random() * 0.31;
        normalizedY = 0.04 + Math.pow(Math.random(), 1.25) * 0.91;
      }

      const isInsideReadingArea =
        Math.abs(normalizedX - 0.5) < 0.27 && Math.abs(normalizedY - 0.49) < 0.24;

      if (isInsideReadingArea) {
        normalizedX = normalizedX < 0.5 ? 0.08 + Math.random() * 0.2 : 0.72 + Math.random() * 0.2;
      }

      return { normalizedX, normalizedY };
    };

    const particleData = Array.from({ length: particleCount }, () => {
      const position = createParticlePosition();
      return {
        ...position,
        depth: -2.4 + Math.random() * 3.8,
        phase: Math.random() * Math.PI * 2,
        speed: 0.16 + Math.random() * 0.24,
        amplitudeX: 0.025 + Math.random() * 0.055,
        amplitudeY: 0.018 + Math.random() * 0.045,
        spin: (Math.random() - 0.5) * 0.9,
        scale: 0.62 + Math.random() * 1.15,
        driftX: (Math.random() - 0.5) * 0.09,
        driftY: (Math.random() - 0.5) * 0.07,
      };
    });

    const geometry = new THREE.PlaneGeometry(0.085, 0.019);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    const rendererOptions = {
      canvas,
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      powerPreference: "high-performance" as WebGLPowerPreference,
    };

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer(rendererOptions);
    } catch (e) {
      console.warn("WebGL not supported:", e);
      geometry.dispose();
      material.dispose();
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.position.set(0, 0, CAMERA_Z + 0.55);
    const particles = new THREE.InstancedMesh(geometry, material, particleCount);
    particles.frustumCulled = false;
    scene.add(particles);

    const getCssColor = (prop: string, fallback: string) => {
      if (typeof window === "undefined") return fallback;
      return getComputedStyle(document.documentElement).getPropertyValue(prop).trim() || fallback;
    };

    const palette = [
      getCssColor("--color-cu-info", "#2563eb"),
      getCssColor("--color-cu-gradient-middle", "#3b82f6"),
      getCssColor("--color-cu-gradient-start", "#d946ef"),
      getCssColor("--color-cu-danger", "#dc2626"),
      getCssColor("--color-cu-warning", "#d97706"),
      getCssColor("--color-cu-success", "#16a34a"),
      getCssColor("--color-cu-gradient-end", "#22d3ee"),
    ];

    particleData.forEach((_, index) => {
      const colorIndex =
        Math.random() < 0.68
          ? Math.floor(Math.random() * 3)
          : Math.floor(Math.random() * palette.length);
      particles.setColorAt(index, new THREE.Color(palette[colorIndex]));
    });
    if (particles.instanceColor) {
      particles.instanceColor.needsUpdate = true;
    }

    const viewport = { width: 1, height: 1, aspect: 1 };
    const pointer = { x: 0, y: 0, active: 0 };
    const reveal = { value: 0 };
    const dummy = new THREE.Object3D();
    const fieldOfView = THREE.MathUtils.degToRad(camera.fov);

    const updateSize = () => {
      const bounds = hero.getBoundingClientRect();
      viewport.width = Math.max(1, Math.round(bounds.width || window.innerWidth));
      viewport.height = Math.max(1, Math.round(bounds.height || window.innerHeight));
      viewport.aspect = viewport.width / viewport.height;

      camera.aspect = viewport.aspect;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(viewport.width, viewport.height, false);
    };

    const pointerX = gsap.quickTo(pointer, "x", { duration: 0.75, ease: "power3.out" });
    const pointerY = gsap.quickTo(pointer, "y", { duration: 0.75, ease: "power3.out" });
    const pointerActive = gsap.quickTo(pointer, "active", { duration: 0.9, ease: "power2.out" });

    const handlePointerMove = (event: PointerEvent) => {
      if (!hasFinePointer) return;
      pointerX((event.clientX / window.innerWidth) * 2 - 1);
      pointerY((event.clientY / window.innerHeight) * 2 - 1);
      pointerActive(1);
    };

    const handlePointerLeave = () => {
      pointerX(0);
      pointerY(0);
      pointerActive(0);
    };

    const renderParticles = (time: number) => {
      const pointerNormalizedX = (pointer.x + 1) * 0.5;
      const pointerNormalizedY = (pointer.y + 1) * 0.5;

      camera.position.x = pointer.x * pointer.active * 0.12;
      camera.position.y = -pointer.y * pointer.active * 0.08;

      particleData.forEach((particle, index) => {
        const distanceFromCamera = CAMERA_Z - particle.depth;
        const visibleHeight = 2 * Math.tan(fieldOfView * 0.5) * distanceFromCamera;
        const visibleWidth = visibleHeight * viewport.aspect;
        const elapsed = time * particle.speed + particle.phase;
        let x = (particle.normalizedX - 0.5) * visibleWidth;
        let y = (0.5 - particle.normalizedY) * visibleHeight;

        x += Math.sin(elapsed * 0.9) * particle.amplitudeX + Math.sin(elapsed * 0.31) * particle.driftX;
        y += Math.cos(elapsed * 0.72) * particle.amplitudeY + Math.cos(elapsed * 0.27) * particle.driftY;

        if (pointer.active > 0.001) {
          const deltaX = particle.normalizedX - pointerNormalizedX;
          const deltaY = particle.normalizedY - pointerNormalizedY;
          const distance = Math.hypot(deltaX, deltaY);
          const influenceRadius = 0.18;

          if (distance > 0.001 && distance < influenceRadius) {
            const force = Math.pow(1 - distance / influenceRadius, 2) * pointer.active;
            x += (deltaX / distance) * force * visibleWidth * 0.035;
            y -= (deltaY / distance) * force * visibleHeight * 0.035;
          }
        }

        const depthScale = THREE.MathUtils.mapLinear(particle.depth, -2.4, 1.4, 0.72, 1.2);
        const scale = particle.scale * depthScale * reveal.value;

        dummy.position.set(x, y, particle.depth);
        dummy.rotation.set(
          Math.sin(elapsed * 0.48) * 0.22,
          Math.cos(elapsed * 0.43) * 0.28,
          particle.phase + time * particle.spin
        );
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        particles.setMatrixAt(index, dummy.matrix);
      });

      particles.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    };

    updateSize();
    window.addEventListener("resize", updateSize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    window.addEventListener("blur", handlePointerLeave);
    gsap.ticker.add(renderParticles);

    const opTween = gsap.to(material, {
      opacity: PARTICLE_OPACITY,
      duration: 1.8,
      ease: "power2.out",
    });
    tweens.add(opTween);

    const revealTween = gsap.to(reveal, {
      value: 1,
      duration: 2.2,
      ease: "power3.out",
    });
    tweens.add(revealTween);

    const camTween = gsap.to(camera.position, {
      z: CAMERA_Z,
      duration: 2.4,
      ease: "power2.out",
    });
    tweens.add(camTween);

    return () => {
      tweens.forEach((t) => t.kill());
      gsap.ticker.remove(renderParticles);
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
      scene.remove(particles);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  const baseBtnClass =
    "inline-flex h-11 items-center justify-center rounded-full px-5 text-base font-medium leading-none transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cu-focus disabled:cursor-not-allowed disabled:opacity-60 sm:h-14 sm:px-7 sm:text-lg";

  const btnBlackClass = `${baseBtnClass} border border-cu-ink bg-cu-ink text-cu-surface hover:border-cu-ink-hover hover:bg-cu-ink-hover`;

  return (
    <div
      data-interactive-hero
      className="relative isolate flex flex-1 flex-col overflow-hidden w-full h-full min-h-[70vh]"
    >
      <canvas
        ref={canvasRef}
        data-particle-canvas
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 size-full"
      />

      <div aria-hidden="true" className="cu-landing-readability pointer-events-none absolute inset-0 z-10" />
      <div aria-hidden="true" className="cu-landing-fade pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40" />

      <main className="relative z-20 flex flex-1 items-center justify-center px-10 py-10">
        <section
          aria-labelledby="subapp-title"
          className="mx-auto w-full max-w-6xl text-center lg:-translate-y-3"
        >
          <h1
            ref={titleRef}
            id="subapp-title"
            aria-label={typewriterText}
            data-typewriter={typewriterText}
            className="text-center text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[6.5rem] font-medium leading-none tracking-tight w-full max-w-full block break-words text-cu-ink"
          >
            <span ref={textTargetRef} data-typewriter-text>
              {typewriterText}
            </span>
            <span
              ref={cursorRef}
              aria-hidden="true"
              data-typewriter-cursor
              className="ml-2 inline-block h-12 w-1 bg-gradient-to-b from-cu-gradient-start via-cu-gradient-middle to-cu-gradient-end align-middle opacity-0 md:h-24 lg:h-28"
            />
            <noscript>{typewriterText}</noscript>
          </h1>

          <div
            ref={actionsRef}
            data-typewriter-actions
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:mt-12 sm:flex-row"
          >
            <Link href="/dashboard" className={btnBlackClass}>
              <span className="flex h-full items-center justify-center gap-2">
                <MaterialIcon name="dashboard" size="auto" />
                <span className="flex h-full items-center justify-center whitespace-nowrap leading-none">
                  Kembali ke Dashboard
                </span>
              </span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
