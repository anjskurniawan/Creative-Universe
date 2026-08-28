"use client";

import { createPortal } from "react-dom";
import { useMenuOverlayInteraction } from "./MenuOverlay.logic";
import type { MenuOverlayProps } from "./MenuOverlay.types";

export type { MenuOverlayItem, MenuOverlayProps } from "./MenuOverlay.types";

export default function MenuOverlay({ isOpen, onClose, menuItems, onItemClick, title = "MENU", activeHref, className = "" }: MenuOverlayProps) {
  const { handleScroll, menuPivot, scrollRef } = useMenuOverlayInteraction({ isOpen, menuItems, activeHref, onItemClick });
  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className={`cu-style fixed inset-0 z-[120] flex min-h-dvh flex-col bg-[#f3faff]/95 px-6 py-7 text-[#04044a] backdrop-blur-2xl ${className}`.trim()} role="dialog" aria-modal="true" aria-label={`Menu ${title}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium uppercase tracking-[0.12em]">{title}</p>
        <button type="button" onClick={onClose} className="text-sm font-medium underline underline-offset-4 focus:outline-none">Tutup</button>
      </div>
      {menuItems.length > 0 && (
        <nav aria-label={`Menu ${title}`} className="my-auto h-[52dvh] overflow-hidden">
          <div ref={scrollRef} onScroll={handleScroll} className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain py-[calc(26dvh-32px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {menuItems.map((item, index) => {
              const distance = Math.abs(index - menuPivot);
              const active = distance === 0;
              return <button key={`${item.href ?? item.label}-${index}`} type="button" onClick={() => onItemClick?.(item, index)} aria-current={active ? "true" : undefined} className={`flex h-16 w-full snap-center items-center overflow-hidden text-left transition-[opacity,transform,font-size] duration-200 focus:outline-none ${active ? "scale-100 text-5xl font-medium leading-none tracking-[-0.05em] opacity-100" : distance === 1 ? "scale-95 text-2xl font-medium opacity-45" : "scale-90 text-xl font-medium opacity-20"}`}><span className="block w-full truncate">{item.label}</span></button>;
            })}
          </div>
        </nav>
      )}
    </div>,
    document.body,
  );
}
