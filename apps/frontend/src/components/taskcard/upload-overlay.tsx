import { MaterialIcon } from "@/components/material-icon";
import { type TaskCardConfig } from "./index";

export type TaskCardUploadOverlayProps = {
  uploadingDocType: "support_file" | "draft_file" | null;
  fileIndex?: number | null;
  isUploading: boolean;
  hasFile: boolean;
  onFileChange: (file: File | null) => void;
  onCancel: () => void;
  onSubmit: () => void;
  config?: TaskCardConfig;
};

export default function TaskCardUploadOverlay({
  uploadingDocType,
  fileIndex = null,
  isUploading,
  hasFile,
  onFileChange,
  onCancel,
  onSubmit,
  config = {},
}: TaskCardUploadOverlayProps) {
  const docTypeLabel = uploadingDocType === "support_file" 
    ? (config.upload_overlay_title_support || "3D Gambar")
    : (config.upload_overlay_title_draft || "Draft");

  return (
    <div
      className={`absolute inset-0 z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between px-6 py-4 xl:py-0 bg-white text-black transition-all duration-300 ease-out border border-[#e5e7eb] rounded-2xl ${
        uploadingDocType ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1 w-full mr-4">
        <div className="flex items-center gap-3 shrink-0">
          <MaterialIcon name="upload_file" size="auto" className="text-[28px] leading-none shrink-0 text-[#8474f9]" />
          <span className="text-base font-semibold leading-normal">
            Unggah {docTypeLabel} {fileIndex !== null ? `(File ${fileIndex + 1})` : ""}:
          </span>
        </div>
        <div className="flex flex-col flex-1 gap-1 w-full">
          <input
            type="file"
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#eeebff] file:text-[#8474f9] hover:file:bg-[#e4dfff] cursor-pointer focus:outline-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4 xl:mt-0 shrink-0">
        <button
          type="button"
          disabled={isUploading}
          onClick={onCancel}
          className="px-4 py-1.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:opacity-50"
        >
          {config.upload_overlay_cancel || "Batal"}
        </button>
        <button
          type="button"
          disabled={!hasFile || isUploading}
          onClick={onSubmit}
          className="px-4 py-1.5 text-sm font-semibold text-white bg-[#8474f9] hover:bg-[#7261e3] rounded-lg cursor-pointer transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8474f9]/50 disabled:opacity-50 flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <MaterialIcon name="sync" className="animate-spin text-[16px]" size="auto" />
              {config.upload_overlay_saving || "Mengunggah..."}
            </>
          ) : (
            <>
              <MaterialIcon name="upload" className="text-[16px]" size="auto" />
              <span className="leading-none">{config.upload_overlay_submit || "Unggah"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
