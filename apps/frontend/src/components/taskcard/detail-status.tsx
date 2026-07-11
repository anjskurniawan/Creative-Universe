import { useState, useRef, useEffect } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { type TaskCardConfig } from "./index";

export type TaskCardDetailStatusState = "Draft Final" | "3D Gambar Kerja";

export type TaskCardDetailStatusProps = {
  className?: string;
  isDone?: boolean;
  status?: TaskCardDetailStatusState;
  files?: (string | null)[];
  onUploadClick?: (index: number) => void;
  onViewClick?: (url: string) => void;
  config?: TaskCardConfig;
};

export default function TaskCardDetailStatus({
  className = "",
  isDone = false,
  status = "3D Gambar Kerja",
  files = [null, null, null],
  onUploadClick,
  onViewClick,
  config = {},
}: TaskCardDetailStatusProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasAnyFile = files.some(f => f !== null);

  const doneBg = config.color_done_bg || "#e8faea";
  const doneText = config.color_done_text || "#2b9915";

  let bgStyle = {};
  let textStyle = {};
  
  let bgClasses = "bg-[#eeebff]";
  let textClasses = "text-[#8474f9]";

  if (!hasAnyFile) {
    bgClasses = "bg-[#f3f4f6]";
    textClasses = "text-[#6b7280]";
  } else if (isDone) {
    bgClasses = "";
    bgStyle = { backgroundColor: doneBg };
    textClasses = "";
    textStyle = { color: doneText };
  }

  const displayText = status === "Draft Final" 
    ? (config.detail_status_2 || "Draft Final") 
    : (config.detail_status_1 || "3D Gambar Kerja");
    
  const iconName = !hasAnyFile 
    ? (config.icon_file_empty || "add_circle") 
    : (config.icon_file_filled || "arrow_drop_down_circle");

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={[
          "flex h-[24px] w-[130px] shrink-0 items-center justify-between rounded-[8px] px-[8px] py-[4px] cursor-pointer hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8474f9]/30",
          bgClasses,
        ].filter(Boolean).join(" ")}
        style={bgStyle}
      >
        <p
          className={[
            "whitespace-nowrap text-[12px] font-normal leading-normal font-['Google_Sans_Flex']",
            textClasses
          ].join(" ")}
          style={textStyle}
        >
          {displayText}
        </p>
        <div className="relative shrink-0 size-[16px] flex items-center justify-center">
          <MaterialIcon
            name={isOpen ? "arrow_drop_up_circle" : iconName}
            size="auto"
            weight={300}
            filled={false}
            className={["!text-[16px] leading-none block", textClasses].join(" ")}
            style={{ fontSize: "16px", ...textStyle }}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-[130px] bg-white border border-cu-line rounded-[8px] shadow-sm z-50 flex flex-col overflow-hidden">
          {files.map((file, idx) => (
            <div
              key={idx}
              onClick={() => {
                setIsOpen(false);
                if (file && onViewClick) onViewClick(file);
                if (!file && onUploadClick) onUploadClick(idx);
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs text-cu-ink hover:bg-gray-50 cursor-pointer border-b border-cu-line last:border-0"
            >
              <MaterialIcon 
                name={file ? "visibility" : "upload"} 
                size="auto" 
                className="text-[14px] text-cu-muted" 
              />
              <span className="font-medium truncate">
                {file 
                  ? (config.detail_dropdown_file ? config.detail_dropdown_file.replace("{N}", String(idx + 1)) : `File ${idx + 1}`) 
                  : (config.detail_dropdown_upload || "Upload")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
