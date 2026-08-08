"use client";

import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import SettingMenu from "@/components/layout/setting-menu";
import SettingsMobileHeader from "@/components/layout/settings-mobile-header";
import SettingsProfileHeader from "@/components/layout/settings-profile-header";
import { getActiveSettingsLabel } from "@/components/layout/settings-navigation-config";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const normalizedPath = (pathname ?? "").replace(/\/$/, "") || "/";

  const urlShowsMobileDetail =
    normalizedPath !== "/settings";
  const isMobileDetail = urlShowsMobileDetail;

  if (!user) return null;

  const activeMobileLabel = getActiveSettingsLabel(normalizedPath, searchParams);

  return (
    <div className="flex w-full max-w-7xl flex-col gap-0 lg:mx-auto lg:gap-6">
      <SettingsProfileHeader user={user} isMobileDetail={isMobileDetail} />

      <div className="mt-4 grid w-full grid-cols-1 items-start gap-6 lg:mt-2 lg:grid-cols-12">
        {/* Kolom kiri: menu navigasi Settings (3/12). */}
        <SettingMenu isMobileDetail={isMobileDetail} />

        {/* Kolom kanan: konten Settings (9/12). */}
        <div className={`${isMobileDetail ? "block" : "hidden lg:block"} w-full p-0 sm:p-4 lg:col-span-9`}>
          <SettingsMobileHeader label={activeMobileLabel} />
          {children}
        </div>
      </div>
    </div>
  );
}
