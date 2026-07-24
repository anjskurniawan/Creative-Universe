"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/material-icon";

export type ApplicationItem = {
  key: string;
  display_name: string;
  href: string;
  icon: string;
};

export type AppsDropdownProps = {
  isOpen: boolean;
  onClose: () => void;
  applications?: ApplicationItem[];
};

export default function AppsDropdown({
  isOpen,
  onClose,
  applications = [],
}: AppsDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="absolute left-2 right-2 top-[calc(100%+8px)] z-50 w-auto rounded-xl p-1.5 border border-[#bdeaff] bg-[#f3fbff]/95 shadow-[0_10px_24px_rgba(0,4,117,0.18)] backdrop-blur-md"
    >
      <ul role="menu" aria-label="Menu aplikasi" className="m-0 flex list-none flex-col gap-1 p-0">
        {applications.map((app) => (
          <li key={app.key}>
            <Link
              href={app.href}
              onClick={onClose}
              role="menuitem"
              className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm text-[#04044A] hover:bg-[#dff6ff] transition-colors"
            >
              <MaterialIcon name={app.icon} size="auto" className="text-lg" />
              <span className="truncate font-medium">{app.display_name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
