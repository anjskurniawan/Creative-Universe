export type AppIconProps = {
  theme?: "light" | "dark" | "retro";
};

export default function AppIcon({ theme = "light" }: AppIconProps) {
  const dark = theme === "dark";
  return (
    <div
      className={`relative flex size-8 shrink-0 items-center justify-center rounded-lg p-1 transition-colors ${
        dark ? "bg-orange-500" : "bg-[#00a4ff]"
      }`}
    >
      <div className="relative h-5 w-[18px]">
        <img
          src="/images/icon-app/Logo_White.png"
          alt="Creative Universe"
          className="absolute inset-0 size-full object-contain"
          style={{ filter: dark ? "brightness(0)" : "none" }}
        />
      </div>
    </div>
  );
}
