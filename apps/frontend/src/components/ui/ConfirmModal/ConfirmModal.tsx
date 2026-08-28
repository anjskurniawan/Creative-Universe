import React from "react";
import { Modal } from "@/components/ui/Modal/Modal";

export interface ConfirmModalProps {
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  isLoading?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  title,
  message,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  isDanger = false,
  isLoading = false,
  error,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <Modal title={title} onClose={onClose}>
      <div className="space-y-4 p-6 text-sm text-cu-muted">
        <div>{message}</div>
        {error && (
          <div className="rounded-xl border border-cu-danger/20 bg-cu-danger-soft px-4 py-3 text-xs text-cu-danger font-semibold animate-fade-in">
            {error}
          </div>
        )}
      </div>
      <div className="flex justify-end gap-3 border-t border-cu-line px-6 py-4">
        <button type="button" onClick={onClose} disabled={isLoading} className="btn btn-secondary">
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={`inline-flex items-center gap-2 btn ${isDanger ? "btn-danger" : "btn-primary"}`}
        >
          {isLoading && (
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
          )}
          {isLoading ? "Memproses..." : confirmText}
        </button>
      </div>
    </Modal>
  );
}
