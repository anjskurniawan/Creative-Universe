"use client";
import { MaterialIcon } from "@/components/material-icon";
export type ButtonMenuProps = { className?: string; icon: string; state?: "Hover" | "Focus" | "Disable" | "Default" };
export default function ButtonMenu({ className = "", icon, state = "Default" }: ButtonMenuProps) {
  const disabled = state === "Disable";
  const stateClasses = state === "Focus" ? "bg-slate-100 border border-[rgba(0,0,0,0.3)]" : state === "Hover" ? "bg-slate-100 border border-transparent" : "border border-transparent hover:bg-slate-50";
  return <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-all ${stateClasses} ${disabled ? "opacity-35" : "opacity-100"} ${className}`}><MaterialIcon name={icon} size="md" className="flex items-center justify-center text-[#222]" /></div>;
}
