type TaskPageTitleProps = {
  children: string;
  theme: "light" | "dark" | "retro";
  mobile?: boolean;
  className?: string;
};

export function TaskPageTitle({ children, theme, mobile = false, className = "" }: TaskPageTitleProps) {
  return (
    <h1 className={`cu-style ${mobile ? "shrink-0 text-4xl tracking-[-0.05em]" : "text-4xl tracking-[-0.72px]"} font-medium leading-none ${theme === "dark" ? "text-[#f1f1f1]" : theme === "retro" ? "text-[#24252b]" : "text-[#181818]"} ${className}`}>
      {children}
    </h1>
  );
}
