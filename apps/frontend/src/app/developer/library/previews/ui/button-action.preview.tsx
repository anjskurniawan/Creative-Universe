"use client";

import React from "react";
import { ButtonAction } from "@/components/ui/button-action";
import { PreviewWrapper } from "../preview-wrapper";

export function ButtonActionPreview() {
  return (
    <PreviewWrapper width="sm">
      <ButtonAction href="#">Lanjutkan</ButtonAction>
    </PreviewWrapper>
  );
}
