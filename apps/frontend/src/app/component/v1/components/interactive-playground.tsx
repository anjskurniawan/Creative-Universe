"use client";

import { useEffect, useState, type ReactNode } from "react";
import { codeToHtml } from "shiki";
import { MaterialIcon } from "@/components/ui/material-icon";
import { API_BASE_URL } from "@/core/api/client";

type Breakpoint = "responsive" | "sm" | "md" | "lg" | "xl" | "2xl";
type PlaygroundTab = "preview" | "code";

const breakpointWidths: Record<Breakpoint, string> = {
  responsive: "100%",
  sm: "370px",
  md: "508px",
  lg: "764px",
  xl: "1020px",
  "2xl": "1276px",
};

type InteractivePlaygroundProps = {
  componentName: string;
  componentPath: string;
  breadcrumb?: string[];
  children: ReactNode;
  code: string;
  controls?: ReactNode;
  initialBreakpoint?: Breakpoint;
  minHeight?: number;
};

function PlaygroundHeader({
  componentName,
  componentPath,
  breadcrumb = [],
}: Pick<
  InteractivePlaygroundProps,
  "componentName" | "componentPath" | "breadcrumb"
>) {
  const [copiedField, setCopiedField] = useState<"path" | "name" | null>(null);

  const copyValue = async (value: string, field: "path" | "name") => {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    window.setTimeout(() => setCopiedField(null), 1_500);
  };

  return (
    <header className="mb-5 shrink-0">
      <nav
        aria-label="Breadcrumb"
        className="mb-2 flex flex-wrap items-center gap-1 font-mono text-xs text-slate-500"
      >
        {breadcrumb.map((segment, index) => (
          <span key={`${segment}-${index}`} className="flex items-center gap-1">
            {index > 0 && <span aria-hidden="true">/</span>}
            <span>{segment}</span>
          </span>
        ))}
        {breadcrumb.length > 0 && <span aria-hidden="true">/</span>}
      </nav>

      <h1 className="text-2xl font-semibold text-slate-900">{componentName}</h1>

      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="truncate">{componentPath}</span>
          <button
            type="button"
            onClick={() => void copyValue(componentPath, "path")}
            className="shrink-0 text-slate-400 hover:text-slate-700"
            aria-label="Copy component path"
          >
            <MaterialIcon
              name={copiedField === "path" ? "check" : "content_copy"}
              size="xs"
            />
          </button>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <span>{componentName}</span>
          <button
            type="button"
            onClick={() => void copyValue(componentName, "name")}
            className="text-slate-400 hover:text-slate-700"
            aria-label="Copy component name"
          >
            <MaterialIcon
              name={copiedField === "name" ? "check" : "content_copy"}
              size="xs"
            />
          </button>
        </div>
      </div>
    </header>
  );
}

function PlaygroundTabs({
  activeTab,
  onChange,
}: {
  activeTab: PlaygroundTab;
  onChange: (tab: PlaygroundTab) => void;
}) {
  return (
    <div className="flex shrink-0 border-b border-slate-200">
      {(["preview", "code"] as const).map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`px-4 py-2.5 text-sm font-medium capitalize ${activeTab === tab ? "border-b-2 border-blue-500 text-blue-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function PreviewCanvas({
  children,
  breakpoint,
  zoom,
  minHeight,
}: {
  children: ReactNode;
  breakpoint: Breakpoint;
  zoom: number;
  minHeight: number;
}) {
  return (
    <div
      className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-8"
      style={{
        minHeight,
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <div
        className="h-fit overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl transition-all duration-300"
        style={{
          width: breakpointWidths[breakpoint],
          transform: `scale(${zoom / 100})`,
          transformOrigin: "top center",
        }}
      >
        <div className="flex h-8 items-center justify-center border-b border-slate-100 bg-slate-50 font-mono text-[10px] text-slate-400">
          {breakpoint === "responsive"
            ? "Responsive (100%)"
            : `${breakpoint.toUpperCase()} — ${breakpointWidths[breakpoint]}`}
        </div>
        <div className="w-full p-4">{children}</div>
      </div>
    </div>
  );
}

function CodePanel({ highlightedCode }: { highlightedCode: string }) {
  return (
    <div className="v1-code-panel min-h-0 flex-1 w-full overflow-auto p-3 text-xs">
      <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </div>
  );
}

function PlaygroundFooter({
  breakpoint,
  zoom,
  onBreakpointChange,
  onZoomChange,
}: {
  breakpoint: Breakpoint;
  zoom: number;
  onBreakpointChange: (value: Breakpoint) => void;
  onZoomChange: (value: number) => void;
}) {
  return (
    <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-3 py-2">
      <div className="flex items-center rounded-md border border-slate-200/60 bg-slate-100 p-1">
        {(Object.keys(breakpointWidths) as Breakpoint[]).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onBreakpointChange(value)}
            className={`rounded px-3 py-1 text-xs font-medium uppercase ${breakpoint === value ? "border border-slate-200/50 bg-white text-slate-800 shadow-sm" : "border border-transparent text-slate-500 hover:bg-slate-200/50"}`}
          >
            {value === "responsive" ? "Responsive" : value}
          </button>
        ))}
      </div>
      <div className="flex items-center rounded-md border border-slate-200/60 bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => onZoomChange(Math.max(25, zoom - 25))}
          className="rounded p-1.5 text-slate-500 hover:bg-slate-200/50"
          aria-label="Zoom out"
        >
          <MaterialIcon name="zoom_out" size="xs" />
        </button>
        <button
          type="button"
          onClick={() => onZoomChange(100)}
          className="min-w-14 px-2 text-xs font-medium text-slate-600"
        >
          {zoom}%
        </button>
        <button
          type="button"
          onClick={() => onZoomChange(Math.min(200, zoom + 25))}
          className="rounded p-1.5 text-slate-500 hover:bg-slate-200/50"
          aria-label="Zoom in"
        >
          <MaterialIcon name="zoom_in" size="xs" />
        </button>
      </div>
    </footer>
  );
}

export function InteractivePlayground({
  componentName,
  componentPath,
  breadcrumb,
  children,
  code,
  controls,
  initialBreakpoint = "responsive",
  minHeight = 400,
}: InteractivePlaygroundProps) {
  const [activeTab, setActiveTab] = useState<PlaygroundTab>("preview");
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(initialBreakpoint);
  const [zoom, setZoom] = useState(100);
  const [isControlsOpen, setIsControlsOpen] = useState(true);
  const [sourceCode, setSourceCode] = useState(code);
  const [sourceStatus, setSourceStatus] = useState<
    "idle" | "loading" | "ready" | "fallback"
  >("idle");
  const [highlightedCode, setHighlightedCode] = useState("");

  useEffect(() => {
    let cancelled = false;
    setSourceStatus("loading");
    const loadSource = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/component-source?path=${encodeURIComponent(componentPath)}`,
          { credentials: "include" },
        );
        if (!response.ok) throw new Error("Source request failed");
        const payload = (await response.json()) as {
          data?: { source?: string };
        };
        if (!cancelled && payload.data?.source) {
          setSourceCode(payload.data.source);
          setSourceStatus("ready");
        } else if (!cancelled) setSourceStatus("fallback");
      } catch {
        if (!cancelled) setSourceStatus("fallback");
      }
    };
    void loadSource();
    return () => {
      cancelled = true;
    };
  }, [activeTab, code, componentPath]);

  useEffect(() => {
    const extension = componentPath.split(".").pop()?.toLowerCase();
    const language =
      extension === "css" || extension === "scss"
        ? "css"
        : extension === "tsx" || extension === "jsx"
          ? "tsx"
          : "typescript";
    void codeToHtml(sourceCode, {
      lang: language,
      theme: "github-dark-default",
    }).then(setHighlightedCode);
  }, [componentPath, sourceCode]);

  const handleTabChange = (tab: PlaygroundTab) => setActiveTab(tab);

  return (
    <section className="flex h-full min-h-0 flex-col">
      <PlaygroundHeader
        componentName={componentName}
        componentPath={componentPath}
        breadcrumb={breadcrumb}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_4px_24px_-12px_rgba(0,0,0,0.1)]">
        <PlaygroundTabs activeTab={activeTab} onChange={handleTabChange} />
        {activeTab !== "code" ? (
          <div className="flex min-h-0 flex-1">
            <PreviewCanvas
              breakpoint={breakpoint}
              zoom={zoom}
              minHeight={minHeight}
            >
              {children}
            </PreviewCanvas>
            {controls && (
              <aside
                className={`shrink-0 border-l border-slate-200/80 bg-white/95 shadow-[-8px_0_24px_-20px_rgba(15,23,42,0.5)] transition-[width] duration-200 ${isControlsOpen ? "w-72" : "w-12"}`}
                aria-label="Component props"
              >
                <button
                  type="button"
                  onClick={() => setIsControlsOpen((open) => !open)}
                  className={`flex h-12 items-center border-b border-slate-200/80 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800 ${isControlsOpen ? "w-full justify-between px-4" : "w-full justify-center"}`}
                  aria-label={
                    isControlsOpen ? "Collapse props" : "Expand props"
                  }
                >
                  {isControlsOpen && (
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <MaterialIcon name="tune" size="xs" />
                      </span>
                      Props
                    </span>
                  )}
                  <MaterialIcon
                    name={isControlsOpen ? "chevron_right" : "tune"}
                    size="xs"
                  />
                </button>
                {isControlsOpen && (
                  <div className="flex flex-col gap-4 p-4">{controls}</div>
                )}
              </aside>
            )}
          </div>
        ) : (
          <>
            <div className="flex shrink-0 items-center justify-end border-b border-[#30363d] bg-[#1f2428] px-6 py-2 text-[11px] text-slate-400">
              {sourceStatus === "loading"
                ? "Memuat source..."
                : sourceStatus === "ready"
                  ? "Source aktual"
                  : "Fallback snippet"}
            </div>
            <CodePanel highlightedCode={highlightedCode} />
          </>
        )}
        {activeTab === "preview" && (
          <PlaygroundFooter
            breakpoint={breakpoint}
            zoom={zoom}
            onBreakpointChange={setBreakpoint}
            onZoomChange={setZoom}
          />
        )}
      </div>
    </section>
  );
}
