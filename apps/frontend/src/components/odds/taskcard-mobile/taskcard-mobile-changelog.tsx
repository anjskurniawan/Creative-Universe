import type { TaskcardMobileChange, TaskcardMobileTheme } from "./types";

type TaskcardMobileChangelogProps = TaskcardMobileChange & {
  theme?: TaskcardMobileTheme;
  className?: string;
};

export function TaskcardMobileChangelog({ label, timestamp, reason, theme = "light", className }: TaskcardMobileChangelogProps) {
  const reasonClass = theme === "dark"
    ? "bg-white/5 text-[#c5cac5]"
    : theme === "retro"
      ? "bg-[#c9ccc0] text-[#4b514a]"
      : "bg-[#edf6ff] text-[#4e6475]";

  return (
    <div className={["flex min-h-[26px] items-start gap-1.5", className].filter(Boolean).join(" ")}>
      <span className={`mt-0 shrink-0 text-[11px] leading-[10px] ${theme === "dark" ? "text-[#b0ff5e]" : theme === "retro" ? "text-[#ba0dcb]" : "text-[#00a4ff]"}`} aria-hidden="true">•</span>
      <span className="flex min-w-0 flex-col">
        {timestamp && <span className={`text-[8px] leading-[10px] ${theme === "dark" ? "text-[#a7ada8]" : theme === "retro" ? "text-[#687065]" : "text-[#525e61]"}`}>{timestamp}</span>}
        <span className={`truncate text-xs leading-4 ${theme === "dark" ? "text-[#f1f1f1]" : theme === "retro" ? "text-[#24252b]" : "text-[#454545]"}`}>{label}</span>
        {reason && <span className={`mt-1 rounded-md px-2 py-1 text-[10px] leading-[14px] ${reasonClass}`}>{reason}</span>}
      </span>
    </div>
  );
}
