"use client";

import { useEffect, useState, type ReactNode } from "react";

export interface HeroHeadingProps {
  children: ReactNode;
  align?: "left" | "center";
  className?: string;
  typing?: boolean;
  typingSpeed?: number;
  typingDelay?: number;
  onTypingComplete?: () => void;
}

export function HeroHeading({ children, align = "center", className = "", typing = false, typingSpeed = 110, typingDelay = 0, onTypingComplete }: HeroHeadingProps) {
  const text = typeof children === "string" ? children : "";
  const characters = splitCharacters(text);
  const [visibleCount, setVisibleCount] = useState(typing ? 0 : characters.length);
  const visibleText = characters.slice(0, visibleCount).join("");

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

  return (
    <h1 aria-label={text || undefined} className={`text-5xl font-medium leading-[0.95] tracking-[-0.04em] text-cu-ink md:text-7xl lg:text-8xl ${align === "center" ? "text-center" : "text-left"} ${className}`}>
      {typing && text ? (
        <span aria-hidden="true" className="relative inline-block max-w-full text-left">
          <span className="block opacity-0">{text}</span>
          <span className="absolute inset-0 block text-left">
            {visibleText}<span className="hero-heading-cursor-anchor" />
          </span>
        </span>
      ) : children}
    </h1>
  );
}

function splitCharacters(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("id", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }
  return Array.from(text);
}
