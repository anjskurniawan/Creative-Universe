"use client";

import React from "react";
import { Logo } from "@/components/ui/logo";
import { PreviewWrapper } from "../preview-wrapper";

export function LogoPreview() {
  return (
    <PreviewWrapper width="auto">
      <Logo size={72} className="text-[#6d46eb]" />
    </PreviewWrapper>
  );
}
