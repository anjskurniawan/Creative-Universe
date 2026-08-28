"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";
import { OddsCategory, OddsDesignerProfile, OddsTaskAttachment } from "@/features/odds/api";
import { OddsGameboyFrame } from "@/features/odds/components/Retro/OddsGameboyFrame/OddsGameboyFrame";
import { PIXEL_MASCOT, primaryButtonClass, secondaryButtonClass } from "@/features/odds/components/Retro/Retro.config";

export function DesignerCharacterSelectStage({
  profiles,
  todayCapacity,
  selectedUserId,
  recommendedUserId,
  onSelect,
  onBack,
  onContinue,
}: {
  profiles: OddsDesignerProfile[];
  todayCapacity: number;
  selectedUserId: string;
  recommendedUserId: string | null;
  onSelect: (profile: OddsDesignerProfile) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const availableCount = profiles.filter((profile) => profile.status === "available").length;
  const rosterScrollRef = useRef<HTMLDivElement>(null);
  const [rosterScrollbar, setRosterScrollbar] = useState({ visible: false, top: 0, height: 48 });

  const syncRosterScrollbar = () => {
    const element = rosterScrollRef.current;
    if (!element) return;

    const scrollRange = element.scrollHeight - element.clientHeight;
    const height = Math.max(48, element.clientHeight * (element.clientHeight / element.scrollHeight));
    const top = scrollRange > 0 ? (element.scrollTop / scrollRange) * (element.clientHeight - height) : 0;
    setRosterScrollbar({ visible: scrollRange > 1, top, height });
  };

  useEffect(() => {
    const element = rosterScrollRef.current;
    if (!element) return;

    syncRosterScrollbar();
    const observer = new ResizeObserver(syncRosterScrollbar);
    observer.observe(element);
    window.addEventListener("resize", syncRosterScrollbar);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncRosterScrollbar);
    };
  }, [profiles.length]);

  return (
    <section className="designer-character-stage relative flex min-h-[440px] flex-1 flex-col overflow-hidden border-2 border-[#24252b] bg-[#c9ccc0] p-2 shadow-[inset_0_0_0_2px_#eceee6] sm:p-3">
      <span className="pointer-events-none absolute -left-8 -top-8 size-20 rotate-45 border-[12px] border-[#ba0dcb] opacity-30" />

      <header className="relative flex shrink-0 items-center justify-between gap-2 border-b-2 border-[#24252b] bg-[#24252b] px-3 py-2 text-[#dfe2d3] sm:items-end sm:gap-3 sm:px-4 sm:py-3">
        <div className="min-w-0">
          <p className="hidden text-[9px] font-black uppercase tracking-[0.22em] text-[#f2b8f6] sm:block">Creative Roster</p>
          <h2 className="whitespace-nowrap text-xs font-black uppercase tracking-[0.02em] text-[#dfe2d3] min-[360px]:text-sm min-[360px]:tracking-[0.04em] sm:mt-1 sm:text-2xl sm:tracking-[0.06em]">Choose Your Creative</h2>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.08em] sm:block sm:text-right sm:tracking-[0.12em]"><span className="size-2 bg-[#ba0dcb] sm:hidden" /><span className="text-[#f2b8f6] sm:block sm:text-[#ba0dcb]">{availableCount}<span className="hidden sm:inline"> Ready</span></span><span className="hidden text-[#969a90] sm:mt-1 sm:block">{profiles.length} Roster</span></div>
      </header>

      {profiles.length > 0 ? (
        <div className="relative mt-3 min-h-0 flex-1">
          <div ref={rosterScrollRef} onScroll={syncRosterScrollbar} className={`retro-scrollbar grid h-full auto-rows-max grid-cols-2 gap-3 overflow-y-auto p-3 sm:grid-cols-3 lg:grid-cols-6 ${rosterScrollbar.visible ? "pr-7" : ""}`}>
            {profiles.map((profile) => {
            const name = profile.user?.name ?? `User #${profile.user_id}`;
            const avatar = profile.user?.avatar ?? profile.user?.avatar_path;
            const available = profile.status === "available";
            const selected = selectedUserId === String(profile.user_id);
            const recommended = recommendedUserId === String(profile.user_id);

              return (
              <button
                key={profile.id}
                type="button"
                disabled={!available}
                aria-pressed={selected}
                aria-label={`${name}, ${available ? "available" : "locked"}${recommended ? ", recommended" : ""}`}
                onClick={() => available && onSelect(profile)}
                className={`group relative aspect-[4/5] min-w-0 origin-center border-[3px] border-[#24252b] bg-[#eceee6] shadow-[3px_3px_0_#24252b] transition-[transform,filter,box-shadow] duration-150 ${
                  available ? "cursor-pointer hover:z-30 hover:scale-110 hover:shadow-[5px_5px_0_#24252b]" : "cursor-not-allowed grayscale"
                } ${selected ? "z-20 scale-105 ring-4 ring-[#ba0dcb] ring-offset-2 ring-offset-[#c9ccc0]" : ""} ${recommended ? "ring-2 ring-[#ba0dcb] ring-offset-2 ring-offset-[#c9ccc0]" : ""}`}
              >
                <span className="absolute inset-x-0 top-0 bottom-9 overflow-hidden bg-[#b9bdb1]">
                  {avatar ? (
                    <span className="absolute inset-0 bg-cover bg-center transition-transform duration-200 group-hover:scale-110" style={{ backgroundImage: `url("${avatar}")` }} role="img" aria-label={`Foto ${name}`} />
                  ) : (
                    <span className={`absolute inset-0 flex items-center justify-center text-4xl font-black ${available ? "bg-[#dfe2d3] text-[#ba0dcb]" : "bg-[#8f938a] text-[#555850]"}`}>{name.slice(0, 1).toUpperCase()}</span>
                  )}

                  <span className={`absolute inset-x-0 bottom-0 z-20 bg-[#24252b]/95 px-2 py-2 text-left text-[#dfe2d3] transition-transform duration-150 ${selected ? "translate-y-0" : "translate-y-full group-hover:translate-y-0"}`}>
                    <span className="block text-[7px] font-black uppercase tracking-[0.12em] text-[#f2b8f6]">{profile.status.replace("_", " ")}</span>
                    <span className="mt-1 block text-[7px] font-black uppercase tracking-[0.08em]">Status: {capacityLabel(profile, todayCapacity)}</span>
                  </span>

                  {!available && (
                    <span className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#24252b]/65 text-[#dfe2d3]">
                      <span className="flex size-9 items-center justify-center border-2 border-[#dfe2d3] bg-[#555850]"><MaterialIcon name="lock" size="sm" /></span>
                      <span className="mt-2 text-[7px] font-black uppercase tracking-[0.12em]">Unavailable</span>
                    </span>
                  )}
                </span>

                <span className={`absolute inset-x-0 bottom-0 flex h-9 items-center justify-center border-t-2 border-[#24252b] px-1 ${selected ? "bg-[#ba0dcb] text-white" : available ? "bg-[#eceee6] text-[#24252b]" : "bg-[#8f938a] text-[#555850]"}`}>
                  <span className="block max-w-full truncate text-[8px] font-black uppercase tracking-[0.04em]" title={name}>{name}</span>
                </span>

                {recommended && available && (
                  <span className="group/recommend absolute left-1 top-1 z-40 border-2 border-[#24252b] bg-[#ba0dcb] px-1.5 py-0.5 text-[7px] font-black uppercase tracking-[0.1em] text-white shadow-[2px_2px_0_#24252b]">
                    ★ Rec
                    <span role="tooltip" className="pointer-events-none absolute left-0 top-full mt-1 w-32 border-2 border-[#24252b] bg-[#eceee6] px-2 py-1.5 text-left text-[7px] font-black uppercase leading-3 tracking-[0.08em] text-[#24252b] opacity-0 shadow-[3px_3px_0_#24252b] transition-opacity group-hover/recommend:opacity-100">Best match for this category</span>
                  </span>
                )}

                {selected && <span className="absolute right-1 top-1 z-40 flex size-6 items-center justify-center border-2 border-[#24252b] bg-[#eceee6] text-[#ba0dcb] shadow-[2px_2px_0_#24252b]"><MaterialIcon name="check" size="sm" /></span>}
              </button>
              );
            })}
          </div>

          {rosterScrollbar.visible && (
            <div className="pointer-events-none absolute inset-y-0 right-0 w-4 border-2 border-[#24252b] bg-[#8f938a] shadow-[inset_0_0_0_2px_#c9ccc0]" aria-hidden="true">
              <span className="absolute inset-x-0 top-0 h-3 border-b-2 border-[#24252b] bg-[#c9ccc0] text-center text-[7px] font-black leading-[10px] text-[#24252b]">▲</span>
              <span className="absolute inset-x-0 bottom-0 h-3 border-t-2 border-[#24252b] bg-[#c9ccc0] text-center text-[7px] font-black leading-[10px] text-[#24252b]">▼</span>
              <span
                className="absolute left-0.5 right-0.5 border-2 border-[#24252b] bg-[#ba0dcb] shadow-[inset_0_0_0_2px_#dfe2d3] transition-transform duration-75"
                style={{ height: `${Math.max(24, rosterScrollbar.height - 24)}px`, transform: `translateY(${rosterScrollbar.top + 12}px)` }}
              >
                <span className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 gap-0.5"><span className="size-0.5 bg-[#24252b]" /><span className="size-0.5 bg-[#24252b]" /><span className="size-0.5 bg-[#24252b]" /></span>
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-[10px] font-black uppercase tracking-[0.12em]">No creatives available for this category.</div>
      )}

      <div className="relative mt-3 flex items-center justify-end gap-2">
        <button type="button" onClick={onBack} className={secondaryButtonClass}>Back</button>
        <button type="button" onClick={onContinue} disabled={!selectedUserId} className={primaryButtonClass}>Next <MaterialIcon name="arrow_forward" size="sm" /></button>
      </div>
    </section>
  );
}

function matchesSpecialization(profile: OddsDesignerProfile, categoryId: string): boolean {
  if (!categoryId) return true;

  const specializations = profile.specializations ?? [];
  return specializations.length === 0
    || specializations.includes(Number(categoryId))
    || specializations.includes(categoryId);
}

function capacityLabel(profile: OddsDesignerProfile, todayCapacity: number): string {
  const todayStr = new Date().toLocaleDateString("en-CA");
  if (profile.leave_dates?.includes(todayStr)) return "Sedang Cuti";
  if (profile.current_load_minutes >= todayCapacity) return "Full Load Today";
  return "Available";
}

function designerSort(left: OddsDesignerProfile, right: OddsDesignerProfile, todayCapacity: number): number {
  const leftOff = left.status === "off" ? 1 : 0;
  const rightOff = right.status === "off" ? 1 : 0;
  const leftLeave = capacityLabel(left, todayCapacity) === "Sedang Cuti" ? 1 : 0;
  const rightLeave = capacityLabel(right, todayCapacity) === "Sedang Cuti" ? 1 : 0;
  const leftFull = capacityLabel(left, todayCapacity) === "Full Load Today" ? 1 : 0;
  const rightFull = capacityLabel(right, todayCapacity) === "Full Load Today" ? 1 : 0;

  return leftOff - rightOff
    || leftLeave - rightLeave
    || leftFull - rightFull;
}

function recommendDesigner(profiles: OddsDesignerProfile[], category: OddsCategory | null | undefined): OddsDesignerProfile | null {
  const todayStr = new Date().toLocaleDateString("en-CA");
  const matching = profiles
    .filter((profile) => profile.is_active && profile.status === "available" && !profile.leave_dates?.includes(todayStr))
    .filter((profile) => matchesSpecialization(profile, category ? String(category.id) : ""))
    .sort((left, right) => designerSort(left, right, 420));

  return matching[0] ?? null;
}

function selectedDesignerName(userId: string, profiles: OddsDesignerProfile[]): string | null {
  const profile = profiles.find((item) => String(item.user_id) === userId);
  return profile?.user?.name ?? (profile ? `User #${profile.user_id}` : null);
}
