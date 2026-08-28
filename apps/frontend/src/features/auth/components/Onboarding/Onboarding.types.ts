export interface OnboardingFormProps {
  onStepChange: (step: number) => void;
  onBackHandlerChange: (handler: (() => void) | null) => void;
  className?: string;
}

export interface OnboardingCardProps {
  className?: string;
}
