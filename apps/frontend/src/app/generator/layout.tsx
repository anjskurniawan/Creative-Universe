import type { ReactNode } from "react";

import { SubAppShell } from "@/shared/layouts/sub-app-shell";

export default function GeneratorLayout({ children }: { children: ReactNode }) {
  return (
    <SubAppShell
      theme="dark"
      stickyNavbar={false}
      mainClassName="w-full mx-auto pt-16 pb-8 px-6 md:px-16 relative z-10"
    >
      {children}
    </SubAppShell>
  );
}
