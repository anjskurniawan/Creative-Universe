import type { AppIconTheme } from "./AppIcon.types";

export const APP_ICON_SIZE_CONFIG = {
  sm: { container: "size-7 rounded-md p-1", logo: "h-4 w-4" },
  md: { container: "size-8 rounded-lg p-1", logo: "h-5 w-[18px]" },
  lg: { container: "size-10 rounded-xl p-1.5", logo: "h-6 w-5" },
} as const;

export const APP_ICON_THEME_CONFIG: Record<AppIconTheme, { backgroundClassName: string; logoClassName: string }> = {
  light: { backgroundClassName: "bg-app-icon-light", logoClassName: "text-white" },
  dark: { backgroundClassName: "bg-app-icon-dark", logoClassName: "text-black" },
};
