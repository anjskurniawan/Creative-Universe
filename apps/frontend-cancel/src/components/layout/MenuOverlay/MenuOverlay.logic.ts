import { useEffect, useRef, useState, type UIEvent } from "react";
import { COMPACT_MENU_ITEM_HEIGHT, MENU_OVERLAY_AUTO_SELECT_DELAY } from "./MenuOverlay.config";
import type { MenuOverlayItem } from "./MenuOverlay.types";

export function useMenuOverlayInteraction({
  isOpen,
  menuItems,
  activeHref,
  onItemClick,
}: {
  isOpen: boolean;
  menuItems: MenuOverlayItem[];
  activeHref?: string;
  onItemClick?: (item: MenuOverlayItem, index: number) => void;
}) {
  const [menuPivot, setMenuPivot] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const autoPositioning = useRef(false);

  const selectPivotItem = (pivot: number) => {
    const item = menuItems[pivot];
    if (item) onItemClick?.(item, pivot);
  };

  const scheduleSelection = (pivot: number) => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => selectPivotItem(pivot), MENU_OVERLAY_AUTO_SELECT_DELAY);
  };

  useEffect(() => {
    if (!isOpen || menuItems.length === 0) return;
    const exact = menuItems.findIndex((item) => item.href === activeHref);
    const nested = menuItems
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.href && activeHref?.startsWith(`${item.href}/`))
      .sort((a, b) => (b.item.href?.length ?? 0) - (a.item.href?.length ?? 0))[0]?.index;
    const activeIndex = Math.max(0, exact >= 0 ? exact : nested ?? 0);
    autoPositioning.current = true;
    requestAnimationFrame(() => {
      setMenuPivot(activeIndex);
      scrollRef.current?.scrollTo({ top: activeIndex * COMPACT_MENU_ITEM_HEIGHT, behavior: "auto" });
      requestAnimationFrame(() => { autoPositioning.current = false; });
    });
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
  }, [activeHref, isOpen, menuItems]);

  const pivotFromScroll = (event: UIEvent<HTMLDivElement>) => Math.max(0, Math.min(menuItems.length - 1, Math.round(event.currentTarget.scrollTop / COMPACT_MENU_ITEM_HEIGHT)));
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (autoPositioning.current) return;
    const pivot = pivotFromScroll(event);
    setMenuPivot(pivot);
    scheduleSelection(pivot);
  };

  return { handleScroll, menuPivot, scrollRef };
}
