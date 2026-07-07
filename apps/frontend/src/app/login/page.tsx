"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as THREE from "three";
import { gsap } from "gsap";
import { useAuth } from "@/providers/auth-provider";
import { isGuestPath, safeInternalRedirect } from "@/lib/routes";
import { ValidationError } from "@/lib/api";

type MobileStep = "username" | "password";

const LOGIN_ERROR_MESSAGE =
  "Username dan Password yang anda masukan tidak sesuai dengan database Pasti Sukses. Periksa kembali data anda";

const LOGIN_CAMERA_Z = 8;
const LOGIN_PARTICLE_OPACITY = 0.78;

function LoginErrorAlert({ message }: { message: string }) {
  const isDefaultMessage = message === LOGIN_ERROR_MESSAGE;

  return (
    <div
      className="mb-3 flex w-full rounded-[8px] bg-[rgba(255,56,60,0.14)] px-3 py-[10px]"
      role="alert"
    >
      <p className="m-0 text-[13px] font-normal leading-[18px] text-[#FF383C]">
        {isDefaultMessage ? (
          <>
            Username dan Password yang anda masukan tidak sesuai dengan database{" "}
            <span className="font-semibold">Pasti Sukses</span>. Periksa kembali data anda
          </>
        ) : (
          message
        )}
      </p>
    </div>
  );
}

function LoginParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const hero = canvas.closest("[data-login-hero]") as HTMLElement | null;
    if (!hero) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      canvas.style.display = "none";
      return;
    }

    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const hues = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 8;
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      hues[i] = i / particleCount;
      const color = new THREE.Color();
      color.setHSL(hues[i], 0.9, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 64;
    textureCanvas.height = 64;
    const context = textureCanvas.getContext("2d");
    if (context) {
      const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(32, 32, 32, 0, Math.PI * 2);
      context.fill();
    }

    const texture = new THREE.CanvasTexture(textureCanvas);
    const material = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: LOGIN_PARTICLE_OPACITY,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
        powerPreference: "high-performance",
      });
    } catch (error) {
      console.warn("WebGL not supported:", error);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.set(0, 0, 1.2);

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const updateSize = () => {
      const bounds = hero.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width || window.innerWidth));
      const height = Math.max(1, Math.round(bounds.height || window.innerHeight));

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
    };

    const renderParticles = (time: number) => {
      const positionAttribute = geometry.getAttribute("position") as THREE.BufferAttribute;
      const colorAttribute = geometry.getAttribute("color") as THREE.BufferAttribute;
      const color = new THREE.Color();

      for (let i = 0; i < particleCount; i++) {
        let x = positionAttribute.getX(i) + velocities[i * 3];
        let y = positionAttribute.getY(i) + velocities[i * 3 + 1];
        let z = positionAttribute.getZ(i) + velocities[i * 3 + 2];

        if (x < -12) x = 12;
        if (x > 12) x = -12;
        if (y < -12) y = 12;
        if (y > 12) y = -12;
        if (z < -16) z = 0;
        if (z > 0) z = -16;

        positionAttribute.setXYZ(i, x, y, z);
        hues[i] = (hues[i] + 0.0006) % 1;
        color.setHSL(hues[i], 0.9, 0.6);
        colorAttribute.setXYZ(i, color.r, color.g, color.b);
      }

      positionAttribute.needsUpdate = true;
      colorAttribute.needsUpdate = true;
      points.rotation.y = time * 0.02;
      points.rotation.x = time * 0.01;
      renderer.render(scene, camera);
    };

    updateSize();
    window.addEventListener("resize", updateSize, { passive: true });
    gsap.ticker.add(renderParticles);
    const cameraTween = gsap.to(camera.position, {
      z: LOGIN_CAMERA_Z,
      duration: 1.35,
      ease: "power2.out",
    });

    return () => {
      cameraTween.kill();
      gsap.ticker.remove(renderParticles);
      window.removeEventListener("resize", updateSize);
      scene.remove(points);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />
      <div aria-hidden="true" className="cu-landing-readability absolute inset-0" />
      <div aria-hidden="true" className="cu-landing-fade absolute inset-x-0 bottom-0 h-40" />
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z" />
      <circle cx="12" cy="12" r="2.75" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z" />
      <circle cx="12" cy="12" r="2.75" />
      <path d="M4 4L20 20" />
    </svg>
  );
}

interface LoginCardProps {
  whiteOverlayRef: React.RefObject<HTMLDivElement | null>;
}

function LoginCard({ whiteOverlayRef }: LoginCardProps) {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [mobileStep, setMobileStep] = useState<MobileStep>("username");
  const [isDesktop, setIsDesktop] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const updateViewport = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
    };
  }, []);

  const hasUsername = username.trim() !== "";
  const hasPassword = password.trim() !== "";

  const usernameHasError = Boolean(fieldErrors.username?.length);
  const passwordHasError = Boolean(fieldErrors.password?.length);

  const isUsernameStep = !isDesktop && mobileStep === "username";
  const isPasswordStep = !isDesktop && mobileStep === "password";

  const canSubmit = isDesktop
    ? hasUsername && hasPassword
    : mobileStep === "username"
      ? hasUsername
      : hasPassword;

  const buttonLabel = !isDesktop && mobileStep === "username" ? "Lanjutkan" : "Masuk";

  function handleBackToUsername() {
    setMobileStep("username");
    setError(null);
    clearFieldError("password");

    setTimeout(() => {
      document.getElementById("username")?.focus();
    }, 50);
  }

  function clearFieldError(field: "username" | "password") {
    setFieldErrors((current) => ({
      ...current,
      [field]: [],
    }));
  }

  function resolveRedirectTarget(loggedInUser: Awaited<ReturnType<typeof login>>) {
    if (!loggedInUser.is_onboarded) {
      return "/onboarding";
    }

    const requestedRedirect = safeInternalRedirect(searchParams.get("redirect"));

    if (requestedRedirect && !isGuestPath(requestedRedirect)) {
      return requestedRedirect;
    }

    const configuredTarget =
      typeof loggedInUser.settings?.redirect_to === "string"
        ? safeInternalRedirect(loggedInUser.settings.redirect_to)
        : null;

    if (configuredTarget && !isGuestPath(configuredTarget)) {
      return configuredTarget;
    }

    if (loggedInUser.roles.includes("Root") || loggedInUser.roles.includes("root")) {
      return "/dashboard";
    }

    return "/";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit || isSubmitting) return;

    if (!isDesktop && mobileStep === "username") {
      setMobileStep("password");
      setError(null);

      setTimeout(() => {
        document.getElementById("password")?.focus();
      }, 50);

      return;
    }

    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      const loggedInUser = await login({ username, password });
      const redirectTarget = resolveRedirectTarget(loggedInUser);
      const shouldPlayUniverseTransition = redirectTarget === "/";

      if (!shouldPlayUniverseTransition) {
        router.push(redirectTarget);
        return;
      }

      const whiteOverlay = whiteOverlayRef.current;

      if (!whiteOverlay) {
        router.push(redirectTarget);
        return;
      }

      if (typeof document !== "undefined") {
        document.body.classList.add("transitioning-universe");
      }

      gsap.killTweensOf(whiteOverlay);
      gsap.set(whiteOverlay, { opacity: 0 });

      // Animasi masuk universe (layar menjadi putih perlahan)
      const tl = gsap.timeline({
        onComplete: () => {
          if (typeof document !== "undefined") {
            document.body.classList.remove("transitioning-universe");
          }
          router.push(redirectTarget);
        }
      });

      tl.to(whiteOverlay, {
        opacity: 1,
        duration: 1.2,
        ease: "power2.inOut",
      });

    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        setFieldErrors(err.errors);
        setError(LOGIN_ERROR_MESSAGE);
      } else {
        setError(err instanceof Error && err.message ? err.message : LOGIN_ERROR_MESSAGE);
      }

      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative z-10 w-full rounded-t-[32px] bg-white px-8 pb-14 pt-8 shadow-2xl md:max-w-[430px] md:rounded-[28px] md:px-9 md:py-10">
      <div className="mb-[25px] flex items-start justify-between gap-3 md:mb-[14px]">
        <h1 className="text-[40px] font-medium leading-[48px] tracking-[-0.03em] text-black">
          Masuk
        </h1>

        {isPasswordStep && (
          <button
            type="button"
            onClick={handleBackToUsername}
            disabled={isSubmitting}
            className="mt-[7px] flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E0E3E1] bg-white text-[#232925] transition-colors duration-200 hover:bg-[#F4F6F5] active:bg-[#ECEFED] disabled:cursor-not-allowed disabled:opacity-50 md:hidden"
            aria-label="Kembali ke input username"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
      </div>

      {error && <LoginErrorAlert message={error} />}

      <form className="flex flex-col gap-[13px]" onSubmit={handleSubmit}>
        <div className={`relative w-full ${isDesktop || isUsernameStep ? "block" : "hidden"}`}>
          <div className="relative h-[60px] w-full">
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder=" "
              disabled={isSubmitting}
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setError(null);
                clearFieldError("username");
              }}
              className={`peer h-full w-full rounded-[8px] border bg-white px-4 pt-[18px] text-[16px] font-medium leading-[24px] text-[#232925] outline-none transition-colors duration-200 placeholder-transparent disabled:cursor-not-allowed disabled:opacity-70 focus:border-[#0088FF] ${
                usernameHasError ? "border-[#FF383C]" : "border-[#909692]"
              }`}
            />

            <label
              htmlFor="username"
              className="pointer-events-none absolute left-4 top-[11px] translate-y-0 text-[13px] font-medium leading-[14px] text-[#909692] transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[16px] peer-placeholder-shown:leading-[24px] peer-focus:top-[11px] peer-focus:translate-y-0 peer-focus:text-[13px] peer-focus:leading-[14px]"
            >
              Username
            </label>
          </div>

          {usernameHasError && (
            <p className="ml-1 mt-1 text-xs text-[#FF383C]">{fieldErrors.username?.[0]}</p>
          )}
        </div>

        <div className={`relative w-full ${isDesktop || isPasswordStep ? "block" : "hidden"}`}>
          <div className="relative h-[60px] w-full">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder=" "
              disabled={isSubmitting}
              value={password}
              onChange={(event) => {
                const value = event.target.value;

                setPassword(value);
                setError(null);
                clearFieldError("password");

                if (value.trim() === "") {
                  setShowPassword(false);
                }
              }}
              className={`peer h-full w-full rounded-[8px] border bg-white px-4 pr-12 pt-[18px] text-[16px] font-medium leading-[24px] text-[#232925] outline-none transition-colors duration-200 placeholder-transparent disabled:cursor-not-allowed disabled:opacity-70 focus:border-[#0088FF] ${
                passwordHasError ? "border-[#FF383C]" : "border-[#909692]"
              }`}
            />

            <label
              htmlFor="password"
              className="pointer-events-none absolute left-4 top-[11px] translate-y-0 text-[13px] font-medium leading-[14px] text-[#909692] transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[16px] peer-placeholder-shown:leading-[24px] peer-focus:top-[11px] peer-focus:translate-y-0 peer-focus:text-[13px] peer-focus:leading-[14px]"
            >
              Password
            </label>

            {hasPassword && (
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                disabled={isSubmitting}
                className="absolute right-4 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-[#232925] transition-opacity duration-200 hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            )}
          </div>

          {passwordHasError && (
            <p className="ml-1 mt-1 text-xs text-[#FF383C]">{fieldErrors.password?.[0]}</p>
          )}
        </div>

        <div className="pt-[12px] md:pt-[18px]">
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className={`flex h-[44px] w-full items-center justify-center rounded-full px-2 text-[16px] font-medium leading-[24px] text-white transition-colors duration-200 ${
              canSubmit && !isSubmitting
                ? "cursor-pointer bg-[#0088FF] hover:bg-[#0077E6] active:bg-[#006BD1]"
                : isSubmitting
                  ? "cursor-not-allowed bg-[#0088FF]"
                  : "cursor-not-allowed bg-[#C6C6C8]"
            }`}
          >
            {isSubmitting ? (
              <svg
                className="h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2Z" />
              </svg>
            ) : (
              <span>{buttonLabel}</span>
            )}
          </button>
        </div>
      </form>

      <p className="mx-auto mt-[25px] max-w-[338px] text-center text-[13px] font-normal leading-[18px] text-[#909692] md:mt-7 md:max-w-[364px]">
        Untuk masuk silahkan menggunakan akun Pasti Sukses. Jika memiliki kendala, silahkan hubungi admin Pasti Sukses untuk mendapatkan bantuan.
      </p>
    </div>
  );
}

export default function LoginPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const whiteOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tweens: gsap.core.Tween[] = [];

    if (whiteOverlayRef.current) {
      tweens.push(
        gsap.to(whiteOverlayRef.current, {
          opacity: 0,
          duration: 0.85,
          ease: "power2.out",
        })
      );
    }

    if (cardRef.current) {
      tweens.push(
        gsap.fromTo(
          cardRef.current,
          {
            y: 140,
            opacity: 0,
            filter: "blur(12px)",
          },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power2.out",
          }
        )
      );
    }

    return () => {
      tweens.forEach((tween) => tween.kill());
    };
  }, []);

  return (
    <main
      data-login-hero
      className="relative min-h-screen overflow-hidden bg-cu-surface font-sans text-[#232925]"
    >
      <LoginParticleBackground />

      <div
        className="relative flex min-h-screen w-full items-end justify-center px-0 pt-10 md:items-center md:px-5 md:py-10 z-10"
      >
        <div ref={cardRef} className="w-full flex justify-center z-10">
          <Suspense
            fallback={
              <div className="relative z-10 min-h-[368px] w-full rounded-t-[32px] bg-white px-8 pb-14 pt-8 shadow-2xl md:max-w-[430px] md:rounded-[28px] md:px-9 md:py-10" />
            }
          >
            <LoginCard whiteOverlayRef={whiteOverlayRef} />
          </Suspense>
        </div>

        <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden w-full -translate-x-1/2 flex-col items-center md:flex">
          <div className="mb-6 flex items-center justify-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://doran.id/wp-content/uploads/2023/03/Logo-PT-Doran-Sukses-Indonesia-white-1400x364-1.png"
              alt="Doran Sukses Indonesia Logo"
              className="h-10 w-auto brightness-0 invert opacity-80"
            />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://jete.id/wp-content/uploads/2023/04/jete-indonesia-logo.png"
              alt="JETE Logo"
              className="h-10 w-auto brightness-0 invert opacity-80"
            />
          </div>

        </div>
      </div>
      {/* Full-screen white transition overlay */}
      <div
        ref={whiteOverlayRef}
        className="fixed inset-0 bg-white opacity-100 pointer-events-none z-[9999]"
      />
    </main>
  );
}
