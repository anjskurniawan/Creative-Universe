import type { HTMLAttributes } from "react";

export type IconMaterialSize = "auto" | "xs" | "sm" | "md" | "lg" | "xl";
export type IconMaterialWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700;
export type IconMaterialGrade = -50 | 0 | 200;

export interface IconMaterialProps extends HTMLAttributes<HTMLSpanElement> {
  name?: string;
  size?: IconMaterialSize;
  /** Material Symbols weight axis. Defaults are selected from the rendered size. */
  weight?: IconMaterialWeight;
  /** Material Symbols fill axis. Product UI icons are filled by default. */
  filled?: boolean;
  grade?: IconMaterialGrade;
}
