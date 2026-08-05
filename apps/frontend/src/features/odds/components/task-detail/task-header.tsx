import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";
import { HeaderTitle } from "@/components/typography/header-title";
import { TaskDetailBackButton } from "@/features/odds/components/task-detail/task-detail-back-button";
import { QaComponentBoundary } from "@/features/odds/components/task-detail/qa-component-boundary";

type TaskHeaderProps = {
  title: string;
};

export function TaskHeader({ title }: TaskHeaderProps) {
  return (
    <div className="flex w-full items-center gap-3">
      <QaComponentBoundary label="HeaderTitle" tone="nested">
        <HeaderTitle className="!py-0 flex-1">
          <span className="lg:hidden">Detail Task</span>
          <span className="hidden lg:inline">{title}</span>
        </HeaderTitle>
      </QaComponentBoundary>
      <span className="lg:hidden">
        <Link href="/odds" className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-[#BDEAFF]/70 bg-white px-3 text-xs font-semibold text-[#04044A] shadow-sm transition hover:border-cu-info hover:text-cu-info">
          <MaterialIcon name="arrow_back" size="sm" />
          Kembali
        </Link>
      </span>
      <QaComponentBoundary label="TaskDetailBackButton" tone="nested">
        <span className="hidden lg:inline-flex"><TaskDetailBackButton /></span>
      </QaComponentBoundary>
    </div>
  );
}
