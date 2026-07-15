import type { ReactNode } from "react";

import { Navbar } from "@/components/navbar";

interface SubAppShellProps {
  children: ReactNode;
  mainClassName: string;
  theme?: "light" | "dark";
  stickyNavbar?: boolean;
}

export function SubAppShell({
  children,
  mainClassName,
  theme = "light",
  stickyNavbar = true,
}: SubAppShellProps) {
  const dark = theme === "dark";

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased ${dark ? "bg-black text-white" : "bg-white text-cu-ink"}`}>
      <Navbar variant={dark ? "dark" : "light"} sticky={stickyNavbar} />
      <div className={`flex flex-1 flex-col ${mainClassName}`}>{children}</div>
    </div>
  );
}
