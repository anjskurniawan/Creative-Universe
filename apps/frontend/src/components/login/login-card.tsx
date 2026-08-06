"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "./login-form";
import { AuthCard } from "@/components/auth/auth-card";
import { Toast } from "@/components/ui/toast";

interface LoginCardProps {
  whiteOverlayRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Komponen Kartu Login Utama (LoginCard)
 * Berisi gabungan komponen modular: Header, Form (Body), dan Footer melalui AuthCard.
 */
export function LoginCard({ whiteOverlayRef }: LoginCardProps) {
  const router = useRouter();
  const [toast, setToast] = useState<{ status: "success" | "error"; message: string } | null>(null);

  // Auto-clear toast notification
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  return (
    <>
      <AuthCard
        title="Masuk"
        footerText="Butuh bantuan? Buka Help Center"
        showCloseButton={true}
        onHeaderButtonClick={() => router.push("/")}
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
