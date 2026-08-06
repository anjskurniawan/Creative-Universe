"use client";

import React, { useState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { OnboardingForm } from "./onboarding-form";

/**
 * Komponen Kartu Onboarding Utama (OnboardingCard)
 * Sinkronisasi step onboarding dengan teks footer AuthCard.
 */
export function OnboardingCard() {
  const [step, setStep] = useState(1);
  const [backHandler, setBackHandler] = useState<(() => void) | null>(null);

  const getFooterText = (currentStep: number) => {
    if (currentStep <= 3 || currentStep === 8) {
      return "Butuh bantuan? Buka Help Center";
    }
    return "Bantu kami mengenali kamu";
  };

  return (
    <AuthCard
      title="Onboarding"
      footerText={getFooterText(step)}
      showCloseButton={false}
      headerButtonIcon="arrow_back"
      headerButtonAriaLabel="Kembali ke step sebelumnya"
      onHeaderButtonClick={backHandler || undefined}
    >
      <OnboardingForm
        onStepChange={setStep}
        onBackHandlerChange={(handler) => setBackHandler(() => handler)}
      />
    </AuthCard>
  );
}
