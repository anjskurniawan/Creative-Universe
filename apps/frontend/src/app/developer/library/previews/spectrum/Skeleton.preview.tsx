/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Skeleton } from "@/components/spectrum/Skeleton";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumSkeletonPreview() {
  return <PreviewWrapper width="sm"><Skeleton {...({ "aria-label": "Skeleton preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
