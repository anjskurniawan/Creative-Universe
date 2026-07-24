"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type MenuItem = {
  label: string;
  href?: string;
};

export type SubAppMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  onItemClick?: (item: MenuItem, index: number) => void;
  title?: string;
  activeHref?: string;
};

const COMPACT_MENU_ITEM_HEIGHT = 64;

export default function SubAppMenu({
  isOpen,
  onClose,
  menuItems,
  onItemClick,
  title = "KV RETAIL",
  activeHref,
}: SubAppMenuProps) {
  const [menuPivot, setMenuPivot] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoSelectTimerRef = useRef<number | null>(null);
  const isAutoPositioning = useRef(false);

  // Position active index on open
  useEffect(() => {
    if (!isOpen) return;

    const activeIndex = Math.max(
      0,
      menuItems.findIndex((item) => item.href && activeHref?.startsWith(item.href))
    );

    isAutoPositioning.current = true;
    requestAnimationFrame(() => {
      setMenuPivot(activeIndex);
      scrollRef.current?.scrollTo({
        top: activeIndex * COMPACT_MENU_ITEM_HEIGHT,
        behavior: "auto",
      });
      requestAnimationFrame(() => {
        isAutoPositioning.current = false;
      });
    });

    return () => {
      if (autoSelectTimerRef.current) window.clearTimeout(autoSelectTimerRef.current);
    };
  }, [isOpen, menuItems, activeHref]);

  if (!isOpen || typeof document === "undefined") return null;

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (isAutoPositioning.current) return;
    const nextPivot = Math.max(
      0,
      Math.min(
        menuItems.length - 1,
        Math.round(event.currentTarget.scrollTop / COMPACT_MENU_ITEM_HEIGHT)
      )
    );
    setMenuPivot(nextPivot);

    if (autoSelectTimerRef.current) window.clearTimeout(autoSelectTimerRef.current);
    autoSelectTimerRef.current = null;
  };

  const handleScrollEnd = (event: React.UIEvent<HTMLDivElement>) => {
    if (isAutoPositioning.current) return;
    const pivot = Math.max(
      0,
      Math.min(
        menuItems.length - 1,
        Math.round(event.currentTarget.scrollTop / COMPACT_MENU_ITEM_HEIGHT)
      )
    );

    if (autoSelectTimerRef.current) window.clearTimeout(autoSelectTimerRef.current);
    autoSelectTimerRef.current = window.setTimeout(() => {
      const selectedItem = menuItems[pivot];
      if (onItemClick && selectedItem) {
        onItemClick(selectedItem, pivot);
      }
    }, 900);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex min-h-dvh flex-col px-6 py-7 backdrop-blur-2xl bg-[#f3faff]/24 text-[#04044a]"
      role="dialog"
      aria-modal="true"
      aria-label={`Menu ${title}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium uppercase tracking-[0.12em]">{title}</p>
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-medium underline underline-offset-4 focus:outline-none"
        >
          Tutup
        </button>
      </div>

      {menuItems && menuItems.length > 0 ? (
        <nav aria-label={`Menu ${title}`} className="my-auto h-[52dvh] overflow-hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onScrollEnd={handleScrollEnd}
            className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain py-[calc(26dvh-32px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {menuItems.map((item, index) => {
              const distance = Math.abs(index - menuPivot);
              const isPivotActive = distance === 0;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    if (onItemClick) onItemClick(item, index);
                  }}
                  className={`flex h-16 w-full snap-center items-center text-left transition-[opacity,transform,font-size] duration-200 focus:outline-none overflow-hidden ${
                    isPivotActive
                      ? "scale-100 text-5xl font-medium leading-none tracking-[-0.05em] opacity-100"
                      : distance === 1
                      ? "scale-95 text-2xl font-medium opacity-45"
                      : "scale-90 text-xl font-medium opacity-20"
                  }`}
                  aria-current={isPivotActive ? "true" : undefined}
                >
                  <span className="truncate block w-full">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      ) : null}
    </div>,
    document.body
  );
}
