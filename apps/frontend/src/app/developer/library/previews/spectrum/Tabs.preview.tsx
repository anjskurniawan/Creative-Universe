/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Tabs } from "@/components/spectrum/Tabs";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumTabsPreview() {
  return <PreviewWrapper width="sm"><Tabs {...({ "aria-label": "Tabs preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
