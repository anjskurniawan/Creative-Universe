export type ButtonMenuState = "Hover" | "Focus" | "Disable" | "Default";

import type { CSSProperties, MouseEventHandler } from "react";
import type { MaterialIconGrade, MaterialIconSize, MaterialIconWeight } from "@/components/ui/MaterialIcon/MaterialIcon";

export type ButtonMenuProps = {
  className?: string;
  icon: string;
  label: string;
  state?: ButtonMenuState;
  dark?: boolean;
  active?: boolean;
  size?: "sm" | "md" | "lg";
  iconSize?: MaterialIconSize;
  iconFilled?: boolean;
  iconWeight?: MaterialIconWeight;
  iconGrade?: MaterialIconGrade;
  iconClassName?: string;
  iconStyle?: CSSProperties;
  title?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};
