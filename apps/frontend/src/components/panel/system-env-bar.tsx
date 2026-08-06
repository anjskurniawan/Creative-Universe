import React from "react";
import type { RootMetrics } from "./panel.types";

interface SystemEnvBarProps {
  metrics: RootMetrics;
}

export function SystemEnvBar({ metrics }: SystemEnvBarProps) {
  const envItems = [
    { label: "Laravel Version", value: metrics.laravel_version },
    { label: "PHP Version", value: metrics.php_version },
    { label: "Database Connection", value: metrics.database_driver, uppercase: true },
    { label: "Database Size", value: metrics.database_size },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 bg-cu-surface border border-cu-line rounded-xl p-4 text-xs shadow-sm">
      {envItems.map((item) => (
        <div key={item.label} className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-cu-muted uppercase tracking-wider">{item.label}</span>
          <span className={`font-mono font-semibold text-cu-ink ${item.uppercase ? "uppercase" : ""}`}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}
