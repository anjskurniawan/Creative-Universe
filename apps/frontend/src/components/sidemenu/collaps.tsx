"use client";

import { Fragment, type ReactNode } from "react";
import { SideMenuAvatar } from "@/components/sidemenu/avatar";
import { SideMenuButton, type SideMenuButtonStatus } from "@/components/sidemenu/button";
import { SideMenuIconApp } from "@/components/sidemenu/iconapp";

export type SideMenuCollapsedItem = {
  label: string;
  icon: string;
  href?: string;
  badge?: number | string;
  status?: SideMenuButtonStatus;
  group?: string;
  isActive?: boolean;
};

type SideMenuCollapsProps = {
  primaryItems: SideMenuCollapsedItem[];
  secondaryItems?: SideMenuCollapsedItem[];
  secondaryContent?: ReactNode;
  onExpand?: () => void;
  avatarName?: string;
  avatarRole?: string;
  className?: string;
};

export function SideMenuCollaps({
  primaryItems,
  secondaryItems = [],
  secondaryContent,
  onExpand,
  avatarName,
  avatarRole,
  className = "",
}: SideMenuCollapsProps) {
  return (
    <aside
      data-variant="Collaps"
      className={[
        "sticky top-4 z-30 m-4 flex h-[calc(100vh-2rem)] min-h-[640px] w-[78px] shrink-0 items-center p-2",
        className,
      ].join(" ")}
    >
      <div className="flex h-full w-[62px] flex-col items-center justify-between rounded-2xl border border-[#ebebeb] bg-white px-2.5 py-3">
        <div className="flex min-h-0 w-full flex-1 flex-col items-center overflow-hidden">
          <div className="flex min-h-0 w-full flex-1 flex-col items-center gap-6">
            <SideMenuIconApp type="Icon" state="Light" />

            <nav aria-label="Navigasi utama" className="flex min-h-0 w-full flex-col items-center gap-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none]">
              {primaryItems.map((item, index) => (
                <Fragment key={item.label}>
                  {index > 0 && item.group && item.group !== primaryItems[index - 1]?.group && (
                    <span className="my-1 h-px w-[30px] shrink-0 bg-[#ebebeb]" aria-hidden="true" />
                  )}
                  <SideMenuButton
                    model="Icon"
                    status={item.status}
                    label={item.label}
                    icon={item.icon}
                    href={item.href}
                    badge={item.badge}
                    isActive={item.isActive}
                  />
                </Fragment>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-2 border-t border-[#ebebeb] py-2">
          <nav aria-label="Navigasi akun" className="flex flex-col items-center gap-1">
            <SideMenuButton
              model="Icon"
              status="Default"
              label="Perluas Navigasi"
              icon="left_panel_open"
              onClick={onExpand}
            />

            {secondaryContent ?? secondaryItems.map((item) => (
              <SideMenuButton
                key={item.label}
                model="Icon"
                status={item.status}
                label={item.label}
                icon={item.icon}
                href={item.href}
                badge={item.badge}
              />
            ))}
          </nav>

          <SideMenuAvatar variant="Avatar" name={avatarName} role={avatarRole} />
        </div>
      </div>
    </aside>
  );
}
