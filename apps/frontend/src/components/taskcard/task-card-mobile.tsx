"use client";

import {
  TaskcardMobileFullCard,
  type TaskcardMobileChange,
  type TaskcardMobileAvatar,
  type TaskcardMobileTone,
} from "@/components/taskcard-mobile";
import type { TaskCardState } from "./task-card";

export type TaskCardMobileTheme = "light" | "dark" | "retro";

export type TaskCardMobileProps = {
  title: string;
  dateRange?: string;
  vendor: string;
  assignedTo?: string;
  assignedAvatars?: TaskcardMobileAvatar[];
  status: TaskCardState;
  tone?: TaskcardMobileTone;
  changes?: TaskcardMobileChange[];
  countdownLabel: string;
  fileLabels?: string[];
  fileSlotFiles?: Array<(string | null)[]>;
  uploadedFileStates?: boolean[];
  fileLink?: string | null;
  delayReasonStage?: string;
  theme?: TaskCardMobileTheme;
  onChangeStatus?: (delayReason?: string) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  onUpload?: (file: File, groupIndex: number, fileIndex: number) => void | Promise<void>;
  onViewFile?: (file: string) => void;
  onSubmitLink?: (link: string, delayReason?: string) => void | Promise<void>;
};

/**
 * Mobile entry point for the finalized task-card contract. The interaction and
 * expanded-detail hierarchy deliberately match the previously approved mobile
 * card, while the page supplies the active Light/Dark/Retro token.
 */
export function TaskCardMobile({
  title,
  dateRange,
  vendor,
  assignedTo,
  assignedAvatars,
  status,
  tone = "default",
  changes,
  countdownLabel,
  fileLabels,
  fileSlotFiles,
  uploadedFileStates,
  fileLink,
  delayReasonStage,
  theme = "light",
  onChangeStatus,
  onDelete,
  onUpload,
  onViewFile,
  onSubmitLink,
}: TaskCardMobileProps) {
  return (
    <TaskcardMobileFullCard
      title={title}
      dateRange={dateRange}
      vendor={vendor}
      assignedTo={assignedTo}
      assignedAvatars={assignedAvatars}
      status={status}
      tone={tone}
      theme={theme}
      changes={changes}
      countdownLabel={countdownLabel}
      fileLabels={fileLabels}
      fileSlotFiles={fileSlotFiles}
      uploadedFileStates={uploadedFileStates}
      fileLink={fileLink}
      delayReasonStage={delayReasonStage}
      defaultOpen={false}
      onChangeStatus={onChangeStatus}
      onDelete={onDelete}
      onUpload={onUpload}
      onViewFile={onViewFile}
      onSubmitLink={onSubmitLink}
      className={`kv-retail-mobile-task-card kv-retail-mobile-task-card--${theme}`}
    />
  );
}
