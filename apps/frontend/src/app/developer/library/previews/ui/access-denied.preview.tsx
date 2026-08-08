"use client";

import React from "react";
import { AccessDenied } from "@/components/ui/access-denied";
import { PreviewWrapper } from "../preview-wrapper";

export function AccessDeniedPreview() {
  return (
    <PreviewWrapper width="full">
      <AccessDenied />
    </PreviewWrapper>
  );
}
