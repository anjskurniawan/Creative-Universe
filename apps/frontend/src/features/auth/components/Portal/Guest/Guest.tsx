"use client";

import React from "react";
import { ParallaxBackground } from "@/features/auth/components/ParallaxBackground";
import { APP_ROUTES } from "@/core/navigation/routes";
import { TypingText } from "./TypingText";
import { ClickToAction } from "./ClickToAction";
import { DEFAULT_GUEST_PORTAL_CONFIG } from "./Guest.config";
import { useGuestLogic } from "./Guest.logic";
import type { GuestProps } from "./Guest.types";

export type { GuestProps } from "./Guest.types";

/**
 * Halaman Landing/Portal untuk tamu (Guest Portal)
 */
export function Guest({ className = "" }: GuestProps) {
  const { hasTypingCompleted, isPrimaryActionVisible, completeTyping } =
    useGuestLogic();

  return (
    <div
      className={`cu-style relative flex min-h-screen flex-col overflow-hidden bg-[#16001f] font-sans text-cu-ink antialiased ${className}`.trim()}
    >
      {/* Background Image Parallax Zoom */}
      <ParallaxBackground />

      {/* Konten Utama */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12 md:gap-10 md:px-16">
        <TypingText
          typing
          typingDelay={DEFAULT_GUEST_PORTAL_CONFIG.typingDelayMs}
          onTypingComplete={completeTyping}
          className="w-full !text-center !text-white [&_.absolute]:!text-center [&_.relative]:!text-center"
        >
          {DEFAULT_GUEST_PORTAL_CONFIG.headingText}
        </TypingText>
        {isPrimaryActionVisible && (
          <div className="cu-landing-action-enter">
            <ClickToAction href={APP_ROUTES.login}>Masuk ke Universe</ClickToAction>
          </div>
        )}
      </main>
    </div>
  );
}

// Backward-compatible alias
export const GuestPortal = Guest;

export default Guest;
