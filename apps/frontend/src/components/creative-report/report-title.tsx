"use client";

import React from "react";

export type ReportTitleProps = {
  title?: string;
  theme?: "light" | "dark" | "retro";
  className?: string;
};

export function ReportTitle({
  title = "Creative Report",
  theme = "light",
  className = "",
}: ReportTitleProps) {
  return (
    <h1
      className={`text-4xl font-medium leading-none tracking-[-0.72px] ${
        theme === "dark"
          ? "text-white"
          : theme === "retro"
          ? "text-[#24252b]"
          : "text-[#24252b]"
      } ${className}`}
    >
      {title}
    </h1>
  );
}
