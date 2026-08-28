import type { ReactNode } from "react";

export type DropdownProps = {
  isOpen: boolean;
  onClose: () => void;
  className: string;
  children: ReactNode;
};
