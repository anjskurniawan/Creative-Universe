"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/Button/Button";
import { PreviewWrapper } from "../PreviewWrapper/PreviewWrapper";

export function ButtonPreview(props: Omit<Partial<ComponentProps<typeof Button>>, "children">) {
  return (
    <PreviewWrapper width="sm">
      <Button {...props}>Submit</Button>
    </PreviewWrapper>
  );
}
