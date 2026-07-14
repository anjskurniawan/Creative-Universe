type TaskcardMobileDetailProps = {
  label: string;
  value: string;
  className?: string;
};

export function TaskcardMobileDetail({ label, value, className }: TaskcardMobileDetailProps) {
  return (
    <div className={["flex w-full items-center justify-between gap-4 text-xs leading-4 text-[#525e61]", className].filter(Boolean).join(" ")}>
      <span>{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  );
}
