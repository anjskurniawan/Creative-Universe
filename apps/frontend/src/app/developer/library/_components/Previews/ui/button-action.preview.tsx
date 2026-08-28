"use client";

import React from "react";
import { ButtonAction } from "@/components/ui/ButtonAction/ButtonAction";
import { PreviewWrapper } from "../PreviewWrapper/PreviewWrapper";

export function ButtonActionPreview() {
  return (
    <PreviewWrapper width="sm">
      <ButtonAction href="#">Lanjutkan</ButtonAction>
    </PreviewWrapper>
  );
}
