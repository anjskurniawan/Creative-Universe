import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  loading = false,
  disabled,
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`text-white font-sans font-semibold text-lg rounded-xl w-full h-[56px] flex items-center justify-center shadow-md shadow-brand/10 hover:shadow-lg hover:shadow-brand/20 active:scale-[0.99] transition-all duration-200 ${
        isDisabled
          ? "bg-brand/60 cursor-not-allowed"
          : "bg-brand hover:brightness-110 active:brightness-95 cursor-pointer"
      } ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        children
      )}
    </button>
  );
}
