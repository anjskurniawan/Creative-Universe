import { MaterialIcon } from "@/components/material-icon";
import { TaskcardMobileButton } from "./taskcard-mobile-button";
import type { TaskcardMobileTheme } from "./types";

type TaskcardMobileFileSlotsOverlayProps = {
  title: string;
  files?: (string | null)[];
  onBack?: () => void;
  canUpload?: boolean;
  onUploadSlot?: (index: number) => void;
  onViewFile?: (file: string) => void;
  theme?: TaskcardMobileTheme;
};

export function TaskcardMobileFileSlotsOverlay({
  title,
  files = [null, null, null],
  onBack,
  canUpload = true,
  onUploadSlot,
  onViewFile,
  theme = "light",
}: TaskcardMobileFileSlotsOverlayProps) {
  const slots = Array.from({ length: 3 }, (_, index) => files[index] || null);

  return (
    <div className={`flex min-h-[407px] flex-col justify-between rounded-b-2xl p-4 ${theme === "dark" ? "bg-[#171717] text-[#f1f1f1]" : theme === "retro" ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b]" : "bg-white text-[#222]"}`}>
      <p className={`text-center text-xs font-semibold leading-4 ${theme === "dark" ? "text-[#a7ada8]" : theme === "retro" ? "text-[#687065]" : "text-[#6d7880]"}`}>{title}</p>
      <div className="flex flex-col gap-3">
        <MaterialIcon name="folder_open" size="auto" weight={400} className="mx-auto text-5xl" style={{ color: theme === "dark" ? "#b0ff5e" : theme === "retro" ? "#ba0dcb" : "#00a4ff" }} />
        <p className={`text-center text-base font-semibold leading-5 ${theme === "dark" ? "text-[#f1f1f1]" : theme === "retro" ? "text-[#24252b]" : "text-[#222]"}`}>Pilih slot file</p>
        <div className="flex flex-col gap-2">
          {slots.map((file, index) => (
            <button
              key={index}
              type="button"
              onClick={() => file ? onViewFile?.(file) : (canUpload ? onUploadSlot?.(index) : undefined)}
              disabled={!file && !canUpload}
              className={[
                "flex h-11 items-center justify-between rounded-xl px-4 text-left text-sm leading-5",
                file ? (theme === "dark" ? "bg-[#b0ff5e]/10 text-[#b0ff5e]" : theme === "retro" ? "bg-[#f2b8f6]/45 text-[#9c0bac]" : "bg-[#eaf8ff] text-[#0077bf]") : (theme === "dark" ? "bg-white/5 text-[#8a918b]" : theme === "retro" ? "bg-[#c9ccc0] text-[#687065]" : "bg-[#f3f4f6] text-[#6b7280]"),
              ].join(" ")}
            >
              <span>{file ? `File ${index + 1}` : (canUpload ? `Upload File ${index + 1}` : `File ${index + 1} kosong`)}</span>
              <MaterialIcon name={file ? "visibility" : "upload"} size="auto" weight={400} className="text-xl leading-none" />
            </button>
          ))}
        </div>
      </div>
      <TaskcardMobileButton theme={theme} color="neutral" style="light" onClick={onBack}>Kembali</TaskcardMobileButton>
    </div>
  );
}
