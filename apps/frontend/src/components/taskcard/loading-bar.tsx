export type TaskCardLoadingBarPercentage = "0" | "25" | "50" | "75" | "100";

export type TaskCardLoadingBarProps = {
  className?: string;
  percentage?: TaskCardLoadingBarPercentage;
  theme?: "light" | "dark" | "retro";
};

export default function TaskCardLoadingBar({
  className = "",
  percentage = "0",
  theme = "light",
}: TaskCardLoadingBarProps) {
  return (
    <div
      className={["h-[7px] w-full overflow-hidden rounded-[32px]", theme === "dark" ? "bg-[#2b322e]" : theme === "retro" ? "bg-[#b5b9ad]" : "bg-[#d9dbde]", className].filter(Boolean).join(" ")}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Number(percentage)}
    >
      <div
        className={`h-full rounded-[32px] transition-all duration-500 ease-out ${theme === "dark" ? "bg-[#b0ff5e]" : theme === "retro" ? "bg-[#ba0dcb]" : "bg-gradient-to-r from-[#7c3aed] to-[#db2777]"}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
