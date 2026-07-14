import { MaterialIcon } from "@/components/material-icon";

type TaskcardMobileFileSlotsOverlayProps = {
  title: string;
  files?: (string | null)[];
  onBack?: () => void;
  canUpload?: boolean;
  onUploadSlot?: (index: number) => void;
  onViewFile?: (file: string) => void;
};

export function TaskcardMobileFileSlotsOverlay({
  title,
  files = [null, null, null],
  onBack,
  canUpload = true,
  onUploadSlot,
  onViewFile,
}: TaskcardMobileFileSlotsOverlayProps) {
  const slots = Array.from({ length: 3 }, (_, index) => files[index] || null);

  return (
    <div className="flex min-h-[407px] flex-col justify-between rounded-b-2xl bg-white p-4">
      <p className="text-center text-xs leading-4 text-[#525e61]">{title}</p>
      <div className="flex flex-col gap-3">
        <MaterialIcon name="folder_open" size="auto" weight={400} className="mx-auto text-5xl text-[#8474f9]" />
        <p className="text-center text-base font-semibold leading-5 text-[#222]">Pilih slot file</p>
        <div className="flex flex-col gap-2">
          {slots.map((file, index) => (
            <button
              key={index}
              type="button"
              onClick={() => file ? onViewFile?.(file) : (canUpload ? onUploadSlot?.(index) : undefined)}
              disabled={!file && !canUpload}
              className={[
                "flex h-11 items-center justify-between rounded-xl px-4 text-left text-sm leading-5",
                file ? "bg-[#eeebff] text-[#8474f9]" : "bg-[#f3f4f6] text-[#6b7280] disabled:cursor-not-allowed disabled:opacity-60",
              ].join(" ")}
            >
              <span>{file ? `File ${index + 1}` : (canUpload ? `Upload File ${index + 1}` : `File ${index + 1} kosong`)}</span>
              <MaterialIcon name={file ? "visibility" : "upload"} size="auto" weight={400} className="text-xl leading-none" />
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={onBack}
        className="h-11 rounded-xl bg-[#f3f4f6] text-base leading-6 text-[#3b4446]"
      >
        Kembali
      </button>
    </div>
  );
}
