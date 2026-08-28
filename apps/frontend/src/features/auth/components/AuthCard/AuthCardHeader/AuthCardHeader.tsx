"use client";

import React from "react";
import { IconMaterial } from "@/features/auth/components/IconMaterial/IconMaterial";
import type { AuthCardHeaderProps } from "../AuthCard.types";

export function AuthCardHeader({
  title,
  showCloseButton = false,
  buttonIcon,
  buttonAriaLabel,
  onButtonClick,
  className = "",
}: AuthCardHeaderProps) {
  const hasHeaderButton = showCloseButton || Boolean(buttonIcon && onButtonClick);

  return (
    <div
      className={`border-b border-divider flex items-center justify-between px-8 py-4 w-full shrink-0 rounded-t-[16px] bg-white ${className}`.trim()}
    >
      <p className="font-sans font-semibold text-sm uppercase tracking-wider text-brand">
        {title}
      </p>
      {hasHeaderButton && (
        <button
          type="button"
          onClick={onButtonClick}
          className="text-label hover:bg-slate-50 hover:text-slate-800 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cu-focus"
          aria-label={buttonAriaLabel || "Close"}
        >
          <IconMaterial name={buttonIcon || "close"} className="text-xl" />
        </button>
      )}
    </div>
  );
}

export default AuthCardHeader;
