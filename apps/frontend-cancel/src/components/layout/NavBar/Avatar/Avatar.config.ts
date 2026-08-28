import type { AvatarState } from "./Avatar.types";

export const AVATAR_FALLBACK_CLASS = {
  dark: "bg-slate-700 text-white",
  light: "bg-slate-500 text-white",
} as const;

export const AVATAR_FOCUS_BORDER_CLASS = {
  dark: "ring-2 ring-orange-400",
  light: "ring-2 ring-sky-400",
} as const;

export const AVATAR_SIZE_CLASS = {
  sm: "size-7 rounded-md text-[10px]",
  md: "size-8 rounded-lg text-[11px]",
  lg: "size-10 rounded-xl text-xs",
} as const;

export const AVATAR_ROUND_CLASS = {
  none: "rounded-none",
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
} as const;

export function getAvatarStateClass(state: AvatarState, dark: boolean) {
  if (state === "Focus") return AVATAR_FOCUS_BORDER_CLASS[dark ? "dark" : "light"];
  if (state === "Disable") return "opacity-50 grayscale";
  return "";
}
