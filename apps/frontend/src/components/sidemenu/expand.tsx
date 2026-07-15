"use client";

import type { ReactNode } from "react";
import { SideMenuAvatar } from "@/components/sidemenu/avatar";
import { SideMenuButton, type SideMenuButtonStatus } from "@/components/sidemenu/button";
import { SideMenuIconApp } from "@/components/sidemenu/iconapp";

export type SideMenuExpandedItem = {
  label: string;
  icon: string;
  href?: string;
  badge?: number | string;
  status?: SideMenuButtonStatus;
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
        "sticky top-4 m-4 flex h-[calc(100vh-2rem)] min-h-[640px] w-[248px] shrink-0 items-center p-2",
        className,
      ].join(" ")}
    >
      <div className="flex h-full w-[232px] flex-col items-start justify-between rounded-2xl border border-[#ebebeb] bg-white p-3">
        <div className="flex w-full flex-col items-start justify-center">
          <div className="flex flex-col items-start gap-8">
            <SideMenuIconApp type="Icon + Text" state="Light" />

            <nav aria-label="Navigasi utama" className="flex w-full flex-col items-start gap-1">
              {primaryItems.map((item) => (
                <SideMenuButton
                  key={item.label}
                  model={item.badge !== undefined ? "Icon + Text + Badge" : "Icon + Text"}
                  status={item.status}
                  label={item.label}
                  icon={item.icon}
                  href={item.href}
                  badge={item.badge}
                />
              ))}
            </nav>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-2 border-t border-[#ebebeb] py-2">
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
