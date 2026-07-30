"use client";

import { useState } from "react";
import { TaskcardMobileHeader } from "./taskcard-mobile-header";
import { TaskcardMobileLayoutCard } from "./taskcard-mobile-layout-card";
import { TaskcardMobileConfirmOverlay } from "./taskcard-mobile-confirm-overlay";
import { TaskcardMobileFileSlotsOverlay } from "./taskcard-mobile-file-slots-overlay";
import { TaskcardMobileOverlay } from "./taskcard-mobile-overlay";
import type { TaskcardMobileAvatar, TaskcardMobileChange, TaskcardMobileTheme, TaskcardMobileTone } from "./types";

type TaskcardMobileFullCardProps = {
  title: string;
  dateRange?: string;
  vendor: string;
  assignedTo?: string;
  assignedAvatars?: TaskcardMobileAvatar[];
  status: string;
  tone?: TaskcardMobileTone;
  theme?: TaskcardMobileTheme;
  changes?: TaskcardMobileChange[];
  countdownLabel: string;
  fileLabels?: string[];
  fileSlotFiles?: Array<(string | null)[]>;
  uploadedFileStates?: boolean[];
  fileLink?: string | null;
  delayReasonStage?: string;
  defaultOpen?: boolean;
  onChangeStatus?: (delayReason?: string) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  onUpload?: (file: File, groupIndex: number, fileIndex: number) => void | Promise<void>;
  onViewFile?: (file: string) => void;
  onSubmitLink?: (link: string, delayReason?: string) => void | Promise<void>;
  className?: string;
};

export function TaskcardMobileFullCard({
  title,
  dateRange,
  vendor,
  assignedTo,
  assignedAvatars,
  status,
  tone = "default",
  theme = "light",
  changes,
  countdownLabel,
  fileLabels,
  fileSlotFiles,
  uploadedFileStates,
  fileLink,
  delayReasonStage,
  defaultOpen = false,
  onChangeStatus,
  onDelete,
  onUpload,
  onViewFile,
  onSubmitLink,
  className,
}: TaskcardMobileFullCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [overlay, setOverlay] = useState<"file-link" | "submit-link" | "file-slots" | "upload-file" | "delete" | "change-status" | null>(null);
  const [fileGroupIndex, setFileGroupIndex] = useState(0);
  const [uploadIndex, setUploadIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const runAction = async (action?: () => void | Promise<void>) => {
    if (!action) return;
    setIsSaving(true);
    try {
      await action();
      setOverlay(null);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <article className={["w-full shrink-0 overflow-hidden rounded-xl shadow-[0_2px_10px_rgba(59,68,70,0.10)]", className].filter(Boolean).join(" ")}>
      <TaskcardMobileHeader
        title={title}
        dateRange={dateRange}
          tone={tone}
          theme={theme}
        open={open}
        onToggle={() => setOpen((current) => !current)}
      />
      {open && overlay === null && (
        <TaskcardMobileLayoutCard
          vendor={vendor}
          assignedTo={assignedTo}
          assignedAvatars={assignedAvatars}
          status={status}
          theme={theme}
          changes={changes}
          countdownLabel={countdownLabel}
          fileLabels={fileLabels}
          uploadedFileStates={uploadedFileStates}
          showCountdown={status !== "Done"}
          canChangeStatus={status !== "Done"}
          canDelete={status !== "Done"}
          actionLabel={status === "Kirim Email" ? "Input Link File" : "Ganti Status"}
          hasFileLink={status === "Done" && Boolean(fileLink)}
          onFileAction={(index) => {
            setFileGroupIndex(index);
            setOverlay("file-slots");
          }}
          onFileLink={() => setOverlay("file-link")}
          onChangeStatus={() => setOverlay(status === "Kirim Email" ? "submit-link" : "change-status")}
          onDelete={() => setOverlay("delete")}
        />
      )}
      {open && overlay === "upload-file" && (
        <TaskcardMobileOverlay
          type="upload-file"
          uploadLabel={fileLabels?.[fileGroupIndex]}
          theme={theme}
          isSaving={isSaving}
          onBack={() => setOverlay(null)}
          onConfirm={(value) => runAction(() => value instanceof File ? onUpload?.(value, fileGroupIndex, uploadIndex) : undefined)}
        />
      )}
      {open && overlay === "file-slots" && (
        <TaskcardMobileFileSlotsOverlay
          title={fileLabels?.[fileGroupIndex] || "File"}
          files={fileSlotFiles?.[fileGroupIndex]}
          theme={theme}
          canUpload={status !== "Done"}
          onBack={() => setOverlay(null)}
          onUploadSlot={(index) => {
            setUploadIndex(index);
            setOverlay("upload-file");
          }}
          onViewFile={onViewFile}
        />
      )}
      {open && overlay === "file-link" && (
        <TaskcardMobileOverlay
          type="file-link"
          initialLink={fileLink}
          theme={theme}
          isSaving={isSaving}
          onBack={() => setOverlay(null)}
        />
      )}
      {open && overlay === "submit-link" && (
        <TaskcardMobileOverlay
          type="submit-link"
          delayReasonStage={delayReasonStage}
          theme={theme}
          isSaving={isSaving}
          onBack={() => setOverlay(null)}
          onConfirm={(value, delayReason) => runAction(() => typeof value === "string" ? onSubmitLink?.(value, delayReason) : undefined)}
        />
      )}
      {open && (overlay === "delete" || overlay === "change-status") && (
        <TaskcardMobileConfirmOverlay
          action={overlay}
          delayReasonStage={delayReasonStage}
          theme={theme}
          isSaving={isSaving}
          onCancel={() => setOverlay(null)}
          onConfirm={(delayReason) => runAction(overlay === "delete" ? onDelete : () => onChangeStatus?.(delayReason))}
        />
      )}
    </article>
  );
}
