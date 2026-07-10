export type TaskCardLoadingBarPercentage = "0" | "25" | "50" | "75" | "100";

export type TaskCardLoadingBarProps = {
  className?: string;
  percentage?: TaskCardLoadingBarPercentage;
};

export default function TaskCardLoadingBar({
  className = "",
  percentage = "0",
}: TaskCardLoadingBarProps) {
  return (
    <div
      className={["h-[7px] w-full overflow-hidden rounded-[32px] bg-[#d9dbde]", className].filter(Boolean).join(" ")}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Number(percentage)}
    >
      <div
        className="h-full rounded-[32px] bg-gradient-to-r from-[#7c3aed] to-[#db2777] transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
