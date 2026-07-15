import Link from "next/link";

export interface LandingPrimaryActionProps {
  href: string;
  children: string;
}

export function LandingPrimaryAction({ href, children }: LandingPrimaryActionProps) {
  return (
    <Link
      href={href}
      className="inline-flex h-12 items-center justify-center rounded-full bg-cu-ink px-6 text-base font-medium text-cu-surface transition-colors hover:bg-cu-ink-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cu-focus md:h-14 md:px-8 md:text-lg"
    >
      {children}
    </Link>
  );
}
