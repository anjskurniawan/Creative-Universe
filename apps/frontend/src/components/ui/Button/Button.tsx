import type { ButtonHTMLAttributes, ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "outline" | "filter";
  size?: "sm" | "md" | "lg";
  iconLeft?: string;
  iconRight?: string;
  children: ReactNode;
}

export function Button({
  loading = false,
  disabled,
  children,
  className = "",
  type = "button",
  variant = "primary",
  size = "lg",
  iconLeft,
  iconRight,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const sizeClasses = {
    sm: "h-9 px-3.5 text-xs rounded-lg gap-1.5",
    md: "h-11 px-5 text-sm rounded-xl gap-2",
    lg: "h-[56px] px-6 text-base rounded-xl gap-2.5",
  }[size];

  const variantClasses = isDisabled
    ? {
        primary: "bg-brand/60 text-white cursor-not-allowed",
        secondary: "bg-slate-200 text-slate-400 cursor-not-allowed",
        danger: "bg-rose-600/60 text-white cursor-not-allowed",
        outline: "border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed",
        filter: "min-w-0 justify-start border border-sky bg-white text-sm text-label cursor-not-allowed [&>span]:min-w-0 [&>span]:flex-1 [&>span]:truncate [&>span:last-child]:flex-none",
      }[variant]
    : {
        primary: "bg-brand hover:brightness-110 active:brightness-95 text-white shadow-md shadow-brand/10 hover:shadow-lg hover:shadow-brand/20 active:scale-[0.99] cursor-pointer",
        secondary: "bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 active:scale-[0.99] cursor-pointer",
        danger: "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-md shadow-rose-600/10 hover:shadow-lg active:scale-[0.99] cursor-pointer",
        outline: "border border-slate-300 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 active:scale-[0.99] cursor-pointer",
        filter: "min-w-0 justify-start border border-sky bg-white text-sm text-label hover:border-brand/40 active:bg-brand/5 cursor-pointer [&>span]:min-w-0 [&>span]:flex-1 [&>span]:truncate [&>span:last-child]:flex-none",
      }[variant];

  const spinnerColor = variant === "secondary" || variant === "outline" ? "text-slate-500" : "text-white";

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`font-sans font-semibold w-full flex items-center justify-center transition-all duration-200 ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className={`h-5 w-5 animate-spin ${spinnerColor}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <>
          {iconLeft && <MaterialIcon name={iconLeft} size="auto" className="text-[1.25em] leading-none" />}
          <span>{children}</span>
          {iconRight && <MaterialIcon name={iconRight} size="auto" className="text-[1.25em] leading-none" />}
        </>
      )}
    </button>
  );
}
