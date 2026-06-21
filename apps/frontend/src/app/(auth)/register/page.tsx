"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, ValidationError } from "@/lib/api";
import { MaterialIcon } from "@/components/material-icon";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    whatsapp_number: "",
    password: "",
    password_confirmation: "",
    registration_note: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      // Redirect to login page with a success query param
      router.push("/login?registered=true");
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        setFieldErrors(err.errors);
      } else {
        setError(err instanceof Error ? err.message : "Gagal melakukan registrasi. Silakan coba kembali.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex size-11 items-center justify-center rounded-lg bg-cu-panel-soft text-cu-ink">
          <MaterialIcon name="person_add" size="md" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold leading-tight tracking-normal text-cu-ink">
            Daftar Akun Baru
          </h1>
          <p className="mt-1 text-sm text-cu-muted">Ajukan akses ke Creative Universe.</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-cu-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-cu-ink" htmlFor="name">
            Nama Lengkap
          </label>
          <input
            className="block w-full mt-2 rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm placeholder:text-cu-soft focus:border-cu-ink focus:ring-cu-ink disabled:cursor-not-allowed disabled:bg-cu-panel-soft disabled:text-cu-muted"
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Nama lengkap"
            disabled={isSubmitting}
          />
          {fieldErrors.name && fieldErrors.name.map((err, i) => (
            <p key={i} className="mt-2 text-sm text-cu-danger">{err}</p>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-cu-ink" htmlFor="username">
            Username
          </label>
          <input
            className="block w-full mt-2 rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm placeholder:text-cu-soft focus:border-cu-ink focus:ring-cu-ink disabled:cursor-not-allowed disabled:bg-cu-panel-soft disabled:text-cu-muted"
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            placeholder="Username (huruf, angka, tanda hubung)"
            disabled={isSubmitting}
          />
          {fieldErrors.username && fieldErrors.username.map((err, i) => (
            <p key={i} className="mt-2 text-sm text-cu-danger">{err}</p>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-cu-ink" htmlFor="email">
            Email
          </label>
          <input
            className="block w-full mt-2 rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm placeholder:text-cu-soft focus:border-cu-ink focus:ring-cu-ink disabled:cursor-not-allowed disabled:bg-cu-panel-soft disabled:text-cu-muted"
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="email@contoh.com"
            disabled={isSubmitting}
          />
          {fieldErrors.email && fieldErrors.email.map((err, i) => (
            <p key={i} className="mt-2 text-sm text-cu-danger">{err}</p>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-cu-ink" htmlFor="whatsapp_number">
            Nomor WhatsApp <span className="font-normal text-cu-muted">(opsional)</span>
          </label>
          <input
            className="block w-full mt-2 rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm placeholder:text-cu-soft focus:border-cu-ink focus:ring-cu-ink disabled:cursor-not-allowed disabled:bg-cu-panel-soft disabled:text-cu-muted"
            type="text"
            id="whatsapp_number"
            name="whatsapp_number"
            value={form.whatsapp_number}
            onChange={handleChange}
            placeholder="6281234567890"
            disabled={isSubmitting}
          />
          <p className="mt-1 text-xs text-cu-muted">Format: 628xxxx (tanpa tanda +)</p>
          {fieldErrors.whatsapp_number && fieldErrors.whatsapp_number.map((err, i) => (
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
            placeholder="Minimal 8 karakter"
            disabled={isSubmitting}
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
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            required
            placeholder="Ulangi password"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-cu-ink" htmlFor="registration_note">
            Catatan untuk Admin <span className="font-normal text-cu-muted">(opsional)</span>
          </label>
          <textarea
            className="block w-full mt-2 rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm placeholder:text-cu-soft focus:border-cu-ink focus:ring-cu-ink disabled:cursor-not-allowed disabled:bg-cu-panel-soft disabled:text-cu-muted"
            id="registration_note"
            name="registration_note"
            rows={3}
            value={form.registration_note}
            onChange={handleChange}
            placeholder="Contoh: Desainer tim JETE Accessories"
            disabled={isSubmitting}
          />
          {fieldErrors.registration_note && fieldErrors.registration_note.map((err, i) => (
            <p key={i} className="mt-2 text-sm text-cu-danger">{err}</p>
          ))}
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
                <MaterialIcon name="person_add" />
              </span>
              <span className="flex h-full items-center justify-center whitespace-nowrap leading-none">Daftar Akun</span>
            </>
          )}
        </button>

        <p className="text-sm text-cu-muted mt-4">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-cu-info hover:text-cu-info-hover">
            Masuk
          </Link>
        </p>
      </form>
    </div>
  );
}
