"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/material-icon";
import { normalizePathname } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import { gsap } from "gsap";

export default function PricetagLayout({ children }: { children: React.ReactNode }) {
  const currentPath = normalizePathname(usePathname());
  const { hasPermission } = useAuth();

  const titleText = "Pricetag Generator";
  const textTargetRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const textTarget = textTargetRef.current;
    const cursor = cursorRef.current;
    if (!textTarget || !cursor) return;

    const splitCharacters = (text: string) => {
      if ("Segmenter" in Intl) {
        const segmenter = new Intl.Segmenter("id", { granularity: "grapheme" });
        return Array.from(segmenter.segment(text), ({ segment }) => segment);
      }
      return Array.from(text);
    };

    const characters = splitCharacters(titleText);
    const progress = { count: 0 };
    textTarget.textContent = "";
    gsap.set(cursor, { opacity: 1 });

    const blink = gsap.to(cursor, {
      opacity: 0.2,
      duration: 0.55,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    const typewriterTween = gsap.to(progress, {
      count: characters.length,
      duration: 1.5,
      ease: "none",
      onUpdate: () => {
        textTarget.textContent = characters.slice(0, Math.round(progress.count)).join("");
      },
      onComplete: () => {
        textTarget.textContent = titleText;
      },
    });

    return () => {
      blink.kill();
      typewriterTween.kill();
    };
  }, []);

  const tabs = [
    { label: "Cari Pricetag", path: "/pricetag/search", permission: "access-pricetag" },
    { label: "Generator", path: "/pricetag/generator", permission: "access-pricetag" },
    { label: "Riwayat", path: "/pricetag/history", permission: "access-pricetag" },
    { label: "Database", path: "/pricetag/database", permission: "pricetag.manage" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-0 py-0 md:gap-8 md:py-4">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black" />

      {/* Centered Header Title */}
      <div className="w-full text-left md:text-center">
        <h1
          id="pricetag-title"
          aria-label={titleText}
          data-typewriter={titleText}
          className="whitespace-nowrap text-left text-[clamp(28px,8.4vw,38px)] font-medium leading-[1.04] tracking-normal text-white md:text-center md:text-5xl lg:text-8xl"
        >
          <span ref={textTargetRef} data-typewriter-text>
            {titleText}
          </span>
          <span
            ref={cursorRef}
            aria-hidden="true"
            data-typewriter-cursor
            className="ml-2 inline-block h-7 w-1 bg-gradient-to-b from-cu-gradient-start via-cu-gradient-middle to-cu-gradient-end align-middle opacity-0 md:h-12 lg:h-20"
          ></span>
          <noscript>{titleText}</noscript>
        </h1>
      </div>

      <nav className="mx-0 flex w-full max-w-full flex-nowrap items-center overflow-x-auto border-b border-white/50 bg-transparent scrollbar-none transition-all duration-300">
        {tabs
          .filter((tab) => hasPermission(tab.permission))
          .map((tab) => {
            const active = currentPath === tab.path;
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`relative flex flex-1 items-center justify-center px-1 py-3 text-center text-[10px] font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap md:px-6 md:py-4 md:text-xs ${
                  active
                    ? "cu-animated-rainbow-line text-white"
                    : "text-white/55 hover:text-white"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
      </nav>

      {/* Main Content Card Panel */}
      <main className="min-h-fit w-full animate-fade-in text-cu-ink md:rounded-2xl md:border md:border-white/5 md:bg-white md:p-8 md:shadow-2xl">
        {children}
      </main>
    </div>
  );
}
