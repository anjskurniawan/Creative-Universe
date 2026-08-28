import React from "react";

export interface ContentTitleProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  className?: string;
}

export function ContentTitle({
  title,
  subtitle,
  rightElement,
  className = "",
}: ContentTitleProps) {
  return (
    <header className={`flex flex-wrap items-start justify-between gap-4 w-full shrink-0 ${className}`}>
      <div>
        <h1 className="text-3xl md:text-[32px] font-semibold leading-tight tracking-tight text-cu-ink font-sans">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-sm font-medium text-cu-muted font-sans">
            {subtitle}
          </p>
        )}
      </div>
      {rightElement && (
        <div className="flex items-center gap-3">
          {rightElement}
        </div>
      )}
    </header>
  );
}
