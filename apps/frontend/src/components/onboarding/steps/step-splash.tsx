"use client";

import React from "react";
import { Logo } from "@/components/ui/logo";

export function StepSplash() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center size-[128px] animate-logo-fade-in">
        <Logo size={120} />
      </div>
    </div>
  );
}
