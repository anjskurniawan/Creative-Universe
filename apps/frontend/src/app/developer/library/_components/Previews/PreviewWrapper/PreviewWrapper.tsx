"use client";

import React from "react";

export interface PreviewWrapperProps {
  children: React.ReactNode;
  width?: "auto" | "sm" | "md" | "lg" | "full";
}

export function PreviewWrapper({ children, width = "auto" }: PreviewWrapperProps) {
  const widthClasses = {
    auto: "w-auto",
    sm: "w-full max-w-[256px]", // setara w-64
    md: "w-full max-w-[384px]", // setara w-96 / w-72
    lg: "w-full max-w-[640px]",
    full: "w-full",
  }[width];

  return (
    <div className="flex min-h-[200px] w-full items-center justify-center p-6">
      <div className={widthClasses}>
        {children}
      </div>
    </div>
  );
}
