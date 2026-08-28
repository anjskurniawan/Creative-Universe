"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Provider } from "@react-spectrum/s2/Provider";
import { useAuth } from "@/hooks/auth";
import SettingMenu from "./SettingMenu/SettingMenu";
import SettingsProfileHeader from "./SettingsProfileHeader/SettingsProfileHeader";
import { SettingTitle } from "./SettingTitle/SettingTitle";
import {
  SettingAsideContext,
  useSettingLayoutState,
} from "./SettingLayout.logic";
import type { SettingLayoutProps } from "./SettingLayout.types";

declare module "@react-spectrum/s2/Provider" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function SettingLayout({
  children,
  aside,
  title,
  subtitle,
}: SettingLayoutProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [asideContent, setAsideContent] = useState<ReactNode>(aside ?? null);
  const { isMobileDetail, activeMobileLabel, resolvedTitle, resolvedSubtitle } =
    useSettingLayoutState(title, subtitle);

  if (!user) return null;

  return (
    <Provider
      locale="id-ID"
      colorScheme="light"
      router={{ navigate: router.push }}
      UNSAFE_className="contents"
    >
      <SettingAsideContext.Provider value={{ setAside: setAsideContent }}>
        <div className="flex h-full min-h-0 w-full flex-col overflow-hidden px-0 lg:px-8">
          <div className="grid h-full min-h-0 w-full grid-cols-1 items-stretch gap-0 lg:mt-2 lg:grid-cols-12 lg:gap-6">
            <div className="w-full space-y-4 lg:col-span-2 lg:min-h-0 lg:overflow-y-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
              <SettingsProfileHeader
                user={user}
                isMobileDetail={isMobileDetail}
              />
              <SettingMenu isMobileDetail={isMobileDetail} />
            </div>
            <div
              className={`${isMobileDetail ? "block" : "hidden lg:block"} w-full lg:col-span-10 lg:min-h-0 lg:overflow-y-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden lg:px-8`}
            >
              {resolvedTitle && (
                <SettingTitle
                  title={resolvedTitle ?? activeMobileLabel}
                  subtitle={resolvedSubtitle}
                  backHref="/settings"
                />
              )}
              <div className="relative grid w-full grid-cols-1 gap-8 lg:grid-cols-6 py-4">
                <div className="col-span-1 flex min-w-0 flex-col gap-8 lg:col-span-4">
                  {children}
                </div>
                <aside className="hidden lg:col-span-2 lg:block">
                  {asideContent}
                </aside>
              </div>
            </div>
          </div>
        </div>
      </SettingAsideContext.Provider>
    </Provider>
  );
}
