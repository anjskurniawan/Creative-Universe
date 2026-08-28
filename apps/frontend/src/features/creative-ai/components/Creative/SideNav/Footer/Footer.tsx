"use client";

import { Avatar } from "@react-spectrum/s2/Avatar";
import { Button as AriaButton } from "react-aria-components";
import { Tooltip, TooltipTrigger } from "@react-spectrum/s2/Tooltip";
import { IconSpectrum } from "@/components/spectrum/IconSpectrum";
import type { FooterProps } from "./Footer.types";

export function Footer({
  isExpanded,
  user,
  onExpand,
  className = "",
}: FooterProps) {
  return (
    <div
      className={`flex flex-col gap-2.5 border-t border-white/10 bg-black/40 p-3 ${className}`.trim()}
    >
      {/* Tombol Expand Sidebar saat mode collapsed */}
      {!isExpanded && (
        <TooltipTrigger placement="right">
          <AriaButton
            aria-label="Buka Sidebar"
            onPress={onExpand}
            className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            <IconSpectrum name="ChevronRight" />
          </AriaButton>
          <Tooltip>Buka Sidebar</Tooltip>
        </TooltipTrigger>
      )}

      {/* Info Profil Avatar Pengguna */}
      <div
        className={`flex items-center gap-3 rounded-xl p-1.5 ${
          isExpanded ? "justify-start" : "justify-center"
        }`}
      >
        <Avatar
          size={36}
          src={user?.avatar_url ?? undefined}
          alt={user?.name ?? "User avatar"}
        />
        {isExpanded && (
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-xs font-semibold text-white">
              {user?.name ?? "Pengguna"}
            </span>
            <span className="truncate text-[11px] text-white/50">
              {user?.roles?.[0] ?? "Member"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
