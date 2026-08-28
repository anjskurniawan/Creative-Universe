import { AVATAR_FALLBACK_CLASS, AVATAR_ROUND_CLASS, AVATAR_SIZE_CLASS, getAvatarStateClass } from "./Avatar.config";
import type { AvatarProps } from "./Avatar.types";

export type { AvatarProps, AvatarRound, AvatarState } from "./Avatar.types";

export default function Avatar({
  name = "Creative Universe",
  src,
  initials,
  state = "Default",
  active = false,
  dark = false,
  size = "md",
  round = "md",
  className = "",
  imageClassName = "",
  fallbackClassName = "",
  style,
  alt,
}: AvatarProps) {
  const sizeClass = AVATAR_SIZE_CLASS[size];
  const roundClass = AVATAR_ROUND_CLASS[round];
  const fallback = initials ?? name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const stateClass = getAvatarStateClass(active ? "Focus" : state, dark);

  if (src) {
    return (
      <div className={`cu-style relative shrink-0 overflow-hidden ${sizeClass} ${roundClass} ${stateClass} ${className}`.trim()} style={style}>
        <img src={src} alt={alt ?? name} className={`absolute inset-0 size-full object-cover ${roundClass} ${imageClassName}`.trim()} />
      </div>
    );
  }

  return (
    <div aria-label={alt ?? name} className={`cu-style relative flex shrink-0 items-center justify-center overflow-hidden ${sizeClass} ${roundClass} ${AVATAR_FALLBACK_CLASS[dark ? "dark" : "light"]} ${stateClass} ${fallbackClassName} ${className}`.trim()} style={style}>
      <span className="font-sans font-semibold leading-none">{fallback || "U"}</span>
    </div>
  );
}
