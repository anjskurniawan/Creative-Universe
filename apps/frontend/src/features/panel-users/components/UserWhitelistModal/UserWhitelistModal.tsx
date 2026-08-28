"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal/Modal";
import type { UserManagementOptions } from "../../types";

interface UserWhitelistModalProps {
  options: UserManagementOptions;
  whitelist: string[];
  setWhitelist: React.Dispatch<React.SetStateAction<string[]>>;
  isSaving: boolean;
  onSave: () => void;
  onClose: () => void;
}

export function UserWhitelistModal({
  options,
  whitelist,
  setWhitelist,
  isSaving,
  onSave,
  onClose,
}: UserWhitelistModalProps) {
  const togglePermission = (permission: string) => {
    setWhitelist((current) =>
      current.includes(permission)
        ? current.filter((item) => item !== permission)
        : [...current, permission]
    );
  };

  return (
    <Modal title="Kelola Izin Delegasi Manajer" onClose={onClose}>
      <div className="space-y-4 p-6">
        <p className="text-sm text-cu-muted">
          Manajer hanya dapat memberikan izin yang dipilih di sini dan juga dimilikinya sendiri.
        </p>
        <div className="grid max-h-80 gap-2 overflow-y-auto sm:grid-cols-2">
          {options.all_permissions.map((permission) => {
            const sensitive = ["run-artisan", "manage-roles", "view-logs"].includes(permission);
            return (
              <label
                key={permission}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-cu-line bg-cu-panel-soft/30 p-3"
              >
                <input
                  type="checkbox"
                  checked={whitelist.includes(permission)}
                  onChange={() => togglePermission(permission)}
                  className="mt-0.5"
                />
                <span className={`text-xs font-semibold ${sensitive ? "text-cu-danger" : "text-cu-ink"}`}>
                  {options.permission_aliases[permission] ?? permission}
                  {sensitive && <small className="mt-0.5 block font-normal">Izin kritis sistem</small>}
                </span>
              </label>
            );
          })}
        </div>
      </div>
      <div className="flex justify-end gap-3 border-t border-cu-line px-6 py-4">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Batal
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="btn btn-primary"
        >
          {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </Modal>
  );
}
