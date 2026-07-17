"use client";

import { Fragment, type ReactNode } from "react";
import { SideMenuAvatar } from "@/components/sidemenu/avatar";
import { SideMenuButton, type SideMenuButtonStatus } from "@/components/sidemenu/button";
import { SideMenuIconApp } from "@/components/sidemenu/iconapp";

export type SideMenuExpandedItem = {
  label: string;
  icon: string;
  href?: string;
  badge?: number | string;
  status?: SideMenuButtonStatus;
  group?: string;
  isActive?: boolean;
};

type SideMenuExpandProps = {
  primaryItems: SideMenuExpandedItem[];
  secondaryItems?: SideMenuExpandedItem[];
  secondaryContent?: ReactNode;
  onCollapse?: () => void;
  avatarName?: string;
  avatarRole?: string;
  className?: string;
};

export function SideMenuExpand({
  primaryItems,
  secondaryItems = [],
  secondaryContent,
  onCollapse,
  avatarName,
  avatarRole,
  className = "",
}: SideMenuExpandProps) {
  return (
    <aside
      data-variant="Expand"
      className={[
        "sticky top-4 z-30 m-4 flex h-[calc(100vh-2rem)] min-h-[640px] w-[248px] shrink-0 items-center p-2",
        className,
      ].join(" ")}
    >
      <div className="flex h-full w-[232px] flex-col items-start justify-between rounded-2xl border border-[#ebebeb] bg-white p-3">
        <div className="flex min-h-0 w-full flex-1 flex-col items-start overflow-hidden">
          <div className="flex min-h-0 w-full flex-1 flex-col items-start gap-6">
            <SideMenuIconApp type="Icon + Text" state="Light" />

            <nav aria-label="Navigasi utama" className="flex min-h-0 w-full flex-col items-start gap-1 overflow-y-auto pr-1 [scrollbar-color:#d8d8d8_transparent] [scrollbar-width:thin]">
              {primaryItems.map((item, index) => (
                <Fragment key={item.label}>
                  {item.group && item.group !== primaryItems[index - 1]?.group && (
                    <span className={`${index === 0 ? "mt-0" : "my-2"} h-px w-full shrink-0 bg-[#ebebeb]`} aria-hidden="true" />
                  )}
                  <SideMenuButton
                    model={item.badge !== undefined ? "Icon + Text + Badge" : "Icon + Text"}
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

        <div className="flex w-full shrink-0 flex-col items-start gap-2 border-t border-[#ebebeb] py-2">
          <nav aria-label="Navigasi akun" className="flex w-full flex-col items-start gap-1">
            <SideMenuButton
              model="Icon + Text"
              status="Default"
              label="Ciutkan Navigasi"
              icon="left_panel_close"
              onClick={onCollapse}
            />

            {secondaryContent ?? secondaryItems.map((item) => (
              <SideMenuButton
                key={item.label}
                model="Icon + Text"
                status={item.status}
                label={item.label}
                icon={item.icon}
                href={item.href}
                badge={item.badge}
              />
            ))}
          </nav>

          <SideMenuAvatar variant="Avatar Detail" name={avatarName} role={avatarRole} />
        </div>
      </div>
    </aside>
  );
}
