"use client";

import { useState, useEffect } from "react";
import TaskCardDate from "./date";
import TaskCardNextButton from "./next-button";
import TaskCardTitleTask from "./title-task";
import TaskCardLoadingBar from "./loading-bar";
import TaskCardDetailStatus from "./detail-status";
import TaskCardDetail from "./detail";
import TaskCardButtonStatus from "./button-status";
import TaskCardDeleteOverlay from "./delete-overlay";
import TaskCardSubmitLinkOverlay from "./submit-link-overlay";
import TaskCardViewLinkOverlay from "./view-link-overlay";
import TaskCardUploadOverlay from "./upload-overlay";
import { apiFetch } from "@/lib/api";
import { MaterialIcon } from "@/components/material-icon";
import { 
  type TaskCardButtonStatusType, 
  type TaskCardNextButtonState,
  type TaskCardButtonStatusState,
  type TaskCardDetailStatusState,
  type TaskCardConfig
} from "./index";

export type TaskCardState =
  | "0"
  | "ACC Draft"
  | "Progress Design"
  | "Approval Design"
  | "Kirim Email"
  | "Done";

const TASK_STEPS: Array<{ state: Exclude<TaskCardState, "0" | "Done">; label: string }> = [
  { state: "ACC Draft", label: "ACC Draft" },
  { state: "Progress Design", label: "Progress Design" },
  { state: "Approval Design", label: "ApprovalDesign" },
  { state: "Kirim Email", label: "Kirim Email" },
];

const PROGRESS_PERCENTAGE: Record<TaskCardState, "0" | "25" | "50" | "75" | "100"> = {
  "0": "0",
  "ACC Draft": "0",
  "Progress Design": "25",
  "Approval Design": "50",
  "Kirim Email": "75",
  Done: "100",
};

function getStepState(cardState: TaskCardState, index: number): TaskCardButtonStatusType {
  if (cardState === "Done") return "Done";
  if (cardState === "0") return "Default";

  const activeIndex = TASK_STEPS.findIndex((step) => step.state === cardState);

  if (index < activeIndex) return "Done";
  if (index === activeIndex) return "Progress";

  return "Default";
}

export type TaskCardProps = {
  state?: TaskCardState;
  onNextClick?: (fileLink?: string) => void;
  onStepClick?: (status: TaskCardButtonStatusState) => void;
  onDetailStatusClick?: (status: TaskCardDetailStatusState) => void;
  onDeleteConfirm?: () => void;
  timestamps?: Record<string, string>;
  title?: string;
  picVendor?: string;
  givenDate?: string;
  deadlineDate?: string;
  assignedUsers?: any[];
  supportFileUrl?: (string | null)[];
  draftFileUrl?: (string | null)[];
  fileLink?: string | null;
  id?: number;
  onRefresh?: () => void;
  config?: TaskCardConfig;
  currentUser?: any;
  createdBy?: number;
};

export default function TaskCard({ 
  state = "0",
  onNextClick,
  onStepClick,
  onDetailStatusClick,
  onDeleteConfirm,
  timestamps,
  title = "KV JETE Pakuwon Solo",
  picVendor = "Fusion",
  givenDate,
  deadlineDate = "13/07/2026",
  assignedUsers = [],
  supportFileUrl = [null, null, null],
  draftFileUrl = [null, null, null],
  fileLink,
  id,
  onRefresh,
  config = {},
  currentUser,
  createdBy,
}: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmittingFile, setIsSubmittingFile] = useState(false);
  const [isViewingLink, setIsViewingLink] = useState(false);
  const [uploadingDocType, setUploadingDocType] = useState<"support_file" | "draft_file" | null>(null);
  const [uploadFileIndex, setUploadFileIndex] = useState<number | null>(null);
  const [uploadFileObj, setUploadFileObj] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [inputFileLink, setInputFileLink] = useState("");
  const [internalTimestamps, setInternalTimestamps] = useState<Record<string, string>>(timestamps || {});

  useEffect(() => {
    if (timestamps) {
      setInternalTimestamps(timestamps);
    }
  }, [timestamps]);

  const getNextAllowedStep = (): TaskCardButtonStatusState | null => {
    if (currentUser && createdBy && currentUser.id !== createdBy && !['Root', 'Manajer', 'SPV'].some(role => currentUser.roles?.some((r: any) => r.name === role))) {
      return null;
    }
    
    if (state === "0") return "ACC Draft";
    if (state === "ACC Draft") return "Progress";
    if (state === "Progress Design") return "Approve";
    if (state === "Approval Design") return "Email";
    return null;
  };

  const handleStepClick = (stepName: TaskCardButtonStatusState) => {
    if (stepName !== getNextAllowedStep()) {
      return; // Safeguard: sequential step flow or unauthorized
    }

    const now = new Date();
    const pad = (num: number) => String(num).padStart(2, "0");
    const formatted = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    
    setInternalTimestamps(prev => ({
      ...prev,
      [stepName]: formatted
    }));
    
    onStepClick?.(stepName);
  };

  const isDone = state === "Done";
  const isKirimEmail = state === "Kirim Email";
  const isProgressDesignOrApprovalDesignOrKirimEmailOrDone = ["Progress Design", "Approval Design", "Kirim Email", "Done"].includes(state);
  const isApprovalDesignOrKirimEmailOrDone = ["Approval Design", "Kirim Email", "Done"].includes(state);
  const isKirimEmailOrDone = ["Kirim Email", "Done"].includes(state);
  const isAccDraft = state === "ACC Draft";
  const isProgressDesign = state === "Progress Design";
  const isApprovalDesign = state === "Approval Design";

  const nextButtonState: TaskCardNextButtonState = isDone
    ? "Done"
    : isKirimEmail
    ? "On"
    : "Delete";

  const getStepType = (stepName: TaskCardButtonStatusState): TaskCardButtonStatusType => {
    if (isDone) return "Done";
    if (state === "0") return "Default";
    if (stepName === "ACC Draft") {
      return isProgressDesignOrApprovalDesignOrKirimEmailOrDone ? "Done" : isAccDraft ? "Progress" : "Default";
    }
    if (stepName === "Progress") {
      return isApprovalDesignOrKirimEmailOrDone ? "Done" : isProgressDesign ? "Progress" : "Default";
    }
    if (stepName === "Approve") {
      return isKirimEmailOrDone ? "Done" : isApprovalDesign ? "Progress" : "Default";
    }
    if (stepName === "Email") {
      return isDone ? "Done" : isKirimEmail ? "Progress" : "Default";
    }
    return "Default";
  };

  const getTimestampColorClass = (stepName: TaskCardButtonStatusState) => {
    const stepType = getStepType(stepName);
    if (stepType === "Done") return "text-[#2b9915]";
    if (stepType === "Progress") return "text-[#8474f9]";
    return "text-[#6b7280]";
  };

  // Parse givenDate
  let parsedDay = "Kamis";
  let parsedDate = "09";
  let parsedMonthYear = "JUL 2026";
  if (givenDate) {
    const d = new Date(givenDate);
    if (!isNaN(d.getTime())) {
      const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const months = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"];
      parsedDay = days[d.getDay()];
      parsedDate = String(d.getDate()).padStart(2, "0");
      parsedMonthYear = `${months[d.getMonth()]} ${d.getFullYear()}`;
    }
  }

  // Format deadline Date
  let formattedDeadline = deadlineDate;
  if (deadlineDate && deadlineDate.includes("-")) {
    const d = new Date(deadlineDate);
    if (!isNaN(d.getTime())) {
      formattedDeadline = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    }
  }

  // Format given Date
  let formattedGivenDate = givenDate;
  if (givenDate && givenDate.includes("-")) {
    const d = new Date(givenDate);
    if (!isNaN(d.getTime())) {
      formattedGivenDate = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    }
  }

  // Calculate Days Left (Deadline - Today)
  let daysLeftText = "Count Down";
  if (deadlineDate) {
    // If it's DD/MM/YYYY from mock, we might need to parse manually, but API gives YYYY-MM-DD
    let dLine: Date;
    if (deadlineDate.includes("/")) {
      const [dd, mm, yyyy] = deadlineDate.split("/");
      dLine = new Date(`${yyyy}-${mm}-${dd}`);
    } else {
      dLine = new Date(deadlineDate);
    }

    if (!isNaN(dLine.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dLine.setHours(0, 0, 0, 0);
      
      const diffTime = dLine.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        daysLeftText = `Terlambat ${Math.abs(diffDays)} Hari`;
      } else if (diffDays === 0) {
        daysLeftText = `Hari Ini`;
      } else {
        daysLeftText = `${diffDays} Days Left`;
      }
    }
  }

  const handleFileClick = (path: string | null | undefined, type: "support_file" | "draft_file") => {
    if (!path) {
      if (currentUser && createdBy && currentUser.id !== createdBy && !['Root', 'Manajer', 'SPV'].some(role => currentUser.roles?.some((r: any) => r.name === role))) {
        return;
      }
      setUploadingDocType(type);
      return;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const fullUrl = `${baseUrl}/storage/${path}`;
    window.open(fullUrl, '_blank');
  };

  const handleUploadSubmit = async () => {
    if (!id || !uploadingDocType || !uploadFileObj || uploadFileIndex === null) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append(uploadingDocType, uploadFileObj);
      formData.append("file_index", uploadFileIndex.toString());

      await apiFetch(`/homework-tasks/${id}/upload`, {
        method: "POST",
        body: formData,
      });
      
      onRefresh?.();
      
      setUploadingDocType(null);
      setUploadFileIndex(null);
      setUploadFileObj(null);
      onRefresh?.();
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative w-full rounded-2xl bg-white shadow-sm border border-[#e5e7eb] hover:z-10 focus-within:z-10">
      {/* Main Card Content */}
      <div className={`flex flex-col xl:flex-row items-stretch xl:items-center w-full transition-all duration-300 ${isDeleting || isSubmittingFile || uploadingDocType ? "opacity-30 blur-[1px] pointer-events-none" : "opacity-100"}`}>
        {/* Task Card - Date */}
        <TaskCardDate
          state={isDone ? "Done" : "Default"}
          day={parsedDay}
          date={parsedDate}
          monthYear={parsedMonthYear}
          className="flex flex-row xl:flex-col justify-between xl:justify-center items-center p-4 xl:p-[16px] w-full xl:w-[122px] shrink-0 xl:h-[122px] rounded-t-2xl xl:rounded-t-none xl:rounded-l-[16px]"
        />

        {/* Main Container */}
        <div className="flex flex-col xl:flex-row flex-1 items-stretch xl:items-center self-stretch">
          <div
            className={[
              "flex flex-col xl:flex-row flex-1 items-stretch xl:items-center justify-between px-5 py-5 xl:px-[32px] xl:py-0 xl:h-full rounded-b-2xl xl:rounded-b-none xl:rounded-r-[16px]",
              isDone ? "bg-[#e8faea]" : "bg-white",
            ].join(" ")}
          >
            {/* Task Info Container */}
            <div className="flex flex-col sm:flex-row gap-4 xl:gap-4 2xl:gap-8 items-stretch sm:items-center relative flex-1 min-w-0 mr-4">
              {/* Title */}
              <div className="flex flex-col items-start relative flex-1 min-w-0 xl:max-w-[220px]">
                <TaskCardTitleTask title={title} className="w-full px-0 py-0 xl:p-[10px]" />
              </div>

              {/* Files */}
              <div className="flex flex-col gap-[7px] items-start relative shrink-0 mt-3 sm:mt-0 xl:w-[150px] px-[10px]">
                <TaskCardDetailStatus
                  status="3D Gambar Kerja"
                  isDone={isDone}
                  files={supportFileUrl}
                  onUploadClick={(idx) => {
                    if (!isDone) {
                      setUploadingDocType("support_file");
                      setUploadFileIndex(idx);
                    }
                  }}
                  onViewClick={(url) => {
                    const isAbsolute = url.startsWith('http://') || url.startsWith('https://');
                    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
                    window.open(isAbsolute ? url : `${baseUrl}/storage/${url}`, '_blank');
                  }}
                  config={config}
                />
                <TaskCardDetailStatus
                  status="Draft Final"
                  isDone={isDone}
                  files={draftFileUrl}
                  onUploadClick={(idx) => {
                    if (!isDone) {
                      setUploadingDocType("draft_file");
                      setUploadFileIndex(idx);
                    }
                  }}
                  onViewClick={(url) => {
                    const isAbsolute = url.startsWith('http://') || url.startsWith('https://');
                    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
                    window.open(isAbsolute ? url : `${baseUrl}/storage/${url}`, '_blank');
                  }}
                  config={config}
                />
              </div>

              {/* Vendor Info */}
              <div className="flex flex-col gap-[7px] items-start relative shrink-0 mt-3 sm:mt-0 xl:w-[130px]">
                <TaskCardDetail variant="Vendor" value={picVendor} config={config} />
                <TaskCardDetail variant="Date" value={formattedDeadline} config={config} />
                {!isDone && (
                  <TaskCardDetail variant="Count Down" value={daysLeftText} config={config} />
                )}
                {isDone && fileLink && (
                  <TaskCardDetail 
                    variant="Variant4" 
                    onClick={() => setIsViewingLink(true)} 
                    config={config}
                  />
                )}
              </div>
            </div>

            {/* Progress Info */}
            <div className="flex flex-col lg:flex-row gap-4 xl:gap-3 2xl:gap-8 items-stretch lg:items-center relative mt-6 xl:mt-0 w-full lg:w-auto shrink-0">
              {/* Progress Details */}
              <div className="flex flex-col gap-[12px] items-start relative w-full xl:w-[410px]">
                <div className="grid grid-cols-2 sm:grid-cols-4 xl:flex xl:items-center xl:justify-between w-full gap-2">
                  <div className="relative flex-1 xl:flex-none w-full xl:w-[95px] pt-3.5">
                    {internalTimestamps["ACC Draft"] && (
                      <span className={`absolute top-0 right-0 text-[8px] font-medium leading-none whitespace-nowrap ${getTimestampColorClass("ACC Draft")}`}>
                        {internalTimestamps["ACC Draft"]}
                      </span>
                    )}
                    <TaskCardButtonStatus
                      status="ACC Draft"
                      type={isProgressDesignOrApprovalDesignOrKirimEmailOrDone ? "Done" : isAccDraft ? "Progress" : "Default"}
                      className={`w-full ${getNextAllowedStep() === "ACC Draft" ? "" : "pointer-events-none"}`}
                      onClick={() => handleStepClick("ACC Draft")}
                      config={config}
                    />
                  </div>

                  <div className="relative flex-1 xl:flex-none w-full xl:w-[100px] pt-3.5">
                    {internalTimestamps["Progress"] && (
                      <span className={`absolute top-0 right-0 text-[8px] font-medium leading-none whitespace-nowrap ${getTimestampColorClass("Progress")}`}>
                        {internalTimestamps["Progress"]}
                      </span>
                    )}
                    <TaskCardButtonStatus
                      status="Progress"
                      type={isApprovalDesignOrKirimEmailOrDone ? "Done" : isProgressDesign ? "Progress" : "Default"}
                      className={`w-full ${getNextAllowedStep() === "Progress" ? "" : "pointer-events-none"}`}
                      onClick={() => handleStepClick("Progress")}
                      config={config}
                    />
                  </div>

                  <div className="relative flex-1 xl:flex-none w-full xl:w-[100px] pt-3.5">
                    {internalTimestamps["Approve"] && (
                      <span className={`absolute top-0 right-0 text-[8px] font-medium leading-none whitespace-nowrap ${getTimestampColorClass("Approve")}`}>
                        {internalTimestamps["Approve"]}
                      </span>
                    )}
                    <TaskCardButtonStatus
                      status="Approve"
                      type={isKirimEmailOrDone ? "Done" : isApprovalDesign ? "Progress" : "Default"}
                      className={`w-full ${getNextAllowedStep() === "Approve" ? "" : "pointer-events-none"}`}
                      onClick={() => handleStepClick("Approve")}
                      config={config}
                    />
                  </div>

                  <div className="relative flex-1 xl:flex-none w-full xl:w-[100px] pt-3.5">
                    {internalTimestamps["Email"] && (
                      <span className={`absolute top-0 right-0 text-[8px] font-medium leading-none whitespace-nowrap ${getTimestampColorClass("Email")}`}>
                        {internalTimestamps["Email"]}
                      </span>
                    )}
                    <TaskCardButtonStatus
                      status="Email"
                      type={isDone ? "Done" : isKirimEmail ? "Progress" : "Default"}
                      className={`w-full ${getNextAllowedStep() === "Email" ? "" : "pointer-events-none"}`}
                      onClick={() => handleStepClick("Email")}
                      config={config}
                    />
                  </div>
                </div>
                <TaskCardLoadingBar percentage={PROGRESS_PERCENTAGE[state]} className="w-full" />
              </div>
              <div className="flex justify-end lg:block shrink-0">
                <TaskCardNextButton 
                  state={nextButtonState} 
                  className={`size-[38px] ${currentUser && createdBy && currentUser.id !== createdBy && !['Root', 'Manajer', 'SPV'].some(role => currentUser.roles?.some((r: any) => r.name === role)) ? "opacity-50 pointer-events-none" : ""}`}
                  onClick={() => {
                    if (currentUser && createdBy && currentUser.id !== createdBy && !['Root', 'Manajer', 'SPV'].some(role => currentUser.roles?.some((r: any) => r.name === role))) {
                       return;
                    }
                    if (nextButtonState === "Delete") {
                      setIsDeleting(true);
                    } else if (nextButtonState === "On") {
                      setIsSubmittingFile(true);
                    } else if (isDone && fileLink) {
                      setIsViewingLink(true);
                    } else {
                      onNextClick?.(fileLink || "");
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Overlay */}
      <TaskCardDeleteOverlay
        isDeleting={isDeleting}
        onCancel={() => setIsDeleting(false)}
        onConfirm={() => {
          onDeleteConfirm?.();
          setIsDeleting(false);
        }}
        config={config}
      />

      {/* Submit File Overlay */}
      <TaskCardSubmitLinkOverlay
        isSubmitting={isSubmittingFile}
        inputValue={inputFileLink}
        onInputChange={setInputFileLink}
        onCancel={() => {
          setIsSubmittingFile(false);
          setInputFileLink("");
        }}
        onSubmit={() => {
          if (!inputFileLink.trim()) {
            alert("Harap masukkan link file!");
            return;
          }
          onNextClick?.(inputFileLink);
          setIsSubmittingFile(false);
          setInputFileLink("");
        }}
        config={config}
      />

      {/* View Link Overlay */}
      <TaskCardViewLinkOverlay
        isViewing={isViewingLink}
        fileLink={fileLink}
        onCancel={() => setIsViewingLink(false)}
        config={config}
      />

      {/* Upload Document Overlay */}
      <TaskCardUploadOverlay
        uploadingDocType={uploadingDocType}
        fileIndex={uploadFileIndex}
        isUploading={isUploading}
        hasFile={!!uploadFileObj}
        onFileChange={setUploadFileObj}
        onCancel={() => {
          setUploadingDocType(null);
          setUploadFileIndex(null);
          setUploadFileObj(null);
        }}
        onSubmit={handleUploadSubmit}
        config={config}
      />
    </div>
  );
}
