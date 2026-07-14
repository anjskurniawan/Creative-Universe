import type { TaskcardMobileChange } from "./types";

type TaskcardMobileChangelogProps = TaskcardMobileChange & {
  className?: string;
};

export function TaskcardMobileChangelog({ label, timestamp, className }: TaskcardMobileChangelogProps) {
  return (
    <div className={["flex min-h-[26px] items-start gap-1", className].filter(Boolean).join(" ")}>
      <span className="mt-1 size-2.5 shrink-0 rounded-full bg-[#8474f9]" aria-hidden="true" />
      <span className="flex min-w-0 flex-col">
        {timestamp && <span className="text-[8px] leading-[10px] text-[#525e61]">{timestamp}</span>}
        <span className="truncate text-xs leading-4 text-[#454545]">{label}</span>
      </span>
    </div>
  );
}
