"use client";

import { useRef, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { TaskcardMobileButton } from "./taskcard-mobile-button";

type TaskcardMobileOverlayProps = {
  type: "file-link" | "submit-link" | "upload-file";
  initialLink?: string | null;
  uploadLabel?: string;
  onBack?: () => void;
  onConfirm?: (value: string | File | null, delayReason?: string) => void | Promise<void>;
  isSaving?: boolean;
  delayReasonStage?: string;
  className?: string;
};

export function TaskcardMobileOverlay({ type, initialLink, uploadLabel = "3D Gambar", onBack, onConfirm, isSaving = false, delayReasonStage, className }: TaskcardMobileOverlayProps) {
  const isViewLink = type === "file-link";
  const isSubmitLink = type === "submit-link";
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState(initialLink || "");
  const [delayReason, setDelayReason] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const confirm = async () => {
    if (isViewLink) {
      if (initialLink) await navigator.clipboard.writeText(initialLink);
      onBack?.();
      return;
    }

    void onConfirm?.(isSubmitLink ? link : file, delayReason.trim() || undefined);
  };

  return (
    <div className={["flex min-h-[407px] flex-col justify-between rounded-b-2xl bg-white p-4", isViewLink ? "bg-[#e8faea]" : "", className].filter(Boolean).join(" ")}>
      <p className={["text-center text-xs leading-4", isViewLink ? "text-[#2b9915]" : (isSubmitLink ? "text-[#8474f9]" : "text-[#525e61]")].join(" ")}>
        {isViewLink ? "Link File" : (isSubmitLink ? "Input Link File" : "UPLOAD")}
      </p>

      <div className="flex flex-col gap-4">
        <MaterialIcon name={isViewLink ? "add_link" : (isSubmitLink ? "attach_file" : "upload_file")} size="auto" weight={400} className={["mx-auto text-5xl", isViewLink ? "text-[#2b9915]" : "text-[#8474f9]"].join(" ")} />
        <p className={["text-center text-base font-semibold leading-5", isViewLink ? "text-[#2b9915]" : "text-[#222]"].join(" ")}>
          {isViewLink ? "Tautan file tersimpan" : (isSubmitLink ? "Masukkan tautan file akhir" : `Unggah ${uploadLabel} :`)}
        </p>
        {isViewLink ? (
          <div className="flex h-11 items-center rounded-xl border border-[#2b9915] bg-white px-4 text-xs leading-4 text-[#3b4446]">
            <span className="truncate">{initialLink || "Tautan file belum tersedia"}</span>
          </div>
        ) : isSubmitLink ? (
          <>
            <input
              type="url"
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="Link File Sharing"
              className="h-11 w-full rounded-xl border border-[#8474f9] bg-[#eeebff] px-4 text-xs leading-4 text-[#3b4446] outline-none placeholder:text-[#8474f9] focus:ring-2 focus:ring-[#8474f9]/25"
            />
            {delayReasonStage && (
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-[#525e61]">Alasan keterlambatan {delayReasonStage} <span className="text-[#ea4c89]">*</span></span>
                <textarea
                  value={delayReason}
                  onChange={(event) => setDelayReason(event.target.value)}
                  placeholder="Tulis alasan keterlambatan..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-[#8474f9] bg-[#eeebff] px-3 py-2 text-xs leading-4 text-[#3b4446] outline-none placeholder:text-[#aeb6b8] focus:ring-2 focus:ring-[#8474f9]/25"
                />
              </label>
            )}
          </>
        ) : (
          <>
            <input
              ref={inputRef}
              type="file"
              className="sr-only"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex h-11 w-full items-center rounded-xl bg-[#eeebff] px-4 text-left text-xs font-semibold leading-4 text-[#8474f9]"
            >
              {file?.name || "Choose File"}
            </button>
          </>
        )}
        <p className={["text-center text-xs leading-4", isViewLink ? "text-[#2b9915]" : "text-[#999]"].join(" ")}>
          {isViewLink ? "Tautan ini telah dilampirkan pada hasil akhir tugas." : (isSubmitLink ? "Tautan akan menyelesaikan task ini." : (file ? "Berkas siap diunggah." : "Tidak ada file yang terpilih."))}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <TaskcardMobileButton color={isViewLink ? "green-light" : "neutral"} style="light" onClick={onBack}>
          {isViewLink ? "Kembali" : "Batal"}
        </TaskcardMobileButton>
        <TaskcardMobileButton color={isViewLink ? "green" : "purple"} style="filled" onClick={confirm} disabled={isSaving || (!isViewLink && !isSubmitLink && !file) || (isSubmitLink && (!link.trim() || (Boolean(delayReasonStage) && !delayReason.trim())))}>
          {isSaving ? "Menyimpan..." : (isViewLink ? "Copy Link" : (isSubmitLink ? "Kirim" : "Unggah"))}
        </TaskcardMobileButton>
      </div>
    </div>
  );
}
