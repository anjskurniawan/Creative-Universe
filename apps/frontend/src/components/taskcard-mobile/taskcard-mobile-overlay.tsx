"use client";

import { useRef, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { TaskcardMobileButton } from "./taskcard-mobile-button";
import type { TaskcardMobileTheme } from "./types";

type TaskcardMobileOverlayProps = {
  type: "file-link" | "submit-link" | "upload-file";
  initialLink?: string | null;
  uploadLabel?: string;
  onBack?: () => void;
  onConfirm?: (value: string | File | null, delayReason?: string) => void | Promise<void>;
  isSaving?: boolean;
  delayReasonStage?: string;
  theme?: TaskcardMobileTheme;
  className?: string;
};

export function TaskcardMobileOverlay({ type, initialLink, uploadLabel = "3D Gambar", onBack, onConfirm, isSaving = false, delayReasonStage, theme = "light", className }: TaskcardMobileOverlayProps) {
  const isViewLink = type === "file-link";
  const isSubmitLink = type === "submit-link";
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState(initialLink || "");
  const [delayReason, setDelayReason] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const primary = theme === "dark" ? "#b0ff5e" : theme === "retro" ? "#ba0dcb" : "#00a4ff";
  const surface = theme === "dark" ? "bg-[#171717] text-[#f1f1f1]" : theme === "retro" ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b]" : "bg-white text-[#222]";
  const muted = theme === "dark" ? "text-[#a7ada8]" : theme === "retro" ? "text-[#687065]" : "text-[#69777f]";
  const inputSurface = theme === "dark" ? "border-white/10 bg-[#101211] text-[#f1f1f1] placeholder:text-[#7b847d]" : theme === "retro" ? "border-2 border-[#24252b] bg-[#dfe2d3] text-[#24252b] placeholder:text-[#687065]" : "border-[#bdeaff] bg-[#f3faff] text-[#26333a] placeholder:text-[#7591a2]";

  const confirm = async () => {
    if (isViewLink) {
      if (initialLink) await navigator.clipboard.writeText(initialLink);
      onBack?.();
      return;
    }

    void onConfirm?.(isSubmitLink ? link : file, delayReason.trim() || undefined);
  };

  return (
    <div className={["flex min-h-[407px] flex-col justify-between rounded-b-2xl p-4", surface, className].filter(Boolean).join(" ")}>
      <p className={`text-center text-xs font-semibold leading-4 ${isViewLink ? "text-[#2b9915]" : muted}`}>
        {isViewLink ? "Link File" : (isSubmitLink ? "Input Link File" : "UPLOAD")}
      </p>

      <div className="flex flex-col gap-4">
        <MaterialIcon name={isViewLink ? "add_link" : (isSubmitLink ? "attach_file" : "upload_file")} size="auto" weight={400} className={["mx-auto text-5xl", isViewLink ? "text-[#2b9915]" : ""].join(" ")} style={isViewLink ? undefined : { color: primary }} />
        <p className={["text-center text-base font-semibold leading-5", isViewLink ? "text-[#2b9915]" : ""].join(" ")} style={isViewLink ? undefined : { color: theme === "dark" ? "#f1f1f1" : undefined}}>
          {isViewLink ? "Tautan file tersimpan" : (isSubmitLink ? "Masukkan tautan file akhir" : `Unggah ${uploadLabel} :`)}
        </p>
        {isViewLink ? (
          <div className={`flex h-11 items-center rounded-xl border border-[#2b9915] px-4 text-xs leading-4 ${inputSurface}`}>
            <span className="truncate">{initialLink || "Tautan file belum tersedia"}</span>
          </div>
        ) : isSubmitLink ? (
          <>
            <input
              type="url"
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="Link File Sharing"
              className={`h-11 w-full rounded-xl border px-4 text-xs leading-4 outline-none focus:ring-2 ${inputSurface}`}
              style={{ borderColor: primary }}
            />
            {delayReasonStage && (
              <label className="flex flex-col gap-1.5">
                <span className={`text-xs font-medium ${muted}`}>Alasan keterlambatan {delayReasonStage} <span className="text-[#ff5e5e]">*</span></span>
                <textarea
                  value={delayReason}
                  onChange={(event) => setDelayReason(event.target.value)}
                  placeholder="Tulis alasan keterlambatan..."
                  rows={3}
                  className={`w-full resize-none rounded-xl border px-3 py-2 text-xs leading-4 outline-none focus:ring-2 ${inputSurface}`}
                  style={{ borderColor: primary }}
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
              className={`flex h-11 w-full items-center rounded-xl px-4 text-left text-xs font-semibold leading-4 ${theme === "dark" ? "bg-[#b0ff5e]/10 text-[#b0ff5e]" : theme === "retro" ? "bg-[#f2b8f6]/45 text-[#9c0bac]" : "bg-[#eaf8ff] text-[#0077bf]"}`}
            >
              {file?.name || "Choose File"}
            </button>
          </>
        )}
        <p className={["text-center text-xs leading-4", isViewLink ? "text-[#2b9915]" : muted].join(" ")}>
          {isViewLink ? "Tautan ini telah dilampirkan pada hasil akhir tugas." : (isSubmitLink ? "Tautan akan menyelesaikan task ini." : (file ? "Berkas siap diunggah." : "Tidak ada file yang terpilih."))}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <TaskcardMobileButton theme={theme} color={isViewLink ? "green-light" : "neutral"} style="light" onClick={onBack}>
          {isViewLink ? "Kembali" : "Batal"}
        </TaskcardMobileButton>
        <TaskcardMobileButton theme={theme} color={isViewLink ? "green" : "purple"} style="filled" onClick={confirm} disabled={isSaving || (!isViewLink && !isSubmitLink && !file) || (isSubmitLink && (!link.trim() || (Boolean(delayReasonStage) && !delayReason.trim())))}>
          {isSaving ? "Menyimpan..." : (isViewLink ? "Copy Link" : (isSubmitLink ? "Kirim" : "Unggah"))}
        </TaskcardMobileButton>
      </div>
    </div>
  );
}
