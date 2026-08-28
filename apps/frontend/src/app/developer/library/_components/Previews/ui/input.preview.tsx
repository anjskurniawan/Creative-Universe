"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/form/Input/Input";
import { PreviewWrapper } from "../PreviewWrapper/PreviewWrapper";

export function InputPreview() {
  const [value, setValue] = useState("");
  return (
    <PreviewWrapper width="md">
      <Input
        id="preview-input"
        label="Nama"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Masukkan nama"
      />
    </PreviewWrapper>
  );
}
