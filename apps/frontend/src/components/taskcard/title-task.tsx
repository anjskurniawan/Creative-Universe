export type TaskCardTitleTaskProps = {
  className?: string;
  title: string;
};

export default function TaskCardTitleTask({
  className = "",
  title,
}: TaskCardTitleTaskProps) {
  return (
    <div className={["flex items-center p-2.5", className].filter(Boolean).join(" ")}>
      <h2 className="line-clamp-2 text-[24px] font-semibold leading-normal text-black">
        {title}
      </h2>
    </div>
  );
}
