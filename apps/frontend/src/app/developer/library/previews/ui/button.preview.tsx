"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PreviewWrapper } from "../preview-wrapper";

export function ButtonPreview(props: any) {
  return (
    <PreviewWrapper width="sm">
      <Button {...props}>Submit</Button>
    </PreviewWrapper>
  );
}
