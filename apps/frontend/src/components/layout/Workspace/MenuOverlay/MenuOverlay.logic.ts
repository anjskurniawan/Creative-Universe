"use client";

import { useEffect, useRef, useState, type UIEvent } from "react";
import {
  COMPACT_MENU_ITEM_HEIGHT,
  MENU_OVERLAY_AUTO_SELECT_DELAY,
} from "./MenuOverlay.config";
import type { MenuOverlayProps } from "./MenuOverlay.types";

type MenuOverlayInteractionProps = Pick<
  MenuOverlayProps,
  "isOpen" | "menuItems" | "activeHref" | "onItemClick"
>;

export function useMenuOverlayInteraction({
  isOpen,
  menuItems,
  activeHref,
  onItemClick,
}: MenuOverlayInteractionProps) {
  const [menuPivot, setMenuPivot] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoSelectTimerRef = useRef<number | null>(null);
  const isAutoPositioning = useRef(false);

  const selectPivotItem = (pivot: number) => {
    const selectedItem = menuItems[pivot];
    if (onItemClick && selectedItem) onItemClick(selectedItem, pivot);
  };

  const schedulePivotSelection = (pivot: number) => {
    if (autoSelectTimerRef.current) window.clearTimeout(autoSelectTimerRef.current);
    autoSelectTimerRef.current = window.setTimeout(
      () => selectPivotItem(pivot),
      MENU_OVERLAY_AUTO_SELECT_DELAY
    );
  };

  useEffect(() => {
    if (!isOpen) return;

    const exactActiveIndex = menuItems.findIndex((item) => item.href === activeHref);
    const nestedActiveIndex = menuItems
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.href && activeHref?.startsWith(`${item.href}/`))
      .sort(
        (left, right) =>
          (right.item.href?.length ?? 0) - (left.item.href?.length ?? 0)
      )[0]?.index;
    const activeIndex = Math.max(
      0,
      exactActiveIndex >= 0 ? exactActiveIndex : (nestedActiveIndex ?? 0)
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

  const pivotFromScroll = (event: UIEvent<HTMLDivElement>) =>
    Math.max(
      0,
      Math.min(
        menuItems.length - 1,
        Math.round(event.currentTarget.scrollTop / COMPACT_MENU_ITEM_HEIGHT)
      )
    );

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (isAutoPositioning.current) return;
    const nextPivot = pivotFromScroll(event);
    setMenuPivot(nextPivot);
    schedulePivotSelection(nextPivot);
  };

  const handleScrollEnd = (event: UIEvent<HTMLDivElement>) => {
    if (isAutoPositioning.current) return;
    schedulePivotSelection(pivotFromScroll(event));
  };

  return { handleScroll, handleScrollEnd, menuPivot, scrollRef };
}
