"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/material-icon";

export type ProfileMenuItem = {
  label: string;
  href: string;
  icon: string;
};

export type UserProfile = {
  name: string;
  role: string;
  avatarUrl?: string | null;
  initials: string;
};

export type ProfileDropdownProps = {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile;
  menuItems?: ProfileMenuItem[];
  onSignOut?: () => void;
};

export default function ProfileDropdown({
  isOpen,
  onClose,
  user = { name: "Guest", role: "User", initials: "U" },
  menuItems = [],
  onSignOut = () => alert("Sign Out Clicked"),
}: ProfileDropdownProps) {
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
      className="absolute left-2 right-2 top-[calc(100%+8px)] z-50 flex w-auto flex-col overflow-hidden rounded-2xl p-1.5 border border-[#bdeaff] bg-[#f3fbff]/95 shadow-[0_10px_24px_rgba(0,4,117,0.18)] backdrop-blur-md"
    >
      {/* User Header */}
      <div className="flex items-center gap-3 rounded-xl px-3 py-3 bg-white/55">
        <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold bg-[#04044A] text-white">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="Foto profil" className="size-full object-cover" />
          ) : (
            user.initials
          )}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[#04044A]">{user.name}</p>
          <p className="truncate text-xs text-[#5b7190]">{user.role}</p>
        </div>
      </div>

      {/* Menu Links */}
      <ul role="menu" aria-label="Menu akun" className="m-0 flex list-none flex-col gap-1 py-1 p-0">
        {menuItems.map((item, index) => (
          <li key={item.label}>
            <Link
              href={item.href}
              onClick={onClose}
              className={`flex h-10 items-center gap-2.5 rounded-xl px-3 text-sm text-[#04044A] hover:bg-[#dff6ff] transition-colors ${
                index === 0 ? "bg-[#dff6ff]" : ""
              }`}
            >
              <MaterialIcon name={item.icon} size="auto" className="text-lg" />
              <span className="font-medium">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Sign Out Action */}
      <button
        type="button"
        onClick={() => {
          onClose();
          onSignOut();
        }}
        className="flex h-10 w-full items-center gap-2.5 rounded-xl px-3 text-sm text-[#04044A] hover:bg-[#dff6ff] text-left transition-colors focus:outline-none"
      >
        <MaterialIcon name="logout" size="auto" className="text-lg" />
        <span className="font-medium">Sign Out</span>
      </button>
    </div>
  );
}
