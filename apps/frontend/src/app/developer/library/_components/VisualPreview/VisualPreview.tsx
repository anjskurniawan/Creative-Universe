import React, { useState } from "react";
import { PREVIEW_REGISTRY, DefaultPreviewPlaceholder } from "@/app/developer/library/_components/Previews";
import type { ComponentItem } from "@/app/developer/library/library.data";
import { ToolbarButton } from "@/app/developer/library/_components/ToolbarButton/ToolbarButton";
import { ToolbarControl } from "@/app/developer/library/_components/ToolbarControl/ToolbarControl";

const VIEWPORT_TOOLS = [
  { value: "Desktop", icon: "desktop_windows", label: "Desktop" },
  { value: "Tablet", icon: "tablet_android", label: "Tablet" },
  { value: "Mobile", icon: "phone_iphone", label: "Mobile" },
] as const;

type PreviewProps = {
  variant?: "primary" | "secondary" | "danger" | "outline" | "filter";
  size?: "sm" | "md" | "lg";
  iconLeft?: string;
  iconRight?: string;
  loading?: boolean;
  disabled?: boolean;
  example?: "report" | "team" | "settings";
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  dropdownVariant?: "basic" | "search" | "search-reset" | "multi-select";
  label?: string;
  description?: string;
  maxFiles?: number;
};

export function VisualPreview({ category, component }: { category: string; component: ComponentItem }) {
  const [viewport, setViewport] = useState<"Desktop" | "Tablet" | "Mobile">("Desktop");
  const [darkBackground, setDarkBackground] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [gridDensity, setGridDensity] = useState("24");
  const [gridColor, setGridColor] = useState<"Slate" | "Purple">("Slate");

  // States for Button customization
  const [btnVariant, setBtnVariant] = useState<"primary" | "secondary" | "danger" | "outline" | "filter">("primary");
  const [btnSize, setBtnSize] = useState<"sm" | "md" | "lg">("lg");
  const [btnIconLeft, setBtnIconLeft] = useState("");
  const [btnIconRight, setBtnIconRight] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [actionCardExample, setActionCardExample] = useState<"report" | "team" | "settings">("report");
  const [dropdownOpen, setDropdownOpen] = useState(true);
  const [dropdownVariant, setDropdownVariant] = useState<"basic" | "search" | "search-reset" | "multi-select">("basic");
  const [fileUploadLabel, setFileUploadLabel] = useState("Lampiran file");
  const [fileUploadDescription, setFileUploadDescription] = useState("PDF, JPG, PNG hingga 10 MB");
  const [fileUploadMaxFiles, setFileUploadMaxFiles] = useState("3");

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
          <ToolbarControl icon="settings" label="Pengaturan Grid">
            <ToolbarControl.Toggle
              label="Tampilkan Grid"
              active={showGrid}
              onChange={setShowGrid}
            />
            <hr className="my-1 border-slate-100" />
            <ToolbarControl.Input
              label="Kepadatan Grid (px)"
              value={gridDensity}
              onChange={setGridDensity}
            />
            <hr className="my-1 border-slate-100" />
            <div className="flex flex-col gap-1 px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Warna Garis</span>
              <ToolbarControl.Item
                label="Slate"
                active={gridColor === "Slate"}
                onClick={() => setGridColor("Slate")}
              />
              <ToolbarControl.Item
                label="Purple"
                active={gridColor === "Purple"}
                onClick={() => setGridColor("Purple")}
              />
            </div>
          </ToolbarControl>

          {/* Button Customizer Controls (Only when viewing the Button component) */}
          {component.name === "Button" && (
            <>
              <div className="h-4 w-px bg-slate-200 mx-1" />
              
              {/* Variant Dropdown */}
              <ToolbarControl icon="style" label="Variant Button">
                <div className="flex flex-col gap-1 px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pilih Varian</span>
                  <ToolbarControl.Item
                    label="Primary"
                    active={btnVariant === "primary"}
                    onClick={() => setBtnVariant("primary")}
                  />
                  <ToolbarControl.Item
                    label="Secondary"
                    active={btnVariant === "secondary"}
                    onClick={() => setBtnVariant("secondary")}
                  />
                  <ToolbarControl.Item
                    label="Danger"
                    active={btnVariant === "danger"}
                    onClick={() => setBtnVariant("danger")}
                  />
                  <ToolbarControl.Item
                    label="Outline"
                    active={btnVariant === "outline"}
                    onClick={() => setBtnVariant("outline")}
                  />
                  <ToolbarControl.Item
                    label="Filter"
                    active={btnVariant === "filter"}
                    onClick={() => setBtnVariant("filter")}
                  />
                </div>
              </ToolbarControl>

              {/* Size Dropdown */}
              <ToolbarControl icon="format_size" label="Ukuran Button">
                <div className="flex flex-col gap-1 px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pilih Ukuran</span>
                  <ToolbarControl.Item
                    label="Small (sm)"
                    active={btnSize === "sm"}
                    onClick={() => setBtnSize("sm")}
                  />
                  <ToolbarControl.Item
                    label="Medium (md)"
                    active={btnSize === "md"}
                    onClick={() => setBtnSize("md")}
                  />
                  <ToolbarControl.Item
                    label="Large (lg)"
                    active={btnSize === "lg"}
                    onClick={() => setBtnSize("lg")}
                  />
                </div>
              </ToolbarControl>

              {/* Icons Dropdown */}
              <ToolbarControl icon="insert_emoticon" label="Ikon Button">
                <ToolbarControl.Input
                  label="Ikon Kiri"
                  value={btnIconLeft}
                  placeholder="save, info, dll"
                  onChange={btnIconLeft => setBtnIconLeft(btnIconLeft)}
                />
                <hr className="my-1 border-slate-100" />
                <ToolbarControl.Input
                  label="Ikon Kanan"
                  value={btnIconRight}
                  placeholder="arrow_forward, dll"
                  onChange={btnIconRight => setBtnIconRight(btnIconRight)}
                />
              </ToolbarControl>

              {/* Loading Toggle */}
              <ToolbarButton
                icon="sync"
                label="Toggle Loading"
                active={btnLoading}
                onClick={() => setBtnLoading((prev) => !prev)}
              />

              {/* Disabled Toggle */}
              <ToolbarButton
                icon="block"
                label="Toggle Disabled"
                active={btnDisabled}
                onClick={() => setBtnDisabled((prev) => !prev)}
              />
            </>
          )}

          {component.name === "ActionCard" && (
            <>
              <div className="h-4 w-px bg-slate-200 mx-1" />
              <ToolbarControl icon="view_carousel" label="Contoh Action Card">
                <div className="flex flex-col gap-1 px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pilih Contoh</span>
                  <ToolbarControl.Item
                    label="Unduh Laporan"
                    icon="download"
                    active={actionCardExample === "report"}
                    onClick={() => setActionCardExample("report")}
                  />
                  <ToolbarControl.Item
                    label="Kelola Tim"
                    icon="groups"
                    active={actionCardExample === "team"}
                    onClick={() => setActionCardExample("team")}
                  />
                  <ToolbarControl.Item
                    label="Pengaturan Sistem"
                    icon="settings"
                    active={actionCardExample === "settings"}
                    onClick={() => setActionCardExample("settings")}
                  />
                </div>
              </ToolbarControl>
            </>
          )}

          {component.name === "FileUploadDropzone" && (
            <>
              <div className="h-4 w-px bg-slate-200 mx-1" />
              <ToolbarControl icon="upload_file" label="Pengaturan Upload">
                <ToolbarControl.Input label="Label" value={fileUploadLabel} onChange={setFileUploadLabel} />
                <hr className="my-1 border-slate-100" />
                <ToolbarControl.Input label="Deskripsi" value={fileUploadDescription} onChange={setFileUploadDescription} />
                <hr className="my-1 border-slate-100" />
                <ToolbarControl.Input label="Maksimal File" value={fileUploadMaxFiles} onChange={setFileUploadMaxFiles} />
              </ToolbarControl>
            </>
          )}

          {component.name === "DropdownMenu" && (
            <>
              <div className="h-4 w-px bg-slate-200 mx-1" />
              <ToolbarControl icon="tune" label="Tipe Dropdown Menu">
                <div className="flex flex-col gap-1 px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pilih Tipe</span>
                  <ToolbarControl.Item label="Basic" icon="list" active={dropdownVariant === "basic"} onClick={() => setDropdownVariant("basic")} />
                  <ToolbarControl.Item label="Searchable" icon="search" active={dropdownVariant === "search"} onClick={() => setDropdownVariant("search")} />
                  <ToolbarControl.Item label="Search + Reset" icon="restart_alt" active={dropdownVariant === "search-reset"} onClick={() => setDropdownVariant("search-reset")} />
                  <ToolbarControl.Item label="Multi-select" icon="checklist" active={dropdownVariant === "multi-select"} onClick={() => setDropdownVariant("multi-select")} />
                </div>
              </ToolbarControl>
              <ToolbarButton
                icon="arrow_drop_down"
                label="Toggle Dropdown Menu"
                active={dropdownOpen}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={() => setDropdownOpen((current) => !current)}
              />
            </>
          )}
        </div>
      </div>

      <div
        className={`relative ${component.name === "DropdownMenu" ? "min-h-[380px] overflow-visible" : "min-h-[320px] overflow-hidden"} rounded-b-2xl border p-6 shadow-sm transition-colors duration-200 ${darkBackground ? "border-slate-700 bg-slate-950" : "border-slate-200 bg-white"}`}
        style={showGrid ? {
          backgroundImage:
            darkBackground
              ? gridColor === "Purple"
                ? "linear-gradient(#6d46eb 1px, transparent 1px), linear-gradient(90deg, #6d46eb 1px, transparent 1px)"
                : "linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)"
              : gridColor === "Purple"
                ? "linear-gradient(#d9d0ff 1px, transparent 1px), linear-gradient(90deg, #d9d0ff 1px, transparent 1px)"
                : "linear-gradient(#e9edf0 1px, transparent 1px), linear-gradient(90deg, #e9edf0 1px, transparent 1px)",
          backgroundSize: `${gridDensity}px ${gridDensity}px`,
        } : undefined}
      >
        <div className="flex min-h-[268px] w-full items-center justify-center">
          <div className={`${viewportWidth} transition-[max-width] duration-300`}>
            <div className="relative flex min-h-[268px] w-full items-center justify-center p-6">
              {(PREVIEW_REGISTRY[`${category}/${component.name}`] || PREVIEW_REGISTRY[component.name]) ? (
                React.cloneElement((PREVIEW_REGISTRY[`${category}/${component.name}`] || PREVIEW_REGISTRY[component.name]) as React.ReactElement<PreviewProps>, {
                  variant: btnVariant,
                  size: btnSize,
                  iconLeft: btnIconLeft,
                  iconRight: btnIconRight,
                  loading: btnLoading,
                  disabled: btnDisabled,
                  example: actionCardExample,
                  isOpen: dropdownOpen,
                  onOpenChange: setDropdownOpen,
                  dropdownVariant,
                  label: fileUploadLabel,
                  description: fileUploadDescription,
                  maxFiles: Math.max(1, Number(fileUploadMaxFiles) || 1),
                })
              ) : (
                <DefaultPreviewPlaceholder componentName={component.name} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
