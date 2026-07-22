import { ReactNode } from "react";

type HeaderTitleAlign = "left" | "center";

export type HeaderTitleProps = {
  children: ReactNode;
  align?: HeaderTitleAlign;
  className?: string;
};

const alignClass: Record<HeaderTitleAlign, string> = {
  left: "justify-start",
  center: "justify-center",
};

export function HeaderTitle({ children, align = "left", className = "" }: HeaderTitleProps) {
  return (
    <header className={`flex items-center py-2 ${alignClass[align]} ${className}`}>
      <h1 className="whitespace-nowrap text-[36px] font-medium leading-none tracking-[-1.08px] text-[#3B4446]">
        {children}
      </h1>
    </header>
  );
}
