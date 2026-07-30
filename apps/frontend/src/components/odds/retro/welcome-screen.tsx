"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { MaterialIcon } from "@/components/ui/material-icon";
import { OddsCategory, OddsDesignerProfile, OddsTaskAttachment } from "@/features/odds/api";
import { OddsGameboyFrame } from "@/components/odds/odds-gameboy-frame";
import { PIXEL_MASCOT } from "./constants";

export function WelcomeScreen({
  onStart,
  playerName,
}: {
  onStart: () => void;
  playerName: string;
}) {
  const welcomeRef = useRef<HTMLDivElement>(null);
  const startTimelineRef = useRef<ReturnType<typeof gsap.timeline> | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const root = welcomeRef.current;
    if (!root) return;

    const media = gsap.matchMedia();
    media.add({
      motionAllowed: "(prefers-reduced-motion: no-preference)",
      reduceMotion: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      if (context.conditions?.reduceMotion) {
        gsap.set(".boot-screen", { autoAlpha: 0 });
        return;
      }

      const intro = gsap.timeline({ defaults: { duration: 0.45, ease: "power2.out" } });
      intro
        .fromTo(".boot-bar", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.75, ease: "steps(8)" })
        .to(".boot-screen", { autoAlpha: 0, duration: 0.15, ease: "none" }, "+=0.1")
        .from(".welcome-kicker", { autoAlpha: 0, y: -12 })
        .from(".welcome-title", { autoAlpha: 0, scale: 0.75, ease: "back.out(1.8)" }, "-=0.15")
        .from(".welcome-subtitle", { autoAlpha: 0, y: 8 }, "-=0.2")
        .from(".player-stage", { autoAlpha: 0, scale: 0.85, ease: "back.out(1.6)" }, "-=0.1")
        .from(".pixel-cell-active", { scale: 0, stagger: { amount: 0.35, from: "random" }, ease: "back.out(2)" }, "-=0.2")
        .fromTo(
          ".start-button",
          { autoAlpha: 0, y: 14, scale: 0.86 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.38,
            ease: "back.out(1.9)",
            clearProps: "transform,opacity,visibility",
          },
          "+=0.08",
        )
        .fromTo(
          ".press-start",
          { autoAlpha: 0, y: 6 },
          { autoAlpha: 1, y: 0, duration: 0.22, ease: "steps(3)" },
          "+=0.06",
        );

      const spriteTravel = context.conditions?.mobile ? 24 : 42;
      const spriteJump = context.conditions?.mobile ? -9 : -14;

      gsap.timeline({ repeat: -1, repeatDelay: 0.25 })
        .set(".sprite-unit", { x: -spriteTravel, scaleX: 1 })
        .to(".sprite-unit", { x: spriteTravel, duration: 1.45, ease: "steps(8)" })
        .set(".sprite-unit", { scaleX: -1 })
        .to(".sprite-unit", { x: -spriteTravel, duration: 1.45, ease: "steps(8)" })
        .set(".sprite-unit", { scaleX: 1 });
      gsap.to(".player-sprite", { y: spriteJump, duration: 0.32, repeat: -1, repeatDelay: 0.55, yoyo: true, ease: "steps(3)" });
      gsap.to(".sprite-shadow", { scaleX: 0.68, autoAlpha: 0.38, duration: 0.32, repeat: -1, yoyo: true, ease: "steps(1)" });
      gsap.fromTo(".sprite-fx", { y: 8, autoAlpha: 0 }, { y: -26, autoAlpha: 1, duration: 1.1, repeat: -1, stagger: { each: 0.24, from: "random" }, ease: "steps(4)" });
      gsap.to(".scanline", { yPercent: 900, duration: 3.2, repeat: -1, ease: "none" });
      gsap.to(".spark-pixel", { y: -9, duration: 0.7, repeat: -1, yoyo: true, stagger: { each: 0.11, from: "random" }, ease: "power1.inOut" });
      gsap.to(".press-start", { autoAlpha: 0.2, duration: 0.65, delay: intro.duration() + 0.1, repeat: -1, yoyo: true, ease: "none" });
    }, root);

    return () => {
      startTimelineRef.current?.kill();
      media.revert();
    };
  }, []);

  const handleStart = () => {
    if (starting) return;

    const root = welcomeRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onStart();
      return;
    }

    setStarting(true);
    const select = gsap.utils.selector(root);
    startTimelineRef.current?.kill();
    startTimelineRef.current = gsap.timeline({ defaults: { ease: "power2.inOut" } })
      .to(select(".start-button"), {
        y: 4,
        scale: 0.94,
        boxShadow: "0 1px 0 #24252b",
        duration: 0.1,
        ease: "steps(2)",
      })
      .to(select(".start-button"), {
        y: 0,
        scale: 1,
        boxShadow: "0 5px 0 #24252b",
        duration: 0.1,
        ease: "steps(2)",
      })
      .set(select(".stage-transition"), { autoAlpha: 1 })
      .to(select(".welcome-content"), { autoAlpha: 0.18, scale: 0.97, duration: 0.24 }, "<")
      .fromTo(
        select(".stage-transition-bar"),
        {
          scaleY: 0,
          transformOrigin: (index) => index % 2 === 0 ? "top center" : "bottom center",
        },
        { scaleY: 1, duration: 0.22, stagger: 0.035, ease: "steps(4)" },
        "<",
      )
      .fromTo(
        select(".stage-transition-copy"),
        { autoAlpha: 0, scale: 0.78 },
        { autoAlpha: 1, scale: 1, duration: 0.28, ease: "steps(4)" },
        ">-0.04",
      )
      .to(select(".stage-transition-copy"), {
        autoAlpha: 0.35,
        duration: 0.12,
        repeat: 3,
        yoyo: true,
        ease: "steps(1)",
      })
      .call(onStart, [], "+=0.18");
  };

  return (
    <div ref={welcomeRef} className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl border-[3px] border-[#24252b] bg-[#dfe2d3] p-5 shadow-[inset_0_0_0_3px_#b5b9ad]">
      <div className="boot-screen absolute inset-0 z-30 flex items-center justify-center bg-[#24252b] p-8 text-[#dfe2d3]">
        <div className="w-full max-w-xs text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em]">Loading ODDS Quest</p>
          <div className="mt-4 border-2 border-[#dfe2d3] p-1"><div className="boot-bar h-3 bg-[#ba0dcb]" /></div>
          <p className="mt-3 text-[9px] font-black uppercase tracking-[0.16em] text-[#c9ccc0]">Initializing player...</p>
        </div>
      </div>
      <div className="stage-transition pointer-events-none invisible absolute inset-0 z-40 opacity-0" aria-hidden="true">
        <div className="absolute inset-0 flex">
          {Array.from({ length: 10 }, (_, index) => (
            <span key={index} className="stage-transition-bar h-full flex-1 bg-[#24252b]" />
          ))}
        </div>
        <div className="stage-transition-copy invisible absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center text-[#dfe2d3] opacity-0">
          <span className="mb-4 grid grid-cols-3 gap-1" aria-hidden="true">
            {Array.from({ length: 9 }, (_, index) => (
              <span key={index} className={`size-2 ${index % 2 === 0 ? "bg-[#ba0dcb]" : "bg-[#dfe2d3]"}`} />
            ))}
          </span>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#c9ccc0]">Entering</p>
          <p className="mt-2 text-3xl font-black uppercase tracking-[-0.04em] text-[#ba0dcb] sm:text-5xl">Stage 01</p>
          <p className="mt-3 border-y-2 border-[#dfe2d3] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em]">Request Builder</p>
        </div>
      </div>
      <div className="scanline pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-[#24252b]/20" />
      <span className="spark-pixel absolute left-[8%] top-[18%] size-2 bg-[#ba0dcb]" />
      <span className="spark-pixel absolute right-[9%] top-[25%] size-1.5 bg-[#24252b]" />
      <span className="spark-pixel absolute bottom-[18%] left-[14%] size-1.5 bg-[#24252b]" />
      <span className="spark-pixel absolute bottom-[23%] right-[16%] size-2 bg-[#ba0dcb]" />
      <div className="welcome-content relative z-10 flex h-full w-full max-w-3xl flex-col items-center justify-between text-center sm:block sm:h-auto">
        <div className="shrink-0">
        <p className="welcome-kicker text-[10px] font-black uppercase tracking-[0.24em]">Creative Universe Presents</p>
        <h1 className="welcome-title mt-3 text-3xl font-black uppercase leading-none tracking-[-0.06em] sm:text-5xl">Odds Quest</h1>
        <p className="welcome-subtitle mt-2 text-xs font-black uppercase tracking-[0.18em]">Build Your Creative Request</p>
        </div>

        <div className="flex min-h-0 w-full flex-1 items-center justify-center py-3 sm:my-6 sm:block sm:py-0">
          <div className="player-stage mx-auto flex aspect-square w-full max-w-[210px] flex-col items-center justify-start overflow-hidden border-[3px] border-[#24252b] bg-[#eceee6] p-3 shadow-[4px_4px_0_#24252b] sm:aspect-auto sm:min-h-52 sm:max-w-[240px] sm:justify-center sm:p-4 sm:shadow-[5px_5px_0_#24252b]">
            <div className="relative flex min-h-0 w-full flex-1 items-center justify-center border-b-2 border-[#24252b] bg-[#dfe2d3] px-3 sm:h-44 sm:flex-none sm:items-end sm:pb-4 sm:pt-8">
              <span className="sprite-fx absolute left-[18%] top-[62%] size-2 bg-[#ba0dcb]" />
              <span className="sprite-fx absolute right-[20%] top-[55%] size-1.5 bg-[#24252b]" />
              <span className="sprite-fx absolute left-[28%] top-[42%] size-1 bg-[#24252b]" />
              <span className="sprite-fx absolute right-[28%] top-[38%] size-2 bg-[#ba0dcb]" />
              <div className="sprite-unit relative flex items-end justify-center pb-2 sm:pb-3">
                <span className="sprite-shadow absolute bottom-0 h-1.5 w-12 bg-[#24252b]/45 sm:bottom-1 sm:h-2 sm:w-20" />
                <div className="player-sprite relative z-10 grid grid-cols-7 gap-0 [image-rendering:pixelated]" aria-label="ODDS pixel character" role="img">
                  {PIXEL_MASCOT.flatMap((row, rowIndex) => row.split("").map((pixel, columnIndex) => (
                    <span
                      key={`${rowIndex}-${columnIndex}`}
                      className={`size-[9px] sm:size-3.5 ${pixel === "1" ? `pixel-cell-active ${rowIndex < 2 ? "bg-[#ba0dcb]" : "bg-[#24252b]"}` : "bg-transparent"}`}
                    />
                  )))}
                </div>
              </div>
            </div>
            <span className="mt-3 max-w-full truncate border-2 border-[#24252b] bg-[#c9ccc0] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] sm:mt-4">{playerName}</span>
          </div>
        </div>

        <div className="shrink-0">
        <button type="button" onClick={handleStart} disabled={starting} aria-busy={starting} className="start-button group inline-flex min-w-48 cursor-pointer items-center justify-center gap-2 rounded-lg border-[3px] border-[#24252b] bg-[#ba0dcb] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_5px_0_#24252b] transition-[transform,box-shadow,background-color] duration-150 ease-out hover:-translate-y-1 hover:bg-[#a80cba] hover:shadow-[0_7px_0_#24252b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ba0dcb]/40 active:translate-y-1 active:shadow-none disabled:pointer-events-none disabled:cursor-wait">
          <span className="text-base transition-transform duration-150 group-hover:translate-x-1 group-hover:scale-125">▶</span>
          {starting ? "Loading Stage" : "Start Game"}
        </button>
        <p className="press-start mt-4 text-[9px] font-black uppercase tracking-[0.18em] text-[#555850]">Press start to continue</p>
        </div>
      </div>
    </div>
  );
}


