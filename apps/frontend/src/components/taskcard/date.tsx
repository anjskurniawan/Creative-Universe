export type TaskCardDateState = "Default" | "Done";

export type TaskCardDateProps = {
  className?: string;
  state?: TaskCardDateState;
  day?: string;
  date?: string;
  monthYear?: string;
};

export default function TaskCardDate({
  className = "",
  state = "Default",
  day = "Kamis",
  date = "09",
  monthYear = "JUL 2026",
}: TaskCardDateProps) {
  const isDone = state === "Done";
  
  return (
    <div
      className={[
        "flex flex-col items-center justify-center p-4 text-white w-[122px] shrink-0",
        isDone ? "bg-[#4ee546]" : "bg-[#8474f9]",
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
