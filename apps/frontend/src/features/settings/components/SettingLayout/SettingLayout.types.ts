import type { ReactNode } from "react";

export interface SettingLayoutProps {
  children: ReactNode;
  aside?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
}
