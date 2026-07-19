export type TaskCardDateState = "Default" | "Done";

export type TaskCardDateProps = {
  className?: string;
  state?: TaskCardDateState;
  day?: string;
  date?: string;
  monthYear?: string;
  theme?: "light" | "dark" | "retro";
};

export default function TaskCardDate({
  className = "",
  state = "Default",
  day = "Kamis",
  date = "09",
  monthYear = "JUL 2026",
  theme = "light",
}: TaskCardDateProps) {
  const isDone = state === "Done";
  
  return (
    <div
      className={[
        "flex w-[122px] shrink-0 flex-col items-center justify-center p-4",
        theme === "dark" ? (isDone ? "bg-[#b0ff5e] text-[#181818]" : "bg-[#202820] text-[#b0ff5e]") : theme === "retro" ? (isDone ? "bg-[#ba0dcb] text-white" : "bg-[#24252b] text-white") : isDone ? "bg-[#4ee546] text-[#181818]" : "bg-[#8474f9] text-white",
        className
      ].filter(Boolean).join(" ")}
    >
      <p className="text-base font-medium leading-normal">{day}</p>
      <p className="w-[72px] text-center text-[44px] font-medium leading-none">
        {date}
      </p>
      <p className="text-xs font-normal leading-normal">{monthYear}</p>
    </div>
  );
}
