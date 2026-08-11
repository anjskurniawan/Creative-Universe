/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ButtonGroup } from "@/components/spectrum/ButtonGroup";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumButtonGroupPreview() {
  return <PreviewWrapper width="sm"><ButtonGroup {...({ "aria-label": "ButtonGroup preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
