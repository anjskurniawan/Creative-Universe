"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";

export function TaskCardActionBar({ children, mobile = false, fillHeight = false, overlay, minButtonWidth = 60 }: { children: ReactNode; mobile?: boolean; fillHeight?: boolean; overlay?: ReactNode; minButtonWidth?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(Number.POSITIVE_INFINITY);
  const items = Children.toArray(children);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const update = () => {
      const width = container.clientWidth;
      setVisibleCount(width >= minButtonWidth ? items.length : 0);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [items.length, minButtonWidth]);

  return <div ref={containerRef} className={`relative flex w-full min-w-0 items-center overflow-hidden ${fillHeight ? "h-full" : ""} ${mobile ? "flex-nowrap" : "flex-nowrap justify-start"} gap-2`}>
    {items.slice(0, visibleCount).map((item, index) => <div key={index} className="w-max min-w-[60px] shrink-0">{item}</div>)}
    {overlay && <div className="absolute inset-0 z-10 overflow-hidden">{overlay}</div>}
  </div>;
}
