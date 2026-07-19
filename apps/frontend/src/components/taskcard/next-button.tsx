"use client";

import { MaterialIcon } from "@/components/material-icon";

export type TaskCardNextButtonState = "Off" | "On" | "Done" | "Delete";

export type TaskCardNextButtonProps = {
  className?: string;
  state?: TaskCardNextButtonState;
  onClick?: () => void;
  theme?: "light" | "dark" | "retro";
};

export default function TaskCardNextButton({
  className = "",
  state = "On",
  onClick,
  theme = "light",
}: TaskCardNextButtonProps) {
  const isDelete = state === "Delete";
  const isDone = state === "Done";
  const isOff = state === "Off";
  
  const bgClasses = theme === "dark"
    ? isDone ? "bg-[#b0ff5e] text-[#181818] hover:bg-[#c6ff89]" : isOff ? "bg-[#272b29] text-[#9da59f] hover:bg-[#333a35]" : isDelete ? "bg-[#3a2020] text-[#ff7e87] hover:bg-[#512b2b]" : "bg-[#b0ff5e] text-[#181818] hover:bg-[#c6ff89]"
    : theme === "retro"
    ? isDone ? "bg-[#ba0dcb] text-white hover:bg-[#9c0bac]" : isOff ? "bg-[#b5b9ad] text-[#687065] hover:bg-[#a6aa9e]" : isDelete ? "bg-[#f2b8f6] text-[#8b0a98] hover:bg-[#e89ced]" : "bg-[#ba0dcb] text-white hover:bg-[#9c0bac]"
    : isDone
    ? "bg-[#4ee546] text-white hover:bg-[#43d13c]"
    : isOff
    ? "bg-[#d7dcdd] text-white hover:bg-[#cfd2d6]"
    : isDelete
    ? "bg-[#ffb2b2] text-[#ff5b55] hover:bg-[#ff9e9e]"
    : "bg-[#8474f9] text-[#1a1a1a] hover:bg-[#7261e3]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex size-[38px] shrink-0 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8474f9]/35 transition-colors duration-200",
        bgClasses,
        className
      ].filter(Boolean).join(" ")}
    >
      {isDelete && (
        <MaterialIcon
          name="close"
          size="auto"
          weight={400}
          filled={false}
          className="text-[20px] leading-none"
        />
      )}
      {isDone && (
        <MaterialIcon
          name="check_circle"
          size="auto"
          weight={400}
          filled={true}
          className="text-[24px] leading-none"
        />
      )}
      {(state === "On" || state === "Off") && (
        <MaterialIcon
          name="arrow_forward"
          size="auto"
          weight={700}
          filled={false}
          className="text-[24px] leading-none"
        />
      )}
    </button>
  );
}
