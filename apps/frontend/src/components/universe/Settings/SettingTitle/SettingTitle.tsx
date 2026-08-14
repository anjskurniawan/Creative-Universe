import type { ReactNode } from "react";
import Link from "next/link";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import { MaterialIcon } from "@/components/ui/material-icon";

interface SettingTitleProps {
  title: ReactNode;
  subtitle?: ReactNode;
  backHref?: string;
}

export function SettingTitle({ title, subtitle, backHref }: SettingTitleProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 flex-col">
        <h1 className={`${style({ font: "heading-2xl" })} max-lg:!text-3xl`}>{title}</h1>
        {subtitle && <h2 className={`${style({ font: "body-lg" })} max-lg:!text-base`}>{subtitle}</h2>}
      </div>
      {backHref && (
        <Link href={backHref} aria-label="Kembali ke menu pengaturan" className="order-2 inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-cu-line bg-cu-surface text-cu-ink transition hover:bg-cu-panel-soft lg:hidden">
          <MaterialIcon name="arrow_back" size="sm" />
        </Link>
      )}
    </div>
  );
}
