"use client";

import { useState } from "react";
import { Button } from "@/components/spectrum/Button";
import { PreviewWrapper } from "../preview-wrapper";

export function SpectrumButtonPreview() {
  const [isPending, setPending] = useState(false);

  return (
    <PreviewWrapper width="sm">
      <div className="flex flex-wrap items-center gap-3">
        <Button>Continue</Button>
        <Button variant="accent">Create</Button>
        <Button variant="secondary" fillStyle="outline">
          Cancel
        </Button>
        <Button
          isPending={isPending}
          onPress={() => {
            setPending(true);
            window.setTimeout(() => setPending(false), 1500);
          }}
        >
          Save
        </Button>
      </div>
    </PreviewWrapper>
  );
}
