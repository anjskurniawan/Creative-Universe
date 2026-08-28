import type { InputHTMLAttributes } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

export interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

export function SearchBar({ value, onChange, onClear, className = "", placeholder = "Cari...", ...props }: SearchBarProps) {
  return (
    <label className={`flex h-11 min-w-0 items-center gap-2 rounded-xl border border-sky bg-white px-5 transition-colors duration-200 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10 ${className}`}>
      <MaterialIcon name="search" size="sm" className="shrink-0 text-slate-400" />
      <input
        {...props}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-label outline-none placeholder:text-slate-400"
      />
      {value && onClear && (
        <button type="button" aria-label="Hapus pencarian" onClick={onClear} className="shrink-0 text-slate-400 transition-colors hover:text-brand">
          <MaterialIcon name="close" size="xs" />
        </button>
      )}
    </label>
  );
}
