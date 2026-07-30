import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

export interface PrimaryActionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function PrimaryActionLink({ href, children, className = "" }: PrimaryActionLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex h-12 items-center rounded-[36px] bg-white p-1 font-sans transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ba0dcb] md:h-14 ${className}`}
    >
      <span className="flex items-center justify-center py-2 pl-9 pr-4 text-center text-base font-medium leading-5 whitespace-nowrap text-[#ba0dcb] md:py-2.5 md:pl-11 md:pr-5 md:text-lg md:leading-6">
        {children}
      </span>
      <Image
        src="/images/design-system/primary-action-arrow.svg"
        alt=""
        width={40}
        height={40}
        aria-hidden="true"
        className="size-10 shrink-0 md:size-12"
      />
    </Link>
  );
}
