"use client";

import { usePathname } from "next/navigation";
import { Link as AriaLink } from "react-aria-components";
import { Badge } from "@react-spectrum/s2/Badge";
import { Tooltip, TooltipTrigger } from "@react-spectrum/s2/Tooltip";
import { iconStyle } from "@react-spectrum/s2/style" with { type: "macro" };
import {
  IconSpectrum,
  type IconSpectrumName,
} from "@/components/spectrum/IconSpectrum";
import type { MenuProps, MenuItem } from "./Menu.types";

export function Menu({
  items,
  isExpanded = true,
  setSidebarExpanded,
  activeHref,
  className = "",
  "aria-label": ariaLabel = "Navigasi Menu",
}: MenuProps) {
  const currentPathname = usePathname();
  const currentActiveHref = activeHref ?? currentPathname;

  // Daftar menu bawaan tetap (Fixed)
  const defaultItems: MenuItem[] = [
    {
      id: "new-chat",
      label: "Percakapan Baru",
      icon: "New",
      onPress: () => {
        if (currentActiveHref === "/creative-ai") {
          window.location.reload();
        } else {
          window.location.href = "/creative-ai";
        }
      },
    },
    {
      id: "search",
      label: "Cari Percakapan",
      icon: "Search",
      onPress: () => {
        if (!isExpanded && setSidebarExpanded) {
          setSidebarExpanded(true);
        } else {
          alert("Cari Percakapan...");
        }
      },
    },
    {
      id: "imagine",
      label: "Imagine Art",
      icon: "Image",
      href: "/creative-ai/imagine",
    },
    {
      id: "workflows",
      label: "Otomatisasi",
      icon: "Animation",
      href: "/creative-ai/workflows",
    },
    {
      id: "plugins",
      label: "Keterampilan & Konektor",
      icon: "Plugin",
      href: "/creative-ai/plugins",
    },
  ];

  const menuItems = items ?? defaultItems;

  if (!menuItems || menuItems.length === 0) return null;

  return (
    <nav
      aria-label={ariaLabel}
      className={`flex flex-col gap-1 w-full ${className}`.trim()}
    >
      {/* List Item Navigasi (Menu utama tanpa header judul) */}
      {menuItems.map((item: MenuItem) => {
        const isActive =
          item.isActive !== undefined
            ? item.isActive
            : Boolean(
                item.href &&
                currentActiveHref &&
                item.href !== "#" &&
                (currentActiveHref === item.href ||
                  currentActiveHref.startsWith(`${item.href}/`)),
              );

        // Ukuran Icon dikunci permanen ke L (22px Spectrum S2)
        const renderIcon = () => {
          if (!item.icon) return null;
          if (typeof item.icon === "string") {
            return (
              <IconSpectrum
                name={item.icon as IconSpectrumName}
                styles={iconStyle({ size: "L" })}
              />
            );
          }
          return item.icon;
        };

        const handleClick = () => {
          if (item.isDisabled) return;
          if (item.onPress) {
            item.onPress();
          } else if (item.href && item.href !== "#") {
            window.location.href = item.href;
          }
        };

        // Render mode collapsed (hanya icon L + tooltip)
        if (!isExpanded) {
          return (
            <TooltipTrigger key={item.id} placement="right">
              <AriaLink
                href={item.isDisabled ? undefined : item.href || "#"}
                isDisabled={item.isDisabled}
                aria-label={item["aria-label"] || item.label}
                onPress={handleClick}
                className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
                  item.isDisabled
                    ? "opacity-40 cursor-not-allowed text-white/30"
                    : isActive
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {renderIcon()}
              </AriaLink>
              <Tooltip>{item.label}</Tooltip>
            </TooltipTrigger>
          );
        }

        // Render mode expanded (icon L + label title-sm + badge)
        return (
          <AriaLink
            key={item.id}
            href={item.isDisabled ? undefined : item.href || "#"}
            isDisabled={item.isDisabled}
            aria-label={item["aria-label"] || item.label}
            onPress={handleClick}
            className={`flex h-11 w-full items-center gap-3 rounded-xl px-3 transition-all ${
              item.isDisabled
                ? "opacity-40 cursor-not-allowed text-white/30"
                : isActive
                  ? "bg-white/15 text-white font-semibold shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {renderIcon()}
            {/* Tipografi title-sm Spectrum */}
            <span className="flex-1 truncate text-sm font-semibold tracking-tight">
              {item.label}
            </span>
            {item.badge && (
              <Badge
                variant={item.badgeVariant || "accent"}
                size="S"
                fillStyle="subtle"
              >
                {item.badge}
              </Badge>
            )}
          </AriaLink>
        );
      })}
    </nav>
  );
}

// Backward compatibility alias
export { Menu as MenuNav };
