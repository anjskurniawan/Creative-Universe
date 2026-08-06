"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { APP_ROUTES } from "@/core/navigation/routes";
import { resolveAuthenticatedRoute } from "@/core/auth";
import { ValidationError } from "@/core/api/client";
import { Logo } from "@/components/ui/logo";
import { Input } from "@/components/ui/form/input";
import { Button } from "@/components/ui/form/button";
import { MaterialIcon } from "@/components/ui/material-icon";
import { playUniverseTransition } from "@/components/login/login-animations";

const LOGIN_ERROR_MESSAGE =
  "Username dan Password yang anda masukan tidak sesuai dengan database Pasti Sukses. Periksa kembali data anda";

interface LoginFormProps {
  whiteOverlayRef: React.RefObject<HTMLDivElement | null>;
  setToast: (toast: { status: "success" | "error"; message: string } | null) => void;
}

/**
 * Komponen Form Login Utama (LoginForm) - Mengelola state input & submit
 */
export function LoginForm({ whiteOverlayRef, setToast }: LoginFormProps) {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const hasUsername = username.trim() !== "";
  const hasPassword = password.trim() !== "";

  const usernameHasError = Boolean(fieldErrors.username?.length);
  const passwordHasError = Boolean(fieldErrors.password?.length);

  const desktopCanSubmit = hasUsername && hasPassword;

  function clearFieldError(field: "username" | "password") {
    setFieldErrors((current) => ({
      ...current,
      [field]: [],
    }));
  }

  function resolveRedirectTarget(loggedInUser: Awaited<ReturnType<typeof login>>) {
    return resolveAuthenticatedRoute(loggedInUser, searchParams.get("redirect"));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!desktopCanSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setToast(null);
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

      playUniverseTransition(whiteOverlay, () => {
        router.push(redirectTarget);
      });
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        setFieldErrors(err.errors);
        setToast({ status: "error", message: LOGIN_ERROR_MESSAGE });
      } else {
        setToast({
          status: "error",
          message: err instanceof Error && err.message ? err.message : LOGIN_ERROR_MESSAGE,
        });
      }
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center px-8 py-11 w-full">
      <div className="flex flex-col gap-8 items-start w-full">
        {/* Logo and Welcome Text */}
        <div className="flex flex-row gap-2 items-center justify-center w-full">
          <div className="flex items-start justify-center text-cu-ink">
            <Logo size={35} />
          </div>
        </div>

        {/* Form Inputs & Submit */}
        <div className="flex flex-col gap-12 items-center w-full">
          <div className="flex flex-col gap-4 items-start w-full">
            {/* Username Field */}
            <Input
              id="username"
              name="username"
              label="Username"
              type="text"
              required
              autoComplete="username"
              disabled={isSubmitting}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setToast(null);
                clearFieldError("username");
              }}
              placeholder="Masukkan username"
              error={usernameHasError ? fieldErrors.username?.[0] : undefined}
            />

            {/* Password Field */}
            <Input
              id="password"
              name="password"
              label="Kata Sandi"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              disabled={isSubmitting}
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                setToast(null);
                clearFieldError("password");
                if (value.trim() === "") setShowPassword(false);
              }}
              placeholder="Masukkan kata sandi"
              error={passwordHasError ? fieldErrors.password?.[0] : undefined}
              rightElement={
                hasPassword && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                    className="text-inherit hover:text-slate-800 transition-colors p-1 rounded focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <MaterialIcon name={showPassword ? "visibility_off" : "visibility"} className="text-xl" />
                  </button>
                )
              }
            />
          </div>

          {/* Submit Button & Subtext */}
          <div className="flex flex-col gap-2 items-center w-full">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!desktopCanSubmit}
            >
              Masuk
            </Button>
            <p className="font-sans font-normal text-[12px] text-[#8a91a1] text-center tracking-[0.6px] leading-[1.5] w-full">
              Gunakan akun <span className="font-medium text-[#525660]">Pasti Sukses</span> yang sudah aktif.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
