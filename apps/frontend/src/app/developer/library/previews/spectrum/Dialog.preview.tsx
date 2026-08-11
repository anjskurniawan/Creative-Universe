/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Dialog } from "@/components/spectrum/Dialog";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumDialogPreview() {
  return <PreviewWrapper width="sm"><Dialog {...({ "aria-label": "Dialog preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
