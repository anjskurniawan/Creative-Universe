"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

type ToolbarButtonProps = {
  icon: string;
  label?: string;
  active?: boolean;
  onClick?: () => void;
};

export function ToolbarButton({ icon, label = "Toolbar action", active, onClick }: ToolbarButtonProps) {
  const [internalActive, setInternalActive] = useState(false);
  const isActive = active ?? internalActive;

  return (
    <button
      type="button"
      aria-pressed={isActive}
      aria-label={label}
      title={label}
      onClick={onClick ?? (() => setInternalActive((current) => !current))}
      className={`flex size-8 cursor-pointer items-center justify-center rounded-md border text-slate-500 transition active:bg-slate-100 ${
        isActive
          ? "border-transparent bg-brand/10 shadow-inner hover:bg-brand/10"
          : "border-transparent hover:bg-slate-200"
      }`}
    >
      <MaterialIcon name={icon} size="auto" weight={300} filled={false} className="text-[12px]" />
    </button>
  );
}
