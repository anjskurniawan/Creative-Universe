"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

export type CreativeAiTypewriterTitleProps = {
  userName?: string;
  isFocused?: boolean;
  hasMessages?: boolean;
  className?: string;
};

export function CreativeAiTypewriterTitle({
  userName = "Sobat CU",
  isFocused = false,
  hasMessages = false,
  className = "",
}: CreativeAiTypewriterTitleProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textTargetRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  const defaultText = "Creative AI siap membantu Anda";
  const focusedText = `Hi, ${userName} what can i help u ?`;

  useEffect(() => {
    if (hasMessages) return;

    const currentText = isFocused ? focusedText : defaultText;
    const characters = Array.from(currentText);
    const progress = { count: 0 };

    if (textTargetRef.current) {
      textTargetRef.current.textContent = "";
      gsap.killTweensOf(textTargetRef.current);
    }
    if (cursorRef.current) {
      gsap.killTweensOf(cursorRef.current);
      gsap.set(cursorRef.current, { opacity: 1 });
      gsap.to(cursorRef.current, {
        opacity: 0.2,
        duration: 0.55,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }

    gsap.to(progress, {
      count: characters.length,
      duration: Math.max(1, characters.length * 0.04),
      ease: "none",
      onUpdate: () => {
        if (textTargetRef.current) {
          textTargetRef.current.textContent = characters.slice(0, Math.round(progress.count)).join("");
        }
      },
      onComplete: () => {
        if (textTargetRef.current) {
          textTargetRef.current.textContent = currentText;
        }
        gsap.delayedCall(1, () => {
          if (cursorRef.current) {
            gsap.killTweensOf(cursorRef.current);
            gsap.to(cursorRef.current, { opacity: 0, duration: 0.25 });
          }
        });
      },
    });
  }, [isFocused, hasMessages, userName, defaultText, focusedText]);

  if (hasMessages) return null;

  return (
    <div className={`w-full text-center flex flex-col items-center py-4 ${className}`}>
      <h1
        ref={titleRef}
        className="text-center text-xl sm:text-2xl md:text-3xl font-medium leading-snug tracking-tight w-full block break-words"
      >
        <span
          ref={textTargetRef}
          className={
            isFocused
              ? "bg-gradient-to-r from-cu-gradient-start via-cu-gradient-middle to-cu-gradient-end bg-clip-text text-transparent"
              : "text-cu-ink"
          }
        >
          {defaultText}
        </span>
        <span
          ref={cursorRef}
          aria-hidden="true"
          className="ml-1.5 inline-block h-5 w-0.5 bg-gradient-to-b from-cu-gradient-start via-cu-gradient-middle to-cu-gradient-end align-middle opacity-0 sm:h-6 md:h-7"
        />
      </h1>
    </div>
  );
}
