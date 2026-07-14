import { useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { TaskcardMobileButton } from "./taskcard-mobile-button";

type TaskcardMobileConfirmOverlayProps = {
  action: "delete" | "change-status";
  onCancel?: () => void;
  onConfirm?: (delayReason?: string) => void;
  isSaving?: boolean;
  delayReasonStage?: string;
};

export function TaskcardMobileConfirmOverlay({ action, onCancel, onConfirm, isSaving = false, delayReasonStage }: TaskcardMobileConfirmOverlayProps) {
  const isDelete = action === "delete";
  const [delayReason, setDelayReason] = useState("");
  const requiresDelayReason = !isDelete && Boolean(delayReasonStage);

  return (
    <div className="flex min-h-[407px] flex-col justify-between rounded-b-2xl bg-white p-4">
      <p className="text-center text-xs leading-4 text-[#525e61]">{isDelete ? "Hapus Tugas" : "Ganti Status"}</p>
      <div className="flex flex-col gap-4 text-center">
        <MaterialIcon name={isDelete ? "delete" : "directory_sync"} size="auto" weight={400} className={isDelete ? "mx-auto text-5xl text-[#b71c1c]" : "mx-auto text-5xl text-[#ea4c89]"} />
        <p className="text-base font-semibold leading-5 text-[#222]">
          {isDelete ? "Hapus tugas ini?" : "Lanjut ke status berikutnya?"}
        </p>
        <p className="text-xs leading-4 text-[#7b868a]">
          {isDelete
            ? "Tindakan ini tidak dapat dibatalkan."
            : requiresDelayReason
            ? `Tahap ${delayReasonStage} terlambat. Jelaskan alasannya untuk melanjutkan status.`
            : "Perubahan status akan diberitahukan kepada seluruh penerima tugas."}
        </p>
        {requiresDelayReason && (
          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-xs font-medium text-[#525e61]">Alasan keterlambatan <span className="text-[#ea4c89]">*</span></span>
            <textarea
              value={delayReason}
              onChange={(event) => setDelayReason(event.target.value)}
              placeholder="Tulis alasan keterlambatan..."
              rows={3}
              className="w-full resize-none rounded-xl border border-[#ea4c89] bg-[#fff7fa] px-3 py-2 text-xs leading-4 text-[#3b4446] outline-none placeholder:text-[#aeb6b8] focus:ring-2 focus:ring-[#ea4c89]/20"
            />
          </label>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <TaskcardMobileButton color="neutral" style="light" onClick={onCancel}>Batal</TaskcardMobileButton>
        <TaskcardMobileButton color={isDelete ? "red" : "pink"} style="filled" onClick={() => onConfirm?.(delayReason.trim() || undefined)} disabled={isSaving || (requiresDelayReason && !delayReason.trim())}>
          {isSaving ? "Menyimpan..." : (isDelete ? "Ya, Hapus" : "Ganti Status")}
        </TaskcardMobileButton>
      </div>
    </div>
  );
}
