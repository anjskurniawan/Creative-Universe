"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Navbar } from "@/components/archive/old-navbar";
import { APP_ROUTES } from "@/core/navigation/routes";
import { useAuth } from "@/providers/auth-provider";
import { HeroHeading } from "@/components/typography/hero-heading";
import { PrimaryActionLink } from "@/components/ui/primary-action-link";

export default function GuestLandingPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [hasTypingCompleted, setHasTypingCompleted] = useState(false);
  const [isPrimaryActionVisible, setIsPrimaryActionVisible] = useState(false);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const completeTyping = useCallback(() => setHasTypingCompleted(true), []);

  useEffect(() => {
    if (!hasTypingCompleted) return;
    const delay = window.setTimeout(() => setIsPrimaryActionVisible(true), 400);
    return () => window.clearTimeout(delay);
  }, [hasTypingCompleted]);

  useEffect(() => {
    const context = gsap.context(() => {
      if (!backgroundRef.current) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(backgroundRef.current, { transformOrigin: "center center", scale: 1 });
        gsap.fromTo(backgroundRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.72, ease: "power2.out" });
        gsap.to(backgroundRef.current, { scale: 1.16, duration: 5.5, delay: 0.72, ease: "sine.inOut", repeat: -1, yoyo: true });
      });
      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(backgroundRef.current, { autoAlpha: 1 });
      });
      return () => media.revert();
    });
    return () => context.revert();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-[url('/images/landing/creative-universe-background.jpg')] bg-cover bg-center bg-no-repeat" />;
  }

  if (isAuthenticated) {
    const creativeRole = user?.roles.find((role) => ["Designer", "Videographer", "Content Creator"].includes(role));
    const firstName = user?.name?.trim().split(/\s+/).slice(0, 2).join(" ") || "Creative";
    const cardImage = user?.card_image_url ?? user?.avatar_url;
    const cardIsVideo = Boolean(cardImage && /\.(mp4|webm|ogg)(?:\?.*)?$/i.test(cardImage));
    return (
      <div className={`flex ${creativeRole ? "h-screen overflow-hidden" : "min-h-screen"} flex-col bg-white font-sans text-cu-ink antialiased`}>
        <Navbar hideBrand />
        <main aria-label="Universe landing" className={`min-h-0 flex-1 ${creativeRole ? "grid lg:grid-cols-2" : "flex items-center pb-0 pl-8 pr-8 pt-8"}`}>
          <div className={creativeRole ? "flex min-h-0 flex-col items-start justify-center px-8 py-8 text-left lg:px-16" : "w-full max-w-4xl text-left"}>
            <HeroHeading key={creativeRole ? firstName : "creative-universe"} typing typingDelay={700} onTypingComplete={completeTyping} gradientSuffix={creativeRole ? firstName : undefined} className="w-full !text-left !text-4xl [&_.hero-heading-gradient-suffix]:bg-gradient-to-r [&_.hero-heading-gradient-suffix]:from-[#7c3aed] [&_.hero-heading-gradient-suffix]:via-[#c084fc] [&_.hero-heading-gradient-suffix]:to-[#22d3ee] [&_.hero-heading-gradient-suffix]:bg-clip-text [&_.hero-heading-gradient-suffix]:text-transparent md:!text-5xl lg:!text-6xl" align="left">
              {creativeRole ? `Hello ${firstName}` : "Creative Universe"}
            </HeroHeading>
          </div>
          {creativeRole && <div className="flex min-h-0 h-full w-full items-end justify-center overflow-hidden bg-white">{cardImage ? cardIsVideo ? <video src={cardImage} muted autoPlay loop playsInline className="h-full w-full object-contain object-bottom" /> : <img src={cardImage} alt={`Card ${user?.name ?? "Creative"}`} className="h-full w-full object-contain object-bottom" /> : <span className="text-sm text-cu-muted">Belum ada image card</span>}</div>}
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#16001f] font-sans text-cu-ink antialiased">
      <div ref={backgroundRef} aria-hidden="true" className="absolute inset-0 bg-[url('/images/landing/creative-universe-background.jpg')] bg-cover bg-center bg-no-repeat opacity-0" />
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12 md:gap-10 md:px-16">
        <HeroHeading typing typingDelay={760} onTypingComplete={completeTyping} className="w-full !text-white">This is Where Creative Begins</HeroHeading>
        {isPrimaryActionVisible && <div className="cu-landing-action-enter"><PrimaryActionLink href={APP_ROUTES.login}>Masuk ke Universe</PrimaryActionLink></div>}
      </main>
    </div>
  );
}
