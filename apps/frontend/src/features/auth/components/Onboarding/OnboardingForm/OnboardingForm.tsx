"use client";

import React from "react";
import { Toast } from "@/components/feedback/Toast/Toast";
import { StepSplash } from "../steps/StepSplash/StepSplash";
import { StepWelcome } from "../steps/StepWelcome/StepWelcome";
import { StepPreparing } from "../steps/StepPreparing/StepPreparing";
import { StepFullName } from "../steps/StepFullName/StepFullName";
import { StepDivision } from "../steps/StepDivision/StepDivision";
import { StepPosition } from "../steps/StepPosition/StepPosition";
import { StepWhatsapp } from "../steps/StepWhatsapp/StepWhatsapp";
import { StepReady } from "../steps/StepReady/StepReady";
import { useOnboardingLogic } from "../Onboarding.logic";
import type { OnboardingFormProps } from "../Onboarding.types";

export function OnboardingForm({
  onStepChange,
  onBackHandlerChange,
  className = "",
}: OnboardingFormProps) {
  const {
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
    handleSubmit,
  } = useOnboardingLogic({ onStepChange, onBackHandlerChange });

  // Cari divisi terpilih
  const selectedDivision = divisions.find((d) => d.id.toString() === divisionId);
  const isCreativeDivision = selectedDivision?.name?.toLowerCase().includes("creative") ?? false;
  const availablePositions = selectedDivision?.positions || [];

  return (
    <div className={`cu-style relative flex w-full flex-col min-h-[460px] px-8 py-8 md:px-9 md:py-10 ${className}`.trim()}>
      {error && (
        <Toast
          status="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <div
        className={`flex flex-1 flex-col transition-all duration-150 ease-out ${
          transitionState === "exiting"
            ? "opacity-0 translate-y-1"
            : transitionState === "entering"
            ? "opacity-0 -translate-y-1"
            : "opacity-100 translate-y-0"
        }`}
      >
        {step === 1 && (
          <div onClick={() => goToStep(2)} className="flex min-h-0 flex-1 items-center justify-center cursor-pointer">
            <StepSplash />
          </div>
        )}
        {step === 2 && (
          <div onClick={() => goToStep(3)} className="flex min-h-0 flex-1 items-center justify-center cursor-pointer">
            <StepWelcome />
          </div>
        )}
        {step === 3 && (
          <div onClick={() => goToStep(4)} className="flex min-h-0 flex-1 items-center justify-center cursor-pointer">
            <StepPreparing />
          </div>
        )}
        {step === 4 && (
          <StepFullName
            value={fullName}
            onChange={setFullName}
            onNext={handleNext}
          />
        )}
        {step === 5 && (
          <StepDivision
            divisions={divisions}
            isLoadingData={isLoadingData}
            divisionId={divisionId}
            onSelectDivision={(id: string) => {
              setDivisionId(id);
              setPositionId("");
              setPositionName("");
            }}
            onNext={handleNext}
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
            onNext={handleNext}
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

export default OnboardingForm;
