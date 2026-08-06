"use client";
import { MaterialIcon } from "@/components/ui/material-icon";
export type ButtonMenuProps = { className?: string; icon: string; state?: "Hover" | "Focus" | "Disable" | "Default"; dark?: boolean };
export default function ButtonMenu({ className = "", icon, state = "Default", dark = false }: ButtonMenuProps) {
  const disabled = state === "Disable";
  const stateClasses =
    state === "Focus"
      ? dark
        ? "bg-orange-500/10 border border-orange-500/30"
        : "bg-slate-100 border border-[rgba(0,0,0,0.3)]"
      : state === "Hover"
        ? dark
          ? "bg-orange-500/10 border border-transparent"
          : "bg-slate-100 border border-transparent"
        : dark
          ? "border border-transparent hover:bg-orange-500/10"
          : "border border-transparent hover:bg-slate-50";
  return (
    <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-all ${stateClasses} ${disabled ? "opacity-35" : "opacity-100"} ${className}`}>
      <MaterialIcon name={icon} size="md" className={`flex items-center justify-center ${dark ? "text-orange-500" : "text-[#222]"}`} />
    </div>
  );
}
