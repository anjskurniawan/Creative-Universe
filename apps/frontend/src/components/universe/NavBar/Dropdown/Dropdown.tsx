"use client";

import { useDropdownDismiss } from "./Dropdown.logic";
import type { DropdownProps } from "./Dropdown.types";

export type { DropdownProps } from "./Dropdown.types";

export default function Dropdown({
  isOpen,
  onClose,
  className,
  children,
}: DropdownProps) {
  const ref = useDropdownDismiss(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
