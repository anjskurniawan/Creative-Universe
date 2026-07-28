"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/material-icon";

export type ProfileMenuItem = { label: string; href: string; icon: string };
export type UserProfile = {
  name: string;
  role: string;
  avatarUrl?: string | null;
  initials: string;
};

export default function ProfileDropdown({
  isOpen,
  onClose,
  user = { name: "Guest", role: "User", initials: "U" },
  menuItems = [],
  onSignOut = () => {},
}: {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile;
  menuItems?: ProfileMenuItem[];
  onSignOut?: () => void;
}) {
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
  if (!isOpen) return null;
  return (
    <div
      ref={ref}
      className="absolute right-0 top-[calc(100%+8px)] z-50 flex w-[280px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-[#bdeaff] bg-[#f3fbff]/95 p-1.5 shadow-[0_10px_24px_rgba(0,4,117,0.18)] backdrop-blur-md max-lg:fixed max-lg:left-2 max-lg:right-2 max-lg:top-[72px] max-lg:w-auto max-lg:max-w-none"
    >
      <div className="flex items-center gap-3 rounded-xl bg-white/55 px-3 py-3">
        <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#04044a] text-xs font-semibold text-white">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Foto profil"
              className="size-full object-cover"
            />
          ) : (
            user.initials
          )}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-[#04044a]">
            {user.name}
          </span>
          <span className="block truncate text-xs text-[#5b7190]">
            {user.role}
          </span>
        </span>
      </div>
      <ul role="menu" className="m-0 flex list-none flex-col gap-1 py-1 pl-0">
        {menuItems.map((item, index) => (
          <li key={item.label}>
            <Link
              href={item.href}
              onClick={onClose}
              className={`flex h-10 items-center gap-2.5 rounded-xl px-3 text-sm text-[#04044a] transition-colors hover:bg-[#dff6ff] ${index === 0 ? "bg-[#dff6ff]" : ""}`}
            >
              <MaterialIcon name={item.icon} size="auto" className="text-lg" />
              <span className="font-medium">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => {
          onClose();
          onSignOut();
        }}
        className="flex h-10 w-full items-center gap-2.5 rounded-xl px-3 text-left text-sm text-[#04044a] transition-colors hover:bg-[#dff6ff]"
      >
        <MaterialIcon name="logout" size="auto" className="text-lg" />
        <span className="font-medium">Sign Out</span>
      </button>
    </div>
  );
}
