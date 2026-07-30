"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { MaterialIcon } from "@/components/ui/material-icon";
import { OddsCategory, OddsDesignerProfile, OddsTaskAttachment } from "@/features/odds/api";
import { OddsGameboyFrame } from "@/components/odds/odds-gameboy-frame";


export const PIXEL_MASCOT = [
  "0011100",
  "0111110",
  "1101011",
  "1111111",
  "0111110",
  "0011100",
  "0111110",
  "1100011",
] as const;

export const secondaryButtonClass = "inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border-2 border-[#24252b] bg-[#eceee6] px-4 text-xs font-black uppercase tracking-wide text-[#24252b] shadow-[0_3px_0_#24252b] transition duration-150 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_4px_0_#24252b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ba0dcb] active:translate-y-0.5 active:shadow-[0_1px_0_#24252b]";
export const primaryButtonClass = "inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border-2 border-[#24252b] bg-[#ba0dcb] px-5 text-xs font-black uppercase tracking-wide text-white shadow-[0_3px_0_#24252b] transition duration-150 hover:-translate-y-0.5 hover:brightness-90 hover:shadow-[0_4px_0_#24252b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ba0dcb] active:translate-y-0.5 active:shadow-[0_1px_0_#24252b] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[#a9aca2] disabled:text-[#666961]";


