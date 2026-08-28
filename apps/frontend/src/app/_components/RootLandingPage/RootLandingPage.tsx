"use client";

import { useAuth } from "@/hooks/auth";
import { Auth } from "@/features/auth/components/Portal/Auth";
import { Guest } from "@/features/auth/components/Portal/Guest";
import { LoadingBackground } from "@/app/_components/LoadingBackground/LoadingBackground";

// Gatekeeper rute "/" untuk mengalihkan tampilan antara Guest dan Auth Portal
export default function RootLandingPage() {
  const { isAuthenticated, isLoading } = useAuth();

  // Loading status autentikasi
  if (isLoading) {
    return <LoadingBackground />;
  }

  // Render dashboard jika sudah login
  if (isAuthenticated) {
    return <Auth />;
  }

  // Render landing page jika belum login
  return <Guest />;
}
