import type { ReactNode } from "react";

export type ContentProps = {
  className?: string;
  heading?: string;
  subheading?: string;
  viewport?: "Mobile" | "Desktop";
  children?: ReactNode;
};

export default function Content({ className, children }: ContentProps) {
  return (
    <main
      data-name="Content / Main"
      className={`cu-style relative flex h-full min-h-0 min-w-0 flex-1 flex-col items-start space-y-4 overflow-y-auto p-4 pb-6 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden ${className ?? ""}`.trim()}
    >
      {children}
    </main>
  );
}
