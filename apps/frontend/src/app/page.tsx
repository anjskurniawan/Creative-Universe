"use client";

import { useAuth } from "@/providers/auth-provider";
import { GuestPortal } from "@/components/landing/guest-portal";
import { AuthPortal } from "@/components/universe/AuthPortal";
import { ImageBackground } from "@/components/universe/Background";

// Gatekeeper rute "/" untuk mengalihkan tampilan antara Guest dan Auth Portal
export default function RootLandingPage() {
  const { isAuthenticated, isLoading } = useAuth();

  // Loading status autentikasi
  if (isLoading) {
    return <ImageBackground />;
  }

  // Render dashboard jika sudah login
  if (isAuthenticated) {
    return <AuthPortal />;
  }

  // Render landing page jika belum login
  return <GuestPortal />;
}
