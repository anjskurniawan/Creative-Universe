import AppIconLogo from "./AppIconLogo/AppIconLogo";
import { APP_ICON_THEME_CONFIG } from "./AppIcon.config";
import type { AppIconProps } from "./AppIcon.types";

export type { AppIconProps } from "./AppIcon.types";

export default function AppIcon({ theme = "light" }: AppIconProps) {
  const themeConfig = APP_ICON_THEME_CONFIG[theme];

  return (
    <div
      className={`relative flex size-8 shrink-0 items-center justify-center rounded-lg p-1 transition-colors ${themeConfig.backgroundClassName}`}
    >
      <AppIconLogo className={`h-5 w-[18px] ${themeConfig.logoClassName}`} />
    </div>
  );
}
