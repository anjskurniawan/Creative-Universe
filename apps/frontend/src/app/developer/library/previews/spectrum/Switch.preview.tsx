/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Switch } from "@/components/spectrum/Switch";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumSwitchPreview() {
  return <PreviewWrapper width="sm"><Switch {...({ "aria-label": "Switch preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
