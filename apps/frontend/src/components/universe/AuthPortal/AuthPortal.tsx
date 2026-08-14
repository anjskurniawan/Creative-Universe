"use client";

import NavBar from "@/components/universe/NavBar/NavBar";
import { LandingText } from "@/components/universe/LandingText";
import { ApplicationUniverse } from "@/components/universe/AppUniverse";
import { MediaAgent } from "@/components/universe/MediaAgent";
import { useAuthPortalLogic } from "./AuthPortal.logic";

/**
 * Halaman Landing/Portal untuk user terautentikasi (Authenticated)
 */
export function AuthPortal() {
  const {
    user,
    hasTypingCompleted,
    showMediaAgent,
    completeTyping,
    creativeRole,
    accessibleApplications,
    firstName,
    cardImage,
  } = useAuthPortalLogic();

  return (
    <div className={`flex ${creativeRole ? "h-screen overflow-hidden" : "min-h-screen"} flex-col bg-white font-sans text-cu-ink antialiased`}>
      <NavBar viewport="Desktop" sticky={false} showNavigation={false} bordered={false} className="items-end" />
      <main aria-label="Universe landing" className="min-h-0 flex-1 grid lg:grid-cols-2">
        <LandingText
          creativeRole={creativeRole}
          firstName={firstName}
          onTypingComplete={completeTyping}
        />
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

export default AuthPortal;
