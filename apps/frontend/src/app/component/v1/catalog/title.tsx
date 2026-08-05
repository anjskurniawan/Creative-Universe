import type { ComponentPropsWithoutRef, ReactNode } from "react";

type TitleAlign = "left" | "center";

export type TitleProps = Omit<
  ComponentPropsWithoutRef<"header">,
  "children"
> & {
  children: ReactNode;
  mobileChildren?: ReactNode;
  align?: TitleAlign;
};

const alignmentClasses: Record<TitleAlign, string> = {
  left: "justify-start",
  center: "justify-center",
};

export function Title({
  children,
  mobileChildren,
  align = "left",
  className = "",
  ...props
}: TitleProps) {
  return (
    <header
      {...props}
      className={`flex items-center py-2 ${alignmentClasses[align]} ${className}`}
    >
      <h1 className="w-full whitespace-nowrap text-[36px] font-medium leading-none tracking-[-1.08px] text-[#3B4446]">
        {mobileChildren !== undefined ? (
          <>
            <span className="lg:hidden">{mobileChildren}</span>
            <span className="hidden lg:inline">{children}</span>
          </>
        ) : (
          children
        )}
      </h1>
    </header>
  );
}
