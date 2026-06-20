"use client";

import React, { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { MaterialIcon } from "@/components/material-icon";

export default function PendingPage() {
  const { user, logout, refreshUser } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    setMessage(null);
    try {
      const u = await refreshUser();
      if (u && u.is_active) {
        // Automatically redirects via RouteGuard
        window.location.href = "/dashboard";
      } else {
        setMessage("Akun Anda masih dalam antrean persetujuan. Silakan hubungi administrator Anda.");
      }
    } catch {
      setMessage("Gagal memverifikasi status. Coba beberapa saat lagi.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cu-surface-soft font-sans text-cu-ink antialiased px-4 py-16">
      {/* Icon */}
      <div className="mb-6 flex size-20 items-center justify-center rounded-full border border-cu-warning/20 bg-cu-warning-soft text-cu-warning">
        <MaterialIcon name="pending_actions" size="xl" />
      </div>

      {/* Heading & Text */}
      <h1 className="mb-3 text-center text-2xl font-semibold text-cu-ink">
        Akunmu Sedang Menunggu Persetujuan
      </h1>
      <p className="mb-2 max-w-md text-center text-cu-muted text-sm">
        Terima kasih telah mendaftar di Creative Universe. Admin akan meninjau akunmu
        dan memberikan persetujuan dalam waktu dekat.
      </p>
      <p className="mb-8 max-w-md text-center text-xs text-cu-muted">
        Kamu akan menerima notifikasi melalui WhatsApp atau email saat akunmu telah disetujui.
        Saat ini kamu belum bisa mengakses fitur apapun.
      </p>

      {message && (
        <div className="mb-4 w-full max-w-sm rounded-lg border border-cu-warning/25 bg-cu-warning-soft p-4 text-xs text-cu-warning">
          {message}
        </div>
      )}

      {/* Account Info Card */}
      <div className="mb-6 w-full max-w-sm rounded-xl border border-cu-line bg-cu-surface p-5 shadow-sm text-left">
        <div className="mb-1 text-xs text-cu-muted">Terdaftar sebagai</div>
        <div className="font-semibold text-cu-ink text-sm">{user?.name}</div>
        <div className="text-xs text-cu-muted mt-0.5">{user?.email}</div>

        {!!user?.settings?.registration_note && (
          <div className="mt-3 border-t border-cu-line pt-3">
            <div className="mb-1 text-xs text-cu-muted">Catatan registrasi</div>
            <div className="text-xs text-cu-ink">{user.settings.registration_note as string}</div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 items-center">
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-cu-border bg-cu-surface px-5 text-sm font-medium leading-none text-cu-ink transition duration-200 hover:border-cu-border-hover hover:bg-cu-surface-soft cursor-pointer"
          onClick={handleCheckStatus}
          disabled={isChecking}
        >
          {isChecking ? (
            <span className="w-4 h-4 border-2 border-cu-ink/30 border-t-cu-ink rounded-full animate-spin"></span>
          ) : (
            "Periksa Status Aktivasi"
          )}
        </button>

        <button
          type="button"
          onClick={() => void logout()}
          className="inline-flex items-center gap-2 text-sm font-medium text-cu-muted transition-colors duration-200 hover:text-cu-ink border-0 bg-transparent cursor-pointer"
        >
          <MaterialIcon name="logout" size="xs" />
          Keluar dari akun
        </button>
      </div>
    </div>
  );
}
