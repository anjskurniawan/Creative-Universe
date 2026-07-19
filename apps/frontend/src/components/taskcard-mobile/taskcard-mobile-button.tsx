import { MaterialIcon } from "@/components/material-icon";
import type { TaskcardMobileButtonColor, TaskcardMobileButtonIcon, TaskcardMobileButtonStyle, TaskcardMobileTheme } from "./types";

type TaskcardMobileButtonProps = {
  children: React.ReactNode;
  color?: TaskcardMobileButtonColor;
  style?: TaskcardMobileButtonStyle;
  icon?: TaskcardMobileButtonIcon;
  onClick?: () => void;
  disabled?: boolean;
  theme?: TaskcardMobileTheme;
  className?: string;
};

const themePrimaryAppearance: Record<TaskcardMobileTheme, Record<TaskcardMobileButtonStyle, string>> = {
  light: {
    outlined: "border border-[#00a4ff] bg-[#f3faff] text-[#0077bf]",
    filled: "bg-[#00a4ff] text-white",
    ghost: "bg-white text-[#0077bf]",
    light: "bg-[#eaf8ff] text-[#0077bf]",
  },
  dark: {
    outlined: "border border-[#b0ff5e] bg-[#b0ff5e]/10 text-[#b0ff5e]",
    filled: "bg-[#b0ff5e] text-[#181818]",
    ghost: "bg-[#171717] text-[#b0ff5e]",
    light: "bg-[#b0ff5e]/10 text-[#b0ff5e]",
  },
  retro: {
    outlined: "border-2 border-[#ba0dcb] bg-[#f2b8f6]/35 text-[#9c0bac]",
    filled: "bg-[#ba0dcb] text-white",
    ghost: "bg-[#eceee6] text-[#9c0bac]",
    light: "bg-[#f2b8f6]/45 text-[#9c0bac]",
  },
};

const appearance: Record<TaskcardMobileButtonStyle, Record<TaskcardMobileButtonColor, string>> = {
  outlined: {
    purple: "border border-[#8474f9] bg-[#eeebff] text-[#8474f9]",
    "purple-light": "border border-[#8474f9] bg-[#eeebff] text-[#8474f9]",
    green: "border border-[#2b9915] bg-[#e8f5e9] text-[#1b5e20]",
    "green-light": "border border-[#2b9915] bg-[#dcedde] text-[#2b9915]",
    red: "border border-[#b71c1c] bg-[#ffebee] text-[#b71c1c]",
    pink: "border border-[#ea4c89] bg-[#fff0f6] text-[#ea4c89]",
    neutral: "border border-[#d7dcdd] bg-white text-[#3b4446]",
    gray: "border border-[#aeb6b8] bg-white text-[#6b7280]",
  },
  filled: {
    purple: "bg-[#9d90fa] text-white",
    "purple-light": "bg-[#c1b9fc] text-white",
    green: "bg-[#2b9915] text-white",
    "green-light": "bg-[#dcedde] text-[#2b9915]",
    red: "bg-[#fd6d6d] text-white",
    pink: "bg-[#ea4c89] text-white",
    neutral: "bg-[#3b4446] text-white",
    gray: "bg-[#6b7280] text-white",
  },
  ghost: {
    purple: "bg-white text-[#8474f9]",
    "purple-light": "bg-white text-[#8474f9]",
    green: "bg-white text-[#2b9915]",
    "green-light": "bg-white text-[#2b9915]",
    red: "bg-white text-[#b71c1c]",
    pink: "bg-white text-[#ea4c89]",
    neutral: "bg-white text-[#3b4446]",
    gray: "bg-white text-[#6b7280]",
  },
  light: {
    purple: "bg-[#eeebff] text-[#8474f9]",
    "purple-light": "bg-[#eeebff] text-[#8474f9]",
    green: "bg-[#e8f5e9] text-[#1b5e20]",
    "green-light": "bg-[#dcedde] text-[#2b9915]",
    red: "bg-[#ffebee] text-[#b71c1c]",
    pink: "bg-[#fff0f6] text-[#ea4c89]",
    neutral: "bg-[#f3f4f6] text-black",
    gray: "bg-[#d9dbde] text-[#6b7280]",
  },
};

const iconName: Record<TaskcardMobileButtonIcon, string | null> = {
  none: null,
  link: "link",
  delete: "delete",
  sync: "directory_sync",
  upload: "data_saver_on",
};

export function TaskcardMobileButton({
  children,
  color = "purple",
  style = "outlined",
  icon = "none",
  onClick,
  disabled = false,
  theme = "light",
  className,
}: TaskcardMobileButtonProps) {
  const iconPosition = icon === "link" || icon === "upload" ? "justify-between" : "justify-center";
  const materialIcon = iconName[icon];
  const useThemePrimary = color !== "red" && color !== "gray";
  const buttonAppearance = theme === "dark" && color === "red"
    ? "border border-[#ff5e5e] bg-transparent text-[#ff7e87]"
    : useThemePrimary ? themePrimaryAppearance[theme][style] : appearance[style][color];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex h-11 w-full items-center rounded-xl px-4 py-2 text-base leading-6 transition-opacity disabled:cursor-not-allowed disabled:opacity-60",
        iconPosition,
        buttonAppearance,
        className,
      ].filter(Boolean).join(" ")}
    >
      <span>{children}</span>
      {materialIcon && <MaterialIcon name={materialIcon} size="auto" weight={400} className="text-2xl leading-none" />}
    </button>
  );
}
