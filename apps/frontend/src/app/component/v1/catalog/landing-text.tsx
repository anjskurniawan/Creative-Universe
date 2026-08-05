"use client";

import { useCallback, useEffect, useState } from "react";
import { HeroHeading } from "@/components/typography/hero-heading";

interface LandingTextProps {
  creativeRole: string | undefined;
  firstName: string;
  onTypingComplete: () => void;
}

/**
 * Komponen Wrapper Kolom Kiri untuk Sapaan / Judul Portal Landing Page
 */
export function LandingText({ creativeRole, firstName, onTypingComplete }: LandingTextProps) {
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(false);
  const [isSubtitleVisible, setIsSubtitleVisible] = useState(Boolean(creativeRole));

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsWelcomeVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleTypingComplete = useCallback(() => {
    setIsSubtitleVisible(true);
    onTypingComplete();
  }, [onTypingComplete]);

  return (
    <div
      className={
        creativeRole
          ? "flex min-h-0 flex-col items-start justify-center px-8 py-8 text-left lg:px-16"
          : "flex min-h-[42vh] flex-col items-start justify-center bg-white px-8 py-12 text-left sm:px-12 lg:min-h-0 lg:px-16 xl:px-24"
      }
    >
      {!creativeRole && (
        <p className={`mb-2 text-xl font-medium text-[#4b5563] transition-all duration-500 ease-out ${isWelcomeVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
          Selamat datang di
        </p>
      )}
      <HeroHeading
        key={creativeRole ? firstName : "creative-universe"}
        typing
        typingDelay={700}
        onTypingComplete={handleTypingComplete}
        gradientSuffix={creativeRole ? firstName : undefined}
        className="w-full !text-left !text-5xl [&_.hero-heading-gradient-suffix]:bg-gradient-to-r [&_.hero-heading-gradient-suffix]:from-[#7c3aed] [&_.hero-heading-gradient-suffix]:via-[#c084fc] [&_.hero-heading-gradient-suffix]:to-[#22d3ee] [&_.hero-heading-gradient-suffix]:bg-clip-text [&_.hero-heading-gradient-suffix]:text-transparent md:!text-6xl lg:!text-7xl"
        align="left"
      >
        {creativeRole ? `Hello ${firstName}` : "Creative Universe"}
      </HeroHeading>
      {!creativeRole && (
        <p className={`mt-4 max-w-xl text-sm leading-relaxed text-[#6b7280] transition-opacity duration-500 ${isSubtitleVisible ? "opacity-100" : "opacity-0"}`}>
          Satu ekosistem untuk semua kebutuhan kreatif. Kelola tugas, pantau performance tim, serta terintegrasi dengan Creative AI untuk decision making.
        </p>
      )}
    </div>
  );
}
