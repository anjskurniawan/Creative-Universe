"use client";

import React from "react";
import NavBar from "@/components/layout/NavBar/NavBar";
import { LandingText } from "@/features/auth/components/LandingText";
import { ApplicationUniverse } from "@/features/auth/components/AppUniverse";
import { MediaAgent } from "@/features/auth/components/MediaAgent";
import { useAuthLogic } from "./Auth.logic";
import type { AuthProps } from "./Auth.types";

export type { AuthProps } from "./Auth.types";

/**
 * Halaman Landing/Portal untuk user terautentikasi (Authenticated Portal)
 */
export function Auth({ className = "" }: AuthProps) {
  const {
    user,
    hasTypingCompleted,
    showMediaAgent,
    completeTyping,
    creativeRole,
    accessibleApplications,
    firstName,
    cardImage,
  } = useAuthLogic();

  return (
    <div
      className={`flex ${
        creativeRole ? "h-screen overflow-hidden" : "min-h-screen"
      } flex-col bg-white font-sans text-cu-ink antialiased ${className}`.trim()}
    >
      <NavBar
        viewport="Desktop"
        sticky={false}
        showNavigation={false}
        showApps={false}
        bordered={false}
        className="items-end"
      />
      <main aria-label="Universe landing" className="min-h-0 flex-1 grid lg:grid-cols-2">
        <LandingText
          creativeRole={creativeRole}
          firstName={firstName}
          onTypingComplete={completeTyping}
        />
        {creativeRole ? (
          <div className="relative min-h-0 h-full w-full overflow-hidden">
            <div
              className={`absolute inset-0 transition-opacity duration-[3000ms] ease-in-out ${
                showMediaAgent ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <MediaAgent src={cardImage} alt={`Card ${user?.name ?? "Creative"}`} />
            </div>
            <div
              className={`absolute inset-0 transition-opacity duration-[3000ms] ease-in-out ${
                showMediaAgent ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
            >
              <ApplicationUniverse
                applications={accessibleApplications}
                isReady={hasTypingCompleted}
                className="h-full min-h-0"
                isExiting={showMediaAgent}
              />
            </div>
          </div>
        ) : (
          <ApplicationUniverse
            applications={accessibleApplications}
            isReady={hasTypingCompleted}
          />
        )}
      </main>
    </div>
  );
}

// Backward-compatible alias
export const AuthPortal = Auth;

export default Auth;
