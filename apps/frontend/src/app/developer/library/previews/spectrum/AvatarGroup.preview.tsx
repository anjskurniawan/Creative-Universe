import { Avatar, AvatarGroup } from "@/components/spectrum/AvatarGroup";
import { PreviewWrapper } from "../preview-wrapper";

const avatarSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' rx='48' fill='%23ba0dcb'/%3E%3Ccircle cx='48' cy='38' r='16' fill='white'/%3E%3Cpath d='M20 82c3-17 14-25 28-25s25 8 28 25' fill='white'/%3E%3C/svg%3E";

export function SpectrumAvatarGroupPreview() {
  return <PreviewWrapper width="md"><AvatarGroup label="Project members" size={32}><Avatar alt="Abraham Baker" src={avatarSrc} /><Avatar alt="Adriana Sullivan" src={avatarSrc} /><Avatar alt="Jonathan Kelly" src={avatarSrc} /><Avatar alt="Zara Bush" src={avatarSrc} /></AvatarGroup></PreviewWrapper>;
}
