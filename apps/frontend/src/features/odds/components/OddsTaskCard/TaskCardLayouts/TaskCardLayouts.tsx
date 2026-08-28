import type { ReactNode } from "react";

export function TaskCardMobileLayout({ surfaceClass, lineClass, isOpen, onToggle, dateBlock, heading, people, meta, actions }: { surfaceClass: string; lineClass: string; isOpen: boolean; onToggle: () => void; dateBlock: ReactNode; heading: ReactNode; people: ReactNode; meta: ReactNode; actions: ReactNode }) {
  return <div className={`min-[988px]:hidden ${surfaceClass}`}><button type="button" onClick={onToggle} className="flex w-full text-left">{dateBlock}<div className="min-w-0 flex-1 p-3">{heading}<div className={`mt-2 border-t pt-2 ${lineClass}`}>{people}</div><div className={`mt-2 flex items-center justify-between gap-2 text-[11px]`}>{meta}</div></div></button>{isOpen && <div className={`border-t p-3 ${lineClass}`}>{actions}</div>}</div>;
}

export function TaskCardCompactLayout({ surfaceClass, lineClass, dateBlock, taskInfo, people, actions, sidePanel }: { surfaceClass: string; lineClass: string; dateBlock: ReactNode; taskInfo: ReactNode; people: ReactNode; actions: ReactNode; sidePanel: ReactNode }) {
  return <div className={`hidden min-h-[146px] items-stretch gap-4 p-4 lg:flex 2xl:hidden ${surfaceClass}`}>{dateBlock}<div className={`flex min-w-0 flex-1 gap-4 border-l pl-4 ${lineClass}`}><div className="flex min-w-0 flex-1 flex-col justify-between">{taskInfo}{people}{actions}</div>{sidePanel}</div></div>;
}

export function TaskCardWideLayout({ surfaceClass, dateBlock, taskInfo, people, deadline, actions, status }: { surfaceClass: string; dateBlock: ReactNode; taskInfo: ReactNode; people: ReactNode; deadline: ReactNode; actions: ReactNode; status: ReactNode }) {
  return <div className={`hidden min-h-[96px] items-stretch min-[988px]:flex ${surfaceClass}`}><div className="flex min-w-0 flex-1 items-stretch">{dateBlock}{taskInfo}{people}{deadline}<div className="box-border flex min-w-0 flex-1 items-center justify-start overflow-hidden px-2">{actions}</div></div>{status}</div>;
}
