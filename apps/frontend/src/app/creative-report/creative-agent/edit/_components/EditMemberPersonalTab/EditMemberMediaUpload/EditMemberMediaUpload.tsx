import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

export interface EditMemberMediaUploadProps {
  fileName?: string;
  onFileChange: (file: File | null) => void;
}

export function EditMemberMediaUpload({
  fileName,
  onFileChange,
}: EditMemberMediaUploadProps) {
  return (
    <label className="flex min-h-20 flex-1 cursor-pointer items-center gap-2 rounded-xl border border-dashed px-3 py-2 transition border-[#c9bbfc] bg-[#faf9ff] hover:border-[#6d46eb] hover:bg-[#f5f2ff]">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#ede9fe] text-[#6d46eb]">
        <MaterialIcon name="cloud_upload" size="xs" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-semibold text-[#3b4446]">
          {fileName ?? "Unggah foto atau video card"}
        </span>
        <span className="mt-0.5 block text-[10px] text-slate-500">
          PNG, JPG, WEBP, MP4, WEBM, OGG
        </span>
      </span>
      <span className="shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold bg-white text-[#6d46eb] shadow-sm">
        Pilih file
      </span>
      <input
        type="file"
        className="sr-only"
        accept="image/png,image/jpeg,image/webp,video/mp4,video/webm,video/ogg"
        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
      />
    </label>
  );
}
