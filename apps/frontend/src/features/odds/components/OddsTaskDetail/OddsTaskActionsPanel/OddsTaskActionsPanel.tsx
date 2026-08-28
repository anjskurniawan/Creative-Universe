import type { ComponentPropsWithoutRef, ReactNode } from "react";

type OddsTaskActionsPanelProps = Omit<ComponentPropsWithoutRef<"section">, "children"> & { children: ReactNode };

/** Surface container for role-based Detail Task actions. */
export function OddsTaskActionsPanel({ children, className = "", ...props }: OddsTaskActionsPanelProps) {
  return <section {...props} className={className}>{children}</section>;
}
