"use client";

import React from "react";
import { MaterialIcon } from "@/components/material-icon";

export type ButtonMenuProps = {
  className?: string;
  icon: string;
  state?: "Hover" | "Focus" | "Disable" | "Default";
};

export default function ButtonMenu({
  className = "",
  icon,
  state = "Default",
}: ButtonMenuProps) {
  const isDisable = state === "Disable";
  const isFocus = state === "Focus";
  const isHover = state === "Hover";

  // State-specific classes for the inner button/menu container
  const stateClasses = isFocus
    ? "bg-slate-100 border border-[rgba(0,0,0,0.3)]"
    : isHover
    ? "bg-slate-100 border border-transparent"
    : "border border-transparent hover:bg-slate-50";

  const opacityClass = isDisable ? "opacity-35" : "opacity-100";

  return (
    <div
      className={`flex items-center justify-center rounded-[8px] size-[32px] shrink-0 transition-all ${stateClasses} ${opacityClass} ${className}`}
      data-node-id={isDisable ? "node-120_599" : isFocus ? "node-120_594" : isHover ? "node-120_579" : "node-120_564"}
    >
      <MaterialIcon
        name={icon}
        size="md"
        className="text-[#222] flex items-center justify-center"
      />
    </div>
  );
}
