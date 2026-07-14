import { TaskcardMobileButton } from "./taskcard-mobile-button";
import { TaskcardMobileChangelog } from "./taskcard-mobile-changelog";
import { TaskcardMobileDetail } from "./taskcard-mobile-detail";
import type { TaskcardMobileChange } from "./types";

type TaskcardMobileLayoutCardProps = {
  vendor: string;
  assignedTo?: string;
  status: string;
  changes?: TaskcardMobileChange[];
  countdownLabel: string;
  fileLabels?: string[];
  uploadedFileStates?: boolean[];
  showCountdown?: boolean;
  canChangeStatus?: boolean;
  canDelete?: boolean;
  actionLabel?: string;
  hasFileLink?: boolean;
  onFileAction?: (index: number) => void;
  onFileLink?: () => void;
  onChangeStatus?: () => void;
  onDelete?: () => void;
  className?: string;
};

export function TaskcardMobileLayoutCard({
  vendor,
  assignedTo,
  status,
  changes = [],
  countdownLabel,
  fileLabels = [],
  uploadedFileStates = [],
  showCountdown = true,
  canChangeStatus = true,
  canDelete = true,
  actionLabel = "Ganti Status",
  hasFileLink = false,
  onFileAction,
  onFileLink,
  onChangeStatus,
  onDelete,
  className,
}: TaskcardMobileLayoutCardProps) {
  return (
    <div className={["flex flex-col gap-4 rounded-b-2xl bg-white p-4", className].filter(Boolean).join(" ")}>
      <div className="flex flex-col gap-2">
        <TaskcardMobileDetail label="Vendor" value={vendor} />
        {assignedTo && <TaskcardMobileDetail label="Assigned" value={assignedTo} />}
        <TaskcardMobileDetail label="Status" value={status} />
        {changes.length > 0 && (
          <div className="mt-1 flex flex-col gap-2">
            {changes.map((change, index) => <TaskcardMobileChangelog key={`${change.label}-${index}`} {...change} />)}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {showCountdown && (
          <TaskcardMobileButton color={countdownLabel.startsWith("Telat") ? "red" : "purple"} style={countdownLabel.startsWith("Telat") ? "light" : "outlined"}>
            {countdownLabel}
          </TaskcardMobileButton>
        )}
        {fileLabels.map((label, index) => (
          <TaskcardMobileButton
            key={label}
            color="purple"
            style={uploadedFileStates[index] ? "filled" : "light"}
            icon="link"
            onClick={() => onFileAction?.(index)}
          >
            {label}
          </TaskcardMobileButton>
        ))}
        {hasFileLink && (
          <TaskcardMobileButton color="green" style="light" icon="link" onClick={onFileLink}>
            Link File
          </TaskcardMobileButton>
        )}
        {canChangeStatus && (
          <TaskcardMobileButton color="pink" style="filled" icon={actionLabel === "Ganti Status" ? "sync" : "link"} onClick={onChangeStatus}>
            {actionLabel}
          </TaskcardMobileButton>
        )}
        {canDelete && (
          <TaskcardMobileButton color="red" style="light" icon="delete" onClick={onDelete}>
            Delete
          </TaskcardMobileButton>
        )}
      </div>
    </div>
  );
}
