"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useAuth } from "@/providers/auth-provider";
import { apiFetch, ValidationError } from "@/lib/api";

const MOBILE_BRAND_TEXT = "Creative Universe";

function MobileAnimatedBrand() {
  const textTargetRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const textTarget = textTargetRef.current;
    const cursor = cursorRef.current;

    if (!textTarget || !cursor) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      textTarget.textContent = MOBILE_BRAND_TEXT;
      cursor.style.opacity = "0";
      return;
    }

    const splitCharacters = (text: string) => {
      if ("Segmenter" in Intl) {
        const segmenter = new Intl.Segmenter("id", {
          granularity: "grapheme",
        });

        return Array.from(segmenter.segment(text), ({ segment }) => segment);
      }

      return Array.from(text);
    };

    const characters = splitCharacters(MOBILE_BRAND_TEXT);
    const progress = { count: 0 };

    textTarget.textContent = "";
    gsap.set(cursor, { opacity: 1 });

    const blink = gsap.to(cursor, {
      opacity: 0.2,
      duration: 0.55,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    const typewriterTween = gsap.to(progress, {
      count: characters.length,
      duration: 1.5,
      ease: "none",
      onUpdate: () => {
        textTarget.textContent = characters
          .slice(0, Math.round(progress.count))
          .join("");
      },
      onComplete: () => {
        textTarget.textContent = MOBILE_BRAND_TEXT;
      },
    });

    return () => {
      blink.kill();
      typewriterTween.kill();
    };
  }, []);

  return (
    <div className="pointer-events-none absolute left-1/2 top-[21%] z-10 flex w-full -translate-x-1/2 justify-center px-8 md:hidden">
      <h2
        aria-label={MOBILE_BRAND_TEXT}
        className="text-center text-[22px] font-medium leading-[28px] tracking-[-0.03em] text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
      >
        <span ref={textTargetRef}>{MOBILE_BRAND_TEXT}</span>
        <span
          ref={cursorRef}
          aria-hidden="true"
          className="ml-1 inline-block h-5 w-[2px] bg-white align-[-3px] opacity-0"
        />
        <noscript>{MOBILE_BRAND_TEXT}</noscript>
      </h2>
    </div>
  );
}

interface Position {
  id: number;
  name: string;
  division_id: number;
}

interface Division {
  id: number;
  name: string;
  positions: Position[];
}

interface SelectOption {
  value: string;
  label: string;
}

interface OnboardingSelectProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  options: SelectOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
}

function OnboardingSelect({
  id,
  label,
  placeholder,
  value,
  options,
  disabled = false,
  onChange,
}: OnboardingSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative w-full" onBlur={closeDropdown}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="relative h-[60px] w-full rounded-[8px] border border-[#909692] bg-white px-4 pr-12 pt-[18px] text-left text-[16px] font-medium leading-[24px] text-[#232925] outline-none transition-colors duration-200 focus:border-[#0088FF] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span className="block truncate">{selectedOption?.label ?? placeholder}</span>
        <span className="pointer-events-none absolute left-4 top-[11px] text-[13px] font-medium leading-[14px] text-[#909692]">
          {label}
        </span>
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#909692]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {isOpen && !disabled && (
        <div
          role="listbox"
          aria-labelledby={id}
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-[180px] overflow-y-auto rounded-[8px] border border-[#909692] bg-white py-1 shadow-[0_12px_28px_rgba(0,0,0,0.16)]"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`flex h-10 w-full items-center px-4 text-left text-[16px] font-medium leading-[24px] transition-colors duration-150 ${
                option.value === value
                  ? "bg-[#E7F3FF] text-[#0088FF]"
                  : "bg-white text-[#232925] hover:bg-[#F4F6F5]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function OnboardingCard() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState(user?.name || "");
  const [divisionId, setDivisionId] = useState("");
  const [positionId, setPositionId] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [divisions, setDivisions] = useState<Division[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  useEffect(() => {
    // If user is already onboarded, send them to dashboard
    if (user && user.is_onboarded) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await apiFetch<Division[]>("/onboarding/data");
        setDivisions(data);
      } catch (err) {
        console.error("Failed to load divisions", err);
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchData();
  }, []);

  // Compute available positions based on selected division
  const currentDivision = divisions.find((d) => d.id.toString() === divisionId);
  const availablePositions = currentDivision?.positions || [];
  const divisionOptions = divisions.map((division) => ({
    value: division.id.toString(),
    label: division.name,
  }));
  const positionOptions = availablePositions.map((position) => ({
    value: position.id.toString(),
    label: position.name,
  }));

  // Removed useEffect for positionId reset. Reset will happen in onChange.

  const isNameFilled = name.trim() !== "";
  const isDivisionFilled = divisionId !== "";
  const isPositionFilled = positionId !== "";
  const isWhatsappFilled = whatsapp.trim() !== "";

  const canProceed = () => {
    if (step === 1) return isNameFilled;
    if (step === 2) return isDivisionFilled;
    if (step === 3) return isPositionFilled;
    if (step === 4) return isWhatsappFilled;
    return false;
  };

  const handleNext = () => {
    if (!canProceed()) return;
    setError(null);
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep((s) => Math.max(1, s - 1));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    if (step < 4) {
      handleNext();
      return;
    }

    if (!canProceed() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await apiFetch("/onboarding/submit", {
        method: "POST",
        body: JSON.stringify({
          name,
          division_id: parseInt(divisionId),
          position_id: parseInt(positionId),
          whatsapp_number: whatsapp,
        }),
      });

      // Refresh user context so it has is_onboarded = true
      await refreshUser();
      
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        // Just show first error
        const firstError = Object.values(err.errors)[0]?.[0];
        setError(firstError || "Terjadi kesalahan validasi.");
      } else {
        setError(err instanceof Error && err.message ? err.message : "Gagal menyimpan data.");
      }
      setIsSubmitting(false);
    }
  }

  if (isLoadingData) {
    return (
      <div className="relative z-10 flex min-h-[368px] w-full items-center justify-center rounded-t-[32px] bg-white px-8 pb-14 pt-8 shadow-2xl md:max-w-[430px] md:rounded-[28px] md:px-9 md:py-10">
        <svg
          className="h-8 w-8 animate-spin text-[#0088FF]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2Z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full rounded-t-[32px] bg-white px-8 pb-14 pt-8 shadow-2xl md:max-w-[430px] md:rounded-[28px] md:px-9 md:py-10">
      <div className="mb-[25px] flex items-start justify-between gap-3 md:mb-[14px]">
        <h1 className="text-[32px] font-medium leading-[40px] tracking-[-0.03em] text-black">
          Lengkapi Profil
        </h1>

        {step > 1 && (
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className="mt-[4px] flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E0E3E1] bg-white text-[#232925] transition-colors duration-200 hover:bg-[#F4F6F5] active:bg-[#ECEFED] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Kembali"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
      </div>

      {error && (
        <div
          className="mb-3 flex w-full rounded-[8px] bg-[rgba(255,56,60,0.14)] px-3 py-[10px]"
          role="alert"
        >
          <p className="m-0 text-[13px] font-normal leading-[18px] text-[#FF383C]">{error}</p>
        </div>
      )}

      <form className="flex flex-col gap-[13px]" onSubmit={handleSubmit}>
        
        {/* Step 1: Nama Lengkap */}
        <div className={`relative w-full ${step === 1 ? "block" : "hidden"}`}>
          <div className="relative h-[60px] w-full">
            <input
              id="name"
              name="name"
              type="text"
              placeholder=" "
              disabled={isSubmitting}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              className="peer h-full w-full rounded-[8px] border border-[#909692] bg-white px-4 pt-[18px] text-[16px] font-medium leading-[24px] text-[#232925] outline-none transition-colors duration-200 placeholder-transparent disabled:cursor-not-allowed disabled:opacity-70 focus:border-[#0088FF]"
            />
            <label
              htmlFor="name"
              className="pointer-events-none absolute left-4 top-[11px] translate-y-0 text-[13px] font-medium leading-[14px] text-[#909692] transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[16px] peer-placeholder-shown:leading-[24px] peer-focus:top-[11px] peer-focus:translate-y-0 peer-focus:text-[13px] peer-focus:leading-[14px]"
            >
              Nama Lengkap
            </label>
          </div>
        </div>

        {/* Step 2: Divisi */}
        <div className={`relative w-full ${step === 2 ? "block" : "hidden"}`}>
          <OnboardingSelect
            id="division"
            label="Divisi"
            placeholder="Pilih Divisi..."
            value={divisionId}
            options={divisionOptions}
            disabled={isSubmitting}
            onChange={(value) => {
              setDivisionId(value);
              setPositionId("");
              setError(null);
            }}
          />
        </div>

        {/* Step 3: Jabatan */}
        <div className={`relative w-full ${step === 3 ? "block" : "hidden"}`}>
          <OnboardingSelect
            id="position"
            label="Jabatan"
            placeholder="Pilih Jabatan..."
            value={positionId}
            options={positionOptions}
            disabled={isSubmitting || !divisionId}
            onChange={(value) => {
              setPositionId(value);
              setError(null);
            }}
          />
        </div>

        {/* Step 4: No Whatsapp */}
        <div className={`relative w-full ${step === 4 ? "block" : "hidden"}`}>
          <div className="relative flex h-[60px] w-full overflow-hidden rounded-[8px] border border-[#909692] bg-white transition-colors duration-200 focus-within:border-[#0088FF]">
            <div className="flex h-full w-[74px] shrink-0 items-center justify-center border-r border-[#D7DDDA] bg-white text-[16px] font-medium leading-[24px] text-[#232925]">
              +62
            </div>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              placeholder=" "
              disabled={isSubmitting}
              value={whatsapp}
              onChange={(e) => {
                setWhatsapp(e.target.value);
                setError(null);
              }}
              className="peer h-full min-w-0 flex-1 bg-white px-4 pt-[18px] text-[16px] font-medium leading-[24px] text-[#232925] outline-none placeholder-transparent disabled:cursor-not-allowed disabled:opacity-70"
            />
            <label
              htmlFor="whatsapp"
              className="pointer-events-none absolute left-[90px] top-[11px] translate-y-0 text-[13px] font-medium leading-[14px] text-[#909692] transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[16px] peer-placeholder-shown:leading-[24px] peer-focus:top-[11px] peer-focus:translate-y-0 peer-focus:text-[13px] peer-focus:leading-[14px]"
            >
              No Whatsapp
            </label>
          </div>
        </div>

        <div className="pt-[12px] md:pt-[18px]">
          <button
            type="submit"
            disabled={!canProceed() || isSubmitting}
            className={`flex h-[44px] w-full items-center justify-center rounded-full px-2 text-[16px] font-medium leading-[24px] text-white transition-colors duration-200 ${
              canProceed() && !isSubmitting
                ? "cursor-pointer bg-[#0088FF] hover:bg-[#0077E6] active:bg-[#006BD1]"
                : isSubmitting
                  ? "cursor-not-allowed bg-[#0088FF]"
                  : "cursor-not-allowed bg-[#C6C6C8]"
            }`}
          >
            {isSubmitting ? (
              <svg
                className="h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2Z" />
              </svg>
            ) : (
              <span>{step < 4 ? "Selanjutnya" : "Simpan Profil"}</span>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 flex justify-center gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 w-6 rounded-full transition-colors ${
              i <= step ? "bg-[#0088FF]" : "bg-[#E0E3E1]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-[url('https://i.pinimg.com/1200x/2a/68/ff/2a68ffb5bc0ea3d310d7ad3708f6282e.jpg')] bg-cover bg-center bg-no-repeat font-sans text-[#232925]">
      <div className="relative flex min-h-screen w-full items-end justify-center px-0 pt-10 md:items-center md:px-5 md:py-10">
        <div className="absolute inset-0 bg-black/25" />

        <MobileAnimatedBrand />

        <Suspense
          fallback={
            <div className="relative z-10 min-h-[368px] w-full rounded-t-[32px] bg-white px-8 pb-14 pt-8 shadow-2xl md:max-w-[430px] md:rounded-[28px] md:px-9 md:py-10" />
          }
        >
          <OnboardingCard />
        </Suspense>

        <div className="pointer-events-none absolute bottom-[clamp(20px,4vh,32px)] left-1/2 z-10 hidden w-full -translate-x-1/2 flex-col items-center md:flex">
          <div className="mb-[clamp(12px,2.4vh,24px)] flex items-center justify-center gap-[clamp(16px,3vw,28px)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://doran.id/wp-content/uploads/2023/03/Logo-PT-Doran-Sukses-Indonesia-white-1400x364-1.png"
              alt="Doran Sukses Indonesia Logo"
              className="h-[clamp(28px,4.8vh,44px)] w-auto max-w-[34vw] brightness-0 invert opacity-80"
            />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://jete.id/wp-content/uploads/2023/04/jete-indonesia-logo.png"
              alt="JETE Logo"
              className="h-[clamp(30px,5vh,46px)] w-auto max-w-[26vw] brightness-0 invert opacity-80"
            />
          </div>

          <p className="text-center text-[clamp(11px,1.5vh,14px)] leading-[1.3] text-white">
            Creative Universe | 2026
          </p>
        </div>
      </div>
    </main>
  );
}
