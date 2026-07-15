"use client";

import React, { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { gsap } from "gsap";
import { useAuth } from "@/providers/auth-provider";
import { SpinningWheel } from "@/components/spinning-wheel";
import { Navbar } from "@/components/navbar";
import { MaterialIcon } from "@/components/material-icon";
import { GuestMobileOrbitMotion } from "@/components/guest-mobile-orbit-motion";

const CAMERA_Z = 8;
const PARTICLE_OPACITY = 0.78;
const MOTIVATIONAL_QUOTES = [
  'Steve Jobs: "Waktumu terbatas, jadi jangan sia-siakan dengan menjalani hidup orang lain."',
  'Winston Churchill: "Keberhasilan adalah kemampuan untuk melewati dan mengatasi dari satu kegagalan ke kegagalan berikutnya tanpa kehilangan semangat."',
  'Andrew Carnegie: "Bila Anda ingin bahagia, buatlah tujuan yang bisa mengendalikan pikiran, melepaskan tenaga, serta mengilhami harapan Anda."',
  'Harrison Ford: "Bekerja keras dan mencari tahu bagaimana menjadi berguna dan jangan mencoba meniru kesuksesan orang lain."',
  'Martha Stewart: "Sukses tidak datang begitu saja, ia datang ketika Anda memiliki keberanian untuk tetap bekerja keras di saat-saat sulit."',
] as const;

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textTargetRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const transitionFnRef = useRef<(() => void) | null>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const transitionOverlayRef = useRef<HTMLDivElement>(null);

  const pushLoginAfterWhiteTransition = useCallback(() => {
    const overlay = transitionOverlayRef.current;

    if (!overlay) {
      router.push("/login");
      return;
    }

    gsap.killTweensOf(overlay);
    overlay.style.display = "block";
    gsap.set(overlay, { opacity: 0 });
    gsap.to(overlay, {
      opacity: 1,
      duration: 0.55,
      ease: "power2.inOut",
      onComplete: () => {
        router.push("/login");
      },
    });
  }, [router]);

  // Typewriter Text
  const typewriterText = "This is Where Creative Begins";

  const handleSpin = useCallback(() => {
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    const textTarget = textTargetRef.current;
    const cursor = cursorRef.current;
    const title = titleRef.current;
    if (!textTarget || !cursor || !title) return;

    if (isAuthenticated) {
      title.className = "w-full max-w-3xl text-3xl md:text-4xl lg:text-5xl font-medium tracking-normal text-cu-ink z-10 relative text-left whitespace-normal break-words";
    }

    const splitCharacters = (t: string) => {
      if ("Segmenter" in Intl) {
        const segmenter = new Intl.Segmenter("id", { granularity: "grapheme" });
        return Array.from(segmenter.segment(t), ({ segment }) => segment);
      }
      return Array.from(t);
    };

    const characters = splitCharacters(randomQuote);
    const progress = { count: 0 };

    gsap.killTweensOf(progress);
    gsap.killTweensOf(cursor);

    textTarget.textContent = "";
    gsap.set(cursor, { opacity: 1 });

    const blink = gsap.to(cursor, {
      opacity: 0.2,
      duration: 0.55,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    gsap.to(progress, {
      count: characters.length,
      duration: Math.max(1.5, characters.length * 0.03),
      ease: "none",
      onUpdate: () => {
        textTarget.textContent = characters.slice(0, Math.round(progress.count)).join("");
      },
      onComplete: () => {
        textTarget.textContent = randomQuote;
        gsap.delayedCall(2, () => {
          blink.kill();
          gsap.to(cursor, { opacity: 0, duration: 0.25, ease: "power1.out" });
        });
      },
    });
  }, [isAuthenticated]);

  useEffect(() => {
    // Prevent animation running during authentication loading
    if (isLoading) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const hero = canvas.closest("[data-interactive-hero]") as HTMLElement;
    if (!hero) return;

    const tweens = new Set<gsap.core.Tween | gsap.core.Timeline>();
    const cleanupTweens = () => {
      transitionFnRef.current = null;
      tweens.forEach((t) => t.kill());
    };

    // Fade out white transition overlay
    if (transitionOverlayRef.current) {
      const overlayFade = gsap.to(transitionOverlayRef.current, {
        opacity: 0,
        duration: 1.0,
        ease: "power2.inOut",
        onComplete: () => {
          if (transitionOverlayRef.current) {
            transitionOverlayRef.current.style.display = "none";
          }
        },
      });
      tweens.add(overlayFade);
    }

    // Prefers Reduced Motion Check
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      canvas.style.display = "none";
      if (textTargetRef.current) {
        textTargetRef.current.textContent = typewriterText;
      }
      return cleanupTweens;
    }

    // 2. THREE.JS RAINBOW DOT PARTICLES BACKGROUND
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();

    // Arrays for position, velocity, and color (HSL)
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const hues = new Float32Array(particleCount);

    // Initial positions, velocities, and rainbow colors
    for (let i = 0; i < particleCount; i++) {
      // Scatter particles randomly in a box
      positions[i * 3] = (Math.random() - 0.5) * 20; // X: -10 to 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // Y: -10 to 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 8; // Z: -16 to 0

      // Random velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.02; // vx
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02; // vy
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02; // vz

      // Rainbow color hues distributed evenly
      hues[i] = i / particleCount;
      const color = new THREE.Color();
      color.setHSL(hues[i], 0.9, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Create programmatically circular dot texture
    const createCircleTexture = () => {
      const c = document.createElement("canvas");
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.4, "rgba(255, 255, 255, 0.8)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(32, 32, 32, 0, Math.PI * 2);
        ctx.fill();
      }
      const texture = new THREE.CanvasTexture(c);
      texture.needsUpdate = true;
      return texture;
    };

    const material = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      map: createCircleTexture(),
      transparent: true,
      opacity: 0, // Starts at 0, animated via GSAP
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
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
      return cleanupTweens;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.position.set(0, 0, 24); // Start far away, zoomed out

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const viewport = { width: 1, height: 1, aspect: 1 };

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

    const renderParticles = (time: number) => {
      const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
      const colorAttr = geometry.getAttribute("color") as THREE.BufferAttribute;
      const colorTemp = new THREE.Color();

      for (let i = 0; i < particleCount; i++) {
        let x = posAttr.getX(i);
        let y = posAttr.getY(i);
        let z = posAttr.getZ(i);

        // Random movement updates
        x += velocities[i * 3];
        y += velocities[i * 3 + 1];
        z += velocities[i * 3 + 2];

        // Boundary wrapping
        if (x < -12) x = 12;
        if (x > 12) x = -12;
        if (y < -12) y = 12;
        if (y > 12) y = -12;
        if (z < -16) z = 0;
        if (z > 0) z = -16;

        posAttr.setXYZ(i, x, y, z);

        // Slowly shift colors along HSL rainbow spectrum
        hues[i] = (hues[i] + 0.0006) % 1.0;
        colorTemp.setHSL(hues[i], 0.9, 0.6);
        colorAttr.setXYZ(i, colorTemp.r, colorTemp.g, colorTemp.b);
      }

      posAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;

      // Rotate the entire particle system slowly
      points.rotation.y = time * 0.02;
      points.rotation.x = time * 0.01;

      renderer.render(scene, camera);
    };

    updateSize();
    window.addEventListener("resize", updateSize, { passive: true });
    gsap.ticker.add(renderParticles);

    // Set initial hidden states for navbar and actions
    if (navbarRef.current) {
      gsap.set(navbarRef.current, { opacity: 0, y: -16 });
    }
    const textTarget = textTargetRef.current;
    const cursor = cursorRef.current;
    const actions = actionsRef.current;
    if (actions) {
      gsap.set(actions, { opacity: 0, filter: "blur(8px)", y: 14 });
    }

    const mainTimeline = gsap.timeline();
    tweens.add(mainTimeline);

    // 1. Zoom in & fade in the background first
    mainTimeline.to(camera.position, {
      z: CAMERA_Z,
      duration: 1.8,
      ease: "power2.out",
    });

    mainTimeline.to(material, {
      opacity: PARTICLE_OPACITY,
      duration: 1.5,
      ease: "power2.out",
    }, 0);

    // 2. Once background zoom is complete, trigger typewriter animation
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

      const blink = gsap.to(cursor, {
        opacity: 0.2,
        duration: 0.55,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
      tweens.add(blink);

      mainTimeline.to(progress, {
        count: characters.length,
        duration: Math.max(2.4, characters.length * 0.06),
        ease: "none",
        onUpdate: () => {
          textTarget.textContent = characters.slice(0, Math.round(progress.count)).join("");
        },
        onComplete: () => {
          textTarget.textContent = typewriterText;

          // 3. Fade in actions and navbar
          if (actions) {
            gsap.to(actions, {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              duration: 1.2,
              ease: "power2.out",
            });
          }

          if (navbarRef.current) {
            gsap.to(navbarRef.current, {
              opacity: 1,
              y: 0,
              duration: 1.0,
              ease: "power2.out",
            });
          }

          const cursorFadeDelay = gsap.delayedCall(2, () => {
            blink.kill();
            gsap.to(cursor, {
              opacity: 0,
              duration: 0.25,
              ease: "power1.out",
            });
          });
          tweens.add(cursorFadeDelay);
        }
      });
    }

    transitionFnRef.current = () => {
      // Zoom out UI (scale down and blur)
      gsap.to([titleRef.current, actionsRef.current], {
        scale: 0.3,
        opacity: 0,
        filter: "blur(16px)",
        duration: 1.2,
        ease: "power2.inOut",
      });

      // Fade out Navbar smoothly and slide up slightly
      if (navbarRef.current) {
        gsap.to(navbarRef.current, {
          opacity: 0,
          y: -16,
          duration: 1.0,
          ease: "power2.inOut",
        });
      }

      // Zoom in/through the particles (moving camera Z forward)
      gsap.to(camera.position, {
        z: 1.2,
        duration: 1.5,
        ease: "power3.inOut",
        onComplete: () => {
          pushLoginAfterWhiteTransition();
        },
      });
    };

    // CLEANUP ACTIONS
    return () => {
      cleanupTweens();
      gsap.ticker.remove(renderParticles);
      window.removeEventListener("resize", updateSize);
      scene.remove(points);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [typewriterText, isLoading, router, pushLoginAfterWhiteTransition]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cu-surface flex flex-col items-center justify-center font-sans text-cu-ink antialiased">
        <div className="w-8 h-8 border-2 border-cu-ink/30 border-t-cu-ink rounded-full animate-spin"></div>
        <p className="mt-3 text-sm text-cu-muted">Memuat sesi...</p>
      </div>
    );
  }

  const guestDesktopBtnClass =
    "inline-flex h-12 w-auto items-center justify-center gap-2 rounded-[20px] border border-transparent bg-[#286bff] px-5 text-base font-medium leading-6 text-white transition duration-200 hover:bg-[#1f5cf0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cu-focus disabled:cursor-not-allowed disabled:opacity-60 md:h-14 md:rounded-full md:border-cu-ink md:bg-cu-ink md:px-7 md:text-lg md:text-cu-surface md:hover:border-cu-ink-hover md:hover:bg-cu-ink-hover";
  const titleClass = isAuthenticated
    ? "text-5xl md:text-6xl lg:text-8xl font-medium tracking-normal text-cu-ink z-10 relative text-left whitespace-nowrap"
    : "mx-auto block w-full max-w-[370px] break-words text-center text-[48px] font-medium leading-[44px] tracking-normal md:max-w-full md:text-7xl md:leading-none lg:text-8xl xl:text-[7.5rem]";

  return (
    <>
      <div
        data-interactive-hero
        className="relative isolate flex min-h-screen flex-col overflow-hidden bg-cu-surface font-sans text-cu-ink antialiased"
      >
        {/* Particle Canvas */}
        <canvas
          ref={canvasRef}
          data-particle-canvas
          aria-hidden="true"
          className="hidden"
        />

        {/* Top Navbar */}
        <div ref={navbarRef} className="relative z-30">
          <Navbar variant="light" />
        </div>

        {/* Main Content Area */}
        <main className="relative z-20 flex flex-1 items-center justify-center px-10 py-10 sm:px-10 lg:px-16">
          <section
            aria-labelledby="landing-title"
            className={
              isAuthenticated
                ? "w-full h-full flex flex-col justify-center"
                : "mx-auto w-full max-w-6xl text-center lg:-translate-y-3"
            }
          >
            <div className={isAuthenticated ? "w-full flex flex-col justify-center text-left" : ""}>
              <h1
                ref={titleRef}
                id="landing-title"
                aria-label={typewriterText}
                data-typewriter={typewriterText}
                className={titleClass}
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
            </div>

            {isAuthenticated ? (
              <div className="absolute top-1/2 right-0 translate-x-[45%] -translate-y-1/2 size-[600px] md:size-[800px] lg:size-[1000px] pointer-events-auto z-10">
                <SpinningWheel onSpin={handleSpin} />
              </div>
            ) : (
              <div
                ref={actionsRef}
                data-typewriter-actions
                className="mt-10 flex flex-col items-center justify-center gap-3 sm:mt-12 sm:flex-row"
              >
                <Link
                  href="/login"
                  className={guestDesktopBtnClass}
                  onClick={(e) => {
                    e.preventDefault();
                    if (transitionFnRef.current) {
                      transitionFnRef.current();
                    } else {
                      pushLoginAfterWhiteTransition();
                    }
                  }}
                >
                  <span className="flex h-full items-center justify-center gap-2">
                    <span className="flex h-full items-center justify-center whitespace-nowrap leading-none">
                      Masuk ke Universe
                    </span>
                    <MaterialIcon name="arrow_right_alt" size="md" />
                  </span>
                </Link>
              </div>
            )}
          </section>
        </main>

        {/* White transition overlay */}
        <div
          ref={transitionOverlayRef}
          className="fixed inset-0 bg-white z-[9999] pointer-events-none"
        />
      </div>
    </>
  );
}

const LANDING_ASSET_PATH = "/images/landing";

function GuestMobileLandingPage() {
  const router = useRouter();
  const mobileTransitionOverlayRef = useRef<HTMLDivElement>(null);

  const pushMobileLoginAfterWhiteTransition = useCallback(() => {
    const overlay = mobileTransitionOverlayRef.current;

    if (!overlay) {
      router.push("/login");
      return;
    }

    gsap.killTweensOf(overlay);
    overlay.style.display = "block";
    gsap.set(overlay, { opacity: 0 });
    gsap.to(overlay, {
      opacity: 1,
      duration: 0.55,
      ease: "power2.inOut",
      onComplete: () => {
        router.push("/login");
      },
    });
  }, [router]);

  return (
    <div className="relative isolate min-h-[100dvh] overflow-hidden bg-black font-sans text-white antialiased">
      <Image
        src={`${LANDING_ASSET_PATH}/mobile-guest.png`}
        alt=""
        width={396}
        height={874}
        priority
        aria-hidden="true"
        className="absolute inset-0 z-0 size-full select-none object-cover"
      />

      <div className="relative z-30">
        <Navbar variant="transparent-dark" session="guest" />
      </div>

      <main className="absolute inset-0 z-10 w-full">
        <section aria-labelledby="guest-landing-title" className="relative h-full w-full">
          <div
            data-guest-landing-copy
            className="absolute inset-x-0 top-[clamp(112px,16dvh,150px)] flex w-full flex-col items-center gap-1 px-4 text-center text-white"
          >
            <h1
              id="guest-landing-title"
              data-guest-landing-title
              className="m-0 w-full text-[clamp(36px,11.36vw,45px)] font-semibold leading-[1] tracking-[-2px] text-white"
            >
              This is Where Creative Begins
            </h1>
            <p className="m-0 w-full whitespace-nowrap text-[clamp(10px,3.03vw,12px)] font-medium leading-[18px] tracking-[0.1px] text-white">
              One universe for tools, assets, workflow, and collaboration.
            </p>
          </div>

          <GuestMobileOrbitMotion />

          <Link
            href="/login"
            data-guest-landing-cta
            onClick={(event) => {
              event.preventDefault();
              pushMobileLoginAfterWhiteTransition();
            }}
            className="absolute left-1/2 bottom-[clamp(124px,17.85dvh,176px)] z-30 flex h-14 -translate-x-1/2 items-center justify-center gap-2 rounded-2xl bg-white px-8 py-0.5 text-center text-base font-medium leading-6 tracking-[-0.32px] text-[#9905e1] transition duration-200 hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#9905e1]"
          >
            <span className="whitespace-nowrap">Masuk ke Universe</span>
            <Image
              src={`${LANDING_ASSET_PATH}/cta-arrow.svg`}
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
              className="size-6 shrink-0"
            />
          </Link>

          <p
            data-guest-landing-footer
            className="absolute left-1/2 bottom-[clamp(24px,3.43dvh,34px)] z-20 m-0 -translate-x-1/2 whitespace-nowrap text-center text-[8px] font-normal leading-none tracking-normal text-white"
          >
            &copy; 2026 Created by Creative Division
          </p>
        </section>
      </main>

      <div
        ref={mobileTransitionOverlayRef}
        className="fixed inset-0 z-[9999] bg-white pointer-events-none"
        style={{ display: "none", opacity: 0 }}
      />
    </div>
  );
}
