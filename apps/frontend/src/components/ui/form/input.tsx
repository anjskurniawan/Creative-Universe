import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { DropdownMenu } from "@/components/ui/form/dropdown-menu";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  type?: InputHTMLAttributes<HTMLInputElement>["type"] | "dropdown" | "phone" | "email" | "datepick" | "checkbox";
  label?: string;
  description?: string;
  error?: string;
  rightElement?: ReactNode;
  active?: boolean;
}

const EMAIL_DOMAINS = ["@gmail.com", "@outlook.com", "@yahoo.com", "@icloud.com"];
const EMAIL_DOMAIN_ITEMS = EMAIL_DOMAINS.map((domain) => ({ value: domain, label: domain }));

export function Input({
  label,
  description,
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
  const emailValue = typeof props.value === "string" ? props.value : "";
  const [emailDomain, setEmailDomain] = useState(
    EMAIL_DOMAINS.find((domain) => emailValue.endsWith(domain)) || EMAIL_DOMAINS[0],
  );
  const [isEmailDomainOpen, setIsEmailDomainOpen] = useState(false);

  const activeEmailDomain =
    EMAIL_DOMAINS.find((domain) => emailValue.endsWith(domain)) || emailDomain;

  const handleEmailDomainChange = (domain: string) => {
    setEmailDomain(domain);
    const username = emailValue.split("@")[0];
    props.onChange?.({
      target: { value: `${username}${domain}` },
      currentTarget: { value: `${username}${domain}` },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="flex flex-col gap-2 items-start w-full group">
      {label && id && type !== "checkbox" && (
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
        {type === "checkbox" ? (
          description ? (
            <label className={`flex cursor-pointer items-center justify-between w-full ${className}`}>
              <span>
                <span className="block font-semibold font-sans text-sm text-[#3b4446]">{label}</span>
                <span className="mt-0.5 block text-xs text-slate-500 font-sans">{description}</span>
              </span>
              <input
                {...props}
                id={id}
                type="checkbox"
                className="size-4 rounded border-slate-300 text-[#6d46eb] focus:ring-[#6d46eb]"
              />
            </label>
          ) : (
            <label className={`flex items-center gap-2 cursor-pointer select-none ${className}`}>
              <input
                {...props}
                id={id}
                type="checkbox"
                className="size-4 rounded border-slate-300 text-[#6d46eb] focus:ring-[#6d46eb]"
              />
              {label && <span className="font-sans text-sm text-slate-700">{label}</span>}
            </label>
          )
        ) : type === "datepick" ? (
          <CustomDatePicker
            compact
            value={typeof props.value === "string" ? props.value : ""}
            onChange={(val) => {
              props.onChange?.({
                target: { value: val },
                currentTarget: { value: val },
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            placeholder={props.placeholder}
            className={className}
          />
        ) : type === "dropdown" ? (
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
        ) : type === "email" ? (
          <div
            className={`relative flex h-12 w-full items-center rounded-xl border bg-white transition-all duration-200 hover:border-slate-300 focus-within:outline-none ${
              hasError
                ? "border-rose-500 focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/10"
                : "border-sky focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10"
            }`}
          >
            <input
              id={id}
              type="text"
              value={emailValue.split("@")[0]}
              disabled={disabled}
              onChange={(event) => {
                const username = event.target.value.replace(/@/g, "");
                props.onChange?.({
                  ...event,
                  target: { ...event.target, value: `${username}${activeEmailDomain}` },
                  currentTarget: { ...event.currentTarget, value: `${username}${activeEmailDomain}` },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              placeholder={props.placeholder || "nama"}
              className={`h-full min-w-0 flex-1 border-0 bg-transparent px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-0 focus:outline-none focus:ring-0 ${className}`}
            />
            <button
              type="button"
              aria-label="Pilih domain email"
              disabled={disabled}
              onClick={() => setIsEmailDomainOpen((open) => !open)}
              className="flex h-full items-center gap-1 border-l border-slate-200 px-3 text-sm text-slate-600 outline-none transition-colors hover:text-brand disabled:cursor-not-allowed disabled:opacity-70"
            >
              {activeEmailDomain}
              <MaterialIcon name="expand_more" size="sm" />
            </button>
            <DropdownMenu
              isOpen={isEmailDomainOpen}
              items={EMAIL_DOMAIN_ITEMS}
              searchable={false}
              onSelect={(domain) => {
                handleEmailDomainChange(domain);
                setIsEmailDomainOpen(false);
              }}
              onClose={() => setIsEmailDomainOpen(false)}
              className="left-auto right-0 w-44"
              style={{ top: "calc(100% + 4px)" }}
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
