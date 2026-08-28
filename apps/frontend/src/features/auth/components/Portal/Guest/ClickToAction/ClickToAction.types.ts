import type { ReactNode } from "react";

export interface ClickToActionProps {
  href: string;
  children: ReactNode;
  className?: string;
  iconName?: string;
}

// Backward-compatible alias
export type ButtonActionProps = ClickToActionProps;
