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
};

export default function TaskCardDetail({
  className = "",
  variant = "Vendor",
  icon,
  value,
  onClick,
  config = {},
}: TaskCardDetailProps) {
  const isCountDown = variant === "Count Down";
  const isVariant4 = variant === "Variant4"; // Done variant
  const isDate = variant === "Date";
  const isVendor = variant === "Vendor";

  if (isCountDown || isVariant4) {
    const doneBg = config.color_done_bg || "#e8faea";
    const doneText = config.color_done_text || "#2b9915";
    const progressText = config.color_progress_text || "#8474f9";
    const progressBgLight = "#eeebff"; // fallback

    let badgeBg = "";
    let style = {};

    if (isVariant4) {
      style = { backgroundColor: doneBg, color: doneText, borderColor: doneText };
      badgeBg = "hover:opacity-80";
    } else {
      style = { backgroundColor: progressBgLight, color: progressText, borderColor: progressText };
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
  
  const textColor = isVendor ? "text-[#8474f9]" : "text-[#222222]";
  const textWeight = isVendor ? "font-semibold" : "font-normal";
  const iconColor = isVendor ? "text-[#8474f9]" : "text-[#1E1E1E]";

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
