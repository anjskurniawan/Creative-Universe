"use client";

import { useState } from "react";
import { PREVIEW_REGISTRY, DefaultPreviewPlaceholder } from "./previews";
import type { ComponentItem } from "./library.data";
import { ToolbarButton } from "./toolbar-button";

const VIEWPORT_TOOLS = [
  { value: "Desktop", icon: "desktop_windows", label: "Desktop" },
  { value: "Tablet", icon: "tablet_android", label: "Tablet" },
  { value: "Mobile", icon: "phone_iphone", label: "Mobile" },
] as const;

export function VisualPreview({ component }: { component: ComponentItem }) {
  const [viewport, setViewport] = useState<"Desktop" | "Tablet" | "Mobile">("Desktop");
  const [darkBackground, setDarkBackground] = useState(false);
  const viewportWidth = {
    Desktop: "w-full",
    Tablet: "w-full max-w-[720px]",
    Mobile: "w-full max-w-[390px]",
  }[viewport];

  return (
    <div className="mt-4 flex flex-col gap-0">
      <div className="rounded-t-2xl border border-b-0 border-slate-200 bg-white px-5 py-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Visual Preview
            </h3>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[9px] font-medium uppercase tracking-wider text-slate-400">
              Playground
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-x border-slate-200 bg-slate-50 px-4 py-2">
        <div className="flex items-center gap-1">
          {VIEWPORT_TOOLS.map((tool) => (
            <ToolbarButton
              key={tool.value}
              icon={tool.icon}
              label={tool.label}
              active={viewport === tool.value}
              onClick={() => setViewport(tool.value)}
            />
          ))}
          <ToolbarButton
            icon="format_color_fill"
            label="Background"
            active={darkBackground}
            onClick={() => setDarkBackground((current) => !current)}
          />
        </div>
      </div>

      <div
        className={`relative min-h-[320px] overflow-hidden rounded-b-2xl border p-6 shadow-sm transition-colors duration-200 ${darkBackground ? "border-slate-700 bg-slate-950" : "border-slate-200 bg-white"}`}
        style={{
          backgroundImage:
            darkBackground
              ? "linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)"
              : "linear-gradient(#e9edf0 1px, transparent 1px), linear-gradient(90deg, #e9edf0 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="flex min-h-[268px] w-full items-center justify-center">
          <div className={`${viewportWidth} transition-[max-width] duration-300`}>
            <div className="relative flex min-h-[268px] w-full items-center justify-center p-6">
              {PREVIEW_REGISTRY[component.name] || (
                <DefaultPreviewPlaceholder componentName={component.name} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
