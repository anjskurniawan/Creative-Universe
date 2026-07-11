import { MaterialIcon } from "@/components/material-icon";
import { type TaskCardConfig } from "./index";

export type TaskCardSubmitLinkOverlayProps = {
  isSubmitting: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
  config?: TaskCardConfig;
};

export default function TaskCardSubmitLinkOverlay({
  isSubmitting,
  inputValue,
  onInputChange,
  onCancel,
  onSubmit,
  config = {},
}: TaskCardSubmitLinkOverlayProps) {
  const progressBg = config.color_progress_bg || "#8474f9";
  const progressText = config.color_progress_text || "#ffffff";
  
  return (
    <div
      className={`absolute inset-0 z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between px-6 py-4 xl:py-0 transition-all duration-300 ease-out border rounded-2xl ${
        isSubmitting ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{ backgroundColor: progressBg, color: progressText, borderColor: progressBg }}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1 w-full mr-4">
        <div className="flex items-center gap-3 shrink-0">
          <MaterialIcon name="attach_file" size="auto" className="text-[28px] leading-none shrink-0" />
          <span className="text-base font-semibold leading-normal">{config.submit_link_title || "Input Link File:"}</span>
        </div>
        <div className="flex flex-col flex-1 gap-1.5 w-full">
          <p className="text-xs font-normal" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {config.submit_link_desc || "Masukkan link file design atau dokumen pendukung tugas"}
          </p>
          <input
            type="url"
            placeholder={config.submit_link_placeholder || "Link File Sharing"}
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            className="w-full max-w-[500px] px-3 py-1.5 bg-white text-black text-sm rounded-lg border-none outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4 xl:mt-0 shrink-0">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: progressText }}
        >
          {config.submit_link_cancel || "Batal"}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="px-4 py-2 text-sm font-semibold bg-white hover:bg-gray-100 rounded-lg cursor-pointer transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          style={{ color: progressBg }}
        >
          {config.submit_link_submit || "Kirim"}
        </button>
      </div>
    </div>
  );
}
