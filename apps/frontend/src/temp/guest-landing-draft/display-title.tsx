"use client";

import { useEffect, useState, type ReactNode } from "react";

export interface DisplayTitleProps {
  children: ReactNode;
  align?: "left" | "center";
  className?: string;
  typing?: boolean;
  typingSpeed?: number;
}

export function DisplayTitle({ children, align = "center", className = "", typing = false, typingSpeed = 55 }: DisplayTitleProps) {
  const text = typeof children === "string" ? children : "";
  const characters = splitCharacters(text);
  const [visibleCount, setVisibleCount] = useState(typing ? 0 : characters.length);

  useEffect(() => {
    if (!typing || !text) return;
    setVisibleCount(0);
    const interval = window.setInterval(() => {
      setVisibleCount((count) => {
        if (count >= characters.length) {
          window.clearInterval(interval);
          return count;
        }
        return count + 1;
      });
    }, typingSpeed);
    return () => window.clearInterval(interval);
  }, [characters.length, text, typing, typingSpeed]);

  return (
    <h1 aria-label={text || undefined} className={`text-5xl font-medium leading-[0.95] tracking-[-0.04em] text-cu-ink md:text-7xl lg:text-8xl ${align === "center" ? "text-center" : "text-left"} ${className}`}>
      {typing && text ? characters.slice(0, visibleCount).join("") : children}
      {typing && visibleCount < characters.length && <span aria-hidden="true" className="ml-1 inline-block h-[0.8em] w-1 animate-pulse bg-gradient-to-b from-cu-gradient-start via-cu-gradient-middle to-cu-gradient-end align-middle" />}
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
