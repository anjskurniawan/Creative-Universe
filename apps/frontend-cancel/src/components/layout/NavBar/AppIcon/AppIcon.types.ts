export type AppIconTheme = "light" | "dark";
export type AppIconSize = "sm" | "md" | "lg";

export type AppIconProps = {
  theme?: AppIconTheme;
  hidden?: boolean;
  size?: AppIconSize;
  logoClassName?: string;
  backgroundClassName?: string;
  className?: string;
  ariaLabel?: string;
};
