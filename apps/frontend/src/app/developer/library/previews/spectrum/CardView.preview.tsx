"use client";
import { CardView } from "@/components/spectrum/CardView";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumCardViewPreview() {
  return <PreviewWrapper width="sm"><CardView aria-label="CardView preview" /></PreviewWrapper>;
}
