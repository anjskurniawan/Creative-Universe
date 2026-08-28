"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";
import { OddsCategory, OddsDesignerProfile, OddsTaskAttachment } from "@/features/odds/api";
import { OddsGameboyFrame } from "@/features/odds/components/Retro/OddsGameboyFrame/OddsGameboyFrame";
import { primaryButtonClass, secondaryButtonClass } from "@/features/odds/components/Retro/Retro.config";
import type { PointerEvent as ReactPointerEvent } from "react";


export function CategoryInventoryStage({
  categories,
  selectedCategoryId,
  onSelect,
  onBack,
  onContinue,
}: {
  categories: OddsCategory[];
  selectedCategoryId: string;
  onSelect: (category: OddsCategory) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const selectedCategory = categories.find((category) => String(category.id) === selectedCategoryId) ?? null;
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const categoryDragRef = useRef({ pointerId: -1, startY: 0, scrollTop: 0, moved: false });
  const [categoryScrollbar, setCategoryScrollbar] = useState({ visible: false, top: 0, height: 48 });

  const syncCategoryScrollbar = () => {
    const element = categoryScrollRef.current;
    if (!element) return;

    const scrollRange = element.scrollHeight - element.clientHeight;
    const height = Math.max(48, element.clientHeight * (element.clientHeight / element.scrollHeight));
    const top = scrollRange > 0 ? (element.scrollTop / scrollRange) * (element.clientHeight - height) : 0;
    setCategoryScrollbar({ visible: scrollRange > 1, top, height });
  };

  useEffect(() => {
    const element = categoryScrollRef.current;
    if (!element) return;

    syncCategoryScrollbar();
    const observer = new ResizeObserver(syncCategoryScrollbar);
    observer.observe(element);
    window.addEventListener("resize", syncCategoryScrollbar);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncCategoryScrollbar);
    };
  }, [categories.length]);

  const startCategoryDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    categoryDragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      scrollTop: event.currentTarget.scrollTop,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveCategoryDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = categoryDragRef.current;
    if (drag.pointerId !== event.pointerId) return;
    const distance = event.clientY - drag.startY;
    if (Math.abs(distance) > 4) drag.moved = true;
    event.currentTarget.scrollTop = drag.scrollTop - distance;
  };

  const finishCategoryDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (categoryDragRef.current.pointerId !== event.pointerId) return;
    categoryDragRef.current.pointerId = -1;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section className="category-inventory-stage relative flex h-full min-h-0 flex-1 flex-col overflow-hidden border-2 border-[#24252b] bg-[#c9ccc0] p-2 shadow-[inset_0_0_0_2px_#eceee6] sm:min-h-[440px] sm:p-3">
      <span className="pointer-events-none absolute -right-7 -top-7 size-20 rotate-45 border-[11px] border-[#ba0dcb] opacity-30" />

      <header className="relative flex shrink-0 items-center justify-between gap-2 border-b-2 border-[#24252b] bg-[#24252b] px-3 py-2 text-[#dfe2d3] sm:items-end sm:gap-3 sm:px-4 sm:py-3">
        <div className="min-w-0">
          <p className="hidden text-[9px] font-black uppercase tracking-[0.22em] text-[#f2b8f6] sm:block">Skill Inventory</p>
          <h2 className="whitespace-nowrap text-xs font-black uppercase tracking-[0.02em] text-[#dfe2d3] min-[360px]:text-sm min-[360px]:tracking-[0.04em] sm:mt-1 sm:text-2xl sm:tracking-[0.06em]">Equip Category</h2>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.08em] sm:gap-2 sm:text-[9px] sm:tracking-[0.12em]"><span className="size-2 bg-[#ba0dcb]" /><span className="sm:hidden">{categories.length}</span><span className="hidden sm:inline">{categories.length} Slots</span></div>
      </header>

      {categories.length > 0 ? (
        <div className="relative mt-2 min-h-0 flex-1 sm:mt-3">
        <div
          ref={categoryScrollRef}
          onScroll={syncCategoryScrollbar}
          onPointerDown={startCategoryDrag}
          onPointerMove={moveCategoryDrag}
          onPointerUp={finishCategoryDrag}
          onPointerCancel={finishCategoryDrag}
          className={`retro-scrollbar grid h-full touch-none auto-rows-max grid-cols-1 gap-2 overflow-y-auto overscroll-contain p-1 sm:touch-pan-y sm:grid-cols-3 sm:gap-3 lg:grid-cols-5 2xl:grid-cols-6 ${categoryScrollbar.visible ? "pr-7" : "pr-2"}`}
        >
          {categories.map((category) => {
            const selected = selectedCategoryId === String(category.id);

            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  if (categoryDragRef.current.moved) {
                    categoryDragRef.current.moved = false;
                    return;
                  }
                  onSelect(category);
                }}
                className={`group relative flex min-h-16 min-w-0 touch-manipulation items-center justify-start overflow-hidden border-[3px] border-[#24252b] px-4 py-3 text-left shadow-[3px_3px_0_#24252b] transition-[transform,background-color,box-shadow] duration-150 hover:-translate-y-1 hover:shadow-[5px_5px_0_#24252b] active:translate-y-0.5 active:shadow-[1px_1px_0_#24252b] sm:aspect-square sm:justify-center sm:p-4 sm:text-center ${selected ? "bg-[#ba0dcb] text-white" : "bg-[#eceee6] text-[#24252b]"}`}
              >
                {selected && <span className="absolute right-2 top-2 border border-white/70 px-2 py-0.5 text-[7px] font-black uppercase tracking-[0.12em] text-white">Selected</span>}
                <span className="line-clamp-2 pr-20 text-base font-black uppercase leading-tight tracking-[-0.02em] sm:line-clamp-4 sm:pr-0 sm:text-lg">{category.name}</span>
              </button>
            );
          })}
        </div>

        {categoryScrollbar.visible && (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-4 border-2 border-[#24252b] bg-[#8f938a] shadow-[inset_0_0_0_2px_#c9ccc0]" aria-hidden="true">
            <span className="absolute inset-x-0 top-0 h-3 border-b-2 border-[#24252b] bg-[#c9ccc0] text-center text-[7px] font-black leading-[10px] text-[#24252b]">▲</span>
            <span className="absolute inset-x-0 bottom-0 h-3 border-t-2 border-[#24252b] bg-[#c9ccc0] text-center text-[7px] font-black leading-[10px] text-[#24252b]">▼</span>
            <span
              className="absolute left-0.5 right-0.5 border-2 border-[#24252b] bg-[#ba0dcb] shadow-[inset_0_0_0_2px_#dfe2d3] transition-transform duration-75"
              style={{ height: `${Math.max(24, categoryScrollbar.height - 24)}px`, transform: `translateY(${categoryScrollbar.top + 12}px)` }}
            >
              <span className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 gap-0.5"><span className="size-0.5 bg-[#24252b]" /><span className="size-0.5 bg-[#24252b]" /><span className="size-0.5 bg-[#24252b]" /></span>
            </span>
          </div>
        )}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center border-x-2 border-b-2 border-[#24252b] bg-[#dfe2d3] p-6 text-center text-[10px] font-black uppercase tracking-[0.12em]">No active categories available.</div>
      )}

      <div className="relative mt-3 flex items-center justify-end gap-2">
        <button type="button" onClick={onBack} className={secondaryButtonClass}>Back</button>
        <button type="button" onClick={onContinue} disabled={!selectedCategory} className={primaryButtonClass}>Next <MaterialIcon name="arrow_forward" size="sm" /></button>
      </div>
    </section>
  );
}
