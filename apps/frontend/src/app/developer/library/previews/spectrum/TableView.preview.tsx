/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { TableView } from "@/components/spectrum/TableView";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumTableViewPreview() {
  return <PreviewWrapper width="sm"><TableView {...({ "aria-label": "TableView preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
