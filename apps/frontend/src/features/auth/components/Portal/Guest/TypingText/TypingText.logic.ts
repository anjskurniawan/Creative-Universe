"use client";

import { useEffect, useState } from "react";
import { DEFAULT_TYPING_TEXT_CONFIG } from "./TypingText.config";
import type { TypingTextProps } from "./TypingText.types";

export function useTypingTextLogic({
  children,
  typing = false,
  typingSpeed = DEFAULT_TYPING_TEXT_CONFIG.defaultTypingSpeed,
  typingDelay = DEFAULT_TYPING_TEXT_CONFIG.defaultTypingDelay,
  onTypingComplete,
  gradientSuffix,
}: TypingTextProps) {
  const text = typeof children === "string" ? children : "";
  const characters = splitCharacters(text);
  const [visibleCount, setVisibleCount] = useState(typing ? 0 : characters.length);
  const visibleText = characters.slice(0, visibleCount).join("");
  const gradientStart = gradientSuffix
    ? characters.length - splitCharacters(gradientSuffix).length
    : characters.length;
  const visiblePrefix = characters
    .slice(0, Math.min(visibleCount, gradientStart))
    .join("");
  const visibleSuffix = characters
    .slice(gradientStart, Math.max(gradientStart, visibleCount))
    .join("");

  useEffect(() => {
    if (!typing || !text) return;
    let count = 0;
    let interval: number | undefined;
    const beginTyping = () => {
      interval = window.setInterval(() => {
        count += 1;
        setVisibleCount(Math.min(count, characters.length));
        if (count >= characters.length) {
          if (interval !== undefined) window.clearInterval(interval);
          onTypingComplete?.();
        }
      }, typingSpeed);
    };
    const delay = window.setTimeout(beginTyping, typingDelay);
    return () => {
      window.clearTimeout(delay);
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [characters.length, onTypingComplete, text, typing, typingDelay, typingSpeed]);

  return {
    text,
    visibleText,
    visiblePrefix,
    visibleSuffix,
  };
}

function splitCharacters(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("id", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }
  return Array.from(text);
}

// Backward-compatible alias
export const useHeroHeadingLogic = useTypingTextLogic;
