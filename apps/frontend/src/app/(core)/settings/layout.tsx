"use client";

import type { ReactNode } from "react";
import Container from "@/components/layout/Container/Container";
import { BackgroundSky } from "./_components/BackgroundSky/BackgroundSky";
import { SettingLayout as SettingsContentLayout } from "@/features/settings/components/SettingLayout/SettingLayout";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <BackgroundSky>
      <Container
        responsiveNavigation
        menuTitle="Pengaturan"
        contentProps={{
          hideSidebar: true,
          contentProps: {
            className:
              "flex h-full min-h-0 flex-1 flex-col items-start overflow-y-auto bg-white p-4 lg:overflow-hidden lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden",
          },
        }}
      >
        <SettingsContentLayout>{children}</SettingsContentLayout>
      </Container>
    </BackgroundSky>
  );
}
