import { resolveStorageUrl } from "@/core/api/client";

export function AssessmentTableAvatar({ name, imagePath }: { name: string; imagePath?: string | null }) {
  const imageUrl = resolveStorageUrl(imagePath);
  const initials = name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  return (
    <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#ede9fe] text-[10px] font-bold text-[#6d46eb]">
      {imageUrl ? <img src={imageUrl} alt="" className="size-full object-cover" /> : initials}
    </span>
  );
}
