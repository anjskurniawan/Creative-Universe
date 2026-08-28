"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { Toast } from "@/components/feedback/Toast/Toast";
import { LoginForm } from "../LoginForm/LoginForm";
import { DEFAULT_LOGIN_CONFIG } from "../Login.config";
import type { LoginCardProps } from "../Login.types";

export type { LoginCardProps } from "../Login.types";

/**
 * Komponen Kartu Login Utama (LoginCard)
 */
export function LoginCard({ whiteOverlayRef, className = "" }: LoginCardProps) {
  const router = useRouter();
  const [toast, setToast] = useState<{ status: "success" | "error"; message: string } | null>(null);

  // Auto-clear toast notification
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(
      () => setToast(null),
      DEFAULT_LOGIN_CONFIG.toastDurationMs
    );
    return () => window.clearTimeout(timeout);
  }, [toast]);

  return (
    <>
      <AuthCard
        title="Masuk"
        footerText="Butuh bantuan? Buka Help Center"
        showCloseButton={true}
        onHeaderButtonClick={() => router.push("/")}
        className={className}
      >
        {/* Form Inputs & Submit (Body Kartu) */}
        <LoginForm whiteOverlayRef={whiteOverlayRef} setToast={setToast} />
      </AuthCard>

      {/* Global Toast Error Portal */}
      {toast && (
        <Toast
          message={toast.message}
          status={toast.status}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default LoginCard;
