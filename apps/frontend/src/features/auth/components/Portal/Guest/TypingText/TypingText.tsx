"use client";

import React from "react";
import { DEFAULT_TYPING_TEXT_CONFIG } from "./TypingText.config";
import { useTypingTextLogic } from "./TypingText.logic";
import type { TypingTextProps } from "./TypingText.types";

export type { TypingTextProps } from "./TypingText.types";

export function TypingText({
  children,
  align = DEFAULT_TYPING_TEXT_CONFIG.defaultAlign,
  className = "",
  typing = false,
  typingSpeed = DEFAULT_TYPING_TEXT_CONFIG.defaultTypingSpeed,
  typingDelay = DEFAULT_TYPING_TEXT_CONFIG.defaultTypingDelay,
  onTypingComplete,
  gradientSuffix,
}: TypingTextProps) {
  const { text, visibleText, visiblePrefix, visibleSuffix } =
    useTypingTextLogic({
      children,
      align,
      className,
      typing,
      typingSpeed,
      typingDelay,
      onTypingComplete,
      gradientSuffix,
    });

  return (
    <h1
      aria-label={text || undefined}
      className={`cu-style text-5xl font-medium leading-[0.95] tracking-[-0.04em] text-cu-ink md:text-7xl lg:text-8xl ${
        align === "center" ? "text-center" : "text-left"
      } ${className}`.trim()}
    >
      {typing && text ? (
        <span
          aria-hidden="true"
          className="relative inline-block max-w-full text-left"
        >
          <span className="block opacity-0">{text}</span>
          <span className="absolute inset-0 block text-left">
            {gradientSuffix ? (
              <>
                {visiblePrefix}
                {visibleSuffix && (
                  <span className="hero-heading-gradient-suffix">
                    {visibleSuffix}
                  </span>
                )}
              </>
            ) : (
              visibleText
            )}
            <span className="hero-heading-cursor-anchor" />
          </span>
        </span>
      ) : (
        children
      )}
    </h1>
  );
}

// Backward-compatible alias
export const HeroHeading = TypingText;

export default TypingText;
