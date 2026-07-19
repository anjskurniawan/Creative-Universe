"use client";

import { useState } from "react";

const STORAGE_KEY = "kv-retail.desktop-sidebar-expanded";
let cachedExpanded = false;

/** Keeps the desktop KV Retail sidebar width stable across route transitions. */
export function useKvRetailDesktopSidebar() {
  const [expanded, setExpanded] = useState(() => {
    if (typeof window === "undefined") return cachedExpanded;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== null) cachedExpanded = stored === "true";
    return cachedExpanded;
  });

  const toggleExpanded = () => {
    setExpanded((current) => {
      const next = !current;
      cachedExpanded = next;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  return { expanded, toggleExpanded };
}
