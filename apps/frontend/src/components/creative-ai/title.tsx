import type { ComponentPropsWithoutRef, ReactNode } from "react";

type TitleAlign = "left" | "center";

export type TitleProps = Omit<ComponentPropsWithoutRef<"header">, "children"> & {
  children: ReactNode;
  align?: TitleAlign;
};

const alignmentClasses: Record<TitleAlign, string> = {
  left: "justify-start",
  center: "justify-center",
};

const textAlignmentClasses: Record<TitleAlign, string> = {
  left: "text-left",
  center: "text-center",
};

export function Title({
  children,
  align = "left",
  className = "",
  ...props
}: TitleProps) {
  return (
    <header
      {...props}
      className={`flex w-full items-center py-2 ${alignmentClasses[align]} ${className}`}
    >
      <h1 className={`w-full whitespace-nowrap text-[36px] font-medium leading-none tracking-[-1.08px] text-white ${textAlignmentClasses[align]}`}>
        {children}
      </h1>
    </header>
  );
}
