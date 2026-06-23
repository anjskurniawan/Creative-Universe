"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { isGuestPath, safeInternalRedirect } from "@/lib/routes";
import { ValidationError } from "@/lib/api";

type MobileStep = "username" | "password";

const LOGIN_ERROR_MESSAGE =
  "Username dan Password yang anda masukan tidak sesuai dengan database Pasti Sukses. Periksa kembali data anda";

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

function LoginCard() {
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

  function clearFieldError(field: "username" | "password") {
    setFieldErrors((current) => ({
      ...current,
      [field]: [],
    }));
  }

  function resolveRedirectTarget(loggedInUser: Awaited<ReturnType<typeof login>>) {
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
      router.push(resolveRedirectTarget(loggedInUser));
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
      <h1 className="mb-[25px] text-[40px] font-medium leading-[48px] tracking-[-0.03em] text-black md:mb-[14px]">
        <span className="md:hidden">Masuk</span>

        <span className="hidden md:inline">
          Sign in to
          <br />
          Creative Universe
        </span>
      </h1>

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
        Dengan melanjutkan, Anda menyetujui{" "}
        <Link
          href="#"
          className="underline underline-offset-2 transition-colors duration-200 hover:text-[#232925]"
        >
          Syarat Layanan
        </Link>
        ,{" "}
        <Link
          href="#"
          className="underline underline-offset-2 transition-colors duration-200 hover:text-[#232925]"
        >
          Kebijakan Privasi
        </Link>{" "}
        dan{" "}
        <Link
          href="#"
          className="underline underline-offset-2 transition-colors duration-200 hover:text-[#232925]"
        >
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
      <div className="relative flex min-h-screen w-full items-end justify-center px-0 pt-10 md:items-center md:px-5 md:py-10">
        <div className="absolute inset-0 bg-black/25" />

        <Suspense
          fallback={
            <div className="relative z-10 min-h-[368px] w-full rounded-t-[32px] bg-white px-8 pb-14 pt-8 shadow-2xl md:max-w-[430px] md:rounded-[28px] md:px-9 md:py-10" />
          }
        >
          <LoginCard />
        </Suspense>

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

          <p className="text-center text-xs text-white">Creative Universe | 2026</p>
        </div>
      </div>
    </main>
  );
}