/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Form } from "@/components/spectrum/Form";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumFormPreview() {
  return <PreviewWrapper width="sm"><Form {...({ "aria-label": "Form preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
