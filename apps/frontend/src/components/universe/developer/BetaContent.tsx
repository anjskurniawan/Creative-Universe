import type { ReactNode } from "react";

export function BetaContent({ children }: { children: ReactNode }) {
  return <div className="mt-4 grid w-fit gap-4 md:grid-cols-2">{children}</div>;
}
