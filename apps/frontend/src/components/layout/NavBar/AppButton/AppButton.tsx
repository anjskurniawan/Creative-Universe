import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";
import type { AppButtonProps } from "./AppButton.types";

export type { AppButtonProps } from "./AppButton.types";

export default function AppButton({
  icon,
  label,
  onClick,
}: AppButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-9 items-center justify-center rounded-lg hover:bg-slate-100"
    >
      <MaterialIcon name={icon} size="auto" className="text-xl" />
    </button>
  );
}
