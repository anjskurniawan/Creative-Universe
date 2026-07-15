"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";

export interface HeroHeadingProps {
  children: ReactNode;
  align?: "left" | "center";
  className?: string;
  typing?: boolean;
  typingSpeed?: number;
  onTypingComplete?: () => void;
}

export function HeroHeading({ children, align = "center", className = "", typing = false, typingSpeed = 110, onTypingComplete }: HeroHeadingProps) {
  const text = typeof children === "string" ? children : "";
  const characters = splitCharacters(text);
  const [visibleCount, setVisibleCount] = useState(typing ? 0 : characters.length);

  useEffect(() => {
    if (!typing || !text) return;
    let count = 0;
    const interval = window.setInterval(() => {
      count += 1;
      setVisibleCount(Math.min(count, characters.length));
      if (count >= characters.length) {
        window.clearInterval(interval);
        onTypingComplete?.();
      }
    }, typingSpeed);
    return () => window.clearInterval(interval);
  }, [characters.length, onTypingComplete, text, typing, typingSpeed]);

  return (
    <h1 aria-label={text || undefined} className={`text-5xl font-medium leading-[0.95] tracking-[-0.04em] text-cu-ink md:text-7xl lg:text-8xl ${align === "center" ? "text-center" : "text-left"} ${className}`}>
      {typing && text ? (
        <span aria-hidden="true">
          {visibleCount === 0 && <span className="hero-heading-cursor-anchor" />}
          {characters.map((character, index) => (
            <Fragment key={`${character}-${index}`}>
              <span className={index >= visibleCount ? "invisible" : ""}>{character}</span>
              {index === visibleCount - 1 && <span className="hero-heading-cursor-anchor" />}
            </Fragment>
          ))}
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
