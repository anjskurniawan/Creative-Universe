"use client";

import { Link as AriaLink } from "react-aria-components";
import type { SubItemListProps } from "./SubItemList.types";

export function SubItemList({ subItems, activeHref }: SubItemListProps) {
  if (!subItems || subItems.length === 0) return null;

  return (
    <div className="ml-8 flex flex-col gap-0.5 py-0.5">
      {subItems.map((subItem) => {
        const isSubActive =
          subItem.isActive !== undefined
            ? subItem.isActive
            : Boolean(
                subItem.href &&
                activeHref &&
                subItem.href !== "#" &&
                (activeHref === subItem.href || activeHref.startsWith(`${subItem.href}/`))
              );

        const handleSubClick = () => {
          if (subItem.isDisabled) return;
          if (subItem.onPress) {
            subItem.onPress();
          } else if (subItem.href && subItem.href !== "#") {
            window.location.href = subItem.href;
          }
        };

        return (
          <AriaLink
            key={subItem.id}
            href={subItem.isDisabled ? undefined : subItem.href || "#"}
            isDisabled={subItem.isDisabled}
            aria-label={subItem["aria-label"] || subItem.label}
            onPress={handleSubClick}
            className={`flex h-8 w-full items-center rounded-lg px-2.5 text-xs transition-all ${
              subItem.isDisabled
                ? "opacity-40 cursor-not-allowed text-white/30"
                : isSubActive
                  ? "bg-white/15 text-white font-medium shadow-sm"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="truncate">{subItem.label}</span>
          </AriaLink>
        );
      })}
    </div>
  );
}
