import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { BREADCRUMB_THEME_CLASS } from "./Breadcrumb.config";
import type { BreadcrumbProps } from "./Breadcrumb.types";

export type { BreadcrumbProps } from "./Breadcrumb.types";

export default function Breadcrumb({
  items = ["Creative Universe", "Global Layout"],
  dark = false,
  className = "",
}: BreadcrumbProps) {
  const themeClass = BREADCRUMB_THEME_CLASS[dark ? "dark" : "light"];

  return (
    <nav aria-label="Breadcrumb" className={`cu-style relative flex items-center gap-1 ${className}`.trim()}>
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="flex items-center gap-1">
          <span className={`whitespace-nowrap font-sans text-sm leading-none ${index === items.length - 1 ? `font-medium ${themeClass.current}` : `font-normal ${themeClass.previous}`}`}>
            {item}
          </span>
          {index < items.length - 1 && (
            <span className="flex size-6 items-center justify-center">
              <MaterialIcon name="chevron_right" size="sm" className={themeClass.previous} />
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
