import { useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { TaskcardMobileButton } from "./taskcard-mobile-button";
import type { TaskcardMobileTheme } from "./types";

type TaskcardMobileConfirmOverlayProps = {
  action: "delete" | "change-status";
  onCancel?: () => void;
  onConfirm?: (delayReason?: string) => void;
  isSaving?: boolean;
  delayReasonStage?: string;
  theme?: TaskcardMobileTheme;
};

export function TaskcardMobileConfirmOverlay({ action, onCancel, onConfirm, isSaving = false, delayReasonStage, theme = "light" }: TaskcardMobileConfirmOverlayProps) {
  const isDelete = action === "delete";
  const [delayReason, setDelayReason] = useState("");
  const requiresDelayReason = !isDelete && Boolean(delayReasonStage);
  const surface = theme === "dark" ? "bg-[#171717] text-[#f1f1f1]" : theme === "retro" ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b]" : "bg-white text-[#222]";
  const muted = theme === "dark" ? "text-[#a7ada8]" : theme === "retro" ? "text-[#687065]" : "text-[#6d7880]";
  const primary = theme === "dark" ? "#b0ff5e" : theme === "retro" ? "#ba0dcb" : "#00a4ff";

  return (
    <div className={`flex min-h-[407px] flex-col justify-between rounded-b-2xl p-4 ${surface}`}>
      <p className={`text-center text-xs font-semibold leading-4 ${muted}`}>{isDelete ? "Hapus Tugas" : "Ganti Status"}</p>
      <div className="flex flex-col gap-4 text-center">
        <MaterialIcon name={isDelete ? "delete" : "directory_sync"} size="auto" weight={400} className={isDelete ? "mx-auto text-5xl text-[#ff5e5e]" : "mx-auto text-5xl"} style={isDelete ? undefined : { color: primary }} />
        <p className="text-base font-semibold leading-5">
          {isDelete ? "Hapus tugas ini?" : "Lanjut ke status berikutnya?"}
        </p>
        <p className={`text-xs leading-4 ${muted}`}>
          {isDelete
            ? "Tindakan ini tidak dapat dibatalkan."
            : requiresDelayReason
            ? `Tahap ${delayReasonStage} terlambat. Jelaskan alasannya untuk melanjutkan status.`
            : "Perubahan status akan diberitahukan kepada seluruh penerima tugas."}
        </p>
        {requiresDelayReason && (
          <label className="flex flex-col gap-1.5 text-left">
            <span className={`text-xs font-medium ${muted}`}>Alasan keterlambatan <span className="text-[#ff5e5e]">*</span></span>
            <textarea
              value={delayReason}
              onChange={(event) => setDelayReason(event.target.value)}
              placeholder="Tulis alasan keterlambatan..."
              rows={3}
              className={`w-full resize-none rounded-xl border px-3 py-2 text-xs leading-4 outline-none ${theme === "dark" ? "border-white/10 bg-[#101211] text-[#f1f1f1] placeholder:text-[#7b847d]" : theme === "retro" ? "border-2 border-[#24252b] bg-[#dfe2d3] text-[#24252b] placeholder:text-[#687065]" : "border-[#bdeaff] bg-[#f3faff] text-[#26333a] placeholder:text-[#7591a2]"}`}
              style={{ borderColor: primary }}
            />
          </label>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <TaskcardMobileButton theme={theme} color="neutral" style="light" onClick={onCancel}>Batal</TaskcardMobileButton>
        <TaskcardMobileButton theme={theme} color={isDelete ? "red" : "pink"} style="filled" onClick={() => onConfirm?.(delayReason.trim() || undefined)} disabled={isSaving || (requiresDelayReason && !delayReason.trim())}>
          {isSaving ? "Menyimpan..." : (isDelete ? "Ya, Hapus" : "Ganti Status")}
        </TaskcardMobileButton>
      </div>
    </div>
  );
}
