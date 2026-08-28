"use client";

import React from "react";
import { Logo } from "@/components/ui/Logo/Logo";

export function StepSplash() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
      <div className="flex items-center justify-center size-[128px] animate-logo-fade-in">
        <Logo size={120} />
      </div>
    </div>
  );
}
