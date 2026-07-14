import { MaterialIcon } from "@/components/material-icon";
import type { TaskcardMobileTone } from "./types";

type TaskcardMobileHeaderProps = {
  title: string;
  dateRange?: string;
  tone?: TaskcardMobileTone;
  open?: boolean;
  onToggle?: () => void;
  className?: string;
};

const toneClass: Record<TaskcardMobileTone, { container: string; title: string; date: string }> = {
  default: {
    container: "bg-white",
    title: "text-[#3b4446]",
    date: "text-[#aeb6b8]",
  },
  done: {
    container: "bg-[#e8f5e9]",
    title: "text-[#1b5e20]",
    date: "text-[#388e3c]",
  },
  emergency: {
    container: "bg-[#ffebee]",
    title: "text-[#b71c1c]",
    date: "text-[#d32f2f]",
  },
};

export function TaskcardMobileHeader({
  title,
  dateRange,
  tone = "default",
  open = false,
  onToggle,
  className,
}: TaskcardMobileHeaderProps) {
  const colors = toneClass[tone];

  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={onToggle}
      className={[
        "flex w-full items-center justify-between p-4 text-left",
        open ? "rounded-t-xl" : "rounded-xl",
        colors.container,
        className,
      ].filter(Boolean).join(" ")}
    >
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className={["truncate text-sm leading-[19px]", colors.title].join(" ")}>{title}</span>
        {dateRange && <span className={["text-xs leading-4", colors.date].join(" ")}>{dateRange}</span>}
      </span>
      <MaterialIcon
        name={open ? "keyboard_arrow_up" : "keyboard_arrow_down"}
        size="auto"
        weight={400}
        className={["ml-4 shrink-0 text-2xl leading-none", colors.title].join(" ")}
      />
    </button>
  );
}
