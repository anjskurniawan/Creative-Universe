"use client";

import type { ReactNode } from "react";
import Container from "@/components/layout/container";
import { BackgroundSky } from "@/components/universe/BackgroundSky";
import { SettingsLayout as SettingsContentLayout } from "@/components/layout/settings-layout";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <BackgroundSky>
      <Container
        menuTitle="Pengaturan"
        contentProps={{ hideSidebar: true }}
      >
        <SettingsContentLayout>{children}</SettingsContentLayout>
      </Container>
    </BackgroundSky>
  );
}
