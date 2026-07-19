import { TaskcardMobileButton } from "./taskcard-mobile-button";
import { TaskcardMobileChangelog } from "./taskcard-mobile-changelog";
import { TaskcardMobileDetail } from "./taskcard-mobile-detail";
import { MaterialIcon } from "@/components/material-icon";
import type { TaskcardMobileAvatar, TaskcardMobileChange, TaskcardMobileTheme } from "./types";

type TaskcardMobileLayoutCardProps = {
  vendor: string;
  assignedTo?: string;
  assignedAvatars?: TaskcardMobileAvatar[];
  status: string;
  theme?: TaskcardMobileTheme;
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
  assignedAvatars,
  status,
  theme = "light",
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
  const surfaceClass = theme === "dark" ? "bg-[#101211]" : theme === "retro" ? "border-2 border-[#24252b] bg-[#dfe2d3]" : "border border-[#e9edf2] bg-[#f8fbff]";
  const sectionTitleClass = theme === "dark" ? "text-[#f1f1f1]" : theme === "retro" ? "text-[#24252b]" : "text-[#26333a]";
  const mutedClass = theme === "dark" ? "text-[#a7ada8]" : theme === "retro" ? "text-[#687065]" : "text-[#6d7880]";
  const dividerClass = theme === "dark" ? "border-white/10" : theme === "retro" ? "border-[#24252b]/20" : "border-[#e9edf2]";

  return (
    <div className={["flex flex-col gap-3 rounded-b-2xl p-3.5", theme === "dark" ? "bg-[#171717]" : theme === "retro" ? "bg-[#eceee6]" : "bg-white", className].filter(Boolean).join(" ")}>
      <section className={`rounded-xl p-3 ${surfaceClass}`}>
        <div className="mb-2 flex items-center justify-between">
          <h3 className={`text-xs font-semibold ${sectionTitleClass}`}>Informasi tugas</h3>
          <MaterialIcon name="info" size="auto" weight={400} className={`text-base ${mutedClass}`} />
        </div>
        <div className={`flex flex-col divide-y ${dividerClass}`}>
          <TaskcardMobileDetail label="Vendor" value={vendor} theme={theme} />
        {assignedTo && <TaskcardMobileDetail label="Assigned" value={assignedTo} avatars={assignedAvatars} theme={theme} />}
          <TaskcardMobileDetail label="Status" value={status} theme={theme} />
        </div>
        {changes.length > 0 && (
          <div className={`mt-3 border-t pt-3 ${dividerClass}`}>
            <div className="mb-2 flex items-center gap-1.5">
              <MaterialIcon name="history" size="auto" weight={400} className={`text-base ${mutedClass}`} />
              <h3 className={`text-xs font-semibold ${sectionTitleClass}`}>Riwayat progres</h3>
            </div>
            <div className="flex flex-col gap-2">
            {changes.map((change, index) => <TaskcardMobileChangelog key={`${change.label}-${index}`} {...change} theme={theme} />)}
            </div>
          </div>
        )}
      </section>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 px-1">
          <MaterialIcon name="folder" size="auto" weight={400} className={`text-base ${mutedClass}`} />
          <h3 className={`text-xs font-semibold ${sectionTitleClass}`}>Dokumen & tindak lanjut</h3>
        </div>
        {showCountdown && (
          <TaskcardMobileButton theme={theme} color={countdownLabel.startsWith("Telat") ? "red" : "purple"} style={countdownLabel.startsWith("Telat") ? "light" : "outlined"}>
            {countdownLabel}
          </TaskcardMobileButton>
        )}
        {fileLabels.map((label, index) => (
          <TaskcardMobileButton
            key={label}
            color="purple"
            theme={theme}
            style={uploadedFileStates[index] ? "filled" : "light"}
            icon="link"
            onClick={() => onFileAction?.(index)}
          >
            {label}
          </TaskcardMobileButton>
        ))}
        {hasFileLink && (
          <TaskcardMobileButton theme={theme} color="green" style="light" icon="link" onClick={onFileLink}>
            Link File
          </TaskcardMobileButton>
        )}
        {canChangeStatus && (
          <TaskcardMobileButton theme={theme} color="pink" style="filled" icon={actionLabel === "Ganti Status" ? "sync" : "link"} onClick={onChangeStatus}>
            {actionLabel}
          </TaskcardMobileButton>
        )}
        {canDelete && (
          <TaskcardMobileButton theme={theme} color="red" style="light" icon="delete" onClick={onDelete}>
            Delete
          </TaskcardMobileButton>
        )}
      </div>
    </div>
  );
}
