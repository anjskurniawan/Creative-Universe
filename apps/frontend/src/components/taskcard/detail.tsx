import { MaterialIcon } from "@/components/material-icon";
import { type TaskCardConfig } from "./index";

export type TaskCardDetailVariant = "Vendor" | "Date" | "Count Down" | "Variant4";

export type TaskCardDetailProps = {
  className?: string;
  variant?: TaskCardDetailVariant;
  icon?: string;
  value?: string;
  onClick?: () => void;
  config?: TaskCardConfig;
  theme?: "light" | "dark" | "retro";
};

export default function TaskCardDetail({
  className = "",
  variant = "Vendor",
  icon,
  value,
  onClick,
  config = {},
  theme = "light",
}: TaskCardDetailProps) {
  const isCountDown = variant === "Count Down";
  const isVariant4 = variant === "Variant4"; // Done variant
  const isDate = variant === "Date";
  const isVendor = variant === "Vendor";

  if (isCountDown || isVariant4) {
    const progressText = config.color_progress_text || "#8474f9";
    const isOverdue = isCountDown && value?.startsWith("Terlambat");

    let badgeBg = "";
    let style = {};

    const defaultCountdownBadge = theme === "dark"
      ? { backgroundColor: "transparent", color: "#b0ff5e", borderColor: "#b0ff5e" }
      : theme === "retro"
      ? { backgroundColor: "transparent", color: "#24252b", borderColor: "#24252b" }
      : { backgroundColor: "transparent", color: progressText, borderColor: progressText };

    if (isVariant4) {
      style = defaultCountdownBadge;
      badgeBg = "hover:opacity-80";
    } else if (isOverdue) {
      style = { ...defaultCountdownBadge, color: "#ef4444", borderColor: "#ef4444" };
      badgeBg = "hover:opacity-80";
    } else {
      style = defaultCountdownBadge;
      badgeBg = "hover:opacity-80";
    }
      
    const displayValue = value || (isVariant4 ? (config.detail_link_file || "Link File") : "4 Days Left");

    return (
      <span
        onClick={onClick}
        className={[
          "flex h-[31px] w-fit items-center rounded-lg border px-4 py-1 text-xs font-normal leading-normal whitespace-nowrap select-none",
          badgeBg,
          onClick ? "cursor-pointer" : "",
          className
        ].filter(Boolean).join(" ")}
        style={style}
      >
        {displayValue}
      </span>
    );
  }

  // Text with icon layout
  const defaultIcon = isDate ? "calendar_month" : "person";
  const displayIcon = icon || defaultIcon;
  const displayValue = value || (isDate ? "13/07/2026" : "Fusion");
  
  const textColor = theme === "dark" ? "text-[#f1f1f1]" : isVendor ? "text-[#8474f9]" : "text-[#222222]";
  const textWeight = isVendor ? "font-semibold" : "font-normal";
  const iconColor = theme === "dark" ? "text-[#b0ff5e]" : isVendor ? "text-[#8474f9]" : "text-[#1E1E1E]";

  return (
    <div
      onClick={onClick}
      className={[
        "flex items-center gap-[8px] select-none",
        textColor,
        onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : "",
        className
      ].filter(Boolean).join(" ")}
    >
      <div className="relative shrink-0 size-[20px] flex items-center justify-center">
        <MaterialIcon
          name={displayIcon}
          size="auto"
          weight={300}
          filled={false}
          className={`text-[20px] leading-none block ${iconColor}`}
          style={{ fontSize: "20px" }}
        />
      </div>
      <p className={`whitespace-nowrap text-[16px] leading-normal font-['Google_Sans_Flex'] ${textWeight}`}>
        {displayValue}
      </p>
    </div>
  );
}
