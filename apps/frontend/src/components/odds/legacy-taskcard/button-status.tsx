"use client";

import { type TaskCardConfig } from "./index";

export type TaskCardButtonStatusState = "Progress" | "ACC Draft" | "Approve" | "Email";
export type TaskCardButtonStatusType = "Default" | "Done" | "Progress";

export type TaskCardButtonStatusProps = {
  className?: string;
  status?: TaskCardButtonStatusState;
  type?: TaskCardButtonStatusType;
  label?: string;
  onClick?: () => void;
  config?: TaskCardConfig;
  theme?: "light" | "dark" | "retro";
};

export default function TaskCardButtonStatus({
  className = "",
  status = "ACC Draft",
  type = "Default",
  label,
  onClick,
  config = {},
  theme = "light",
}: TaskCardButtonStatusProps) {
  const isDone = type === "Done";
  const isProgress = type === "Progress";

  // Use config colors or fallback to original
  const doneBg = theme === "dark" ? "#202820" : theme === "retro" ? "#eceee6" : config.color_done_bg || "#e8faea";
  const progressBg = theme === "dark" ? "#b0ff5e" : theme === "retro" ? "#ba0dcb" : config.color_progress_bg || "#8474f9";
  const doneText = theme === "dark" ? "#b0ff5e" : theme === "retro" ? "#24252b" : config.color_done_text || "#2b9915";
  const progressText = theme === "dark" ? "#181818" : theme === "retro" ? "#ffffff" : config.color_progress_text || "#ffffff";

  let bgStyle = {};
  let bgClasses = "border-[0.5px] border-solid transition-colors duration-200 ";
  
  if (isDone) {
    bgStyle = { backgroundColor: doneBg, borderColor: doneText };
    bgClasses += "hover:opacity-80";
  } else if (isProgress) {
    bgStyle = { backgroundColor: progressBg, borderColor: "transparent" };
    bgClasses += "hover:opacity-80";
  } else {
    bgClasses += theme === "dark" ? "bg-[#272b29] border-transparent hover:bg-[#333a35]" : theme === "retro" ? "bg-[#dfe2d3] border-[#24252b] hover:bg-[#c9ccc0]" : "bg-[#d9dbde] border-transparent hover:bg-[#cfd2d6]";
  }

  let textStyle = {};
  let textClasses = "text-center text-[10px] font-medium leading-3 ";
  
  if (isDone) {
    textStyle = { color: doneText };
  } else if (isProgress) {
    textStyle = { color: progressText };
  } else {
    textClasses += theme === "dark" ? "text-[#9da59f]" : theme === "retro" ? "text-[#24252b]" : "text-[#6b7280]";
  }

  let defaultLabel = "";
  if (status === "Email") defaultLabel = config.btn_status_email || "Kirim Email";
  else if (status === "Approve") defaultLabel = config.btn_status_approve || "Approval Design";
  else if (status === "Progress") defaultLabel = config.btn_status_progress || "Progress Design";
  else defaultLabel = config.btn_status_draft || "ACC Draft";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex h-11 w-full xl:w-[100px] items-center justify-center rounded-lg py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8474f9]/35 cursor-pointer",
        bgClasses,
        className
      ].filter(Boolean).join(" ")}
      style={bgStyle}
    >
      <span className={textClasses} style={textStyle}>
        {label || defaultLabel}
      </span>
    </button>
  );
}
