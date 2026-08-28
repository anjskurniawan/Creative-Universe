"use client";

import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

export type ExportPdfButtonProps = {
  theme?: "light" | "dark" | "retro";
  onClick?: () => void;
  className?: string;
};

export function ExportPdfButton({
  theme = "light",
  onClick,
  className = "",
}: ExportPdfButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick ?? (() => window.print())}
      className={`flex flex-1 items-center justify-center gap-1 rounded-lg border p-2 text-sm font-medium leading-4 sm:flex-none cursor-pointer ${
        theme === "dark"
          ? "border-[rgba(123,123,123,0.25)] bg-[#b0ff5e] text-[#181818]"
          : theme === "retro"
          ? "border-2 border-[#24252b] bg-[#ba0dcb] text-white shadow-[0_2px_0_#24252b]"
          : "border-[rgba(123,123,123,0.25)] bg-[#00a4ff] text-white"
      } ${className}`}
    >
      <MaterialIcon name="picture_as_pdf" size="auto" className="text-xl" /> Export PDF
    </button>
  );
}
