"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/material-icon";

export type SideMenuAvatarVariant = "Avatar" | "Avatar Detail";

type SideMenuAvatarProps = {
  variant?: SideMenuAvatarVariant;
  name?: string;
  role?: string;
  href?: string;
  className?: string;
};

function getInitials(name?: string) {
  if (!name) return "AK";

  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function SideMenuAvatar({
  variant = "Avatar",
  name = "Anjas Kurniawan",
  role = "Root Admin",
  href = "/profile",
  className = "",
}: SideMenuAvatarProps) {
  const isDetail = variant === "Avatar Detail";
  const classes = [
    "flex h-[38px] shrink-0 items-center overflow-hidden transition-[width] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8474f9]",
    isDetail ? "w-[208px] justify-between rounded-lg" : "w-[38px] justify-center rounded-[36px] bg-black p-[10px]",
    className,
  ].join(" ");

  const content = isDetail ? (
    <>
      <span className="flex min-w-0 shrink-0 items-center gap-2">
        <span className="flex size-[38px] shrink-0 items-center justify-center rounded-[36px] bg-black p-[10px] text-[11px] font-bold leading-[14px] text-white">
          {getInitials(name)}
        </span>

        <span className="flex h-8 w-[122px] shrink-0 flex-col items-start justify-center overflow-hidden whitespace-nowrap text-left">
          <span className="w-full truncate text-[11px] font-medium leading-[14px] text-[#1f2937]">
            {name}
          </span>
          <span className="w-full truncate text-[9px] font-normal leading-3 text-[#8a93a3]">
            {role}
          </span>
        </span>
      </span>

      <MaterialIcon
        name="more_horiz"
        size="auto"
        weight={400}
        filled={false}
        className="shrink-0 text-[20px] leading-none text-[#6b7280]"
      />
    </>
  ) : (
    <span className="whitespace-nowrap text-[11px] font-bold leading-[14px] text-white">
      {getInitials(name)}
    </span>
  );

  return (
    <Link
      href={href}
      aria-label={isDetail ? `Profil ${name}` : "Profil"}
      className={classes}
      title={isDetail ? undefined : name}
    >
      {content}
    </Link>
  );
}
