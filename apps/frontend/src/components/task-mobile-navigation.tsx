"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/material-icon";

export type TaskMobileNavigationItem = {
  label: string;
  icon: string;
  href?: string;
};

type TaskMobileNavigationProps = {
  items: TaskMobileNavigationItem[];
  activeLabel?: string;
  onItemSelect?: (item: TaskMobileNavigationItem) => void;
};

export function TaskMobileNavigation({ items, activeLabel, onItemSelect }: TaskMobileNavigationProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav aria-label="Navigasi task" className="fixed bottom-5 right-4 z-[90] flex flex-col items-end gap-2">
      {isOpen && (
        <div className="flex flex-col items-end gap-2">
          {[...items].reverse().map((item) => {
          const active = activeLabel ? activeLabel === item.label : (item.href === "/task" ? pathname === "/task" : pathname === item.href);
          const content = (
            <>
              <span className="rounded-lg bg-white px-3 py-2 text-xs font-medium leading-4 text-[#3b4446] shadow-[0_4px_12px_rgba(59,68,70,0.14)]">
                {item.label}
              </span>
              <span className={[
                "flex size-10 items-center justify-center rounded-full border transition-colors shadow-[0_4px_12px_rgba(59,68,70,0.14)]",
                active ? "border-[#ea4c89] bg-[#ea4c89] text-white" : "border-[#e5e7eb] bg-white text-[#525e61]",
              ].join(" ")}>
                <MaterialIcon name={item.icon} size="auto" weight={active ? 500 : 400} filled={active} className="text-xl leading-none" />
              </span>
            </>
          );

          if (!item.href) {
            return (
              <button
                key={item.label}
                type="button"
                aria-label={item.label}
                onClick={() => {
                  onItemSelect?.(item);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2"
              >
                {content}
              </button>
            );
          }

          return (
            <Link key={item.label} href={item.href} aria-label={item.label} className="flex items-center gap-2" onClick={() => {
              onItemSelect?.(item);
              setIsOpen(false);
            }}>
              {content}
            </Link>
          );
          })}
        </div>
      )}

      <button
        type="button"
        aria-label={isOpen ? "Tutup menu task" : "Buka menu task"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex size-14 items-center justify-center rounded-full bg-[#ea4c89] text-white shadow-[0_8px_20px_rgba(234,76,137,0.35)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ea4c89]/25"
      >
        <MaterialIcon name={isOpen ? "close" : "menu"} size="auto" weight={500} className="text-[28px] leading-none" />
      </button>
    </nav>
  );
}
