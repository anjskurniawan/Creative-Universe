export type AvatarState = "Default" | "Focus";

export type AvatarProps = {
  name?: string;
  src?: string | null;
  state?: AvatarState;
  dark?: boolean;
};
