"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export type ToolbarControlProps = {
  icon: string;
  label?: string;
  active?: boolean;
  children: ReactNode;
};

export function ToolbarControl({ icon, label = "Toolbar control", active, children }: ToolbarControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={label}
        title={label}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex size-8 cursor-pointer items-center justify-center rounded-md border text-slate-500 transition active:bg-slate-100 ${
          isOpen || active
            ? "border-transparent bg-brand/10 shadow-inner hover:bg-brand/10 text-brand"
            : "border-transparent hover:bg-slate-200"
        }`}
      >
        <MaterialIcon name={icon} size="auto" weight={300} className="text-[12px]" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 z-50 min-w-[220px] rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_12px_28px_rgba(55,35,130,0.12)] flex flex-col gap-2">
          {children}
        </div>
      )}
    </div>
  );
}

// 1. Menu Item / Select Option
type ItemProps = {
  label: string;
  icon?: string;
  active?: boolean;
  onClick?: () => void;
};
ToolbarControl.Item = function ToolbarControlItem({ label, icon, active, onClick }: ItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold transition-colors duration-150 ${
        active
          ? "bg-brand/10 text-brand"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
      }`}
    >
      <span className="flex items-center gap-2">
        {icon && <MaterialIcon name={icon} size="auto" className="text-sm" />}
        {label}
      </span>
      {active && <MaterialIcon name="check" size="auto" className="text-sm text-brand" />}
    </button>
  );
};

// 2. Inline Text Input
type InputProps = {
  label?: string;
  value: string;
  placeholder?: string;
  onChange: (val: string) => void;
};
ToolbarControl.Input = function ToolbarControlInput({ label, value, placeholder, onChange }: InputProps) {
  return (
    <div className="flex flex-col gap-1 px-1 py-0.5">
      {label && <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-700 outline-none transition duration-150 placeholder:text-slate-400 focus:border-brand/40 focus:bg-white focus:ring-1 focus:ring-brand/40"
      />
    </div>
  );
};

// 3. Checkbox Control
type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
};
ToolbarControl.Checkbox = function ToolbarControlCheckbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 hover:bg-slate-50 transition-colors duration-150">
      <span className="text-xs font-semibold text-slate-600 select-none">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-3.5 rounded border-slate-300 text-brand focus:ring-brand"
      />
    </label>
  );
};

// 4. Toggle Switch Control
type ToggleProps = {
  label: string;
  active: boolean;
  onChange: (val: boolean) => void;
};
ToolbarControl.Toggle = function ToolbarControlToggle({ label, active, onChange }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 hover:bg-slate-50 transition-colors duration-150">
      <span className="text-xs font-semibold text-slate-600 select-none">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={active}
        onClick={() => onChange(!active)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
          active ? "bg-brand" : "bg-slate-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            active ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
};
