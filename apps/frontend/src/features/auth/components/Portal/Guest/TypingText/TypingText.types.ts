import type { ReactNode } from "react";

export interface TypingTextProps {
  children: ReactNode;
  align?: "left" | "center";
  className?: string;
  typing?: boolean;
  typingSpeed?: number;
  typingDelay?: number;
  onTypingComplete?: () => void;
  gradientSuffix?: string;
}

// Backward-compatible alias
export type HeroHeadingProps = TypingTextProps;
