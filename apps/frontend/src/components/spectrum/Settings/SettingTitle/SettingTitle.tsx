import type { ReactNode } from "react";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };

interface SettingTitleProps {
  title: ReactNode;
  subtitle?: ReactNode;
}

export function SettingTitle({ title, subtitle }: SettingTitleProps) {
  return (
    <div className="spectrum-component">
      <div className="flex flex-col">
        <h1 className={`${style({ font: "heading-2xl" })}`}>{title}</h1>
        {subtitle && <h2 className={`${style({ font: "body-lg" })}`}>{subtitle}</h2>}
      </div>
    </div>
  );
}
