"use client";

import { MaterialIcon } from "@/components/material-icon";

export type TaskCardDetailStatusState = "Draft Final" | "3D Gambar Kerja";

export type TaskCardDetailStatusProps = {
  className?: string;
  isDone?: boolean;
  status?: TaskCardDetailStatusState;
  hasFile?: boolean;
  onClick?: () => void;
};

export default function TaskCardDetailStatus({
  className = "",
  isDone = false,
  status = "3D Gambar Kerja",
  hasFile = true,
  onClick,
}: TaskCardDetailStatusProps) {
  let bgClasses = "bg-[#eeebff] border-transparent border-[0.5px] border-solid";
  let textClasses = "text-[#8474f9]";

  if (!hasFile) {
    bgClasses = "bg-[#f3f4f6] border-transparent border-[0.5px] border-solid";
    textClasses = "text-[#6b7280]";
  } else if (isDone) {
    bgClasses = "bg-[#e8faea] border-[#2b9915] border-[0.5px] border-solid";
    textClasses = "text-[#2b9915]";
  }

  const displayText = status === "Draft Final" ? "Draft Final" : "3D Gambar Kerja";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex h-[23px] shrink-0 items-center gap-2 rounded-lg px-4 py-1 cursor-pointer hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8474f9]/30",
        bgClasses,
        className
      ].filter(Boolean).join(" ")}
    >
      <MaterialIcon
        name={hasFile ? "visibility" : "add"}
        size="auto"
        weight={300}
        filled={false}
        className={["text-[15px] leading-none shrink-0", textClasses].join(" ")}
      />
      <p
        className={[
          "whitespace-nowrap text-xs font-normal leading-normal",
          textClasses
        ].join(" ")}
      >
        {displayText}
      </p>
    </button>
  );
}
