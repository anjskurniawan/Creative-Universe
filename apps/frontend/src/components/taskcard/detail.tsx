import { MaterialIcon } from "@/components/material-icon";

export type TaskCardDetailVariant = "Vendor" | "Date" | "Count Down" | "Variant4";

export type TaskCardDetailProps = {
  className?: string;
  variant?: TaskCardDetailVariant;
  icon?: string;
  value?: string;
};

export default function TaskCardDetail({
  className = "",
  variant = "Vendor",
  icon,
  value,
}: TaskCardDetailProps) {
  const isCountDown = variant === "Count Down";
  const isVariant4 = variant === "Variant4"; // Done variant
  const isDate = variant === "Date";
  const isVendor = variant === "Vendor";

  if (isCountDown || isVariant4) {
    const badgeBg = isVariant4
      ? "bg-[#e8faea] border-[#2b9915] text-[#2b9915] hover:bg-[#dbf7df]"
      : "bg-[#eeebff] border-[#8474f9] text-[#8474f9] hover:bg-[#e4e0ff]";
      
    const displayValue = value || (isVariant4 ? "Link File" : "4 Days Left");

    return (
      <span
        className={[
          "flex h-[31px] w-fit items-center rounded-lg border px-4 py-1 text-xs font-normal leading-normal whitespace-nowrap select-none",
          badgeBg,
          className
        ].filter(Boolean).join(" ")}
      >
        {displayValue}
      </span>
    );
  }

  // Text with icon layout
  const defaultIcon = isDate ? "calendar_month" : "person";
  const displayIcon = icon || defaultIcon;
  const displayValue = value || (isDate ? "13/07/2026" : "Fusion");

  return (
    <div
      className={[
        "flex h-5 items-center gap-2 text-black select-none",
        className
      ].filter(Boolean).join(" ")}
    >
      <MaterialIcon
        name={displayIcon}
        size="auto"
        weight={300}
        filled={false}
        className="text-[16px] leading-none shrink-0"
      />
      <p className="whitespace-nowrap text-xs font-normal leading-normal">
        {displayValue}
      </p>
    </div>
  );
}
