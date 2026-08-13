"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Provider } from "@react-spectrum/s2/Provider";
import { useAuth } from "@/providers/auth-provider";
import SettingMenu from "@/components/layout/setting-menu";
import SettingsMobileHeader from "@/components/layout/settings-mobile-header";
import SettingsProfileHeader from "@/components/layout/settings-profile-header";
import { getActiveSettingsLabel } from "@/components/layout/settings-navigation-config";
import { SettingTitle } from "@/components/universe/Settings/SettingTitle/SettingTitle";

declare module "@react-spectrum/s2/Provider" {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
  }
}

interface SettingsLayoutProps {
  children: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
}

function getSettingsTitle(pathname: string): { title: string; subtitle: string } | null {
  const route = pathname.replace(/\/$/, "") || "/";
  const titles: Record<string, { title: string; subtitle: string }> = {
    "/settings/account/profile": {
      title: "Profil",
      subtitle: "Kelola informasi profil dan data akun Anda.",
    },
    "/settings/account/appearance": {
      title: "Tampilan",
      subtitle: "Atur preferensi tampilan dan pengalaman penggunaan Anda.",
    },
    "/settings/account/notifications": {
      title: "Notifikasi",
      subtitle: "Kelola preferensi notifikasi akun Anda.",
    },
    "/settings/account/privacy": {
      title: "Privasi Profil",
      subtitle: "Kelola pengaturan privasi dan visibilitas profil Anda.",
    },
    "/settings/account/applications": {
      title: "Aplikasi Saya",
      subtitle: "Kelola aplikasi dan layanan yang terhubung ke akun Anda.",
    },
    "/settings/security/authentication": {
      title: "Authentication",
      subtitle: "Kelola metode autentikasi dan akses keamanan akun Anda.",
    },
    "/settings/security/session": {
      title: "Session",
      subtitle: "Kelola browser dan perangkat yang sedang mengakses akun Anda.",
    },
    "/settings/security/activity-log": {
      title: "Log Aktivitas",
      subtitle: "Tinjau riwayat aktivitas dan perubahan penting pada akun Anda.",
    },
    "/settings/administration/system-configuration": {
      title: "Konfigurasi Sistem",
      subtitle: "Kelola konfigurasi utama yang digunakan oleh sistem.",
    },
    "/settings/administration/workflow": {
      title: "Alur Kerja",
      subtitle: "Atur alur kerja dan proses operasional aplikasi.",
    },
    "/settings/administration/generator-preferences": {
      title: "Preferensi Generator",
      subtitle: "Kelola preferensi dan perilaku generator.",
    },
    "/settings/administration/access-control": {
      title: "Hak Akses",
      subtitle: "Kelola pengaturan peran, izin, dan konfigurasi administrasi.",
    },
  };
  return titles[route] ?? null;
}

export function SettingsLayout({ children, title, subtitle }: SettingsLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const normalizedPath = (pathname ?? "").replace(/\/$/, "") || "/";

  const isMobileDetail = normalizedPath !== "/settings";

  if (!user) return null;

  const activeMobileLabel = getActiveSettingsLabel(normalizedPath, searchParams);
  const routeTitle = getSettingsTitle(normalizedPath);
  const resolvedTitle = title ?? routeTitle?.title;
  const resolvedSubtitle = subtitle ?? routeTitle?.subtitle;

  return (
    <Provider
      locale="id-ID"
      colorScheme="light"
      router={{ navigate: router.push }}
      UNSAFE_className="contents"
    >
      <div className="flex w-full flex-col gap-0 px-1 lg:gap-8 lg:px-64">
        <div className="mt-4 grid w-full grid-cols-1 items-stretch gap-6 lg:mt-2 lg:grid-cols-12">
          <div className="w-full space-y-4 lg:col-span-2">
            <SettingsProfileHeader user={user} isMobileDetail={isMobileDetail} />
            <SettingMenu isMobileDetail={isMobileDetail} />
          </div>

          <div
            className={`${isMobileDetail ? "block" : "hidden lg:block"} w-full px-1 lg:col-span-10 lg:px-8`}
          >
            <SettingsMobileHeader label={activeMobileLabel} />
            {/* Internal layout: 2/6 supporting column, 4/6 main content. */}
            <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-6">
              <div className="col-span-1 flex min-w-0 flex-col gap-8 lg:col-span-5">
                {resolvedTitle && (
                  <SettingTitle title={resolvedTitle} subtitle={resolvedSubtitle} />
                )}
                {children}
              </div>
              <div className="hidden lg:col-span-1 lg:block" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </Provider>
  );
}
