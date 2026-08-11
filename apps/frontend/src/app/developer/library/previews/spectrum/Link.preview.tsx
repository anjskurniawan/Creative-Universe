/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Link } from "@/components/spectrum/Link";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumLinkPreview() {
  return <PreviewWrapper width="sm"><Link {...({ "aria-label": "Link preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
