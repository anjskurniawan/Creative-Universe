"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { ValidationError } from "@/core/api/client";
import { authApi, type OnboardingDivision, type OnboardingInput } from "@/core/auth";
import { APP_ROUTES } from "@/core/navigation/routes";
import { Toast } from "@/components/ui/toast";

// Import modular step components
import { StepSplash } from "./steps/step-splash";
import { StepWelcome } from "./steps/step-welcome";
import { StepPreparing } from "./steps/step-preparing";
import { StepFullName } from "./steps/step-fullname";
import { StepDivision } from "./steps/step-division";
import { StepPosition } from "./steps/step-position";
import { StepWhatsapp } from "./steps/step-whatsapp";
import { StepReady } from "./steps/step-ready";

export interface OnboardingFormProps {
  onStepChange: (step: number) => void;
  onBackHandlerChange: (handler: (() => void) | null) => void;
}

export function OnboardingForm({ onStepChange, onBackHandlerChange }: OnboardingFormProps) {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [transitionState, setTransitionState] = useState<"entering" | "normal" | "exiting">("normal");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [positionId, setPositionId] = useState("");
  const [positionName, setPositionName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [divisions, setDivisions] = useState<OnboardingDivision[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (user && user.is_onboarded) {
      router.replace(APP_ROUTES.home);
    }
  }, [user, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await authApi.onboarding.data();
        setDivisions(data);
      } catch (err) {
        console.error("Failed to load divisions", err);
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchData();
  }, []);

  const changeStep = (nextStep: number) => {
    setTransitionState("exiting");
    setTimeout(() => {
      setError(null);
      setStep(nextStep);
      onStepChange(nextStep);
      setTransitionState("entering");
      setTimeout(() => {
        setTransitionState("normal");
      }, 50);
    }, 400);
  };

  useEffect(() => {
    if (step < 5 || step >= 8) {
      onBackHandlerChange(null);
      return;
    }

    onBackHandlerChange(() => changeStep(step - 1));
  }, [step]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 1) {
      timer = setTimeout(() => changeStep(2), 2800);
    } else if (step === 2) {
      timer = setTimeout(() => changeStep(3), 2500);
    } else if (step === 3) {
      timer = setTimeout(() => changeStep(4), 3000);
    }
    return () => clearTimeout(timer);
  }, [step]);

  const currentDivision = divisions.find((d) => d.id.toString() === divisionId);
  const isCreativeDivision = currentDivision?.name === "Creative";
  const availablePositions = isCreativeDivision ? currentDivision?.positions || [] : [];

  async function handleSubmit() {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: OnboardingInput = {
        name: fullName,
        division_id: parseInt(divisionId),
        whatsapp_number: `62${whatsapp.replace(/[^0-9]/g, "")}`,
      };

      if (isCreativeDivision) {
        payload.position_id = parseInt(positionId);
      } else {
        payload.position_name = positionName.trim();
      }

      await authApi.onboarding.submit(payload);

      await refreshUser();
      changeStep(8);
      
      setTimeout(() => {
        router.push(APP_ROUTES.home);
      }, 2500);
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        const firstError = Object.values(err.errors)[0]?.[0];
        setError(firstError || "Terjadi kesalahan validasi.");
      } else {
        setError(err instanceof Error && err.message ? err.message : "Gagal menyimpan data.");
      }
      setIsSubmitting(false);
    }
  }

  const transitionClass = 
    transitionState === "exiting" 
      ? "opacity-0 translate-y-[-10px] scale-[0.98] transition-all duration-300 ease-in-out" 
      : transitionState === "entering"
      ? "opacity-0 translate-y-[10px] scale-[0.98]"
      : "opacity-100 translate-y-0 scale-100 transition-all duration-300 ease-out";

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-11 w-full relative">
      {error && <Toast message={error} onClose={() => setError(null)} />}

      <div className={`w-full h-full flex flex-col items-center justify-center ${transitionClass}`}>
        {step === 1 && <StepSplash />}
        {step === 2 && <StepWelcome />}
        {step === 3 && <StepPreparing />}
        
        {step === 4 && (
          <StepFullName
            value={fullName}
            onChange={setFullName}
            onNext={() => fullName && changeStep(5)}
          />
        )}

        {step === 5 && (
          <StepDivision
            divisions={divisions}
            isLoadingData={isLoadingData}
            divisionId={divisionId}
            onSelectDivision={(id) => {
              setDivisionId(id);
              setPositionId("");
              setPositionName("");
            }}
            onNext={() => divisionId && changeStep(6)}
          />
        )}

        {step === 6 && (
          <StepPosition
            isCreativeDivision={isCreativeDivision}
            availablePositions={availablePositions}
            positionId={positionId}
            onSelectPositionId={setPositionId}
            positionName={positionName}
            onChangePositionName={setPositionName}
            onNext={() => (isCreativeDivision ? positionId : positionName) && changeStep(7)}
          />
        )}

        {step === 7 && (
          <StepWhatsapp
            value={whatsapp}
            onChange={setWhatsapp}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 8 && <StepReady />}
      </div>
    </div>
  );
}
