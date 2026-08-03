import type { ComponentPropsWithoutRef, ReactNode } from "react";

type OddsTaskHistoryPanelProps = Omit<ComponentPropsWithoutRef<"section">, "children"> & {
  children: ReactNode;
};

/** Surface container for the Detail Task Log Task tab. */
export function OddsTaskHistoryPanel({ children, className = "", ...props }: OddsTaskHistoryPanelProps) {
  return <section {...props} className={className}>{children}</section>;
}
