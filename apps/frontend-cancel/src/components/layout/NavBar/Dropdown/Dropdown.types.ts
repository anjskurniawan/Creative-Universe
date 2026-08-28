import type { ReactNode } from "react";

export type DropdownProps = {
  isOpen?: boolean;
  children: ReactNode;
  onClose: () => void;
  className?: string;
};
