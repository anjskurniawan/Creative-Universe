import type { ReactNode } from "react";

export type ContentProps = {
  className?: string;
  heading?: string;
  subheading?: string;
  viewport?: "Mobile" | "Desktop";
  children?: ReactNode;
};
