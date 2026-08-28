export type TaskcardMobileTone = "default" | "done" | "emergency";
export type TaskcardMobileTheme = "light" | "dark" | "retro";

export type TaskcardMobileButtonColor =
  | "purple"
  | "purple-light"
  | "green"
  | "green-light"
  | "red"
  | "pink"
  | "neutral"
  | "gray";

export type TaskcardMobileButtonStyle = "outlined" | "filled" | "ghost" | "light";
export type TaskcardMobileButtonIcon = "none" | "link" | "delete" | "sync" | "upload";

export type TaskcardMobileChange = {
  label: string;
  timestamp?: string;
  reason?: string;
};

export type TaskcardMobileAvatar = {
  name: string;
  photoUrl?: string | null;
};
