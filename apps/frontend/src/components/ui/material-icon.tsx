import React from "react";

type MaterialIconSize = "auto" | "xs" | "sm" | "md" | "lg" | "xl";
type MaterialIconWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700;

interface MaterialIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: string;
  size?: MaterialIconSize;
  /** Material Symbols weight axis. Defaults are selected from the rendered size. */
  weight?: MaterialIconWeight;
  /** Material Symbols fill axis. Product UI icons are filled by default. */
  filled?: boolean;
  grade?: -50 | 0 | 200;
}

const SIZE_CLASSES: Record<MaterialIconSize, string> = {
  auto: "cu-material-icon-auto",
  xs: "text-base",
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-4xl",
};

const DEFAULT_WEIGHTS: Record<MaterialIconSize, MaterialIconWeight> = {
  auto: 400,
  xs: 300,
  sm: 400,
  md: 500,
  lg: 500,
  xl: 600,
};

const OPTICAL_SIZES: Record<MaterialIconSize, number> = {
  auto: 24,
  xs: 20,
  sm: 20,
  md: 24,
  lg: 40,
  xl: 48,
};

export function MaterialIcon({
  name,
  size = "auto",
  weight,
  filled = true,
  grade = 0,
  className = "",
  style,
  ...props
}: MaterialIconProps) {
  let resolvedName = name ?? "";

  if (!resolvedName) {
    const iconClass = className.split(/\s+/).find((candidate) => candidate.startsWith("cu-icon-"));
    resolvedName = iconClass?.slice(8).replace(/-/g, "_") ?? "info";
  }

  resolvedName = resolvedName.replace(/-/g, "_").replace(/[^a-z0-9_]/g, "") || "info";

  const resolvedWeight = weight ?? DEFAULT_WEIGHTS[size];
  const variationSettings = [
    `'FILL' ${filled ? 1 : 0}`,
    `'wght' ${resolvedWeight}`,
    `'GRAD' ${grade}`,
    `'opsz' ${OPTICAL_SIZES[size]}`,
  ].join(", ");

  return (
    <span
      aria-hidden="true"
      className={`material-symbols-rounded cu-material-icon ${SIZE_CLASSES[size]} ${className}`.trim()}
      style={{ fontVariationSettings: variationSettings, ...style }}
      {...props}
    >
      {resolvedName}
    </span>
  );
}
