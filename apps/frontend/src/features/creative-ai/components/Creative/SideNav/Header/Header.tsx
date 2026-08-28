import { Link as AriaLink } from "react-aria-components";
import { Tooltip, TooltipTrigger } from "@react-spectrum/s2/Tooltip";
import AppIconLogo from "@/components/layout/NavBar/AppIcon/AppIconLogo/AppIconLogo";
import { IconSpectrum } from "@/components/spectrum/IconSpectrum";
import type { HeaderProps } from "./Header.types";

export function Header({ isExpanded, onCollapse, className = "" }: HeaderProps) {
  return (
    <div
      className={`relative flex h-16 w-full items-center border-b border-white/10 px-3 transition-all ${className}`.trim()}
    >
      {/* Logo SVG Universe murni putih yang mengarah ke route "/" */}
      <TooltipTrigger placement="right">
        <AriaLink
          href="/"
          aria-label="Beranda Creative Universe"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white/90 hover:bg-white/10 hover:text-white transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/20"
        >
          <AppIconLogo className="h-7 w-7 text-white" />
        </AriaLink>
        <Tooltip>Beranda Creative Universe</Tooltip>
      </TooltipTrigger>

      {/* Tombol Sembunyikan / Collapse Sidebar (Absolute / Right aligned dengan transisi opacity agar tidak menggeser logo) */}
      <div
        className={`ml-auto flex items-center transition-all duration-200 ${
          isExpanded ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none w-0 overflow-hidden"
        }`}
      >
        <button
          type="button"
          aria-label="Sembunyikan Sidebar"
          onClick={onCollapse}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <IconSpectrum name="ChevronLeft" />
        </button>
      </div>
    </div>
  );
}
