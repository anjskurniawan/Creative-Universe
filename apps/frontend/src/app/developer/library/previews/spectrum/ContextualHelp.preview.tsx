/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ContextualHelp } from "@/components/spectrum/ContextualHelp";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumContextualHelpPreview() {
  return <PreviewWrapper width="sm"><ContextualHelp {...({ "aria-label": "ContextualHelp preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
