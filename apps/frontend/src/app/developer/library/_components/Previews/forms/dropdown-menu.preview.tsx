"use client";
import { useState } from "react";
import { DropdownMenu } from "@/components/ui/form/DropdownMenu/DropdownMenu";
import { PreviewWrapper } from "../PreviewWrapper/PreviewWrapper";

type DropdownPreviewVariant = "basic" | "search" | "search-reset" | "multi-select";

const variantItems = {
  basic: [
    { value: "design", label: "Design" },
    { value: "development", label: "Development" },
    { value: "qa", label: "Quality Assurance" },
  ],
  search: [
    { value: "design", label: "Design" },
    { value: "development", label: "Development" },
    { value: "qa", label: "Quality Assurance" },
    { value: "creative", label: "Creative Direction" },
    { value: "strategy", label: "Creative Strategy" },
    { value: "production", label: "Production" },
  ],
  "search-reset": [
    { value: "january", label: "Januari 2026" },
    { value: "february", label: "Februari 2026" },
    { value: "march", label: "Maret 2026" },
    { value: "april", label: "April 2026" },
    { value: "may", label: "Mei 2026" },
    { value: "june", label: "Juni 2026" },
  ],
  "multi-select": [
    { value: "designer", label: "Designer" },
    { value: "developer", label: "Developer" },
    { value: "qa", label: "Quality Assurance" },
    { value: "copywriter", label: "Copywriter" },
  ],
} as const;

export function DropdownMenuPreview({ isOpen = true, onOpenChange = () => {}, dropdownVariant = "basic" }: { isOpen?: boolean; onOpenChange?: (isOpen: boolean) => void; dropdownVariant?: DropdownPreviewVariant }) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const items = [...variantItems[dropdownVariant]];
  const isMultiSelect = dropdownVariant === "multi-select";

  const handleSelect = (value: string) => {
    if (isMultiSelect) {
      setSelectedValues((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
    }
  };

  return <PreviewWrapper width="md"><div className="relative w-72"><DropdownMenu isOpen={isOpen} items={items} searchable={dropdownVariant !== "basic"} searchPlaceholder={dropdownVariant === "search-reset" ? "Cari bulan..." : "Cari divisi..."} onSelect={handleSelect} onClose={() => {}} onReset={dropdownVariant === "search-reset" ? () => setSelectedValues([]) : undefined} selectedValues={isMultiSelect ? selectedValues : undefined} style={{ top: 0 }} /></div></PreviewWrapper>;
}
