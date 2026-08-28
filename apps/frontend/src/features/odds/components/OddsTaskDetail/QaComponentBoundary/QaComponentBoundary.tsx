"use client";

import { cloneElement, createContext, isValidElement, useContext, type ReactElement, type ReactNode } from "react";

export type QaBoundaryTone = "primary" | "nested" | "deep";
export type QaBoundaryLevels = Record<QaBoundaryTone, boolean>;
const QaModeContext = createContext<QaBoundaryLevels>({ primary: false, nested: false, deep: false });

export function QaModeProvider({ children, levels }: { children: ReactNode; levels: QaBoundaryLevels }) {
  return <QaModeContext.Provider value={levels}>{children}</QaModeContext.Provider>;
}

export function useQaMode() {
  return useContext(QaModeContext).primary;
}

export function useQaBoundaryLevels() {
  return useContext(QaModeContext);
}

type QaComponentBoundaryProps = {
  label: string;
  enabled?: boolean;
  children: ReactNode;
  className?: string;
  tone?: QaBoundaryTone;
  wrap?: boolean;
  labelSide?: "left" | "right";
};

/** Visual-only component map for the ODDS dummy detail route. */
export function QaComponentBoundary({ label, enabled, children, className = "", tone = "primary", wrap = false, labelSide = "left" }: QaComponentBoundaryProps) {
  const qaLevels = useContext(QaModeContext);
  if (!(enabled ?? qaLevels[tone])) return <>{children}</>;

  const labelPosition = labelSide === "right" ? "before:left-auto before:right-2" : "before:left-2";
  const boundaryClass = tone === "deep"
    ? `relative !border-2 !border-emerald-500 before:pointer-events-none before:absolute ${labelPosition} before:top-2 before:z-20 before:whitespace-nowrap before:rounded before:bg-emerald-600 before:px-1.5 before:py-0.5 before:text-[9px] before:font-bold before:uppercase before:tracking-wide before:text-white before:content-[attr(data-qa-component)]`
    : tone === "nested"
    ? `relative !border-2 !border-blue-500 before:pointer-events-none before:absolute ${labelPosition} before:top-2 before:z-20 before:whitespace-nowrap before:rounded before:bg-blue-600 before:px-1.5 before:py-0.5 before:text-[9px] before:font-bold before:uppercase before:tracking-wide before:text-white before:content-[attr(data-qa-component)]`
    : `relative !border-2 !border-red-500 before:pointer-events-none before:absolute ${labelPosition} before:top-2 before:z-20 before:whitespace-nowrap before:rounded before:bg-red-600 before:px-1.5 before:py-0.5 before:text-[9px] before:font-bold before:uppercase before:tracking-wide before:text-white before:content-[attr(data-qa-component)]`;

  // Clone the element rather than adding a wrapper so flex and grid layouts
  // remain identical to the real Detail Task page.
  if (!wrap && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string; "data-qa-component"?: string }>;
    return cloneElement(child, {
      className: `${className} ${child.props.className ?? ""} ${boundaryClass}`,
      "data-qa-component": label,
    });
  }

  return (
    <div className={`${className} ${tone === "deep" ? "relative !border-2 !border-emerald-500" : tone === "nested" ? "relative !border-2 !border-blue-500" : "relative !border-2 !border-red-500"}`}>
      <span className={`pointer-events-none absolute left-2 top-2 z-20 whitespace-nowrap rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white ${tone === "deep" ? "bg-emerald-600" : tone === "nested" ? "bg-blue-600" : "bg-red-600"}`}>
        {label}
      </span>
      {children}
    </div>
  );
}
