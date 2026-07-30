import type { ReactNode } from "react";
import type { RequestBuilderTheme } from "../types";

export function RequestBuilderShell({
  children,
  theme,
  onSubmit,
  footer,
}: {
  children: ReactNode;
  theme: RequestBuilderTheme;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  footer?: ReactNode;
}) {
  const { dark, containerClass } = theme;
  return (
    <div className={`flex w-full flex-col flex-1 min-h-0 ${dark ? "text-[#F1F1F1]" : "text-[#04044A]"}`}>
      <form
        onSubmit={onSubmit}
        className="flex min-h-0 flex-1 flex-col justify-between"
      >
        <div className={`flex min-h-[560px] flex-1 flex-col p-6 sm:p-8 ${containerClass}`}>
          {children}
        </div>
        {footer}
      </form>
    </div>
  );
}
