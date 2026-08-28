import { TypingText } from "@/features/auth/components/Portal/Guest/TypingText";
import { useLandingTextLogic } from "./LandingText.logic";
import type { LandingTextProps } from "./LandingText.types";

export type { LandingTextProps } from "./LandingText.types";

/**
 * Komponen Wrapper Kolom Kiri untuk Sapaan / Judul Portal Landing Page
 */
export function LandingText({ creativeRole, firstName, onTypingComplete }: LandingTextProps) {
  const { isWelcomeVisible, isSubtitleVisible, greeting, weather, handleTypingComplete } = useLandingTextLogic({
    creativeRole,
    onTypingComplete,
  });

  return (
    <div
      className={
        creativeRole
          ? "cu-style flex min-h-0 flex-col items-start justify-center px-8 py-8 text-left lg:px-16"
          : "cu-style flex min-h-[42vh] flex-col items-start justify-center bg-white px-8 py-12 text-left sm:px-12 lg:min-h-0 lg:px-16 xl:px-24"
      }
    >
      {!creativeRole && (
        <div className="flex w-full flex-col gap-2 lg:hidden">
          <p
            className={`text-xl font-medium tracking-[-0.02em] text-cu-ink transition-all duration-500 ease-out ${isWelcomeVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
          >
            Hi, {" "}
            <span className="landing-name-gradient bg-gradient-to-r from-[var(--color-cu-gradient-start)] via-[var(--color-cu-gradient-middle)] to-[var(--color-cu-gradient-end)] bg-clip-text text-transparent">
              {firstName}
            </span>
          </p>
          <TypingText
            typing
            typingDelay={700}
            className="!text-4xl"
            align="left"
          >
            {greeting}
          </TypingText>
        </div>
      )}
      <div className={creativeRole ? "contents" : "hidden lg:block"}>
        <TypingText
          key={creativeRole ? `${greeting}-${firstName}` : "creative-universe"}
          typing
          typingDelay={700}
          onTypingComplete={handleTypingComplete}
          gradientSuffix={creativeRole ? firstName : undefined}
          className="w-full whitespace-pre-line !text-left !text-6xl [&_.hero-heading-gradient-suffix]:bg-gradient-to-r [&_.hero-heading-gradient-suffix]:from-[#7c3aed] [&_.hero-heading-gradient-suffix]:via-[#c084fc] [&_.hero-heading-gradient-suffix]:to-[#22d3ee] [&_.hero-heading-gradient-suffix]:bg-clip-text [&_.hero-heading-gradient-suffix]:text-transparent md:!text-7xl lg:!text-8xl"
          align="left"
        >
          {creativeRole ? `${greeting}\n${firstName}` : "Creative Universe"}
        </TypingText>
      </div>
      <div className="mt-5 flex items-center gap-4 text-sm text-cu-muted lg:hidden" aria-label="Informasi cuaca">
        {weather ? (
          <>
            <span className="min-w-max">{weather.label || "Weather"}</span>
            <span className="h-4 w-px bg-cu-line" aria-hidden="true" />
            <span>{Math.round(weather.temperature)}°C</span>
            <span className="h-4 w-px bg-cu-line" aria-hidden="true" />
            <span>UV {weather.uvIndex.toFixed(1)}</span>
          </>
        ) : (
          <span>Memuat cuaca...</span>
        )}
      </div>
      {!creativeRole && (
        <p className={`mt-4 hidden max-w-xl text-sm leading-relaxed text-[#6b7280] transition-opacity duration-500 lg:block ${isSubtitleVisible ? "opacity-100" : "opacity-0"}`}>
          Satu ekosistem untuk semua kebutuhan kreatif. Kelola tugas, pantau performance tim, serta terintegrasi dengan Creative AI untuk decision making.
        </p>
      )}
    </div>
  );
}

export default LandingText;
