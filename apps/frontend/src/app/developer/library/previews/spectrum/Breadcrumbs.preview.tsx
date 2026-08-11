/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Breadcrumbs } from "@/components/spectrum/Breadcrumbs";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumBreadcrumbsPreview() {
  return <PreviewWrapper width="sm"><Breadcrumbs {...({ "aria-label": "Breadcrumbs preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
