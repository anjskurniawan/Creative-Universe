"use client";

import React from "react";
import { AccessDenied } from "@/components/ui/AccessDenied/AccessDenied";
import { PreviewWrapper } from "../PreviewWrapper/PreviewWrapper";

export function AccessDeniedPreview() {
  return (
    <PreviewWrapper width="full">
      <AccessDenied />
    </PreviewWrapper>
  );
}
