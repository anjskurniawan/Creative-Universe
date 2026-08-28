"use client";

import React from "react";
import { PrimaryActionLink } from "@/components/ui/PrimaryActionLink/PrimaryActionLink";
import { PreviewWrapper } from "../PreviewWrapper/PreviewWrapper";

export function PrimaryActionLinkPreview() {
  return (
    <PreviewWrapper width="auto">
      <PrimaryActionLink href="#">Mulai Sekarang</PrimaryActionLink>
    </PreviewWrapper>
  );
}
