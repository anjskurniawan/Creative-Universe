import {
  AVATAR_FALLBACK_CLASS,
  AVATAR_FOCUS_BORDER_CLASS,
} from "./Avatar.config";
import type { AvatarProps } from "./Avatar.types";

export type { AvatarProps, AvatarState } from "./Avatar.types";

export default function Avatar({
  name = "Creative Universe",
  src,
  state = "Default",
  dark = false,
}: AvatarProps) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const theme = dark ? "dark" : "light";
  const border = state === "Focus" ? AVATAR_FOCUS_BORDER_CLASS[theme] : "";

  if (src) {
    return (
      <div className={`relative size-8 shrink-0 overflow-hidden rounded-lg ${border}`}>
        <img src={src} alt={name} className="absolute inset-0 size-full rounded-lg object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg ${AVATAR_FALLBACK_CLASS[theme]} ${border}`}
    >
      <span className="font-sans text-[11px] font-semibold leading-none">{initials}</span>
    </div>
  );
}
