/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { TreeView } from "@/components/spectrum/TreeView";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumTreeViewPreview() {
  return <PreviewWrapper width="sm"><TreeView {...({ "aria-label": "TreeView preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
