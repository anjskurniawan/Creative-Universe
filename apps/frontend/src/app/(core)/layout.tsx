import type { ReactNode } from "react";

import { CoreShell } from "@/core/layouts/core-shell";

export default function CoreLayout({ children }: { children: ReactNode }) {
  return <CoreShell>{children}</CoreShell>;
}
