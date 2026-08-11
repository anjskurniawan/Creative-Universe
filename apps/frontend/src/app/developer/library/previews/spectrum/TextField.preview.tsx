"use client";

import { TextField } from "@/components/spectrum/TextField";
import { PreviewWrapper } from "../preview-wrapper";

export function SpectrumTextFieldPreview() {
  return (
    <PreviewWrapper width="md">
      <TextField
        label="Project name"
        description="Choose a name that is easy for your team to recognize."
        placeholder="Enter a project name"
      />
    </PreviewWrapper>
  );
}
