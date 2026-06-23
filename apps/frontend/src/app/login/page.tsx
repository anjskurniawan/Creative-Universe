"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { useRouter, useSearchParams } from "next/navigation";
import { isGuestPath, safeInternalRedirect } from "@/lib/routes";
import { ValidationError } from "@/lib/api";

function LoginCard() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const canSubmit = username.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      const loggedInUser = await login({ username, password });
      
      // Determine redirection target path dynamically
      const requestedRedirect = safeInternalRedirect(searchParams.get("redirect"));
      let targetPath = requestedRedirect && !isGuestPath(requestedRedirect)
        ? requestedRedirect
        : "";

      if (!targetPath) {
        const configuredTarget = typeof loggedInUser.settings?.redirect_to === "string"
          ? safeInternalRedirect(loggedInUser.settings.redirect_to)
          : null;

        if (configuredTarget && !isGuestPath(configuredTarget)) {
          targetPath = configuredTarget;
        } else if (
          loggedInUser.roles.includes("Root") || 
          loggedInUser.roles.includes("root")
        ) {
          targetPath = "/dashboard";
        } else {
          targetPath = "/";
        }
      }
      
      router.push(targetPath);
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        setFieldErrors(err.errors);
        setError("Periksa kembali data Anda.");
      } else {
        setError(err instanceof Error ? err.message : "Username dan Password yang anda masukan tidak sesuai dengan database. Periksa kembali data anda.");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-[430px] rounded-[28px] bg-white px-8 py-8 shadow-2xl md:px-9">
      <h1 className="mb-[14px] text-[40px] font-medium leading-[48px] tracking-[-0.03em] text-black">
        Sign in to<br />
        Creative Universe
      </h1>

      {/* Alert Error Backend */}
      {error && (
        <div className="mb-3 flex w-full rounded-[8px] bg-[rgba(255,56,60,0.14)] px-3 py-[10px]" role="alert">
          <p className="m-0 text-[13px] font-normal leading-[18px] text-[#FF383C]">
            {error}
          </p>
        </div>
      )}

      <form id="loginForm" className="flex flex-col gap-[13px]" onSubmit={handleSubmit}>
        {/* Username */}
        <div className="relative w-full">
          <div className="relative h-[60px] w-full">
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder=" "
              disabled={isSubmitting}
              className={`peer h-full w-full rounded-[8px] border bg-white px-4 pt-[18px] text-[16px] font-medium leading-[24px] text-[#232925] outline-none transition-colors duration-200 placeholder-transparent focus:border-[#0088FF] ${fieldErrors.username ? 'border-[#FF383C]' : 'border-[#909692]'}`}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (fieldErrors.username) {
                  setFieldErrors({ ...fieldErrors, username: [] });
                }
              }}
            />
            <label
              htmlFor="username"
              className="pointer-events-none absolute left-4 top-[11px] translate-y-0 text-[13px] font-medium leading-[14px] text-[#909692] transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[16px] peer-placeholder-shown:leading-[24px] peer-focus:top-[11px] peer-focus:translate-y-0 peer-focus:text-[13px] peer-focus:leading-[14px]"
            >
              Username
            </label>
          </div>
          {fieldErrors.username && fieldErrors.username.length > 0 && (
            <p className="mt-1 ml-1 text-xs text-[#FF383C]">{fieldErrors.username[0]}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative w-full">
          <div className="relative h-[60px] w-full">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder=" "
              disabled={isSubmitting}
              className={`peer h-full w-full rounded-[8px] border bg-white px-4 pr-12 pt-[18px] text-[16px] font-medium leading-[24px] text-[#232925] outline-none transition-colors duration-200 placeholder-transparent focus:border-[#0088FF] ${fieldErrors.password ? 'border-[#FF383C]' : 'border-[#909692]'}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors({ ...fieldErrors, password: [] });
                }
              }}
            />
            <label
              htmlFor="password"
              className="pointer-events-none absolute left-4 top-[11px] translate-y-0 text-[13px] font-medium leading-[14px] text-[#909692] transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[16px] peer-placeholder-shown:leading-[24px] peer-focus:top-[11px] peer-focus:translate-y-0 peer-focus:text-[13px] peer-focus:leading-[14px]"
            >
              Password
            </label>

            {password.trim() !== "" && (
              <button
                id="togglePassword"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-[#232925] transition-opacity duration-200 hover:opacity-70"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z" />
                    <circle cx="12" cy="12" r="2.75" />
                    <path d="M4 4L20 20" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z" />
                    <circle cx="12" cy="12" r="2.75" />
                  </svg>
                )}
              </button>
            )}
          </div>
          {fieldErrors.password && fieldErrors.password.length > 0 && (
            <p className="mt-1 ml-1 text-xs text-[#FF383C]">{fieldErrors.password[0]}</p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-[18px]">
          <button
            id="submitButton"
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className={`flex h-[44px] w-full items-center justify-center rounded-full px-2 text-[16px] font-medium leading-[24px] text-white transition-colors duration-200 ${
              isSubmitting
                ? "bg-[#0088FF] cursor-not-allowed"
                : canSubmit
                ? "cursor-pointer bg-[#0088FF] hover:bg-[#0077E6] active:bg-[#006BD1]"
                : "cursor-not-allowed bg-[#C6C6C8]"
            }`}
          >
            {isSubmitting ? (
              <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2Z" />
              </svg>
            ) : (
              <span>Masuk</span>
            )}
          </button>
        </div>
      </form>

      <p className="mx-auto mt-7 max-w-[364px] text-center text-[13px] font-normal leading-[18px] text-[#909692]">
        Dengan melanjutkan, Anda menyetujui{" "}
        <Link href="#" className="underline underline-offset-2 transition-colors duration-200 hover:text-[#232925]">
          Syarat Layanan
        </Link>
        ,{" "}
        <Link href="#" className="underline underline-offset-2 transition-colors duration-200 hover:text-[#232925]">
          Kebijakan Privasi
        </Link>{" "}
        dan{" "}
        <Link href="#" className="underline underline-offset-2 transition-colors duration-200 hover:text-[#232925]">
          Penggunaan Cookie
        </Link>{" "}
        kami.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[url('https://i.pinimg.com/1200x/2a/68/ff/2a68ffb5bc0ea3d310d7ad3708f6282e.jpg')] bg-cover bg-center bg-no-repeat font-sans text-[#232925]">
      <div className="relative flex min-h-screen w-full items-center justify-center px-5 py-10">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Login Card bound inside Suspense for useSearchParams */}
        <Suspense fallback={<div className="relative z-10 w-full max-w-[430px] rounded-[28px] bg-white px-8 py-8 shadow-2xl md:px-9 min-h-[450px]"></div>}>
          <LoginCard />
        </Suspense>

        {/* Logo + Footer Text */}
        <div className="absolute bottom-8 left-1/2 z-10 flex w-full -translate-x-1/2 flex-col items-center">
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
          <p className="text-center text-xs text-white">
            Creative Universe | 2026
          </p>
        </div>
      </div>
    </main>
  );
}
