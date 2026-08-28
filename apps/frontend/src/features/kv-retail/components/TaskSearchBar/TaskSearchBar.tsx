import { useEffect, useRef, useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

type TaskSearchTheme = "light" | "dark" | "retro";

export function TaskSearchBar({
  value,
  onChange,
  theme = "light",
  compact = false,
  placeholder = "Cari tugas, proyek, atau lokasi ...",
}: {
  value: string;
  onChange: (value: string) => void;
  theme?: TaskSearchTheme;
  compact?: boolean;
  placeholder?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(compact);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isExpanded) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isExpanded]);
  const themeClasses = theme === "dark"
    ? "border border-white/10 bg-[#171717] text-[#f1f1f1] placeholder:text-[#7d827f] focus:border-[#b0ff5e] focus:ring-[#b0ff5e]/20"
    : theme === "retro"
      ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b] placeholder:text-[#687065] focus:border-[#ba0dcb] focus:ring-[#ba0dcb]/20"
    : "border border-[#cbd5e1] bg-white text-[#222] placeholder:text-[#aeb6b8] focus:border-[#8474f9] focus:ring-[#8474f9]/15";

  if (!isExpanded) {
    return (
      <div ref={containerRef} className="cu-style shrink-0">
        <button
          type="button"
          aria-label="Buka pencarian tugas"
          onClick={() => setIsExpanded(true)}
          className={`flex h-[58px] w-[58px] items-center justify-center rounded-xl outline-none transition-colors focus-visible:ring-2 ${themeClasses}`}
        >
          <MaterialIcon name="search" size="auto" weight={300} filled={false} className={`${theme === "dark" ? "text-[#b0ff5e]" : theme === "retro" ? "text-[#24252b]" : "text-[#525e61]"} text-[24px] leading-none`} />
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`cu-style min-w-0 ${compact ? "flex-1" : "w-full"}`}>
      <label className="relative block w-full">
        <span className="sr-only">Cari tugas, proyek, atau lokasi</span>
        <MaterialIcon
          name="search"
          size="auto"
          weight={compact ? 400 : 300}
          filled={false}
          className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${compact ? "text-xl" : "text-[24px] leading-none"} ${theme === "dark" ? "text-[#b0ff5e]" : theme === "retro" ? "text-[#24252b]" : "text-[#525e61]"}`}
        />
        <input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={() => { if (!value) setIsExpanded(false); }}
          className={`${compact ? "h-12 rounded-xl py-3 pl-11 pr-3 text-sm" : "h-[58px] rounded-xl py-3 pl-[50px] pr-4 text-base tracking-[0.32px]"} w-full outline-none focus:ring-2 ${themeClasses}`}
        />
      </label>
    </div>
  );
}
