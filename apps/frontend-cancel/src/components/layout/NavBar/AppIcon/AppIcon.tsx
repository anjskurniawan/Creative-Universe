import AppIconLogo from "./AppIconLogo/AppIconLogo";
import { APP_ICON_THEME_CONFIG } from "./AppIcon.config";
import { APP_ICON_SIZE_CONFIG } from "./AppIcon.config";
import type { AppIconProps } from "./AppIcon.types";

export type { AppIconProps, AppIconTheme } from "./AppIcon.types";

export default function AppIcon({
  theme = "light",
  hidden = false,
  size = "md",
  logoClassName,
  backgroundClassName,
  className = "",
  ariaLabel = "Creative Universe",
}: AppIconProps) {
  if (hidden) return null;
  const themeConfig = APP_ICON_THEME_CONFIG[theme];
  const sizeConfig = APP_ICON_SIZE_CONFIG[size];
  return (
    <div
      aria-label={ariaLabel}
      className={`cu-style relative flex shrink-0 items-center justify-center transition-colors ${sizeConfig.container} ${themeConfig.backgroundClassName} ${backgroundClassName ?? ""} ${className}`.trim()}
    >
      <AppIconLogo
        ariaLabel={ariaLabel}
        className={`${sizeConfig.logo} ${themeConfig.logoClassName} ${logoClassName ?? ""}`.trim()}
      />
    </div>
  );
}
