import type { HTMLAttributes } from "react";

export type MaterialIconSize = "auto" | "xs" | "sm" | "md" | "lg" | "xl";
export type MaterialIconWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700;
export type MaterialIconGrade = -50 | 0 | 200;

export interface MaterialIconProps extends HTMLAttributes<HTMLSpanElement> {
  name?: string;
  size?: MaterialIconSize;
  weight?: MaterialIconWeight;
  filled?: boolean;
  grade?: MaterialIconGrade;
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
  filled = false,
  grade = 0,
  className = "",
  style,
  ...props
}: MaterialIconProps) {
  const iconClass = className.split(/\s+/).find((candidate) => candidate.startsWith("cu-icon-"));
  const resolvedName = (name ?? iconClass?.slice(8) ?? "info").replace(/-/g, "_").replace(/[^a-z0-9_]/g, "") || "info";
  const variationSettings = `'FILL' ${filled ? 1 : 0}, 'wght' ${weight ?? DEFAULT_WEIGHTS[size]}, 'GRAD' ${grade}, 'opsz' ${OPTICAL_SIZES[size]}`;

  return (
    <span
      aria-hidden="true"
      className={`material-symbols-rounded cu-material-icon ${SIZE_CLASSES[size]} ${className}`.trim()}
      style={{ fontFamily: '"Material Symbols Rounded"', fontVariationSettings: variationSettings, ...style }}
      {...props}
    >
      {resolvedName}
    </span>
  );
}
