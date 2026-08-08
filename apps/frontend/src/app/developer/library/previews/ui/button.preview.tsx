"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { PreviewWrapper } from "../preview-wrapper";

export function ButtonPreview(props: Omit<Partial<ComponentProps<typeof Button>>, "children">) {
  return (
    <PreviewWrapper width="sm">
      <Button {...props}>Submit</Button>
    </PreviewWrapper>
  );
}
