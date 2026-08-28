import type { ReactNode } from "react";

export interface AuthCardProps {
  title: string;
  footerText: string;
  showCloseButton?: boolean;
  headerButtonIcon?: string;
  headerButtonAriaLabel?: string;
  onHeaderButtonClick?: () => void;
  children: ReactNode;
  className?: string;
}

export interface AuthCardHeaderProps {
  title: string;
  showCloseButton?: boolean;
  buttonIcon?: string;
  buttonAriaLabel?: string;
  onButtonClick?: () => void;
  className?: string;
}

export interface AuthCardFooterProps {
  text: string;
  className?: string;
}
