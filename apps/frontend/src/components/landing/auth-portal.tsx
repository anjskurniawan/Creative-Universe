"use client";

import { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/layout/navbar";
import { useAuth } from "@/providers/auth-provider";
import { visibleSubApplications } from "@/core/applications";
import { LandingText } from "@/components/landing/landing-text";
import { ApplicationUniverse } from "@/components/landing/application-universe";
import { MediaAgent } from "@/components/landing/media-agent";

/**
 * Halaman Landing/Portal untuk user terautentikasi (Authenticated)
 */
export function AuthPortal() {
  const { user } = useAuth();
  const [hasTypingCompleted, setHasTypingCompleted] = useState(false);
  const [showMediaAgent, setShowMediaAgent] = useState(true);

  // Callback untuk menandai selesainya animasi pengetikan judul
  const completeTyping = useCallback(() => setHasTypingCompleted(true), []);

  const creativeRole = user?.roles.find((role) => ["Designer", "Videographer", "Content Creator"].includes(role));
  const accessibleApplications = visibleSubApplications(user?.applications ?? []);
  const firstName = user?.name?.trim().split(/\s+/).slice(0, 2).join(" ") || "Creative";
  const cardImage = user?.card_image_url ?? user?.avatar_url;

  useEffect(() => {
    if (!creativeRole) {
      return;
    }

    const interval = window.setInterval(() => {
      setShowMediaAgent((current) => !current);
    }, 10000);

    return () => window.clearInterval(interval);
  }, [creativeRole]);

  return (
    <div className={`flex ${creativeRole ? "h-screen overflow-hidden" : "min-h-screen"} flex-col bg-white font-sans text-cu-ink antialiased`}>
      <Navbar viewport="Desktop" sticky={false} showNavigation={false} bordered={false} className="items-end" />
      {/* Konten Utama Terbagi Menjadi 2 Kolom (50% / 50%) pada Layar Lebar (lg) */}
      <main aria-label="Universe landing" className="min-h-0 flex-1 grid lg:grid-cols-2">
        {/* Kolom Kiri: Sapaan dan Judul Utama */}
        <LandingText
          creativeRole={creativeRole}
          firstName={firstName}
          onTypingComplete={completeTyping}
        />
        {/* Kolom Kanan: Media Card untuk Creative Role ATAU Orbit Aplikasi untuk Non-Creative */}
        {creativeRole ? (
          <div className="relative min-h-0 h-full w-full overflow-hidden">
            <div className={`absolute inset-0 transition-opacity duration-[3000ms] ease-in-out ${showMediaAgent ? "opacity-100" : "pointer-events-none opacity-0"}`}>
              <MediaAgent src={cardImage} alt={`Card ${user?.name ?? "Creative"}`} />
            </div>
            <div className={`absolute inset-0 transition-opacity duration-[3000ms] ease-in-out ${showMediaAgent ? "pointer-events-none opacity-0" : "opacity-100"}`}>
              <ApplicationUniverse
                applications={accessibleApplications}
                isReady={hasTypingCompleted}
                className="h-full min-h-0"
                isExiting={showMediaAgent}
              />
            </div>
          </div>
        ) : (
          <ApplicationUniverse applications={accessibleApplications} isReady={hasTypingCompleted} />
        )}
      </main>
    </div>
  );
}
