"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export type MenuItem = {
  id: string;
  label: string;
  children?: MenuItem[];
};

type MenuListProps = {
  items: MenuItem[];
  activeItem: string;
  onSelect: (id: string) => void;
  level?: number;
};

export function MenuList({ items, activeItem, onSelect, level = 1 }: MenuListProps) {
  const [openItems, setOpenItems] = useState(
    () => new Set(items.filter((item) => item.children).map((item) => item.id))
  );

  const toggleItem = (id: string) => {
    setOpenItems((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <ul className="flex flex-col gap-1" aria-label={level === 1 ? "Menu contoh" : undefined}>
      {items.map((item) => {
        const hasChildren = Boolean(item.children?.length);
        const isOpen = openItems.has(item.id);
        const itemClassName = activeItem === item.id
          ? "bg-[#e5f7ff] font-semibold text-[#0077bf]"
          : level === 1
            ? "font-semibold text-[#3b4446] hover:bg-[#f3fbff]"
            : "text-[#5f6b73] hover:bg-[#f3fbff]";

        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => hasChildren ? toggleItem(item.id) : onSelect(item.id)}
              aria-expanded={hasChildren ? isOpen : undefined}
              className={`flex h-9 w-full items-center gap-2 rounded-lg pr-2 text-left text-xs transition ${itemClassName}`}
              style={{ paddingLeft: `${8 + (level - 1) * 16}px` }}
            >
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {hasChildren && (
                <MaterialIcon
                  name="expand_more"
                  size="sm"
                  className={`shrink-0 text-[#7d7c7c] transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              )}
            </button>
            {hasChildren && isOpen && (
              <MenuList items={item.children!} activeItem={activeItem} onSelect={onSelect} level={level + 1} />
            )}
          </li>
        );
      })}
    </ul>
  );
}
