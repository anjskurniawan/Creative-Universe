"use client";

import React, { useMemo } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export type BreadcrumbProps = {
  className?: string;
  items?: string[];
};

export default function Breadcrumb({
  className = "",
  items,
}: BreadcrumbProps) {
  const resolvedItems = useMemo(() => {
    if (items) return items;
    if (typeof document === "undefined") return [];

    const parts = document.title.split(" - ");
    return parts.length >= 2 ? [parts[1], parts[0]] : [parts[0] || "Sub App"];
  }, [items]);

  if (resolvedItems.length === 0) return null;

  return (
    <div
      className={`content-stretch flex gap-[4px] items-center relative ${className}`}
      data-node-id="28:115"
      data-name="navbar/Breadcrumb"
    >
      {resolvedItems.map((item, index) => {
        const isLast = index === resolvedItems.length - 1;

        return (
          <React.Fragment key={index}>
            <p
              className={`[word-break:break-word] font-sans text-[14px] whitespace-nowrap leading-none ${
                isLast
                  ? "font-medium text-[#3b4446]"
                  : "font-normal text-[#aeb6b8]"
              }`}
              data-node-id={isLast ? "28:119" : "28:116"}
            >
              {item}
            </p>
            {!isLast && (
              <div
                className="relative shrink-0 size-[24px] flex items-center justify-center"
                data-node-id="28:117"
                data-name="Frame"
              >
                <MaterialIcon name="chevron_right" size="sm" className="text-[#aeb6b8]" aria-hidden />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
