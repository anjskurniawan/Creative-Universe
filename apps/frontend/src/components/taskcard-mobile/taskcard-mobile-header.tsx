import { MaterialIcon } from "@/components/material-icon";
import type { TaskcardMobileTheme, TaskcardMobileTone } from "./types";

type TaskcardMobileHeaderProps = {
  title: string;
  dateRange?: string;
  tone?: TaskcardMobileTone;
  theme?: TaskcardMobileTheme;
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

const toneLabel: Record<TaskcardMobileTone, string> = {
  default: "Berjalan",
  done: "Selesai",
  emergency: "Terlambat",
};

export function TaskcardMobileHeader({
  title,
  dateRange,
  tone = "default",
  theme = "light",
  open = false,
  onToggle,
  className,
}: TaskcardMobileHeaderProps) {
  const colors = toneClass[tone];
  const themedContainer = theme === "dark" ? "bg-[#171717]" : theme === "retro" ? "bg-[#eceee6]" : colors.container;
  const themedTitle = theme === "dark" ? "text-[#f1f1f1]" : theme === "retro" ? "text-[#24252b]" : colors.title;
  const themedDate = theme === "dark" ? "text-[#a7ada8]" : theme === "retro" ? "text-[#687065]" : colors.date;

  const accentClass = tone === "emergency"
    ? "bg-red-500/10 text-red-500"
    : theme === "dark"
      ? "bg-[#b0ff5e]/15 text-[#b0ff5e]"
      : theme === "retro"
        ? "bg-[#ba0dcb]/15 text-[#ba0dcb]"
        : "bg-[#00a4ff]/10 text-[#0077bf]";

  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={onToggle}
      className={[
        "flex w-full items-center gap-3 p-3.5 text-left transition-colors",
        open ? "rounded-t-xl" : "rounded-xl",
        themedContainer,
        className,
      ].filter(Boolean).join(" ")}
    >
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${accentClass}`}>
        <MaterialIcon name={tone === "done" ? "task_alt" : tone === "emergency" ? "priority_high" : "assignment"} size="auto" weight={400} className="text-xl leading-none" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex min-w-0 items-center gap-2">
          <span className={["truncate text-sm font-semibold leading-5", themedTitle].join(" ")}>{title}</span>
          <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-semibold leading-3 ${accentClass}`}>{toneLabel[tone]}</span>
        </span>
        {dateRange && <span className={["truncate text-[11px] leading-4", themedDate].join(" ")}>{dateRange}</span>}
      </span>
      <MaterialIcon
        name={open ? "keyboard_arrow_up" : "keyboard_arrow_down"}
        size="auto"
        weight={400}
        className={["shrink-0 text-2xl leading-none", themedTitle].join(" ")}
      />
    </button>
  );
}
