"use client";

import { useRef, useState } from "react";
import { toBlob } from "html-to-image";
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
import TaskCardDelayReasonOverlay from "./delay-reason-overlay";
import { resolveStorageUrl } from "@/core/api/client";
import { kvRetailApi } from "@/features/kv-retail/api";
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
  onNextClick?: (fileLink?: string, delayReason?: string) => void;
  onStepClick?: (status: TaskCardButtonStatusState, delayReason?: string) => void;
  onDetailStatusClick?: (status: TaskCardDetailStatusState) => void;
  onDeleteConfirm?: () => void;
  timestamps?: Record<string, string>;
  title?: string;
  picVendor?: string;
  givenDate?: string;
  deadlineDate?: string;
  assignedUsers?: unknown[];
  supportFileUrl?: (string | null)[];
  draftFileUrl?: (string | null)[];
  fileLink?: string | null;
  id?: number;
  onRefresh?: () => void;
  config?: TaskCardConfig;
  currentUser?: { id?: number; roles?: Array<string | { name?: string }> } | null;
  createdBy?: number;
  delayReasonStage?: string;
  isLate?: boolean;
  onTitleSave?: (title: string) => Promise<void>;
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
  delayReasonStage,
  isLate = false,
  onTitleSave,
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
  const [delayReason, setDelayReason] = useState("");
  const [pendingStep, setPendingStep] = useState<TaskCardButtonStatusState | null>(null);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const exportCardRef = useRef<HTMLDivElement>(null);

  const canManageTask = !currentUser || !createdBy || currentUser.id === createdBy || ["Root", "Manajer", "SPV"].some((role) =>
    currentUser.roles?.some((currentRole: string | { name?: string }) => typeof currentRole === "string" ? currentRole === role : currentRole.name === role),
  );

  const getNextAllowedStep = (): TaskCardButtonStatusState | null => {
    if (!canManageTask) {
      return null;
    }
    
    if (state === "0") return "ACC Draft";
    if (state === "ACC Draft") return "Progress";
    if (state === "Progress Design") return "Approve";
    if (state === "Approval Design") return "Email";
    return null;
  };

  const commitStep = (stepName: TaskCardButtonStatusState, reason?: string) => {
    const now = new Date();
    const pad = (num: number) => String(num).padStart(2, "0");
    const formatted = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    setInternalTimestamps(prev => ({ ...prev, [stepName]: formatted }));
    onStepClick?.(stepName, reason);
  };

  const handleStepClick = (stepName: TaskCardButtonStatusState) => {
    if (stepName !== getNextAllowedStep()) {
      return; // Safeguard: sequential step flow or unauthorized
    }

    if (delayReasonStage) {
      setPendingStep(stepName);
      return;
    }

    commitStep(stepName);
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
      if (!canManageTask) {
        return;
      }
      setUploadingDocType(type);
      return;
    }
    window.open(resolveStorageUrl(path) ?? undefined, '_blank');
  };

  const handleUploadSubmit = async () => {
    if (!id || !uploadingDocType || !uploadFileObj || uploadFileIndex === null) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append(uploadingDocType, uploadFileObj);
      formData.append("file_index", uploadFileIndex.toString());

      await kvRetailApi.tasks.uploadFile(id, formData);
      
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

  // Archived PNG renderer: retained temporarily while preview uses a dedicated tab.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDownloadImage = async () => {
    if (isExportingImage) return;

    setIsExportingImage(true);
    try {
      const exportElement = exportCardRef.current;
      if (!exportElement) throw new Error("Layout export tidak tersedia.");

      // Render the dedicated desktop layout as real HTML/CSS first. The canvas
      // implementation below only remains as a safety net for browsers that
      // reject DOM-to-image rendering.
      try {
        await document.fonts?.ready;
        const imageBlob = await toBlob(exportElement, {
          backgroundColor: "#f7f7ff",
          cacheBust: true,
          pixelRatio: 2,
          // Material Symbols is loaded from Google Fonts. Its stylesheet is
          // cross-origin and cannot be read by html-to-image, while this
          // export layout uses only local text symbols.
          skipFonts: true,
          // The source stays off-screen in the app, but its cloned export
          // must start at the canvas origin or every child is cropped out.
          style: {
            left: "0",
            top: "0",
            position: "static",
            transform: "none",
          },
          width: 403,
          height: 632,
        });
        if (!imageBlob) throw new Error("Renderer CSS tidak menghasilkan gambar.");
        const filename = (title || "task-kv-retail")
          .trim()
          .replace(/[^a-z0-9]+/gi, "-")
          .replace(/^-+|-+$/g, "")
          .toLowerCase();
        const downloadLink = document.createElement("a");
        downloadLink.download = `${filename || "task-kv-retail"}.png`;
        downloadLink.href = URL.createObjectURL(imageBlob);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();
        window.setTimeout(() => URL.revokeObjectURL(downloadLink.href), 1000);
        return;
      } catch (cssExportError) {
        console.warn("Render CSS task gagal, memakai renderer cadangan.", cssExportError);
      }

      const scale = 2;
      const width = 403;
      const height = 632;
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas tidak tersedia.");
      context.scale(scale, scale);

      const roundedRect = (x: number, y: number, w: number, h: number, radius: number) => {
        context.beginPath();
        context.roundRect(x, y, w, h, radius);
      };
      const fillRounded = (x: number, y: number, w: number, h: number, radius: number, color: string) => {
        roundedRect(x, y, w, h, radius);
        context.fillStyle = color;
        context.fill();
      };
      const text = (value: string, x: number, y: number, font: string, color: string) => {
        context.font = font;
        context.fillStyle = color;
        context.fillText(value, x, y);
      };
      const wrappedText = (value: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const words = value.split(/\s+/);
        let line = "";
        let lineY = y;
        for (const word of words) {
          const nextLine = line ? `${line} ${word}` : word;
          if (context.measureText(nextLine).width > maxWidth && line) {
            context.fillText(line, x, lineY);
            line = word;
            lineY += lineHeight;
          } else {
            line = nextLine;
          }
        }
        if (line) context.fillText(line, x, lineY);
      };

      const usesGreenTheme = isDone || Boolean(delayReasonStage);
      const palette = usesGreenTheme
        ? { page: "#F5FFF2", primary: "#2BAF33", soft: "#E4F9DB", border: "#00AA0A", muted: "#2BAF33" }
        : { page: "#F6F4FF", primary: "#6931F1", soft: "#EEECFC", border: "#6931F1", muted: "#6931F1" };
      const delayedStage = delayReasonStage === "ACC Draft" ? 0 : delayReasonStage === "Progress Design" ? 1 : delayReasonStage === "Approval Design" ? 2 : delayReasonStage === "Kirim Email" ? 3 : -1;
      const stageLabels = ["ACC Draft", "Progress Design", "Approval Design", "Kirim Email"];
      const stageIcons = ["✓", "✎", "♙", "✉"];
      const statusDate = internalTimestamps["Email"] || internalTimestamps["Approve"] || internalTimestamps["Progress"] || internalTimestamps["ACC Draft"] || "-";

      context.fillStyle = palette.page;
      context.fillRect(0, 0, width, height);
      fillRounded(0, 0, width, height, 16, palette.page);
      context.strokeStyle = palette.primary;
      context.lineWidth = 0.4;
      context.beginPath(); context.moveTo(16, 62); context.lineTo(387, 62); context.stroke();

      fillRounded(16, 16, 38, 38, 8, "#000000");
      context.textAlign = "center";
      text("CU", 35, 40, "600 12px Arial", "#FFFFFF");
      context.textAlign = "left";
      text("Creative Universe", 61, 31, "600 13px Arial", "#111111");
      text("ODDS", 61, 47, "400 10px Arial", "#111111");
      context.textAlign = "right";
      text(isDone ? "✓" : "○", 386, 43, "600 24px Arial", "#111111");
      context.textAlign = "left";

      fillRounded(16, 70, 88, 99, 12, palette.primary);
      context.textAlign = "center";
      text(parsedDay, 60, 93, "400 12px Arial", "#FFFFFF");
      text(parsedDate, 60, 130, "600 36px Arial", "#FFFFFF");
      text(parsedMonthYear, 60, 153, "400 12px Arial", "#FFFFFF");
      context.textAlign = "left";
      context.font = "600 24px Arial";
      context.fillStyle = "#242435";
      wrappedText(title, 112, 101, 270, 29);
      fillRounded(112, 140, 212, 22, 4, palette.soft);
      text(`▣  Tugas di Submit tanggal ${formattedGivenDate || "-"}`, 120, 155, "400 10px Arial", palette.primary);

      fillRounded(16, 177, 371, 102, 8, "#FFFFFF");
      context.strokeStyle = "#F0F0F3"; context.lineWidth = 0.5; roundedRect(16, 177, 371, 102, 8); context.stroke();
      context.beginPath(); context.arc(42, 203, 18, 0, Math.PI * 2); context.fillStyle = palette.soft; context.fill();
      text("◉", 31, 209, "400 20px Arial", "#2F2F2F");
      text("Vendor", 68, 198, "400 10px Arial", "#9A9A9A");
      text(picVendor, 68, 214, "600 14px Arial", "#2F2F2F");
      context.beginPath(); context.arc(42, 254, 18, 0, Math.PI * 2); context.fillStyle = palette.soft; context.fill();
      text("▣", 33, 260, "400 17px Arial", palette.primary);
      text("Deadline", 68, 249, "400 10px Arial", "#9A9A9A");
      text(formattedDeadline || "-", 68, 265, "600 14px Arial", "#4B4B4B");

      fillRounded(16, 287, 371, 141, 8, "#FFFFFF");
      text("Progress", 24, 310, "600 14px Arial", "#2F2F2F");
      stageLabels.forEach((label, index) => {
        const x = 35 + index * 90;
        const completed = isDone || index < TASK_STEPS.findIndex((step) => step.state === state);
        const active = TASK_STEPS[index]?.state === state;
        const isDelayed = delayedStage === index;
        const color = isDelayed ? "#F13131" : palette.primary;
        const softColor = isDelayed ? "#FCECEC" : palette.soft;
        text(internalTimestamps[index === 0 ? "ACC Draft" : index === 1 ? "Progress" : index === 2 ? "Approve" : "Email"] || (active ? statusDate : ""), x, 335, "400 8px Arial", color);
        context.beginPath(); context.arc(x + 20, 362, 22, 0, Math.PI * 2); context.fillStyle = softColor; context.fill();
        context.textAlign = "center"; text(completed ? "✓" : stageIcons[index], x + 20, 368, "600 19px Arial", color); context.textAlign = "left";
        fillRounded(x, 391, 67, 20, 4, softColor); context.strokeStyle = color; context.lineWidth = 0.2; roundedRect(x, 391, 67, 20, 4); context.stroke();
        context.textAlign = "center"; text(label, x + 33.5, 404, "400 8px Arial", color); context.textAlign = "left";
      });

      fillRounded(16, 436, 371, 180, 8, "#FFFFFF");
      text("Detail", 24, 459, "600 14px Arial", "#2F2F2F");
      fillRounded(24, 473, 126, 126, 4, palette.soft); context.strokeStyle = palette.border; context.lineWidth = 0.2; roundedRect(24, 473, 126, 126, 4); context.stroke();
      context.textAlign = "center"; text("✧", 50, 540, "400 27px Arial", palette.primary); text("Creative Agent", 102, 535, "600 10px Arial", palette.primary); text("Suggest", 102, 550, "600 10px Arial", palette.primary); context.textAlign = "left";
      const detailText = isLate ? "Prioritaskan penyelesaian task yang melewati deadline dan pastikan proses berikutnya tidak tertunda." : isDone ? "Task telah selesai. Dokumentasikan hasil akhir untuk referensi pekerjaan berikutnya." : "Pantau progres pada tahap aktif dan pastikan kebutuhan approval tersedia sebelum deadline.";
      context.fillStyle = "#555555"; context.font = "400 10px Arial"; wrappedText(`• ${detailText}`, 166, 484, 195, 14);

      const imageUrl = canvas.toDataURL("image/png");
      const filename = (title || "task-kv-retail")
        .trim()
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();
      const downloadLink = document.createElement("a");
      downloadLink.download = `${filename || "task-kv-retail"}.png`;
      downloadLink.href = imageUrl;
      downloadLink.click();
    } catch (error) {
      console.error("Gagal mengunduh gambar task:", error);
      alert("Gambar task belum dapat dibuat. Silakan coba lagi.");
    } finally {
      setIsExportingImage(false);
    }
  };

  const handleOpenPrintPreview = () => {
    if (!id) return;
    window.open(`/kv-retail/print/?task=${id}`, "_blank", "noopener,noreferrer");
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
            <div className="flex flex-col sm:flex-row gap-4 xl:gap-4 2xl:gap-6 items-stretch sm:items-center relative min-w-0 xl:flex-none xl:mr-6">
              {/* Title */}
              <div className="flex flex-col items-start relative flex-1 min-w-0 xl:w-[420px] xl:flex-none">
                <TaskCardTitleTask title={title} editable={canManageTask} onSave={onTitleSave} className="w-full px-0 py-0 xl:p-[10px]" />
                {isDone && isLate && (
                  <span className="mt-1 rounded-full bg-[#fee2e2] px-2 py-1 text-xs font-semibold text-[#b91c1c]">Terlambat</span>
                )}
              </div>

              {/* Files */}
              <div className="flex flex-col gap-[7px] items-start relative shrink-0 mt-3 sm:mt-0 xl:w-[150px] px-[10px]">
                <TaskCardDetailStatus
                  status="3D Gambar Kerja"
                  isDone={isDone}
                  files={supportFileUrl}
                  onUploadClick={(idx) => {
                    setUploadingDocType("support_file");
                    setUploadFileIndex(idx);
                  }}
                  onViewClick={(url) => {
                    window.open(resolveStorageUrl(url) ?? undefined, '_blank');
                  }}
                  config={config}
                />
                <TaskCardDetailStatus
                  status="Draft Final"
                  isDone={isDone}
                  files={draftFileUrl}
                  onUploadClick={(idx) => {
                    setUploadingDocType("draft_file");
                    setUploadFileIndex(idx);
                  }}
                  onViewClick={(url) => {
                    window.open(resolveStorageUrl(url) ?? undefined, '_blank');
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
              <div data-export-exclude="true" className="flex shrink-0 justify-end gap-2">
                <button
                  type="button"
                  aria-label={`Buka preview task ${title}`}
                  title="Buka preview task"
                  onClick={handleOpenPrintPreview}
                  className="flex size-[38px] shrink-0 items-center justify-center rounded-lg border border-[#d7dcdd] bg-white text-[#525e61] transition-colors duration-200 hover:border-[#8474f9] hover:text-[#8474f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8474f9]/35"
                >
                  <MaterialIcon name="open_in_new" size="auto" weight={400} filled={false} className="text-[20px] leading-none" />
                </button>
                <TaskCardNextButton 
                  state={nextButtonState} 
                  className={`size-[38px] ${!canManageTask ? "opacity-50 pointer-events-none" : ""}`}
                  onClick={() => {
                    if (!canManageTask) {
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

      <TaskCardDelayReasonOverlay
        isOpen={Boolean(pendingStep)}
        stage={delayReasonStage}
        value={delayReason}
        onChange={setDelayReason}
        onCancel={() => { setPendingStep(null); setDelayReason(""); }}
        onConfirm={() => {
          if (!pendingStep || !delayReason.trim()) return;
          commitStep(pendingStep, delayReason.trim());
          setPendingStep(null);
          setDelayReason("");
        }}
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

      <div
        aria-hidden="true"
        ref={exportCardRef}
        className={`pointer-events-none fixed -left-[440px] top-0 flex h-[632px] w-[403px] flex-col items-center justify-center gap-2 overflow-hidden rounded-[16px] p-4 font-sans text-[#171725] ${isDone || Boolean(delayReasonStage) ? "bg-[#f5fff2]" : "bg-[#eeecfc]"}`}
      >
        {(() => {
          const isGreenTheme = isDone || Boolean(delayReasonStage);
          const exportPrimary = isGreenTheme ? "#2baf33" : "#6931f1";
          const exportSoft = isGreenTheme ? "#e4f9db" : "#eeecfc";
          const exportBorder = isGreenTheme ? "#00aa0a" : "#6931f1";
          const lateStageIndex = TASK_STEPS.findIndex((step) => step.state === delayReasonStage);
          const activeStageIndex = TASK_STEPS.findIndex((step) => step.state === state);
          const showAgentDetail = isDone;
          const agentSuggestion = isLate
            ? "Prioritaskan penyelesaian task yang melewati deadline dan pastikan proses berikutnya tidak tertunda."
            : isDone
              ? "Task sudah selesai. Dokumentasikan hasil akhir sebagai referensi untuk pekerjaan berikutnya."
              : "Revisi arahan visual sebelum approval agar pekerjaan dapat diteruskan tanpa penundaan.";

          return <>
            <header className="flex h-[47px] w-full items-center justify-between border-b" style={{ borderColor: exportBorder }}>
              <div className="flex items-center gap-2"><div className="flex size-[38px] flex-col items-center justify-center rounded-[8px] bg-black text-[9px] font-bold leading-[9px] text-white"><span>CU</span><span>EA</span></div><div><p className="text-[13px] font-bold leading-4">Creative Universe</p><p className="text-[10px] leading-3">ODDS</p></div></div>
              <div className="flex size-[20px] items-center justify-center rounded-full border-2 border-[#111] text-[13px] font-bold">✓</div>
            </header>
            <section className="flex h-[99px] w-full gap-2"><div className="flex w-[88px] shrink-0 flex-col items-center justify-center rounded-[12px] text-white" style={{ backgroundColor: exportPrimary }}><span className="text-[12px]">{parsedDay}</span><strong className="text-[36px] leading-9">{parsedDate}</strong><span className="mt-1 text-[12px] uppercase">{parsedMonthYear}</span></div><div className="min-w-0 pt-2"><h1 className="max-h-[52px] overflow-hidden text-[24px] font-bold leading-[27px] tracking-[-0.3px]">{title}</h1><div className="mt-3 inline-flex max-w-full items-center rounded-[4px] border px-2 py-1 text-[10px] leading-[12px]" style={{ backgroundColor: exportSoft, borderColor: exportBorder, color: exportPrimary }}>▣&nbsp; Tugas di Submit tanggal {formattedGivenDate || "-"}</div></div></section>
            <section className="flex h-[102px] w-full flex-col gap-[14px] rounded-[8px] bg-white p-2"><div className="flex items-center gap-2"><div className="flex size-[36px] items-center justify-center rounded-full text-[20px]" style={{ backgroundColor: exportSoft }}>◉</div><div><p className="text-[10px] text-[#9b9b9b]">Vendor</p><p className="text-[14px] font-bold leading-4">{picVendor}</p></div></div><div className="flex items-center gap-2"><div className="flex size-[36px] items-center justify-center rounded-full text-[18px]" style={{ backgroundColor: exportSoft, color: exportPrimary }}>▣</div><div><p className="text-[10px] text-[#9b9b9b]">Deadline</p><p className="text-[14px] font-bold leading-4">{formattedDeadline || "-"}</p></div></div></section>
            <section className="h-[141px] w-full rounded-[8px] bg-white p-2"><h2 className="text-[14px] font-bold">Progress</h2><div className="mt-2 grid grid-cols-4 gap-1">{TASK_STEPS.map((step, index) => { const stepState = step.state === "Progress Design" ? "Progress" : step.state === "Approval Design" ? "Approve" : step.state === "Kirim Email" ? "Email" : "ACC Draft"; const completed = isDone || (activeStageIndex !== -1 && index < activeStageIndex); const delayed = lateStageIndex === index; const color = delayed ? "#f04444" : exportPrimary; const softColor = delayed ? "#ffebeb" : exportSoft; return <div key={step.state} className="min-w-0 text-center"><p className="h-[13px] overflow-hidden text-[8px] leading-[13px]" style={{ color }}>{internalTimestamps[stepState] || ""}</p><div className="mx-auto mt-1 flex size-[44px] items-center justify-center rounded-full text-[20px] font-bold" style={{ backgroundColor: softColor, color }}>{completed ? "✓" : delayed ? "✎" : index === 2 ? "♙" : index === 3 ? "✉" : "✓"}</div><p className="mt-1 rounded-[4px] border px-0.5 py-1 text-[8px] leading-[13px]" style={{ backgroundColor: softColor, borderColor: delayed ? "#ffbaba" : exportBorder, color }}>{step.label === "ApprovalDesign" ? "Approval Design" : step.label}</p></div>; })}</div></section>
            {showAgentDetail && <section className="h-[180px] w-full rounded-[8px] bg-white p-2"><h2 className="text-[14px] font-bold">Detail</h2><div className="mt-2 flex gap-2"><div className="flex h-[126px] w-[126px] shrink-0 flex-col items-center justify-center rounded-[4px] border text-center" style={{ backgroundColor: exportSoft, borderColor: exportBorder, color: exportPrimary }}><span className="text-[25px]">✧</span><span className="mt-1 text-[10px] font-bold leading-3">Creative Agent<br />Suggest</span></div><p className="pt-1 text-[10px] leading-[13px] text-[#555]">• {agentSuggestion}</p></div></section>}
          </>;
        })()}
      </div>

      <div aria-hidden="true" className="hidden">
        <div className="relative overflow-hidden rounded-[26px] bg-white p-10 shadow-[0_18px_55px_rgba(56,48,113,0.12)]">
          <div className="absolute right-0 top-0 h-52 w-52 rounded-bl-full bg-[#eeeaff]" />
          <div className="relative flex items-start justify-between gap-10">
            <div className="flex items-start gap-6">
              <div className="flex size-28 shrink-0 flex-col items-center justify-center rounded-[22px] bg-[#8474f9] text-white shadow-[0_12px_24px_rgba(132,116,249,0.28)]">
                <span className="text-sm font-medium uppercase tracking-[0.18em]">KV</span>
                <span className="mt-1 text-2xl font-semibold">Retail</span>
              </div>
              <div className="pt-1">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8474f9]">Task Summary</p>
                <h1 className="mt-3 max-w-[650px] text-[38px] font-semibold leading-[1.16] tracking-[-1px] text-[#242435]">{title}</h1>
                <p className="mt-4 text-lg text-[#6e7180]">{picVendor} · Diberikan {formattedGivenDate || "-"}</p>
              </div>
            </div>
            <div className={`relative rounded-2xl px-5 py-3 text-center text-base font-semibold ${isDone ? "bg-[#e8faea] text-[#238c36]" : isLate ? "bg-[#fff0f2] text-[#d94a67]" : "bg-[#eeeaff] text-[#6655dc]"}`}>
              {isDone ? "Selesai" : isLate ? "Terlambat" : "Dalam Proses"}
            </div>
          </div>

          <div className="relative mt-10 grid grid-cols-[1.1fr_0.9fr] gap-7">
            <div className="rounded-2xl border border-[#ececf4] bg-[#fcfcff] p-6">
              <p className="text-sm font-medium text-[#85889a]">Deadline</p>
              <p className="mt-2 text-[30px] font-semibold tracking-[-0.5px]">{formattedDeadline || "-"}</p>
              <p className={`mt-3 text-base font-medium ${isLate ? "text-[#d94a67]" : "text-[#707484]"}`}>{isDone ? "Task telah diselesaikan" : daysLeftText}</p>
            </div>
            <div className="rounded-2xl bg-[#282445] p-6 text-white">
              <div className="flex items-center justify-between"><p className="text-sm font-medium text-white/65">Progress task</p><p className="text-lg font-semibold">{PROGRESS_PERCENTAGE[state]}%</p></div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#a99cff]" style={{ width: `${PROGRESS_PERCENTAGE[state]}%` }} /></div>
              <p className="mt-5 text-base text-white/80">Tahap aktif: <span className="font-semibold text-white">{isDone ? "Selesai" : state === "0" ? "Belum dimulai" : state}</span></p>
            </div>
          </div>

          <div className="relative mt-7 rounded-2xl border border-[#ececf4] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#85889a]">Alur Pengerjaan</p>
            <div className="mt-5 grid grid-cols-4 gap-3">
              {TASK_STEPS.map((step, index) => {
                const stepType = getStepType(step.state === "Progress Design" ? "Progress" : step.state === "Approval Design" ? "Approve" : step.state === "Kirim Email" ? "Email" : "ACC Draft");
                const completed = stepType === "Done";
                const active = stepType === "Progress";
                return <div key={step.state} className={`rounded-xl border p-4 ${completed ? "border-[#bfe9c5] bg-[#effbf1]" : active ? "border-[#bdb4ff] bg-[#f1efff]" : "border-[#e7e8ef] bg-[#fafafd]"}`}><div className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${completed ? "bg-[#44b95a] text-white" : active ? "bg-[#8474f9] text-white" : "bg-[#e5e7ef] text-[#85889a]"}`}>{completed ? "✓" : index + 1}</div><p className="mt-3 text-base font-semibold">{step.label}</p><p className="mt-1 text-sm text-[#85889a]">{completed ? "Selesai" : active ? "Berjalan" : "Menunggu"}</p></div>;
              })}
            </div>
          </div>

          <div className="relative mt-8 flex items-center justify-between border-t border-[#ededf4] pt-6 text-sm text-[#898b9b]"><span>Creative Universe · KV Retail</span><span>Diekspor {new Date().toLocaleDateString("id-ID")}</span></div>
        </div>
      </div>
    </div>
  );
}
