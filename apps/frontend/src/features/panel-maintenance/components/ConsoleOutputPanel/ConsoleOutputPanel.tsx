"use client";

import React from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

interface ConsoleOutputPanelProps {
  consoleOutput: string;
  onClear: () => void;
}

export function ConsoleOutputPanel({ consoleOutput, onClear }: ConsoleOutputPanelProps) {
  return (
    <section className="rounded-2xl border border-cu-line bg-cu-surface p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-cu-line pb-3">
        <div className="flex items-center gap-2">
          <span className="text-cu-primary flex items-center justify-center">
            <MaterialIcon name="terminal" size="xs" />
          </span>
          <h3 className="text-sm font-bold text-cu-ink">Output Konsol</h3>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-cu-muted hover:text-cu-ink transition flex items-center gap-1"
        >
          <MaterialIcon name="backspace" size="xs" /> Bersihkan
        </button>
      </div>

      <div className="rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-200 min-h-[250px] max-h-[450px] overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
        {consoleOutput}
      </div>
    </section>
  );
}
