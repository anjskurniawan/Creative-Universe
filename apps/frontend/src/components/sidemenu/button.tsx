"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/material-icon";

export type SideMenuButtonModel = "Icon" | "Icon + Text" | "Icon + Text + Badge";
export type SideMenuButtonStatus = "Default" | "Hover" | "Active" | "Highlight";

export type SideMenuMenuModel = SideMenuButtonModel;
export type SideMenuMenuStatus = SideMenuButtonStatus;

type SideMenuButtonProps = {
  model?: SideMenuButtonModel;
  status?: SideMenuButtonStatus;
  label?: string;
  icon?: string;
  href?: string;
  badge?: number | string;
  onClick?: () => void;
  className?: string;
};

function buttonStatusClasses(status: SideMenuButtonStatus) {
  if (status === "Highlight") {
    return "bg-[#ea4c89] text-white";
  }

  if (status === "Active") {
    return "bg-[#8a38f5] text-white";
  }

  if (status === "Hover") {
    return "bg-[#eff2f3] text-[#525e61]";
  }

  return "text-[#525e61] hover:bg-[#eff2f3]";
}

function badgeStatusClasses(status: SideMenuButtonStatus) {
  if (status === "Highlight") {
    return "bg-[#eff2f3] text-[#ea4c89]";
  }

  if (status === "Active") {
    return "bg-white text-[#8a38f5]";
  }

  return "bg-[#525e61] text-[#eff2f3]";
}

export function SideMenuButton({
  model = "Icon",
  status = "Default",
  label = "Dashboard",
  icon = "analytics",
  href,
  badge,
  onClick,
  className = "",
}: SideMenuButtonProps) {
  const isIconOnly = model === "Icon";
  const hasBadge = model === "Icon + Text + Badge";
  const classes = [
    "group flex h-[38px] shrink-0 items-center overflow-hidden rounded-xl p-[10px] text-xs font-medium leading-4 transition-[width,padding,background-color,color] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8474f9] focus-visible:ring-offset-2",
    isIconOnly
      ? "w-[38px] justify-center p-0"
      : "w-full justify-between gap-1",
    buttonStatusClasses(status),
    className,
  ].join(" ");

  const content = (
    <>
      <span
        className={[
          "flex shrink-0 items-center",
          isIconOnly ? "w-full justify-center gap-0" : "min-w-0 gap-1",
        ].join(" ")}
      >
        <span className="flex size-6 shrink-0 items-center justify-center">
          <MaterialIcon
            name={icon}
            size="auto"
            weight={300}
            filled={false}
            className="block text-[24px] leading-none"
          />
        </span>

        <span
          aria-hidden={isIconOnly}
          className={[
            "shrink-0 overflow-hidden truncate text-left transition-[width,max-width,opacity,transform] duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            isIconOnly
              ? "w-0 max-w-0 -translate-x-2 opacity-0"
              : "w-[142px] max-w-[142px] translate-x-0 opacity-100 delay-75",
          ].join(" ")}
        >
          {label}
        </span>
      </span>

      {hasBadge && (
        <span
          className={[
            "flex size-[18px] shrink-0 items-center justify-center rounded-full text-center text-[8px] font-medium leading-[10px]",
            badgeStatusClasses(status),
          ].join(" ")}
        >
          {badge ?? 10}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        aria-current={status === "Active" ? "page" : undefined}
        title={isIconOnly ? label : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={classes}
      title={isIconOnly ? label : undefined}
      aria-label={isIconOnly ? label : undefined}
    >
      {content}
    </button>
  );
}

export { SideMenuButton as SideMenuMenu };
