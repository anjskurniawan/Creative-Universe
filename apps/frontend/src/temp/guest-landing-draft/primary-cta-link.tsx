import type { ReactNode } from "react";
import Link from "next/link";

export interface PrimaryCtaLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function PrimaryCtaLink({ href, children, className = "" }: PrimaryCtaLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex h-12 items-center justify-center rounded-full bg-cu-ink px-6 text-base font-medium text-cu-surface transition-colors hover:bg-cu-ink-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cu-focus md:h-14 md:px-8 md:text-lg ${className}`}
    >
      {children}
    </Link>
  );
}
