export type ProfileCardProps = {
  name: string;
  role: string;
  avatarSrc?: string | null;
  bannerSrc?: string | null;
  onChangeAvatar?: () => void;
  onChangeBanner?: () => void;
};
