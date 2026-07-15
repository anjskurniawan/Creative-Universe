"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { APP_ROUTES } from "@/core/navigation/routes";
import { useAuth } from "@/providers/auth-provider";
import { HeroHeading } from "@/design-system/atoms/typography/hero-heading";
import { PrimaryActionLink } from "@/design-system/atoms/actions/primary-action-link";

export default function GuestLandingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [hasTypingCompleted, setHasTypingCompleted] = useState(false);
  const [isPrimaryActionVisible, setIsPrimaryActionVisible] = useState(false);
  const completeTyping = useCallback(() => setHasTypingCompleted(true), []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace(APP_ROUTES.dashboard);
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!hasTypingCompleted) return;
    const delay = window.setTimeout(() => setIsPrimaryActionVisible(true), 400);
    return () => window.clearTimeout(delay);
  }, [hasTypingCompleted]);

  if (isLoading) {
    return <div className="min-h-screen bg-[url('/images/landing/creative-universe-background.jpg')] bg-cover bg-center bg-no-repeat" />;
  }

  if (isAuthenticated) return null;

  return (
    <div className="flex min-h-screen flex-col bg-[url('/images/landing/creative-universe-background.jpg')] bg-cover bg-center bg-no-repeat font-sans text-cu-ink antialiased">
      <Navbar variant="transparent-dark" session="guest" />
      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12 md:gap-10 md:px-16">
        <HeroHeading typing onTypingComplete={completeTyping} className="w-full !text-white">This is Where Creative Begins</HeroHeading>
        {isPrimaryActionVisible && <div className="cu-landing-action-enter"><PrimaryActionLink href={APP_ROUTES.login}>Masuk ke Universe</PrimaryActionLink></div>}
      </main>
    </div>
  );
}
