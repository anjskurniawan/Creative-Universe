import React, { ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}

export function Modal({ title, children, onClose, wide = false }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cu-overlay/60 p-4 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`max-h-[92vh] w-full overflow-y-auto rounded-2xl border border-cu-line bg-cu-surface shadow-xl ${
          wide ? "max-w-4xl" : "max-w-2xl"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-cu-line bg-cu-surface px-6 py-4">
          <h2 className="text-lg font-semibold text-cu-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="text-cu-muted hover:text-cu-ink transition"
          >
            <MaterialIcon name="close" size="sm" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
