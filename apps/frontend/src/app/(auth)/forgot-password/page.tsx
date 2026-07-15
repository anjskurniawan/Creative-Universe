"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ValidationError } from "@/core/api/client";
import { authApi } from "@/core/auth";
import { APP_ROUTES } from "@/core/navigation/routes";
import { MaterialIcon } from "@/components/material-icon";

type Step = "REQUEST" | "VERIFY" | "RESET";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("REQUEST");
  const [login, setLogin] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      const res = await authApi.passwordReset.requestOtp(login);
      setMaskedPhone(res.masked_phone || "nomor WhatsApp Anda");
      setStep("VERIFY");
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        setFieldErrors(err.errors);
      } else {
        setError(err instanceof Error ? err.message : "Gagal mengirim OTP. Pastikan email/username benar.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      await authApi.passwordReset.verifyOtp(otp);
      setStep("RESET");
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        setFieldErrors(err.errors);
      } else {
        setError(err instanceof Error ? err.message : "OTP salah atau kedaluwarsa.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      const res = await authApi.passwordReset.requestOtp(login);
      setMaskedPhone(res.masked_phone || "nomor WhatsApp Anda");
      setError(null);
      alert("Kode OTP berhasil dikirim ulang.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal mengirim ulang OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      await authApi.passwordReset.reset(password, passwordConfirmation);
      router.push(`${APP_ROUTES.login}?registered=false&reset=success`);
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        setFieldErrors(err.errors);
      } else {
        setError(err instanceof Error ? err.message : "Gagal mengatur ulang sandi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {step === "REQUEST" && (
        <div>
          <div className="mb-6 flex items-start gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg bg-cu-panel-soft text-cu-ink">
              <MaterialIcon name="lock_reset" size="md" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold leading-tight tracking-normal text-cu-ink">
                Lupa Password
              </h1>
              <p className="mt-1 text-sm text-cu-muted">
                Masukkan email atau username. Kami akan mengirimkan kode OTP ke WhatsApp-mu.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-cu-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cu-ink" htmlFor="login">
                Email atau Username
              </label>
              <input
                className="block w-full mt-2 rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm placeholder:text-cu-soft focus:border-cu-ink focus:ring-cu-ink disabled:cursor-not-allowed disabled:bg-cu-panel-soft disabled:text-cu-muted"
                type="text"
                id="login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                placeholder="Email atau username"
                disabled={isSubmitting}
                autoFocus
              />
              {fieldErrors.login && fieldErrors.login.map((err, i) => (
                <p key={i} className="mt-2 text-sm text-cu-danger">{err}</p>
              ))}
            </div>

            <button
              type="submit"
              className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-ink bg-cu-ink px-5 text-sm font-medium leading-none text-cu-surface transition duration-200 hover:border-cu-ink-hover hover:bg-cu-ink-hover focus:outline-none focus:ring-2 focus:ring-cu-focus focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mengirim..." : "Kirim Kode OTP"}
            </button>

            <p className="text-sm text-cu-muted mt-4">
              Ingat passwordnya?{" "}
              <Link href="/login" className="font-medium text-cu-info hover:text-cu-info-hover">
                Masuk
              </Link>
            </p>
          </form>
        </div>
      )}

      {step === "VERIFY" && (
        <div>
          <div className="mb-6 flex items-start gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg bg-cu-panel-soft text-cu-ink">
              <MaterialIcon name="pin" size="md" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold leading-tight tracking-normal text-cu-ink">
                Verifikasi OTP
              </h1>
              <p className="mt-1 text-sm text-cu-muted">
                Kode OTP telah dikirim ke WhatsApp{" "}
                <span className="font-semibold text-cu-ink">{maskedPhone}</span>. Masukkan kode 6 digit di bawah.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-cu-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cu-ink" htmlFor="otp">
                Kode OTP
              </label>
              <input
                className="block w-full mt-2 rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-cu-ink shadow-sm placeholder:text-cu-soft focus:border-cu-ink focus:ring-cu-ink disabled:cursor-not-allowed disabled:bg-cu-panel-soft disabled:text-cu-muted text-center font-mono text-2xl tracking-widest"
                type="text"
                id="otp"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
                placeholder="000000"
                disabled={isSubmitting}
                autoFocus
              />
              <p className="mt-2 text-xs text-cu-muted">Kode berlaku 15 menit.</p>
              {fieldErrors.otp && fieldErrors.otp.map((err, i) => (
                <p key={i} className="mt-2 text-sm text-cu-danger">{err}</p>
              ))}
            </div>

            <button
              type="submit"
              className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-ink bg-cu-ink px-5 text-sm font-medium leading-none text-cu-surface transition duration-200 hover:border-cu-ink-hover hover:bg-cu-ink-hover focus:outline-none focus:ring-2 focus:ring-cu-focus focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Memverifikasi..." : "Verifikasi"}
            </button>

            <p className="text-center text-sm mt-4">
              <button
                type="button"
                onClick={handleResendOtp}
                className="font-medium text-cu-info hover:text-cu-info-hover cursor-pointer"
                disabled={isSubmitting}
              >
                Kirim ulang kode
              </button>
            </p>
          </form>
        </div>
      )}

      {step === "RESET" && (
        <div>
          <div className="mb-6 flex items-start gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg bg-cu-panel-soft text-cu-ink">
              <MaterialIcon name="password" size="md" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold leading-tight tracking-normal text-cu-ink">
                Buat Password Baru
              </h1>
              <p className="mt-1 text-sm text-cu-muted">
                OTP berhasil diverifikasi. Silakan buat password baru.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-cu-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cu-ink" htmlFor="password">
                Password Baru
              </label>
              <input
                className="block w-full mt-2 rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm placeholder:text-cu-soft focus:border-cu-ink focus:ring-cu-ink disabled:cursor-not-allowed disabled:bg-cu-panel-soft disabled:text-cu-muted"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Minimal 8 karakter"
                disabled={isSubmitting}
                autoFocus
              />
              {fieldErrors.password && fieldErrors.password.map((err, i) => (
                <p key={i} className="mt-2 text-sm text-cu-danger">{err}</p>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-cu-ink" htmlFor="password_confirmation">
                Konfirmasi Password
              </label>
              <input
                className="block w-full mt-2 rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm placeholder:text-cu-soft focus:border-cu-ink focus:ring-cu-ink disabled:cursor-not-allowed disabled:bg-cu-panel-soft disabled:text-cu-muted"
                type="password"
                id="password_confirmation"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                placeholder="Ulangi password baru"
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-ink bg-cu-ink px-5 text-sm font-medium leading-none text-cu-surface transition duration-200 hover:border-cu-ink-hover hover:bg-cu-ink-hover focus:outline-none focus:ring-2 focus:ring-cu-focus focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : "Reset Password"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
