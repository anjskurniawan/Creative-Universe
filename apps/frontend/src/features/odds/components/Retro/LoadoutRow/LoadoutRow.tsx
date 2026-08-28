"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";
import { OddsCategory, OddsDesignerProfile, OddsTaskAttachment } from "@/features/odds/api";
import { OddsGameboyFrame } from "@/features/odds/components/Retro/OddsGameboyFrame/OddsGameboyFrame";


export function LoadoutRow({ label, value, active, disabled = false, onClick }: { label: string; value: string; active: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="group flex w-full items-center gap-2 border border-transparent px-2 py-1.5 text-left transition hover:border-[#24252b] hover:bg-[#dfe2d3] disabled:cursor-not-allowed disabled:hover:border-transparent disabled:hover:bg-transparent">
      <span className={`size-2 shrink-0 border border-[#24252b] ${active ? "bg-[#ba0dcb]" : "bg-[#b9bdb1]"}`} />
      <span className="min-w-0 flex-1">
        <span className="block text-[8px] font-black uppercase tracking-[0.14em] text-[#666961]">{label}</span>
        <span className={`mt-0.5 block truncate text-[10px] font-black uppercase ${active ? "text-[#24252b]" : "text-[#777a72]"}`}>{value}</span>
      </span>
      <span className={`text-xs font-black ${disabled ? "opacity-30" : ""}`}>›</span>
    </button>
  );
}
