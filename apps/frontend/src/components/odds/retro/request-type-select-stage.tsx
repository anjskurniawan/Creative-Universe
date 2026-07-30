"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { MaterialIcon } from "@/components/ui/material-icon";
import { OddsCategory, OddsDesignerProfile, OddsTaskAttachment } from "@/features/odds/api";
import { OddsGameboyFrame } from "@/components/odds/odds-gameboy-frame";


export function RequestTypeSelectStage({ onContinue }: { onContinue: () => void }) {
  return (
    <section className="class-select-stage relative flex h-auto max-w-4xl w-full mx-auto my-auto flex-col overflow-hidden border-2 border-[#24252b] bg-[#c9ccc0] p-2 shadow-[inset_0_0_0_2px_#eceee6] sm:p-3 rounded-lg">
      <span className="pointer-events-none absolute -left-8 -top-8 size-20 rotate-45 border-[12px] border-[#ba0dcb] opacity-40" />
      <span className="pointer-events-none absolute -bottom-10 -right-10 size-28 rotate-45 border-[14px] border-[#24252b] opacity-10" />

      <header className="relative flex shrink-0 flex-col items-center justify-center gap-1 border-b-2 border-[#24252b] bg-[#24252b] px-3 py-2 text-center text-[#dfe2d3] sm:px-4 sm:py-3 rounded-t">
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#f2b8f6]">Request Type Select</p>
        <h2 className="text-sm font-black uppercase tracking-[0.04em] text-[#dfe2d3] sm:text-2xl sm:tracking-[0.06em]">Mau buat project apa hari ini ?</h2>
      </header>

      <div className="retro-scrollbar relative mt-2 flex flex-col items-center justify-center gap-4 p-1 sm:mt-3 sm:gap-6 md:flex-row md:overflow-visible">
        <div className="group relative flex w-full max-w-sm flex-col overflow-hidden border-[3px] border-[#24252b] bg-[#dfe2d3] text-left shadow-[5px_5px_0_#24252b] transition-transform duration-150 hover:-translate-y-1" role="option" aria-selected="true">
          <div className="flex items-center justify-between border-b-2 border-[#24252b] bg-[#ba0dcb] px-3 py-2 text-white">
            <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em]"><span className="animate-pulse">▶</span> Option 01</span>
            <span className="border border-white/70 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.14em]">Available</span>
          </div>

          <div
            className="relative flex min-h-0 items-center justify-center overflow-hidden border-b-2 border-[#24252b] py-8 sm:min-h-48"
            style={{
              backgroundImage: "linear-gradient(rgba(36,37,43,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(36,37,43,0.08) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          >
            <span className="absolute left-3 top-3 border-2 border-[#24252b] bg-[#eceee6] px-2 py-1 text-[8px] font-black uppercase tracking-[0.14em]">Type 01</span>
            <span className="absolute right-3 top-3 text-[8px] font-black uppercase tracking-[0.14em]">Ready</span>
            <RetroRequestTypeIcon icon="brush" label="Design brush icon" />
          </div>

          <div className="flex shrink-0 items-end justify-between gap-2 bg-[#eceee6] p-2 sm:gap-3 sm:p-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#6b6e67]">Request Type</p>
              <h3 className="mt-0.5 text-lg font-black uppercase tracking-[-0.04em] sm:mt-1 sm:text-2xl">Design</h3>
              <p className="hidden text-[9px] font-black uppercase tracking-[0.1em] text-[#555850] sm:mt-1 sm:block">Static Visual Asset</p>
            </div>
            <button type="button" onClick={onContinue} className="group/select flex min-h-10 min-w-28 cursor-pointer items-center justify-between gap-3 border-2 border-[#24252b] bg-[#ba0dcb] px-3 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-white shadow-[0_3px_0_#24252b] transition-[transform,background-color,box-shadow] duration-150 hover:-translate-y-0.5 hover:bg-[#a80cba] hover:shadow-[0_4px_0_#24252b] active:translate-y-0.5 active:shadow-none">
              Select <span className="transition-transform group-hover/select:translate-x-1">▶</span>
            </button>
          </div>
        </div>

        <div className="relative flex w-full max-w-sm cursor-not-allowed flex-col overflow-hidden border-[3px] border-[#24252b] bg-[#aeb1a7] text-left text-[#555850] shadow-[3px_3px_0_#24252b]" aria-label="Video type locked" aria-disabled="true">
          <span className="absolute inset-0 z-10 opacity-15" style={{ backgroundImage: "repeating-linear-gradient(135deg, #24252b 0 2px, transparent 2px 10px)" }} />
          <div className="relative z-20 flex items-center justify-between border-b-2 border-[#24252b] bg-[#8f938a] px-3 py-2">
            <span className="text-[9px] font-black uppercase tracking-[0.16em]">Option 02</span>
            <span className="border border-[#24252b] bg-[#d4d7cc] px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.14em]">Locked</span>
          </div>
          <div className="relative flex min-h-0 items-center justify-center overflow-hidden border-b-2 border-[#24252b] py-8 sm:min-h-48">
            <span className="absolute left-3 top-3 border-2 border-[#24252b] bg-[#d4d7cc] px-2 py-1 text-[8px] font-black uppercase tracking-[0.14em]">Type 02</span>
            <RetroRequestTypeIcon icon="videocam" label="Video camera icon" muted />
            <span className="absolute bottom-4 right-4 z-20 border-2 border-[#24252b] bg-[#24252b] px-3 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-[#dfe2d3]">Future Update</span>
          </div>
          <div className="relative z-20 flex shrink-0 items-end justify-between gap-2 bg-[#b9bdb1] p-2 sm:gap-3 sm:p-4">
            <span>
              <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-[#6b6e67]">Request Type</span>
              <span className="mt-0.5 block text-lg font-black uppercase tracking-[-0.04em] sm:mt-1 sm:text-2xl">Video</span>
              <span className="mt-1 hidden text-[9px] font-black uppercase tracking-[0.1em] sm:block">Motion Visual Asset</span>
            </span>
            <button type="button" disabled className="min-h-10 min-w-28 cursor-not-allowed border-2 border-[#24252b] bg-[#d4d7cc] px-3 py-2 text-[8px] font-black uppercase tracking-[0.14em] text-[#777a72]">Locked</button>
          </div>
        </div>
      </div>
    </section>
  );
}


export function RetroRequestTypeIcon({ icon, label, muted = false }: { icon: "brush" | "videocam"; label: string; muted?: boolean }) {
  return (
    <span className={`relative z-20 flex size-20 items-center justify-center border-[3px] border-[#24252b] bg-[#eceee6] shadow-[4px_4px_0_#24252b] transition-transform duration-150 group-hover:-translate-y-2 group-hover:rotate-[-2deg] sm:size-32 sm:border-[4px] sm:shadow-[7px_7px_0_#24252b] ${muted ? "opacity-60 grayscale" : ""}`} aria-label={label} role="img">
      <span className="absolute inset-1 border-2 border-[#24252b]/20" />
      <MaterialIcon name={icon} size="lg" className={`scale-[1.8] sm:scale-[2.6] ${muted ? "text-[#666961]" : "text-[#ba0dcb]"}`} />
      <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-[#24252b]/20" />
    </span>
  );
}


