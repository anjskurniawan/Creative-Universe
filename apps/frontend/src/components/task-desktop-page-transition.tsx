"use client";

import { type ReactNode } from "react";

type TaskDesktopPageTransitionProps = {
  children: ReactNode;
  className?: string;
};

export function TaskDesktopPageTransition({ children, className = "" }: TaskDesktopPageTransitionProps) {
  return <main className={className}>{children}</main>;
}
