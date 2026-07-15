"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as THREE from "three";
import { gsap } from "gsap";
import { useAuth } from "@/providers/auth-provider";
import { APP_ROUTES } from "@/core/navigation/routes";
import { resolveAuthenticatedRoute } from "@/core/auth";
import { ValidationError } from "@/core/api/client";
import { CreativeUniverseLogo, Navbar } from "@/components/navbar";

// Small stacked "CR EA" logo
const LogoSmall = () => (
  <svg viewBox="0 0 31 34" fill="none" className="w-[30.47px] h-[33.08px]" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.7697 9.8199C20.7697 9.34949 21.1331 8.93782 21.5949 8.93282L23.6987 8.91011C24.9343 8.89678 25.9358 8.09011 26.0387 6.84366C26.1274 5.76886 25.7533 4.78595 24.7312 4.4022C24.3554 4.26116 23.9614 4.18053 23.547 4.18012L20.1122 4.17657C20.0372 4.17657 19.9658 4.33324 19.9658 4.41428L19.9412 15.4503C19.9393 16.2897 19.322 16.9472 18.5566 17.0953C18.1179 17.1801 17.7249 17.1653 17.2933 17.103C16.7397 17.0232 16.2479 16.6703 16.0281 16.1518C15.8968 15.8422 15.8397 15.5214 15.8397 15.1693L15.8431 5.29345L15.8456 2.36428C15.846 1.96595 15.8895 1.59574 16.0593 1.23449C16.3774 0.55824 17.031 0.0592821 17.8112 0.0569904L23.6562 0.0401155C24.2049 0.0384488 24.7043 0.130949 25.2308 0.240532C26.481 0.500949 27.6041 1.09907 28.5187 1.96345C30.791 4.11137 31.117 7.58866 29.2999 10.1366C28.4991 11.2597 27.4587 11.8393 27.4008 11.9495C27.3804 11.9884 27.4068 12.0978 27.4368 12.1418L30.0462 15.9601C30.317 16.3564 30.1193 16.8774 29.7079 17.0407C29.5641 17.0978 29.3999 17.1522 29.2495 17.1522H27.0277C26.8179 17.1522 26.6029 17.1112 26.4066 17.0637C25.9208 16.9466 25.5658 16.6524 25.2935 16.2424L23.5685 13.6439C23.2012 13.0905 22.5689 12.8405 21.9229 12.8451C21.6366 12.8472 21.3631 12.832 21.1208 12.6766C20.8922 12.5299 20.7687 12.2374 20.7689 11.9547L20.7697 9.82032V9.8199Z" fill="#111827"/>
    <path d="M20.3166 29.83C20.0503 29.8296 19.8751 30.0175 19.8749 30.25L19.8728 32.1365C19.8722 32.6413 19.5112 33.0669 18.9974 33.0665L16.923 33.065C16.5966 33.0648 16.2643 32.8811 16.0801 32.6179C15.9364 32.4125 15.852 32.1419 15.853 31.874L15.8785 24.9298C15.8853 23.0754 16.6241 21.2861 17.823 19.8975C19.1955 18.3079 21.191 17.4392 23.293 17.4884C25.592 17.5421 27.7445 18.7098 29.0276 20.6188C29.8418 21.8302 30.3114 23.2596 30.3114 24.7334V31.9788C30.3114 32.5434 29.871 33.0588 29.3264 33.0579L27.0247 33.0548C26.6064 33.0542 26.271 32.609 26.2685 32.2079L26.2568 30.2863C26.2553 30.0536 26.0882 29.8409 25.838 29.8404L20.3168 29.8298L20.3166 29.83ZM25.9895 26.1771C26.1076 26.1454 26.1851 26.08 26.186 25.9965L26.1955 24.8427C26.203 23.9215 25.8145 23.0296 25.1253 22.4202C24.5182 21.8834 23.7651 21.6454 22.966 21.674C21.3076 21.7332 19.9626 23.3242 19.9535 24.8425L19.9468 25.9565C19.946 26.0886 20.0464 26.1782 20.191 26.1782L25.9899 26.1769L25.9895 26.1771Z" fill="#111827"/>
    <g id="Group_2">
      <path d="M5.21866 27.1418C4.57158 27.1418 4.16449 27.5584 4.14699 28.1834C4.13199 28.7241 4.49762 29.2274 5.09158 29.2282L14.4382 29.2403C14.9303 29.2409 15.2876 29.6576 15.2855 30.1097L15.2749 32.2647C15.2726 32.7411 14.8585 33.0786 14.4214 33.0772L13.4782 33.0738H5.08991C4.2272 33.0738 3.44616 32.8966 2.68908 32.4959C1.05887 31.6334 0.0561609 29.8899 0.174703 28.0315C0.238661 27.029 0.679286 26.1255 1.31512 25.3693C1.36929 25.3049 1.38679 25.2186 1.3322 25.1551C0.161994 23.7905 -0.190506 22.1386 0.563661 20.4661C1.34449 18.7345 3.06616 17.589 4.97387 17.5895L8.2697 17.5901L14.4251 17.5957C14.9716 17.5961 15.3964 17.9634 15.3962 18.5186L15.3957 20.5018C15.3957 20.9878 15.0153 21.4163 14.5066 21.4172L8.67595 21.4263L5.05095 21.4388C4.4997 21.4407 4.14283 21.9147 4.1522 22.4363C4.16116 22.9276 4.48366 23.3624 5.00304 23.3699L6.49554 23.3911L12.5564 23.3978C13.0424 23.3984 13.4293 23.7857 13.4291 24.2618L13.4282 26.2705C13.428 26.7843 13.023 27.1434 12.518 27.1434L5.21845 27.1422L5.21866 27.1418Z" fill="#111827"/>
      <path d="M8.73099 12.987C9.76578 12.915 10.6731 12.4858 11.4312 11.8216C11.692 11.5933 11.9664 11.3781 12.3372 11.4052C12.6847 11.4306 12.947 11.6431 13.1897 11.8789L14.6358 13.2833C15.0654 13.7006 15.0735 14.4291 14.5927 14.8393L13.8324 15.4877C12.2731 16.6666 10.4029 17.2152 8.45203 17.2043C6.81745 17.1952 5.26766 16.7293 3.90661 15.8439C1.63724 14.3677 0.203907 11.9439 0.0230732 9.23453C-0.00671848 8.78766 -0.00984352 8.39558 0.0266148 7.94037C0.396823 3.30995 4.37911 -0.23359 9.02057 0.0120352C11.187 0.126827 12.8656 0.99391 14.4472 2.43099C14.722 2.68079 14.9633 2.96829 14.962 3.36516C14.9612 3.66516 14.7852 3.94891 14.5666 4.14912L12.9839 5.59828C12.7672 5.79662 12.4327 5.88808 12.1566 5.84599C11.796 5.79099 11.5416 5.57578 11.2887 5.34828C9.65766 3.88266 7.22203 3.84204 5.57641 5.31433C3.88224 6.82974 3.67016 9.5837 5.11328 11.4054C5.98057 12.5002 7.30828 13.086 8.73099 12.9868V12.987Z" fill="#111827"/>
    </g>
  </svg>
);

type MobileStep = "username" | "password";
type LoginMode = "desktop" | "mobile";

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

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M5.5 5.5L14.5 14.5" />
      <path d="M14.5 5.5L5.5 14.5" />
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

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const hasUsername = username.trim() !== "";
  const hasPassword = password.trim() !== "";

  const usernameHasError = Boolean(fieldErrors.username?.length);
  const passwordHasError = Boolean(fieldErrors.password?.length);

  const isUsernameStep = mobileStep === "username";
  const isPasswordStep = mobileStep === "password";
  const desktopCanSubmit = hasUsername && hasPassword;
  const mobileCanSubmit = isUsernameStep ? hasUsername : hasPassword;
  const mobileButtonLabel = isUsernameStep ? "Lanjutkan" : "Masuk";

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
    return resolveAuthenticatedRoute(loggedInUser, searchParams.get("redirect"));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>, mode: LoginMode) {
    event.preventDefault();

    const canSubmit = mode === "desktop" ? desktopCanSubmit : mobileCanSubmit;

    if (!canSubmit || isSubmitting) return;

    if (mode === "mobile" && mobileStep === "username") {
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
    const shouldPlayUniverseTransition = redirectTarget === APP_ROUTES.home;

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
    <div 
      className="bg-white border border-[#edeef0] rounded-[16px] shadow-[0px_8px_12px_rgba(0,0,0,0.15)] flex flex-col items-start w-full max-w-[488px] overflow-hidden transition-all duration-300 relative z-10"
      id="login-card-container"
    >
      {/* Card Header */}
      <div className="border-b border-[#edeef0] flex items-center justify-between px-8 py-4 w-full shrink-0">
        <p className="font-sans font-semibold text-[16px] text-[#525660]">
          Masuk
        </p>
        <Link 
          href="/"
          className="text-[#525660] hover:bg-gray-100 p-1 rounded-full transition-colors duration-150 w-6 h-6 flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cu-focus" 
          aria-label="Close"
        >
          <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.0625 15L5 13.9375L8.9375 10L5 6.0625L6.0625 5L10 8.9375L13.9375 5L15 6.0625L11.0625 10L15 13.9375L13.9375 15L10 11.0625L6.0625 15Z" fill="currentColor"/>
          </svg>
        </Link>
      </div>

      {/* Card Body */}
      <form onSubmit={(event) => handleSubmit(event, "desktop")} className="flex flex-col items-center justify-center px-8 md:px-16 py-11 w-full">
        <div className="flex flex-col gap-8 items-start w-full">
          
          {/* Logo and Welcome Text */}
          <div className="flex flex-col gap-2 items-start justify-center w-full">
            <div className="flex items-start justify-center w-10 h-10">
              <LogoSmall />
            </div>
            <p className="font-sans font-semibold text-[32px] text-[#111827]">
              Masuk
            </p>
          </div>

          {error && <LoginErrorAlert message={error} />}

          {/* Form Inputs & Submit */}
          <div className="flex flex-col gap-12 items-center w-full">
            <div className="flex flex-col gap-4 items-start w-full">
              {/* Username Field */}
              <div className="flex flex-col gap-2 items-start w-full">
                <label htmlFor="username" className="font-sans font-semibold text-[14px] text-[#525660]">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  disabled={isSubmitting}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError(null);
                    clearFieldError("username");
                  }}
                  placeholder="Masukkan username"
                  className={`border flex h-[52px] items-center px-4 rounded-[8px] w-full text-[16px] text-gray-900 placeholder-[#b9bdc7] focus:outline-none focus:border-[#286bff] focus:ring-1 focus:ring-[#286bff] transition-all disabled:opacity-70 disabled:cursor-not-allowed ${
                    usernameHasError ? "border-[#FF383C]" : "border-[#edeef0]"
                  }`}
                />
                {usernameHasError && (
                  <p className="text-xs text-[#FF383C]">{fieldErrors.username?.[0]}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-2 items-start w-full">
                <label htmlFor="password" className="font-sans font-semibold text-[14px] text-[#525660]">
                  Kata Sandi
                </label>
                <div className={`border flex h-[52px] items-center justify-between px-4 rounded-[8px] w-full relative focus-within:border-[#286bff] focus-within:ring-1 focus-within:ring-[#286bff] transition-all ${
                  passwordHasError ? "border-[#FF383C]" : "border-[#edeef0]"
                }`}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    value={password}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPassword(value);
                      setError(null);
                      clearFieldError("password");
                      if (value.trim() === "") setShowPassword(false);
                    }}
                    placeholder="Masukkan kata sandi"
                    className="w-full h-full text-[16px] text-gray-900 placeholder-[#b9bdc7] bg-transparent focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                  {hasPassword && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                      className="text-[#6B7280] hover:text-gray-900 transition-colors p-1 rounded focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.71809 9.71082C1.64864 9.89792 1.64864 10.1037 1.71809 10.2908C2.3945 11.9309 3.54268 13.3333 5.01706 14.3201C6.49144 15.3069 8.22562 15.8336 9.99975 15.8336C11.7739 15.8336 13.5081 15.3069 14.9824 14.3201C16.4568 13.3333 17.605 11.9309 18.2814 10.2908C18.3509 10.1037 18.3509 9.89792 18.2814 9.71082C17.605 8.0707 16.4568 6.66835 14.9824 5.68157C13.5081 4.69478 11.7739 4.168 9.99975 4.168C8.22562 4.168 6.49144 4.69478 5.01706 5.68157C3.54268 6.66835 2.3945 8.0707 1.71809 9.71082Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        {showPassword && (
                          <path d="M3 3L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        )}
                      </svg>
                    </button>
                  )}
                </div>
                {passwordHasError && (
                  <p className="text-xs text-[#FF383C]">{fieldErrors.password?.[0]}</p>
                )}
              </div>
            </div>

            {/* Submit Button & Subtext */}
            <div className="flex flex-col gap-2 items-center w-full">
              <button
                type="submit"
                disabled={!desktopCanSubmit || isSubmitting}
                className={`text-white font-sans font-semibold text-[20px] rounded-[10px] w-full h-[56px] flex items-center justify-center shadow-[0px_4px_4px_rgba(59,130,246,0.2)] transition-all ${
                  desktopCanSubmit && !isSubmitting
                    ? "bg-[#286bff] hover:bg-[#1a5bf0] active:bg-[#0c4ce0] cursor-pointer"
                    : "bg-[#286bff] opacity-70 cursor-not-allowed"
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
                  <span>Masuk</span>
                )}
              </button>
              <p className="font-sans font-normal text-[12px] text-[#8a91a1] text-center tracking-[0.6px] leading-[1.5] w-full">
                Gunakan akun <span className="font-medium text-[#525660]">Pasti Sukses</span> yang sudah aktif.
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* Card Footer */}
      <div className="bg-white border-t border-[#edeef0] flex items-center px-8 py-3 w-full shrink-0">
        <p className="font-sans font-normal text-[12px] text-[#8a91a1] tracking-[0.6px] leading-[1.5]">
          Butuh bantuan? Buka <a href="#" className="text-[#286bff] hover:underline">Help Center</a>
        </p>
      </div>
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

      <div className="absolute inset-x-0 top-0 z-20 hidden md:block">
        <Navbar variant="light" />
      </div>

      <div
        className="relative z-10 flex min-h-screen w-full items-end justify-center px-0 pt-10 md:items-center md:px-5 md:pt-0"
      >
        <div ref={cardRef} className="w-full flex justify-center z-10">
          <Suspense
            fallback={
              <div className="relative z-10 min-h-[368px] w-full rounded-t-[32px] bg-white px-8 pb-14 pt-8 shadow-2xl md:h-[612px] md:w-[488px] md:max-w-[488px] md:rounded-[16px] md:p-0 md:shadow-[0px_8px_12px_rgba(0,0,0,0.15)]" />
            }
          >
            <LoginCard whiteOverlayRef={whiteOverlayRef} />
          </Suspense>
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
