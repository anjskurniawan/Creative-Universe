"use client";

import { useState, type MouseEventHandler } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

type ToolbarButtonProps = {
  icon: string;
  label?: string;
  active?: boolean;
  onClick?: () => void;
  onMouseDown?: MouseEventHandler<HTMLButtonElement>;
};

export function ToolbarButton({ icon, label = "Toolbar action", active, onClick, onMouseDown }: ToolbarButtonProps) {
  const [internalActive, setInternalActive] = useState(false);
  const isActive = active ?? internalActive;

  return (
    <button
      type="button"
      aria-pressed={isActive}
      aria-label={label}
      title={label}
      onMouseDown={onMouseDown}
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
