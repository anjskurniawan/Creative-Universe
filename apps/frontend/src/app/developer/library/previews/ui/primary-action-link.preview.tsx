"use client";

import React from "react";
import { PrimaryActionLink } from "@/components/ui/primary-action-link";
import { PreviewWrapper } from "../preview-wrapper";

export function PrimaryActionLinkPreview() {
  return (
    <PreviewWrapper width="auto">
      <PrimaryActionLink href="#">Mulai Sekarang</PrimaryActionLink>
    </PreviewWrapper>
  );
}
