import type { AppIconTheme } from "./AppIcon.types";

export const APP_ICON_THEME_CONFIG: Record<
  AppIconTheme,
  { backgroundClassName: string; logoClassName: string }
> = {
  light: {
    backgroundClassName: "bg-[#00a4ff]",
    logoClassName: "text-white",
  },
  dark: {
    backgroundClassName: "bg-orange-500",
    logoClassName: "text-black",
  },
};
