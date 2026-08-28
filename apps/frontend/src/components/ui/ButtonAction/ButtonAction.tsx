import type { ReactNode } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

export interface ButtonActionProps {
  href: string;
  children: ReactNode;
  className?: string;
}

/**
 * Komponen Tombol Aksi Utama (ButtonAction)
 */
export function ButtonAction({ href, children, className = "" }: ButtonActionProps) {
  return (
    <Link
      href={href}
      className={`inline-flex h-12 items-center rounded-[36px] bg-white p-1 font-sans transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:h-14 ${className}`}
    >
      <span className="flex items-center justify-center py-2 pl-9 pr-4 text-center text-base font-medium leading-5 whitespace-nowrap text-brand md:py-2.5 md:pl-11 md:pr-5 md:text-lg md:leading-6">
        {children}
      </span>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-white md:size-12">
        <MaterialIcon name="arrow_forward" className="text-xl md:text-2xl" />
      </span>
    </Link>
  );
}
