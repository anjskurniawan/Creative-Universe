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
        gsap.delayedCall(1.5, () => {
          blink.kill();
          gsap.to(cursor, {
            opacity: 0,
            duration: 0.25,
            ease: "power1.out",
          });
        });
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
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-8 py-4">
      {/* Animated glowing blobs in background */}
      <div className="fixed inset-0 -z-10 bg-[#0a0a0a] overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-fuchsia-600 via-purple-600 to-indigo-600 opacity-30 blur-[120px] animate-blob-1"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-blue-600 via-cyan-600 to-teal-600 opacity-25 blur-[120px] animate-blob-2"></div>
        <div className="absolute top-[30%] -right-[10%] w-[35%] h-[35%] rounded-full bg-gradient-to-bl from-rose-600 via-pink-600 to-orange-500 opacity-20 blur-[100px] animate-blob-3"></div>
      </div>

      {/* Centered Header Title */}
      <div className="text-center">
        <h1
          id="pricetag-title"
          aria-label={titleText}
          data-typewriter={titleText}
          className="text-center text-4xl md:text-5xl lg:text-8xl font-medium text-white tracking-normal leading-none"
        >
          <span ref={textTargetRef} data-typewriter-text>
            {titleText}
          </span>
          <span
            ref={cursorRef}
            aria-hidden="true"
            data-typewriter-cursor
            className="ml-2 inline-block h-8 w-1 bg-gradient-to-b from-cu-gradient-start via-cu-gradient-middle to-cu-gradient-end align-middle opacity-0 md:h-12 lg:h-20"
          ></span>
          <noscript>{titleText}</noscript>
        </h1>
      </div>

      {/* Pill Navigation Switcher */}
      <nav className="flex items-center p-1 rounded-full border border-white/10 bg-[#0d0d0d]/60 backdrop-blur-md gap-1 md:gap-1.5 shadow-xl transition-all duration-300 max-w-full overflow-x-auto scrollbar-none flex-nowrap mx-4 sm:mx-0">
        {tabs
          .filter((tab) => hasPermission(tab.permission))
          .map((tab) => {
            const active = currentPath === tab.path;
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`flex items-center justify-center px-3 py-2 md:px-6 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                  active
                    ? "bg-white text-cu-ink shadow-md font-extrabold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
      </nav>

      {/* Main Content Card Panel */}
      <main className="w-full bg-white text-cu-ink rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-white/5 min-h-fit animate-fade-in">
        {children}
      </main>
    </div>
  );
}
