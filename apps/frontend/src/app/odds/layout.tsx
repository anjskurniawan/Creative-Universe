import type { ReactNode } from "react";
import { OddsShell } from "@/features/odds/components/OddsShell/OddsShell";

export default function OddsLayout({ children }: { children: ReactNode }) {
  return <OddsShell>{children}</OddsShell>;
}
