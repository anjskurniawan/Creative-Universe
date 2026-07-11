import { MaterialIcon } from "@/components/material-icon";
import { type TaskCardConfig } from "./index";

export type TaskCardDeleteOverlayProps = {
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  config?: TaskCardConfig;
};

export default function TaskCardDeleteOverlay({
  isDeleting,
  onCancel,
  onConfirm,
  config = {},
}: TaskCardDeleteOverlayProps) {
  const deleteBg = config.color_delete_bg || "#ff5b55";
  const deleteText = config.color_delete_text || "#ffffff";
  
  return (
    <div
      className={`absolute inset-0 z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 sm:py-0 transition-all duration-300 ease-out border rounded-2xl ${
        isDeleting ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{ backgroundColor: deleteBg, color: deleteText, borderColor: deleteBg }}
    >
      <div className="flex items-center gap-3">
        <MaterialIcon name="delete_forever" size="auto" className="text-[28px] leading-none shrink-0" />
        <span className="text-base sm:text-lg font-medium leading-normal">{config.delete_overlay_title || "Apakah Anda yakin ingin menghapus tugas ini?"}</span>
      </div>
      <div className="flex items-center gap-3 mt-4 sm:mt-0">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold rounded-lg cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: deleteText }}
        >
          {config.delete_overlay_cancel || "Batal"}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-4 py-2 text-sm font-semibold bg-white hover:bg-gray-100 rounded-lg cursor-pointer transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          style={{ color: deleteBg }}
        >
          {config.delete_overlay_confirm || "Ya, Hapus"}
        </button>
      </div>
    </div>
  );
}
