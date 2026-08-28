import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getButtonMenuStateClasses } from "./ButtonMenu.config";
import type { ButtonMenuProps } from "./ButtonMenu.types";

export type { ButtonMenuProps, ButtonMenuState } from "./ButtonMenu.types";

export default function ButtonMenu({
  className = "",
  icon,
  label,
  state = "Default",
  dark = false,
  active = false,
  size = "md",
  iconSize = "md",
  iconFilled = true,
  iconWeight,
  iconGrade,
  iconClassName = "",
  iconStyle,
  title,
  onClick,
}: ButtonMenuProps) {
  const disabled = state === "Disable";
  const sizeClass = size === "sm" ? "size-8" : size === "lg" ? "size-12" : "size-10";
  return (
    <button
      type="button"
      className={`cu-style flex ${sizeClass} shrink-0 items-center justify-center rounded-lg transition-all ${getButtonMenuStateClasses(state, dark, active)} ${disabled ? "opacity-35" : "opacity-100"} ${className}`.trim()}
      aria-label={label}
      title={title ?? label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
    >
      <MaterialIcon name={icon} size={iconSize} filled={iconFilled} weight={iconWeight} grade={iconGrade} style={iconStyle} className={`flex items-center justify-center ${dark ? "text-orange-500" : "text-[#222]"} ${iconClassName}`.trim()} />
    </button>
  );
}
