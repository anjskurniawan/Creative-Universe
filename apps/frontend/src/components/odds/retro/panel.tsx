"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { MaterialIcon } from "@/components/ui/material-icon";
import { OddsCategory, OddsDesignerProfile, OddsTaskAttachment } from "@/features/odds/api";
import { OddsGameboyFrame } from "@/components/odds/odds-gameboy-frame";


export function Panel({ step, title, icon, children, fill = false }: { step?: string; title: string; icon: string; children: ReactNode; fill?: boolean }) {
  return (
    <section className={`${fill ? "flex min-h-0 flex-1 flex-col p-1 sm:p-2" : "min-h-[420px] p-1 sm:p-2"} bg-[#dfe2d3]`} style={fill ? { paddingBottom: 14 } : undefined}>
      <div className={`${fill ? "mb-3 shrink-0" : "mb-5"} flex items-center gap-2 border-b-2 border-[#24252b] pb-3`}>
        {step && <span className="flex size-8 items-center justify-center border-2 border-[#24252b] bg-[#ba0dcb] text-xs font-black text-white shadow-[2px_2px_0_#24252b]">{step}</span>}
        <span className="flex size-8 items-center justify-center border-2 border-[#24252b] bg-[#eceee6]"><MaterialIcon name={icon} size="sm" /></span>
        <h2 className="text-base font-black uppercase tracking-[0.08em] text-[#24252b]">{title}</h2>
      </div>
      {children}
    </section>
  );
}


export function StepActions({ children }: { children: ReactNode }) {
  return <div className="relative bottom-[6px] mt-auto flex shrink-0 flex-wrap items-center justify-end gap-2 border-t-2 border-[#24252b] pt-3">{children}</div>;
}


