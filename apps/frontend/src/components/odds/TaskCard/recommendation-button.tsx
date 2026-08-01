"use client";

import { MaterialIcon } from "@/components/ui/material-icon";

type RecommendationButtonProps = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

export function RecommendationButton({ label, onClick, disabled = false }: RecommendationButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-[26px] w-full items-center justify-between gap-2 rounded-lg border border-white/70 bg-white px-2 py-0 text-xs font-bold leading-none text-[#005c94] shadow-sm transition hover:border-white hover:bg-transparent hover:text-white hover:shadow-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-white/70 disabled:hover:bg-white disabled:hover:text-[#005c94] disabled:hover:shadow-sm"
    >
      {label}
      <MaterialIcon name="arrow_forward" size="xs" className="animate-pulse" />
    </button>
  );
}
