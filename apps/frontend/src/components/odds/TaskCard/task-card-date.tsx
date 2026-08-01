type DateDisplayProps = {
  quadrant: string;
  date: string;
  day: string;
  monthYear: string;
  time: string;
  isDone: boolean;
  accentClass: string;
  primaryClass: string;
  secondaryClass: string;
};

export function TaskCardMobileDate({ quadrant, date, monthYear, isDone }: Pick<DateDisplayProps, "quadrant" | "date" | "monthYear" | "isDone">) {
  return <div className={`flex w-[74px] shrink-0 flex-col items-center justify-center gap-1 px-2 py-3 ${isDone ? "bg-emerald-600 text-white" : "bg-[#00a4ff] text-white"}`}><span className="text-[9px] font-semibold tracking-[0.08em]">{quadrant}</span><span className="text-[34px] font-medium leading-none">{date}</span><span className="text-[9px]">{monthYear}</span></div>;
}

export function TaskCardCompactDate({ quadrant, date, day, monthYear, time, accentClass, primaryClass, secondaryClass }: DateDisplayProps) {
  return <div className="flex w-[100px] shrink-0 flex-col items-center justify-center text-center"><p className={`text-[11px] font-medium ${accentClass}`}>{quadrant}</p><p className={`text-[44px] font-medium leading-none ${primaryClass}`}>{date}</p><p className={`text-[11px] ${secondaryClass}`}>{monthYear}</p><p className={`text-[10px] ${secondaryClass}`}>{time} {day}</p></div>;
}

export function TaskCardWideDate({ quadrant, date, day, monthYear, time, isDone }: Pick<DateDisplayProps, "quadrant" | "date" | "day" | "monthYear" | "time" | "isDone">) {
  return <><div className={`flex shrink-0 items-center justify-center px-0.5 text-white ${isDone ? "bg-[#17633d]" : "bg-[#0077bf]"}`}><span className="text-[9px] font-medium tracking-[0.08em] [writing-mode:vertical-rl] rotate-180">{quadrant}</span></div><div className={`flex w-20 shrink-0 flex-col items-center justify-center text-white ${isDone ? "bg-[#238653]" : "bg-[#00a4ff]"}`}><span className="text-[9px] font-semibold">{isDone ? "SELESAI" : `${time} ${day}`}</span><span className="text-[34px] font-medium leading-none">{date}</span><span className="text-[10px]">{monthYear}</span></div></>;
}
