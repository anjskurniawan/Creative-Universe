"use client";

import type { ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";
import type { CreativeReportGroup } from "@/features/creative-report/types";

export type GroupAccordionProps = {
  group: CreativeReportGroup;
  index: number;
  isOpen: boolean;
  onToggle: (id: number) => void;
  children?: ReactNode;
};

export function GroupAccordion({
  group,
  index,
  isOpen,
  onToggle,
  children,
}: GroupAccordionProps) {
  return (
    <div className="cu-style">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => onToggle(group.id)}
        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
          isOpen
            ? "rounded-b-none border-[#c9bbfc] bg-[#f7f5ff]"
            : "border-[#dbe4e8] bg-white hover:bg-slate-50"
        }`}
      >
        <span className="flex size-7 items-center justify-center rounded-lg bg-[#ede9fe] text-sm font-semibold text-[#6d46eb]">
          {index + 1}
        </span>
        <span className="flex-1">
          <span className="block text-sm font-semibold text-[#3b4446]">
            {group.name}
          </span>
          <span className="text-xs text-[#7b868a]">
            {group.staff_count} staff
          </span>
        </span>
        <MaterialIcon
          name={isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"}
          size="md"
          className="text-[#6d46eb]"
        />
      </button>
      {isOpen && children}
    </div>
  );
}
