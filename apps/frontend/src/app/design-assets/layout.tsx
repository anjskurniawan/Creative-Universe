import type { ReactNode } from "react";

import { SubAppShell } from "@/shared/layouts/sub-app-shell";

export default function DesignAssetsLayout({ children }: { children: ReactNode }) {
  return (
    <SubAppShell mainClassName="w-full mx-auto pt-0 pb-8 px-6 md:px-16 relative z-10">
      {children}
    </SubAppShell>
  );
}
