"use client";

import { useDropdownDismiss } from "./Dropdown.logic";
import type { DropdownProps } from "./Dropdown.types";

export type { DropdownProps } from "./Dropdown.types";

export default function Dropdown({ isOpen = true, onClose, className = "", children }: DropdownProps) {
  const ref = useDropdownDismiss(isOpen, onClose);
  if (!isOpen) return null;
  return <div ref={ref} role="menu" className={`cu-style absolute right-0 top-12 z-30 w-64 rounded-lg border border-slate-200 bg-white p-2 text-sm ${className}`.trim()}>{children}</div>;
}
