import type { RefObject } from "react";

export interface LoginFormProps {
  whiteOverlayRef: RefObject<HTMLDivElement | null>;
  setToast: (toast: { status: "success" | "error"; message: string } | null) => void;
  className?: string;
}

export interface LoginCardProps {
  whiteOverlayRef: RefObject<HTMLDivElement | null>;
  className?: string;
}
