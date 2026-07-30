import type { TaskcardMobileAvatar, TaskcardMobileTheme } from "./types";

type TaskcardMobileDetailProps = {
  label: string;
  value: string;
  avatars?: TaskcardMobileAvatar[];
  theme?: TaskcardMobileTheme;
  className?: string;
};

export function TaskcardMobileDetail({ label, value, avatars = [], theme = "light", className }: TaskcardMobileDetailProps) {
  const isAssigned = label === "Assigned";
  const avatarUsers: TaskcardMobileAvatar[] = avatars.length > 0 ? avatars : isAssigned ? value.split(",").map((name) => ({ name: name.trim() })).filter((user) => user.name) : [];

  return (
    <div className={["flex w-full items-center justify-between gap-4 py-2 text-xs leading-4", theme === "dark" ? "text-[#b9b9b9]" : theme === "retro" ? "text-[#4b514a]" : "text-[#525e61]", className].filter(Boolean).join(" ")}>
      <span>{label}</span>
      <span className="flex min-w-0 items-center justify-end gap-1.5 text-right font-semibold">
        {isAssigned && <span className="flex shrink-0 -space-x-1.5">{avatarUsers.map((user, index) => {
          const initials = user.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
          return user.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`${user.name}-${index}`} src={user.photoUrl} alt={user.name} className="size-4 rounded-full border border-white object-cover" />
          ) : (
            <span key={`${user.name}-${index}`} className={`flex size-4 items-center justify-center rounded-full border border-white text-[7px] font-bold leading-none ${theme === "dark" ? "bg-[#b0ff5e] text-[#181818]" : theme === "retro" ? "bg-[#ba0dcb] text-white" : "bg-[#00a4ff] text-white"}`} aria-label={`Avatar ${user.name}`}>{initials || "?"}</span>
          );
        })}</span>}
        <span className="truncate">{value}</span>
      </span>
    </div>
  );
}
