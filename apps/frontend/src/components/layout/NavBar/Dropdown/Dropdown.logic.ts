"use client";

import { useEffect, useRef } from "react";

export function useDropdownDismiss(isOpen: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const close = (event: MouseEvent) => {
      if ((event.target as Element).closest("[data-dropdown-trigger]")) return;
      if (ref.current && !ref.current.contains(event.target as Node)) onClose();
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [isOpen, onClose]);

  return ref;
}
