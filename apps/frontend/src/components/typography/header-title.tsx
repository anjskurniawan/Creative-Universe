import { ComponentPropsWithoutRef, ReactNode } from "react";

type HeaderTitleAlign = "left" | "center";

export type HeaderTitleProps = Omit<ComponentPropsWithoutRef<"header">, "children"> & {
  children: ReactNode;
  align?: HeaderTitleAlign;
};

const alignClass: Record<HeaderTitleAlign, string> = {
  left: "justify-start",
  center: "justify-center",
};

export function HeaderTitle({ children, align = "left", className = "", ...props }: HeaderTitleProps) {
  return (
    <header {...props} className={`flex items-center py-2 ${alignClass[align]} ${className}`}>
      <h1 className="w-full whitespace-nowrap text-[36px] font-medium leading-none tracking-[-1.08px] text-[#3B4446]">
        {children}
      </h1>
    </header>
  );
}
