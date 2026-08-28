import React, { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

export interface ModalProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  wide?: boolean;
  fullHeight?: boolean;
}

export function Modal({
  title,
  children,
  footer,
  onClose,
  wide = false,
  fullHeight = false,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-cu-overlay/60 p-8 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`flex flex-col w-full bg-cu-surface shadow-xl overflow-hidden border border-cu-line rounded-2xl ${
          fullHeight ? "h-full" : "max-h-[92vh]"
        } ${wide ? "max-w-5xl" : "max-w-2xl"}`}
      >
        {/* Sticky Header */}
        <div className="flex-none flex items-center justify-between border-b border-cu-line bg-cu-surface px-6 py-4">
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {children}
        </div>

        {/* Sticky Footer */}
        {footer && (
          <div className="flex-none border-t border-cu-line bg-cu-panel-soft/40 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
