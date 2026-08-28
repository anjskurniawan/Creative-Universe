import type { CSSProperties } from "react";

export type AvatarState = "Default" | "Focus" | "Disable";
export type AvatarRound = "none" | "sm" | "md" | "lg" | "full";

export type AvatarProps = {
  name?: string;
  src?: string;
  initials?: string;
  state?: AvatarState;
  active?: boolean;
  dark?: boolean;
  size?: "sm" | "md" | "lg";
  round?: AvatarRound;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  style?: CSSProperties;
  alt?: string;
};
