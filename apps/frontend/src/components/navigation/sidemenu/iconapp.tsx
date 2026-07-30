"use client";

import Image from "next/image";
import Link from "next/link";

export type SideMenuIconAppState = "Light" | "Dark";
export type SideMenuIconAppType = "Icon" | "Icon + Text";

export type SideMenuIconVariant = "Logo Vector Group" | "Logo Container";

type SideMenuIconAppProps = {
  state?: SideMenuIconAppState;
  type?: SideMenuIconAppType;
  label?: string;
  subtitle?: string;
  href?: string;
  className?: string;
};

export function SideMenuIconApp({
  state = "Light",
  type = "Icon",
  label = "Creative Universe",
  subtitle = "ODDS",
  href = "/dashboard",
  className = "",
}: SideMenuIconAppProps) {
  const isDark = state === "Dark";
  const isIconText = type === "Icon + Text";
  const iconBoxClass = isDark ? "bg-white" : "bg-black";
  const logoClass = isDark ? "brightness-0" : "";

  const icon = (
    <span className={`flex size-[38px] shrink-0 items-center justify-center rounded-lg p-1 ${iconBoxClass}`}>
      <Image
        src="/images/landing/logo-navbar.svg"
        alt=""
        width={22}
        height={24}
        className={`h-6 w-[22.109px] ${logoClass}`}
      />
    </span>
  );

  return (
    <Link
      href={href}
      aria-label={label}
      className={[
        "flex h-[38px] shrink-0 overflow-hidden transition-[width] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8474f9]",
        isIconText ? "w-[208px] flex-col items-start justify-center" : "w-[38px] items-center justify-center rounded-lg",
        className,
      ].join(" ")}
    >
      {isIconText ? (
        <span className="flex w-full shrink-0 items-start gap-2">
          {icon}
          <span className="flex h-9 min-w-px flex-1 flex-col items-start justify-center gap-px overflow-hidden whitespace-nowrap">
            <span
              className={[
                "max-w-full truncate text-[13px] font-semibold leading-4 tracking-[-0.13px]",
                isDark ? "text-[#eff2f3]" : "text-[#3b4446]",
              ].join(" ")}
            >
              {label}
            </span>
            <span
              className={[
                "max-w-full truncate text-[10px] font-normal leading-[13px]",
                isDark ? "text-[#d7dcdd]" : "text-[#aeb6b8]",
              ].join(" ")}
            >
              {subtitle}
            </span>
          </span>
        </span>
      ) : (
        icon
      )}
    </Link>
  );
}

export function sideMenuIconVariantToType(variant: SideMenuIconVariant): SideMenuIconAppType {
  return variant === "Logo Container" ? "Icon + Text" : "Icon";
}
