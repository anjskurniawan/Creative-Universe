"use client";

import { useState, useEffect } from "react";
import TaskCardDate from "./date";
import TaskCardNextButton from "./next-button";
import TaskCardTitleTask from "./title-task";
import TaskCardLoadingBar from "./loading-bar";
import TaskCardDetailStatus from "./detail-status";
import TaskCardDetail from "./detail";
import TaskCardButtonStatus from "./button-status";
import { MaterialIcon } from "@/components/material-icon";
import { 
  type TaskCardButtonStatusType, 
  type TaskCardNextButtonState,
  type TaskCardButtonStatusState,
  type TaskCardDetailStatusState
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
  supportFileUrl?: string | null;
  draftFileUrl?: string | null;
  fileLink?: string | null;
  id?: number;
  onRefresh?: () => void;
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
  supportFileUrl,
  draftFileUrl,
  fileLink,
  id,
  onRefresh,
}: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmittingFile, setIsSubmittingFile] = useState(false);
  const [isViewingLink, setIsViewingLink] = useState(false);
  const [uploadingDocType, setUploadingDocType] = useState<"support_file" | "draft_file" | null>(null);
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
    if (state === "0") return "ACC Draft";
    if (state === "ACC Draft") return "Progress";
    if (state === "Progress Design") return "Approve";
    if (state === "Approval Design") return "Email";
    return null;
  };

  const handleStepClick = (stepName: TaskCardButtonStatusState) => {
    if (stepName !== getNextAllowedStep()) {
      return; // Safeguard: sequential step flow
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

  // Calculate Days Left (Deadline - Given Date)
  let daysLeftText = "Count Down";
  if (deadlineDate && givenDate) {
    const dLine = new Date(deadlineDate);
    const dGiven = new Date(givenDate);
    if (!isNaN(dLine.getTime()) && !isNaN(dGiven.getTime())) {
      const diffTime = dLine.getTime() - dGiven.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      daysLeftText = `${diffDays} Days Left`;
    }
  }

  const handleFileClick = (path: string | null | undefined, type: "support_file" | "draft_file") => {
    if (!path) {
      setUploadingDocType(type);
      return;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const fullUrl = `${baseUrl}/storage/${path}`;
    window.open(fullUrl, '_blank');
  };

  const handleUploadSubmit = async () => {
    if (!id || !uploadingDocType || !uploadFileObj) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append(uploadingDocType, uploadFileObj);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      await fetch(`${baseUrl}/api/v1/homework-tasks/${id}/upload`, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header manually for FormData
      });
      
      setUploadingDocType(null);
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
    <div className="relative w-full overflow-hidden rounded-2xl bg-white shadow-sm border border-[#e5e7eb]">
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
              {/* Task Details */}
              <div className="flex flex-col items-start relative w-full flex-1 min-w-0 xl:max-w-[379px]">
                <TaskCardTitleTask title={title} className="px-0 py-0 xl:p-[10px] w-full truncate" />
                <div className="flex flex-wrap gap-[9px] items-center relative w-full px-[10px]">
                  <TaskCardDetailStatus 
                    isDone={isDone} 
                    status="3D Gambar Kerja" 
                    hasFile={!!supportFileUrl}
                    onClick={() => handleFileClick(supportFileUrl, "support_file")}
                  />
                  <TaskCardDetailStatus 
                    isDone={isDone} 
                    status="Draft Final" 
                    hasFile={!!draftFileUrl}
                    onClick={() => handleFileClick(draftFileUrl, "draft_file")}
                  />
                </div>
              </div>

              {/* Vendor Info */}
              <div className="flex flex-col gap-[7px] items-start relative shrink-0 mt-3 sm:mt-0 xl:w-[130px]">
                <TaskCardDetail variant="Vendor" value={picVendor} />
                <TaskCardDetail variant="Date" value={formattedDeadline} />
                <div 
                  className={isDone && fileLink ? "cursor-pointer" : ""} 
                  onClick={() => {
                    if (isDone && fileLink) setIsViewingLink(true);
                  }}
                >
                  <TaskCardDetail variant={isDone ? "Variant4" : "Count Down"} value={isDone ? undefined : daysLeftText} />
                </div>
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
                    />
                  </div>
                </div>
                <TaskCardLoadingBar percentage={PROGRESS_PERCENTAGE[state]} className="w-full" />
              </div>
              <div className="flex justify-end lg:block shrink-0">
                <TaskCardNextButton 
                  state={nextButtonState} 
                  className="size-[38px]" 
                  onClick={() => {
                    if (nextButtonState === "Delete") {
                      setIsDeleting(true);
                    } else if (nextButtonState === "On") {
                      setIsSubmittingFile(true);
                    } else {
                      onNextClick?.();
                    }
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Overlay */}
      <div className={`absolute inset-0 z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 sm:py-0 bg-[#ff5b55] text-white transition-all duration-300 ease-out border border-[#ff5b55] rounded-2xl ${isDeleting ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`}>
        <div className="flex items-center gap-3">
          <MaterialIcon name="delete_forever" size="auto" className="text-[28px] leading-none shrink-0" />
          <span className="text-base sm:text-lg font-medium leading-normal">Apakah Anda yakin ingin menghapus tugas ini?</span>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button 
            type="button"
            onClick={() => setIsDeleting(false)}
            className="px-4 py-2 text-sm font-semibold text-white bg-white/20 hover:bg-white/30 rounded-lg cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Batal
          </button>
          <button 
            type="button"
            onClick={() => {
              onDeleteConfirm?.();
              setIsDeleting(false);
            }}
            className="px-4 py-2 text-sm font-semibold text-[#ff5b55] bg-white hover:bg-gray-100 rounded-lg cursor-pointer transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Ya, Hapus
          </button>
        </div>
      </div>

      {/* Submit File Overlay */}
      <div className={`absolute inset-0 z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between px-6 py-4 xl:py-0 bg-[#8474f9] text-white transition-all duration-300 ease-out border border-[#8474f9] rounded-2xl ${isSubmittingFile ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`}>
        <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1 w-full mr-4">
          <div className="flex items-center gap-3 shrink-0">
            <MaterialIcon name="attach_file" size="auto" className="text-[28px] leading-none shrink-0" />
            <span className="text-base font-semibold leading-normal">Input Link File:</span>
          </div>
          <div className="flex flex-col flex-1 gap-1.5 w-full">
            <p className="text-xs text-white/80 font-normal">Masukkan link file design atau dokumen pendukung tugas</p>
            <input 
              type="url" 
              placeholder="Link File Sharing" 
              value={inputFileLink} 
              onChange={(e) => setInputFileLink(e.target.value)} 
              className="w-full max-w-[500px] px-3 py-1.5 bg-white text-black text-sm rounded-lg border-none outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 xl:mt-0 shrink-0">
          <button 
            type="button"
            onClick={() => {
              setIsSubmittingFile(false);
              setInputFileLink("");
            }}
            className="px-4 py-2 text-sm font-semibold text-white bg-white/20 hover:bg-white/30 rounded-lg cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Batal
          </button>
          <button 
            type="button"
            onClick={() => {
              if (!inputFileLink.trim()) {
                alert("Harap masukkan link file!");
                return;
              }
              onNextClick?.(inputFileLink);
              setIsSubmittingFile(false);
              setInputFileLink("");
            }}
            className="px-4 py-2 text-sm font-semibold text-[#8474f9] bg-white hover:bg-gray-100 rounded-lg cursor-pointer transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Kirim
          </button>
        </div>
      </div>

      {/* View Link Overlay */}
      <div className={`absolute inset-0 z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between px-6 py-4 xl:py-0 bg-[#e8faea] text-[#2b9915] transition-all duration-300 ease-out border border-[#2b9915] rounded-2xl ${isViewingLink ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`}>
        <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1 w-full mr-4">
          <div className="flex items-center gap-3 shrink-0">
            <MaterialIcon name="link" size="auto" className="text-[28px] leading-none shrink-0" />
            <span className="text-base font-semibold leading-normal">Tautan File Tersimpan:</span>
          </div>
          <div className="flex flex-col flex-1 gap-1.5 w-full">
            <p className="text-xs text-[#2b9915]/80 font-normal">Tautan ini telah dilampirkan pada hasil akhir tugas.</p>
            <div className="flex items-center w-full max-w-[500px] bg-white rounded-lg px-3 py-1.5 border border-[#2b9915]/20 shadow-sm overflow-hidden">
              <span className="text-sm text-black truncate flex-1">{fileLink}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 xl:mt-0 shrink-0">
          <button 
            type="button"
            onClick={() => setIsViewingLink(false)}
            className="px-4 py-2 text-sm font-semibold text-[#2b9915] bg-[#dbf7df] hover:bg-[#c2efc9] rounded-lg cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b9915]/50"
          >
            Kembali
          </button>
          <button 
            type="button"
            onClick={() => {
              if (fileLink) {
                navigator.clipboard.writeText(fileLink);
                alert("Link berhasil disalin!");
              }
            }}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#2b9915] hover:bg-[#238011] rounded-lg cursor-pointer transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b9915]/50 flex items-center gap-2"
          >
            <MaterialIcon name="content_copy" size="auto" className="text-[18px]" />
            Copy Link
          </button>
        </div>
      </div>

      {/* Upload Document Overlay */}
      <div className={`absolute inset-0 z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between px-6 py-4 xl:py-0 bg-white text-black transition-all duration-300 ease-out border border-[#e5e7eb] rounded-2xl ${uploadingDocType ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`}>
        <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1 w-full mr-4">
          <div className="flex items-center gap-3 shrink-0">
            <MaterialIcon name="upload_file" size="auto" className="text-[28px] leading-none shrink-0 text-[#8474f9]" />
            <span className="text-base font-semibold leading-normal">Unggah {uploadingDocType === "support_file" ? "3D Gambar" : "Draft"}:</span>
          </div>
          <div className="flex flex-col flex-1 gap-1 w-full">
            <input 
              type="file" 
              onChange={(e) => setUploadFileObj(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#eeebff] file:text-[#8474f9] hover:file:bg-[#e4dfff] cursor-pointer focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 xl:mt-0 shrink-0">
          <button 
            type="button"
            disabled={isUploading}
            onClick={() => {
              setUploadingDocType(null);
              setUploadFileObj(null);
            }}
            className="px-4 py-1.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:opacity-50"
          >
            Batal
          </button>
          <button 
            type="button"
            disabled={!uploadFileObj || isUploading}
            onClick={handleUploadSubmit}
            className="px-4 py-1.5 text-sm font-semibold text-white bg-[#8474f9] hover:bg-[#7261e3] rounded-lg cursor-pointer transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8474f9]/50 disabled:opacity-50 flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <MaterialIcon name="sync" className="animate-spin text-[16px]" size="auto" />
                <span className="leading-none">Mengunggah...</span>
              </>
            ) : (
              <>
                <MaterialIcon name="upload" className="text-[16px]" size="auto" />
                <span className="leading-none">Unggah</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
