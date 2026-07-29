import type { ReactNode } from "react";

export function TaskCardActionBar({ children, mobile = false, fillHeight = false, overlay }: { children: ReactNode; mobile?: boolean; fillHeight?: boolean; overlay?: ReactNode }) {
  return <div className={`relative flex w-full items-center ${fillHeight ? "h-full" : ""} ${mobile ? "flex-wrap" : "flex-wrap justify-center"} gap-2`}>{children}{overlay && <div className="absolute inset-0 z-10 overflow-hidden">{overlay}</div>}</div>;
}
