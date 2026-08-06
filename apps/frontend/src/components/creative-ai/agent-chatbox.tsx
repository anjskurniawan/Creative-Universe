"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export type AgentChatboxProps = {
  placeholder?: string;
  onSend?: (message: string, model: string, parameters: CreativeAiParameters) => void;
  className?: string;
};

export type CreativeAiParameters = {
  memory: boolean;
  structured_outputs: boolean;
  function_calling: boolean;
  web_access: boolean;
  reasoning_effort: "low" | "medium" | "high" | "xhigh";
  stream_response: boolean;
  aspect_ratio: "1:1" | "4:3" | "3:4" | "16:9" | "9:16";
};

export function AgentChatbox({
  placeholder = "Ask Creative Agent",
  onSend,
  className = "",
}: AgentChatboxProps) {
  const [value, setValue] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-3-6-flash");
  const [parameters, setParameters] = useState<CreativeAiParameters>({
    memory: false,
    structured_outputs: false,
    function_calling: false,
    web_access: false,
    reasoning_effort: "medium",
    stream_response: false,
    aspect_ratio: "1:1",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleSubmit = () => {
    if (!value.trim()) return;
    if (onSend) onSend(value, selectedModel, parameters);
    setValue("");
  };

  return (
    <>
      {(dropdownOpen || settingsOpen) && (
        <div
          className="fixed inset-0 z-30 cursor-default"
          onClick={() => {
            setDropdownOpen(false);
            setSettingsOpen(false);
          }}
        />
      )}
      <div
        className={`relative z-40 w-full rounded-full border border-white/10 transition-all duration-300 bg-white/[0.03] backdrop-blur-md shadow-2xl ${className}`}
      >
        {dropdownOpen && (
          <div className="absolute bottom-full mb-3 right-12 w-40 rounded-xl border border-white/10 bg-[#27272a] shadow-2xl py-1 z-50 overflow-hidden">
            {[
              { id: "grok", label: "grok-4-5" },
              { id: "gemini", label: "gemini-3-6-flash" },
              { id: "z-image", label: "z-image" },
            ].map((model) => {
              const isAvailable = true;
              return (
                <button
                  key={model.id}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => {
                    setSelectedModel(model.label);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                    !isAvailable
                      ? "text-white/30 cursor-not-allowed"
                      : selectedModel === model.label
                      ? "text-orange-500 bg-white/5 font-semibold"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {model.label}
                </button>
              );
            })}
          </div>
        )}
        {settingsOpen && (
          <div className="absolute bottom-full right-12 mb-3 w-64 rounded-xl border border-white/10 bg-[#27272a] p-4 text-white shadow-2xl z-50">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">Pengaturan {selectedModel}</p>
            {selectedModel === "z-image" && <p className="text-xs text-white/60">Z-Image menggunakan prompt untuk generate image.</p>}
            {selectedModel === "z-image" && (
              <label className="mt-3 flex items-center justify-between gap-3 text-xs text-white/70">
                Rasio gambar
                <select
                  value={parameters.aspect_ratio}
                  onChange={(event) => setParameters((current) => ({ ...current, aspect_ratio: event.target.value as CreativeAiParameters["aspect_ratio"] }))}
                  className="rounded bg-white/10 px-1.5 py-1 text-[11px] text-white outline-none"
                >
                  {["1:1", "4:3", "3:4", "16:9", "9:16"].map((ratio) => <option key={ratio} value={ratio} className="bg-[#27272a]">{ratio}</option>)}
                </select>
              </label>
            )}
            {selectedModel !== "z-image" && <>
            {([
              ["memory", "Memory"],
              ["structured_outputs", "Structured outputs"],
              ["function_calling", "Function calling"],
              ["web_access", "Web access"],
              ["stream_response", "Stream response"],
            ] as const).map(([key, label]) => (
              <label key={key} className="flex cursor-pointer items-center justify-between gap-3 py-1.5 text-xs text-white/70">
                {label}
                <input type="checkbox" checked={parameters[key]} onChange={(event) => setParameters((current) => ({ ...current, [key]: event.target.checked }))} className="size-3.5 accent-orange-500" />
              </label>
            ))}
            <label className="mt-2 flex items-center justify-between gap-3 text-xs text-white/70">
              Reasoning effort
              <select value={parameters.reasoning_effort} onChange={(event) => setParameters((current) => ({ ...current, reasoning_effort: event.target.value as CreativeAiParameters["reasoning_effort"] }))} className="rounded bg-white/10 px-1.5 py-1 text-[11px] text-white outline-none">
                {(["low", "medium", "high", "xhigh"] as const).map((effort) => <option key={effort} value={effort} className="bg-[#27272a]">{effort}</option>)}
              </select>
            </label>
            </>}
          </div>
        )}
        <div className="flex items-center gap-3 p-2">
          <button
            type="button"
            aria-label="Sisipkan file"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-white/55 hover:bg-white/10 transition-all active:scale-95"
          >
            <MaterialIcon name="add" size="sm" />
          </button>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
          />
          <button
            type="button"
            aria-label="Pengaturan AI"
            onClick={() => {
              setSettingsOpen((prev) => !prev);
              setDropdownOpen(false);
            }}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-white/55 hover:bg-white/10 transition-all active:scale-95"
          >
            <MaterialIcon name="settings" size="sm" />
          </button>
          <button
            type="button"
            aria-label="Pilih model"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-white/55 hover:text-white hover:bg-white/5 transition-all active:scale-95"
          >
            <span>{selectedModel}</span>
            <MaterialIcon name="keyboard_arrow_down" size="xs" />
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!value.trim()}
            className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-all active:scale-95 ${
              value.trim()
                ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
                : "bg-white/5 text-white/20 cursor-not-allowed"
            }`}
          >
            <MaterialIcon name="arrow_upward" size="sm" />
          </button>
        </div>
      </div>
    </>
  );
}
