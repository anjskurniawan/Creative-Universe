"use client";

import { useAuth } from "@/providers/auth-provider";
import { GuestPortal } from "@/components/landing/guest-portal";
import { AuthPortal } from "@/components/landing/auth-portal";

// Gatekeeper rute "/" untuk mengalihkan tampilan antara Guest dan Auth Portal
export default function RootLandingPage() {
  const { isAuthenticated, isLoading } = useAuth();

  // Loading status autentikasi
  if (isLoading) {
    return <div className="min-h-screen bg-[url('/images/landing/creative-universe-background.jpg')] bg-cover bg-center bg-no-repeat" />;
  }

  // Render dashboard jika sudah login
  if (isAuthenticated) {
    return <AuthPortal />;
  }

  // Render landing page jika belum login
  return <GuestPortal />;
}
