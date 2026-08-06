import type { InputHTMLAttributes, ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  type?: InputHTMLAttributes<HTMLInputElement>["type"] | "dropdown" | "phone";
  label?: string;
  error?: string;
  rightElement?: ReactNode;
  active?: boolean;
}

export function Input({
  label,
  error,
  id,
  className = "",
  disabled,
  rightElement,
  type = "text",
  onClick,
  active = false,
  ...props
}: InputProps) {
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-2 items-start w-full group">
      {label && id && (
        <label
          htmlFor={id}
          className={`font-sans font-semibold text-xs uppercase tracking-wider transition-colors duration-200 ${
            hasError
              ? "text-rose-500"
              : active
              ? "text-brand"
              : "text-label group-focus-within:text-brand"
          }`}
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        {type === "dropdown" ? (
          <div
            id={id}
            tabIndex={disabled ? undefined : 0}
            onClick={disabled ? undefined : onClick}
            className={`border flex h-12 items-center pl-4 pr-12 rounded-xl w-full text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none transition-all duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${
              hasError
                ? "border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                : active
                ? "border-brand ring-2 ring-brand/10"
                : "border-sky hover:border-slate-300 focus:border-brand focus:ring-2 focus:ring-brand/10"
            } ${className}`}
          >
            {props.value ? (
              <span className="text-slate-800 font-sans text-sm">{props.value}</span>
            ) : (
              <span className="text-slate-400 font-sans text-sm">{props.placeholder}</span>
            )}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 transition-colors duration-200">
              {rightElement || <MaterialIcon name="expand_more" className="text-xl" />}
            </div>
          </div>
        ) : type === "phone" ? (
          <div className="relative w-full">
            <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 font-sans text-sm font-medium text-slate-800">
              +62
            </span>
            <input
              {...props}
              id={id}
              type="tel"
              disabled={disabled}
              onClick={onClick}
              className={`border flex h-12 items-center pl-12 pr-4 rounded-xl w-full text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed ${
                hasError
                  ? "border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                  : "border-sky hover:border-slate-300 focus:border-brand focus:ring-2 focus:ring-brand/10"
              } ${className}`}
            />
          </div>
        ) : ( // Default input
          <input
            id={id}
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`border flex h-12 items-center pl-4 ${
              rightElement ? "pr-12" : "pr-4"
            } rounded-xl w-full text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed ${
              hasError
                ? "border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                : "border-sky hover:border-slate-300 focus:border-brand focus:ring-2 focus:ring-brand/10"
            } ${className}`}
            {...props}
          />
        )}
        {type !== "dropdown" && rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 group-focus-within:text-brand transition-colors duration-200">
            {rightElement}
          </div>
        )}
      </div>
      {hasError && <p className="text-xs text-rose-500 font-medium mt-1">{error}</p>}
    </div>
  );
}
