"use client";

export type TaskCardButtonStatusState = "Progress" | "ACC Draft" | "Approve" | "Email";
export type TaskCardButtonStatusType = "Default" | "Done" | "Progress";

export type TaskCardButtonStatusProps = {
  className?: string;
  status?: TaskCardButtonStatusState;
  type?: TaskCardButtonStatusType;
  label?: string;
  onClick?: () => void;
};

export default function TaskCardButtonStatus({
  className = "",
  status = "ACC Draft",
  type = "Default",
  label,
  onClick,
}: TaskCardButtonStatusProps) {
  const isDone = type === "Done";
  const isProgress = type === "Progress";

  const bgClasses = isDone
    ? "bg-[#e8faea] border-[#2b9915] border-[0.5px] border-solid hover:bg-[#dbf7df]"
    : isProgress
    ? "bg-[#8474f9] border-transparent border-[0.5px] border-solid hover:bg-[#7261e3]"
    : "bg-[#d9dbde] border-transparent border-[0.5px] border-solid hover:bg-[#cfd2d6]";

  const textClasses = isDone
    ? "text-[#2b9915]"
    : isProgress
    ? "text-white"
    : "text-[#6b7280]";

  let defaultLabel = "";
  if (status === "Email") defaultLabel = "Kirim Email";
  else if (status === "Approve" && ["Progress", "Done"].includes(type)) defaultLabel = "Approval Design";
  else if (status === "Approve" && type === "Default") defaultLabel = "Approval Design";
  else if (status === "Progress") defaultLabel = "Progress Design";
  else defaultLabel = "ACC Draft";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex h-11 w-full xl:w-[100px] items-center justify-center rounded-lg py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8474f9]/35 cursor-pointer transition-colors duration-200",
        bgClasses,
        className
      ].filter(Boolean).join(" ")}
    >
      <span
        className={[
          "text-center text-[10px] font-medium leading-3",
          textClasses
        ].join(" ")}
      >
        {label || defaultLabel}
      </span>
    </button>
  );
}
