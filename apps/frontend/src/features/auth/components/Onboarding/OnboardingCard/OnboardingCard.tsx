"use client";

import React, { useCallback, useState } from "react";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { OnboardingForm } from "../OnboardingForm/OnboardingForm";
import { DEFAULT_ONBOARDING_CONFIG } from "../Onboarding.config";
import type { OnboardingCardProps } from "../Onboarding.types";

export type { OnboardingCardProps } from "../Onboarding.types";

/**
 * Komponen Kartu Onboarding Utama (OnboardingCard)
 * Sinkronisasi step onboarding dengan teks footer AuthCard.
 */
export function OnboardingCard({ className = "" }: OnboardingCardProps) {
  const [step, setStep] = useState<number>(DEFAULT_ONBOARDING_CONFIG.initialStep);
  const [backHandler, setBackHandler] = useState<(() => void) | null>(null);
  const handleStepChange = useCallback((nextStep: number) => setStep(nextStep), []);
  const handleBackHandlerChange = useCallback((handler: (() => void) | null) => {
    setBackHandler(() => handler);
  }, []);

  const getFooterText = (currentStep: number) => {
    if (currentStep <= 3 || currentStep === DEFAULT_ONBOARDING_CONFIG.totalSteps) {
      return DEFAULT_ONBOARDING_CONFIG.footerHelpText;
    }
    return DEFAULT_ONBOARDING_CONFIG.footerPersonalText;
  };

  return (
    <AuthCard
      title="Onboarding"
      footerText={getFooterText(step)}
      showCloseButton={false}
      headerButtonIcon="arrow_back"
      headerButtonAriaLabel="Kembali ke step sebelumnya"
      onHeaderButtonClick={backHandler || undefined}
      className={className}
    >
      <OnboardingForm
        onStepChange={handleStepChange}
        onBackHandlerChange={handleBackHandlerChange}
      />
    </AuthCard>
  );
}

export default OnboardingCard;
