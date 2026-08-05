"use client";

import { catalogItems } from "../data/catalog-items";
import { MenuList } from "./menu-list";

type CatalogSidebarProps = {
  activeItem: string;
  onSelect: (id: string) => void;
};

export function CatalogSidebar({ activeItem, onSelect }: CatalogSidebarProps) {
  return (
    <aside className="flex h-full w-72 shrink-0 flex-col rounded-2xl border border-[#ebebeb] bg-white p-3">
      <div className="flex h-10 items-center px-2 text-sm font-semibold text-[#3b4446]">
        List Component V1
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto" aria-label="Menu component">
        <MenuList items={catalogItems} activeItem={activeItem} onSelect={onSelect} />
      </nav>
    </aside>
  );
}
