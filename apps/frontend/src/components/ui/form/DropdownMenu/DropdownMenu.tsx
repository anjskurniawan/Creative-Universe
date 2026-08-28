"use client";

import React, { useState, useEffect, useRef } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

export interface DropdownMenuItem {
  value: string;
  label: string;
}

export interface DropdownMenuProps {
  isOpen: boolean;
  items: DropdownMenuItem[];
  onSelect: (value: string) => void;
  className?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  onClose?: () => void;
  onReset?: () => void;
  selectedValues?: string[];
  style?: React.CSSProperties;
}

export function DropdownMenu({
  isOpen,
  items,
  onSelect,
  className = "",
  searchable = items.length > 3,
  searchPlaceholder = "Cari...",
  onClose,
  onReset,
  selectedValues,
  style,
}: DropdownMenuProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  // Reset query pencarian saat dropdown ditutup
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen || !onClose) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !menuRef.current.parentElement?.contains(event.target as Node)
      ) {
        onClose?.();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      ref={menuRef}
      style={style}
      className={`absolute top-[calc(100%+6px)] left-0 w-full bg-white border border-divider rounded-[12px] shadow-lg z-50 flex flex-col max-h-[260px] overflow-hidden animate-fade-in ${className}`}
    >
      {/* Search Bar Input */}
      {searchable && (
        <div className="p-3 border-b border-divider bg-white shrink-0">
          <div className="flex h-12 items-center gap-2 rounded-lg border border-slate-200  px-2">
            <MaterialIcon name="search" className="text-slate-400 text-lg" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm font-sans text-slate-800 placeholder-slate-400 focus:outline-none"
              autoFocus
            />
          </div>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="mt-2 text-xs font-semibold text-cu-muted transition hover:text-cu-ink"
            >
              Reset
            </button>
          )}
        </div>
      )}

      {/* List Items */}
      <div className="dropdown-menu-scrollbar overflow-y-auto flex-1 max-h-[200px]">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.value}
              onClick={() => onSelect(item.value)}
              className="px-4 py-3 hover:bg-slate-50 hover:text-brand text-[#232925] font-sans font-medium text-sm cursor-pointer transition-colors flex items-center justify-between"
            >
              <span>{item.label}</span>
              {selectedValues && (
                <input
                  type="checkbox"
                  checked={selectedValues.includes(item.value)}
                  readOnly
                  className="rounded text-brand focus:ring-brand size-4 cursor-pointer"
                />
              )}
            </div>
          ))
        ) : (
          <div className="flex min-h-[45px] items-center justify-center px-4 py-3 text-center text-slate-400 font-sans font-medium text-sm">
            Tidak ditemukan
          </div>
        )}
      </div>
    </div>
  );
}
