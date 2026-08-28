"use client";

import React from "react";
import { Logo } from "@/components/ui/Logo/Logo";
import { Input } from "@/components/ui/form/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { IconMaterial } from "@/features/auth/components/IconMaterial/IconMaterial";
import { useLoginLogic } from "../Login.logic";
import type { LoginFormProps } from "../Login.types";

/**
 * Komponen Form Login Utama (LoginForm)
 */
export function LoginForm({
  whiteOverlayRef,
  setToast,
  className = "",
}: LoginFormProps) {
  const {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isSubmitting,
    fieldErrors,
    hasUsername,
    hasPassword,
    usernameHasError,
    passwordHasError,
    desktopCanSubmit,
    clearFieldError,
    handleSubmit,
  } = useLoginLogic({ whiteOverlayRef, setToast });

  return (
    <div className={`cu-style p-8 w-full ${className}`.trim()}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 w-full">
        {/* Logo Universe */}
        <div className="flex justify-center items-center py-2">
          <Logo width={160} height={40} className="w-40 h-auto" />
        </div>

        {/* Input Username & Password */}
        <div className="flex flex-col gap-4">
          <Input
            id="login-username"
            name="username"
            label="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              clearFieldError("username");
            }}
            placeholder="Username anda"
            error={usernameHasError ? fieldErrors.username?.[0] : undefined}
            disabled={isSubmitting}
            autoComplete="username"
          />

          <div className="relative">
            <Input
              id="login-password"
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError("password");
              }}
              placeholder="••••••••"
              error={passwordHasError ? fieldErrors.password?.[0] : undefined}
              disabled={isSubmitting}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-label hover:text-slate-700 p-1"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              <IconMaterial
                name={showPassword ? "visibility_off" : "visibility"}
                className="text-lg"
              />
            </button>
          </div>
        </div>

        {/* Tombol Submit Login */}
        <Button
          type="submit"
          variant="primary"
          disabled={!desktopCanSubmit || isSubmitting}
          className="mt-2 w-full"
        >
          {isSubmitting ? "Memproses..." : "Masuk"}
        </Button>
      </form>
    </div>
  );
}

export default LoginForm;
