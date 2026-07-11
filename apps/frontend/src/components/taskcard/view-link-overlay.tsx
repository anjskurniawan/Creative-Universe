import { MaterialIcon } from "@/components/material-icon";
import { type TaskCardConfig } from "./index";

export type TaskCardViewLinkOverlayProps = {
  isViewing: boolean;
  fileLink?: string | null;
  onCancel: () => void;
  config?: TaskCardConfig;
};

export default function TaskCardViewLinkOverlay({
  isViewing,
  fileLink,
  onCancel,
  config = {},
}: TaskCardViewLinkOverlayProps) {
  const doneBg = config.color_done_bg || "#e8faea";
  const doneText = config.color_done_text || "#2b9915";

  return (
    <div
      className={`absolute inset-0 z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between px-6 py-4 xl:py-0 transition-all duration-300 ease-out border rounded-2xl ${
        isViewing ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{ backgroundColor: doneBg, color: doneText, borderColor: doneText }}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1 w-full mr-4">
        <div className="flex items-center gap-3 shrink-0">
          <MaterialIcon name="link" size="auto" className="text-[28px] leading-none shrink-0" />
          <span className="text-base font-semibold leading-normal">{config.view_link_title || "Tautan File Tersimpan:"}</span>
        </div>
        <div className="flex flex-col flex-1 gap-1.5 w-full">
          <p className="text-xs font-normal" style={{ opacity: 0.8 }}>{config.view_link_desc || "Tautan ini telah dilampirkan pada hasil akhir tugas."}</p>
          <div className="flex items-center w-full max-w-[500px] bg-white rounded-lg px-3 py-1.5 border shadow-sm overflow-hidden" style={{ borderColor: `${doneText}33` }}>
            <span className="text-sm text-black truncate flex-1">{fileLink}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4 xl:mt-0 shrink-0">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2"
          style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: doneText }}
        >
          {config.view_link_cancel || "Kembali"}
        </button>
        <button
          type="button"
          onClick={() => {
            if (fileLink) {
              navigator.clipboard.writeText(fileLink);
              alert("Link berhasil disalin!");
            }
          }}
          className="px-4 py-2 text-sm font-semibold text-white rounded-lg cursor-pointer transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 flex items-center gap-2"
          style={{ backgroundColor: doneText }}
        >
          <MaterialIcon name="content_copy" size="auto" className="text-[18px]" />
          {config.view_link_copy || "Copy Link"}
        </button>
      </div>
    </div>
  );
}
