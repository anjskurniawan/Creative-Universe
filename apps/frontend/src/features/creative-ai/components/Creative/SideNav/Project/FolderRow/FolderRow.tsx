"use client";

import { Link as AriaLink } from "react-aria-components";
import { Tooltip, TooltipTrigger } from "@react-spectrum/s2/Tooltip";
import { iconStyle } from "@react-spectrum/s2/style" with { type: "macro" };
import { IconSpectrum, type IconSpectrumName } from "@/components/spectrum/IconSpectrum";
import { SubItemList } from "../SubItemList";
import type { FolderRowProps } from "./FolderRow.types";

export function FolderRow({
  item,
  isExpanded,
  isFolderOpen,
  isItemActive,
  onToggleFolder,
  activeHref,
}: FolderRowProps) {
  const hasSubItems = item.subItems && item.subItems.length > 0;

  const renderIcon = () => {
    if (!item.icon || item.icon === "Folder") {
      const iconName: IconSpectrumName = isFolderOpen ? "FolderOpen" : "Folder";
      return <IconSpectrum name={iconName} styles={iconStyle({ size: "L" })} />;
    }
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

  const handleItemClick = () => {
    if (item.isDisabled) return;
    if (hasSubItems) {
      onToggleFolder();
    }
    if (item.onPress) {
      item.onPress();
    }
  };

  const handleAddSubItem = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.onAddSubItem) {
      item.onAddSubItem();
    } else {
      alert(`Tambah item baru ke proyek: ${item.label}`);
    }
  };

  const handleMoreOptions = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.onMoreOptions) {
      item.onMoreOptions();
    } else {
      alert(`Opsi proyek: ${item.label}`);
    }
  };

  // Mode Collapsed
  if (!isExpanded) {
    return (
      <TooltipTrigger placement="right">
        <AriaLink
          href={item.isDisabled ? undefined : item.href || "#"}
          isDisabled={item.isDisabled}
          aria-label={item["aria-label"] || item.label}
          onPress={handleItemClick}
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
            item.isDisabled
              ? "opacity-40 cursor-not-allowed text-white/30"
              : isItemActive
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

  // Mode Expanded
  return (
    <div className="flex flex-col gap-0.5 w-full">
      {/* Baris Folder Item */}
      <div className="group relative flex w-full items-center rounded-xl transition-all hover:bg-white/5">
        <button
          type="button"
          disabled={item.isDisabled}
          aria-label={item["aria-label"] || item.label}
          onClick={handleItemClick}
          className={`flex h-10 flex-1 min-w-0 items-center gap-3 rounded-xl px-3 text-left transition-all ${
            item.isDisabled
              ? "opacity-40 cursor-not-allowed text-white/30"
              : isItemActive
                ? "bg-white/15 text-white font-semibold shadow-sm"
                : "text-white/70 group-hover:text-white"
          }`}
        >
          <div className="shrink-0">{renderIcon()}</div>
          {/* Tipografi body-sm Spectrum dengan truncated text */}
          <span className="truncate text-sm font-normal text-white/90">
            {item.label}
          </span>
        </button>

        {/* Container Actions (+ dan ...) */}
        <div className="mr-2 flex shrink-0 items-center gap-0.5">
          {/* Action (+): Tambah Item */}
          <TooltipTrigger placement="top">
            <button
              type="button"
              aria-label={`Tambah item ke ${item.label}`}
              onClick={handleAddSubItem}
              className="flex h-6 w-6 items-center justify-center rounded-md text-white/40 opacity-0 group-hover:opacity-100 hover:bg-white/10 hover:text-white transition-all"
            >
              <IconSpectrum
                name="Add"
                styles={iconStyle({ size: "S" })}
              />
            </button>
            <Tooltip>Tambah Item</Tooltip>
          </TooltipTrigger>

          {/* Action (...): Opsi Lainnya */}
          <TooltipTrigger placement="top">
            <button
              type="button"
              aria-label={`Opsi lainnya ${item.label}`}
              onClick={handleMoreOptions}
              className="flex h-6 w-6 items-center justify-center rounded-md text-white/40 opacity-0 group-hover:opacity-100 hover:bg-white/10 hover:text-white transition-all"
            >
              <IconSpectrum
                name="More"
                styles={iconStyle({ size: "S" })}
              />
            </button>
            <Tooltip>Opsi Lainnya</Tooltip>
          </TooltipTrigger>
        </div>
      </div>

      {/* Sub-item list */}
      {hasSubItems && isFolderOpen && (
        <SubItemList subItems={item.subItems!} activeHref={activeHref} />
      )}
    </div>
  );
}
