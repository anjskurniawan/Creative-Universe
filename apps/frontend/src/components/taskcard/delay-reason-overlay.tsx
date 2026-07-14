import { MaterialIcon } from "@/components/material-icon";

type TaskCardDelayReasonOverlayProps = {
  isOpen: boolean;
  stage?: string;
  value: string;
  onChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function TaskCardDelayReasonOverlay({ isOpen, stage, value, onChange, onCancel, onConfirm }: TaskCardDelayReasonOverlayProps) {
  return (
    <div className={`absolute inset-0 z-10 flex flex-col items-start justify-between rounded-2xl border border-[#ea4c89] bg-white px-6 py-4 transition-all duration-300 xl:flex-row xl:items-center xl:py-0 ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}>
      <div className="flex w-full min-w-0 flex-1 flex-col gap-3 xl:flex-row xl:items-center xl:gap-4 xl:pr-4">
        <div className="flex shrink-0 items-center gap-3 text-[#ea4c89]"><MaterialIcon name="warning" size="auto" className="text-[28px]" /><span className="text-base font-semibold">Alasan Keterlambatan</span></div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5"><p className="text-xs text-[#525e61]">Tahap {stage} terlambat. Isi alasan sebelum melanjutkan status.</p><textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder="Tulis alasan keterlambatan..." rows={2} className="h-[58px] w-full resize-none rounded-lg border border-[#f4a5c2] bg-[#fff7fa] px-3 py-2 text-sm text-[#222] outline-none focus:ring-2 focus:ring-[#ea4c89]/20" /></div>
      </div>
      <div className="mt-4 flex shrink-0 items-center gap-3 xl:mt-0"><button type="button" onClick={onCancel} className="rounded-lg bg-[#f3f4f6] px-4 py-2 text-sm font-semibold text-[#525e61]">Batal</button><button type="button" disabled={!value.trim()} onClick={onConfirm} className="rounded-lg bg-[#ea4c89] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Lanjutkan</button></div>
    </div>
  );
}
