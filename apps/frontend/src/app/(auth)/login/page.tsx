"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { ValidationError } from "@/lib/api";
import { MaterialIcon } from "@/components/material-icon";
import {
  isGuestPath,
  pathnameFromTarget,
  safeInternalRedirect,
} from "@/lib/routes";

export default function LoginPage() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [form, setForm] = useState({ login: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: [] });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      const loggedInUser = await login(form);
      
      // Determine redirection target path dynamically
      const requestedRedirect = safeInternalRedirect(searchParams.get("redirect"));
      let targetPath = requestedRedirect && !isGuestPath(requestedRedirect)
        ? requestedRedirect
        : "";
      if (!targetPath) {
        const configuredTarget = typeof loggedInUser.settings?.redirect_to === "string"
          ? safeInternalRedirect(loggedInUser.settings.redirect_to)
          : null;

        if (
          configuredTarget &&
          !isGuestPath(configuredTarget) &&
          pathnameFromTarget(configuredTarget) !== "/pending"
        ) {
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
      } else {
        setError(err instanceof Error ? err.message : "Gagal melakukan login. Silakan coba kembali.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex size-11 items-center justify-center rounded-lg bg-cu-panel-soft text-cu-ink">
          <MaterialIcon name="login" size="md" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold leading-tight tracking-normal text-cu-ink">
            Login your account
          </h1>
          <p className="mt-1 text-sm text-cu-muted">You can login using your email or username.</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-cu-danger">
          {error}
        </div>
      )}

      {searchParams.get("registered") && (
        <div className="mb-4 rounded-lg border border-cu-success/20 bg-cu-success-soft p-4 text-sm text-cu-success">
          Registrasi berhasil. Akun Anda sedang menunggu persetujuan admin.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-cu-ink" htmlFor="login">
            Email atau Username
          </label>
          <input
            className="block w-full mt-2 rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm placeholder:text-cu-soft focus:border-cu-ink focus:ring-cu-ink disabled:cursor-not-allowed disabled:bg-cu-panel-soft disabled:text-cu-muted"
            type="text"
            id="login"
            name="login"
            value={form.login}
            onChange={handleChange}
            required
            placeholder="Email atau username"
            disabled={isSubmitting}
          />
          {fieldErrors.login && fieldErrors.login.map((err, i) => (
            <p key={i} className="mt-2 text-sm text-cu-danger">{err}</p>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-cu-ink" htmlFor="password">
            Password
          </label>
          <input
            className="block w-full mt-2 rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm placeholder:text-cu-soft focus:border-cu-ink focus:ring-cu-ink disabled:cursor-not-allowed disabled:bg-cu-panel-soft disabled:text-cu-muted"
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Password"
            disabled={isSubmitting}
          />
          {fieldErrors.password && fieldErrors.password.map((err, i) => (
            <p key={i} className="mt-2 text-sm text-cu-danger">{err}</p>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4">
          <label htmlFor="remember" className="flex items-center gap-2 text-sm text-cu-muted select-none">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="size-4 rounded border-cu-border text-cu-ink focus:ring-cu-ink"
              disabled={isSubmitting}
            />
            Ingat saya
          </label>

          <Link href="/forgot-password" className="text-sm font-medium text-cu-info hover:text-cu-info-hover">
            Lupa password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-ink bg-cu-ink px-5 text-sm font-medium leading-none text-cu-surface transition duration-200 hover:border-cu-ink-hover hover:bg-cu-ink-hover focus:outline-none focus:ring-2 focus:ring-cu-focus focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex h-full items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Memproses...</span>
            </span>
          ) : (
            <>
              <span className="flex h-full items-center justify-center leading-none">
                <MaterialIcon name="login" />
              </span>
              <span className="flex h-full items-center justify-center whitespace-nowrap leading-none">Masuk</span>
            </>
          )}
        </button>

        <p className="text-sm text-cu-muted mt-4">
          Belum punya akun?{" "}
          <Link href="/register" className="font-medium text-cu-info hover:text-cu-info-hover">
            Daftar Akun
          </Link>
        </p>
      </form>
    </div>
  );
}
