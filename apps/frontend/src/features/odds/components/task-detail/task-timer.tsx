import type { ComponentPropsWithoutRef, ReactNode } from "react";

type TaskTimerProps = {
  children: ReactNode;
} & Pick<ComponentPropsWithoutRef<"div">, "className"> & { "data-qa-component"?: string };

export function TaskTimer({ children, className = "", "data-qa-component": qaComponent }: TaskTimerProps) {
  return <div className={`flex h-11 items-center py-0 ${className}`} data-qa-component={qaComponent}><p className="w-full whitespace-nowrap text-[36px] font-medium leading-none tracking-[-1.08px] text-[#3B4446]">{children}</p></div>;
}
