"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import { ValidationError } from "@/core/api/client";
import { authApi, type OnboardingDivision, type OnboardingInput } from "@/core/auth";
import { APP_ROUTES } from "@/core/navigation/routes";
import { DEFAULT_ONBOARDING_CONFIG } from "./Onboarding.config";

export function useOnboardingLogic({
  onStepChange,
  onBackHandlerChange,
}: {
  onStepChange: (step: number) => void;
  onBackHandlerChange: (handler: (() => void) | null) => void;
}) {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<number>(DEFAULT_ONBOARDING_CONFIG.initialStep);
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

  const goToStep = (nextStep: number) => {
    setTransitionState("exiting");
    setTimeout(() => {
      setStep(nextStep);
      onStepChange(nextStep);
      setTransitionState("entering");
      setTimeout(() => setTransitionState("normal"), 50);
    }, 150);
  };

  const handleNext = () => {
    if (step < DEFAULT_ONBOARDING_CONFIG.totalSteps) {
      goToStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      goToStep(step - 1);
    }
  };

  useEffect(() => {
    if (step > 1 && step < DEFAULT_ONBOARDING_CONFIG.totalSteps) {
      onBackHandlerChange(handleBack);
    } else {
      onBackHandlerChange(null);
    }
  }, [step, onBackHandlerChange]);

  useEffect(() => {
    if (step < 1 || step > 3) return;
    const timer = window.setTimeout(() => {
      setTransitionState("exiting");
      window.setTimeout(() => {
        setStep((current) => current + 1);
        onStepChange(step + 1);
        setTransitionState("entering");
        window.setTimeout(() => setTransitionState("normal"), 50);
      }, 150);
    }, step === 1 ? 1800 : 2200);
    return () => window.clearTimeout(timer);
  }, [step, onStepChange]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    const whatsappDigits = whatsapp.replace(/\D/g, "").replace(/^0+/, "");
    const payload: OnboardingInput = {
      name: fullName.trim(),
      division_id: Number(divisionId),
      whatsapp_number: whatsappDigits ? `62${whatsappDigits}` : "",
    };

    if (positionId) {
      payload.position_id = Number(positionId);
    } else if (positionName.trim()) {
      payload.position_name = positionName.trim();
    }

    try {
      await authApi.onboarding.submit(payload);
      await refreshUser();
      goToStep(8);
    } catch (err) {
      if (err instanceof ValidationError) {
        const firstErr = Object.values(err.errors)[0]?.[0];
        setError(firstErr || "Terjadi kesalahan validasi.");
      } else {
        setError((err as Error).message || "Gagal menyimpan data onboarding.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    step,
    transitionState,
    isSubmitting,
    error,
    setError,
    fullName,
    setFullName,
    divisionId,
    setDivisionId,
    positionId,
    setPositionId,
    positionName,
    setPositionName,
    whatsapp,
    setWhatsapp,
    divisions,
    isLoadingData,
    goToStep,
    handleNext,
    handleBack,
    handleSubmit,
  };
}
