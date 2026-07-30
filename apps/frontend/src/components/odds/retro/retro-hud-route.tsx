"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { MaterialIcon } from "@/components/ui/material-icon";
import { OddsCategory, OddsDesignerProfile, OddsTaskAttachment } from "@/features/odds/api";
import { OddsGameboyFrame } from "@/components/odds/odds-gameboy-frame";


export function RetroHudRoute({
  steps,
  currentStep,
  syncPercent,
  onSelect,
}: {
  steps: ReadonlyArray<{ label: string; detail: string }>;
  currentStep: number;
  syncPercent: number;
  onSelect: (step: number) => void;
}) {
  return (
    <nav className="overflow-hidden rounded-lg border-2 border-[#24252b] bg-[#24252b] text-[#dfe2d3] shadow-[inset_0_0_0_2px_#555850]" aria-label={`Rute quest, tahap ${currentStep} dari ${steps.length}`}>
      <div className="flex items-end justify-between border-b border-[#dfe2d3]/40 px-3 py-2">
        <span>
          <span className="block text-[7px] font-black uppercase tracking-[0.18em] text-[#f2b8f6]">Quest Route</span>
          <span className="mt-0.5 block text-[9px] font-black uppercase tracking-[0.12em]">Stage {String(currentStep).padStart(2, "0")}</span>
        </span>
        <span className="text-lg font-black leading-none text-[#ba0dcb]">{String(currentStep).padStart(2, "0")}<span className="text-[9px] text-[#dfe2d3]">/{String(steps.length).padStart(2, "0")}</span></span>
      </div>

      <div className="px-3 py-2">
        {steps.map((item, index) => {
          const step = index + 1;
          const completed = step < currentStep;
          const active = step === currentStep;
          const available = step <= currentStep;

          return (
            <div key={item.label} className="relative flex min-h-8 gap-2">
              <div className="relative flex w-5 shrink-0 justify-center">
                {index < steps.length - 1 && <span className={`absolute left-1/2 top-5 h-[calc(100%-12px)] w-0.5 -translate-x-1/2 ${step < currentStep ? "bg-[#ba0dcb]" : "bg-[#666961]"}`} />}
                <button
                  type="button"
                  disabled={!available}
                  onClick={() => available && onSelect(step)}
                  aria-current={active ? "step" : undefined}
                  aria-label={`${completed ? "Complete" : active ? "Active" : "Locked"}: ${item.label}`}
                  className={`relative z-10 mt-0.5 flex size-5 items-center justify-center border text-[8px] font-black transition-transform ${
                    active
                      ? "animate-pulse border-[#dfe2d3] bg-[#ba0dcb] text-white shadow-[2px_2px_0_#dfe2d3]"
                      : completed
                        ? "cursor-pointer border-[#dfe2d3] bg-[#dfe2d3] text-[#24252b] hover:scale-110"
                        : "cursor-not-allowed border-[#777a72] bg-[#3d3f45] text-[#969a90]"
                  }`}
                >
                  {completed ? "✓" : active ? "●" : "?"}
                </button>
              </div>
              <span className={`min-w-0 flex-1 pb-2 ${active ? "text-[#dfe2d3]" : completed ? "text-[#c9ccc0]" : "text-[#777a72]"}`}>
                <span className="block truncate text-[8px] font-black uppercase tracking-[0.1em]">{active || completed ? item.label : "???"}</span>
                {active && <span className="mt-0.5 block truncate text-[7px] font-black uppercase tracking-[0.08em] text-[#f2b8f6]">{item.detail}</span>}
              </span>
            </div>
          );
        })}
      </div>

      <div className="border-t border-[#dfe2d3]/40 px-3 py-2">
        <div className="mb-1 flex items-center justify-between text-[7px] font-black uppercase tracking-[0.12em]"><span>Sync</span><span>{syncPercent}%</span></div>
        <div className="h-2 border border-[#dfe2d3] bg-[#555850] p-px"><div className="h-full bg-[#ba0dcb] transition-[width] duration-300" style={{ width: `${syncPercent}%` }} /></div>
      </div>
    </nav>
  );
}


