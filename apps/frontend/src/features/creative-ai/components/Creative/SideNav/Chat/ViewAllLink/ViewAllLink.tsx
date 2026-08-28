"use client";

import { Link as AriaLink } from "react-aria-components";
import type { ViewAllLinkProps } from "./ViewAllLink.types";

export function ViewAllLink({
  href = "/creative-ai/history",
  onPress,
}: ViewAllLinkProps) {
  const handleClick = () => {
    if (onPress) {
      onPress();
    } else if (href && href !== "#") {
      window.location.href = href;
    }
  };

  return (
    <AriaLink
      href={href || "#"}
      onPress={handleClick}
      className="flex h-7 w-full items-center px-3 text-xs font-semibold text-white/40 hover:text-white transition-colors mt-0.5"
    >
      <span>Lihat Semua</span>
    </AriaLink>
  );
}
