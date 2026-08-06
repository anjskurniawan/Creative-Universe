"use client";

import React, { FormEvent } from "react";
import { Modal } from "@/components/ui/modal";
import type { ManagedRole, ManagedPermission } from "@/core/admin";

interface RoleEditorModalProps {
  editing: ManagedRole | null;
  name: string;
  setName: (name: string) => void;
  permissions: ManagedPermission[];
  selectedPermissions: string[];
  togglePermission: (permissionKey: string) => void;
  isSaving: boolean;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export function RoleEditorModal({
  editing,
  name,
  setName,
  permissions,
  selectedPermissions,
  togglePermission,
  isSaving,
  onSave,
  onClose,
}: RoleEditorModalProps) {
  return (
    <Modal title={editing ? "Ubah Permission Role" : "Buat Role Baru"} onClose={onClose}>
      <form onSubmit={onSave}>
        <div className="space-y-5 p-6">
          <p className="text-sm text-cu-muted">
            {editing
              ? "Nama role tidak diubah dari panel ini."
              : "Gunakan nama yang jelas, misalnya Koordinator Creative."}
          </p>
          
          <label className="block space-y-2 text-sm font-medium text-cu-ink">
            <span>Nama Role</span>
            <input
              required
              minLength={3}
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={Boolean(editing)}
              placeholder="Koordinator Creative"
              className="form-input disabled:bg-cu-panel-soft disabled:text-cu-muted"
            />
          </label>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-cu-ink">Permission</h3>
              <span className="text-xs text-cu-muted">{selectedPermissions.length} dipilih</span>
            </div>
            <div className="grid max-h-72 gap-2 overflow-y-auto rounded-xl border border-cu-line bg-cu-panel-soft p-3 sm:grid-cols-2">
              {permissions.map((permission) => (
                <label
                  key={permission.key}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink"
                >
                  <input
                    className="mt-0.5"
                    type="checkbox"
                    checked={selectedPermissions.includes(permission.key)}
                    onChange={() => togglePermission(permission.key)}
                  />
                  <span>
                    <span className="block">{permission.display_name}</span>
                    <small className="text-cu-muted">{permission.application_name}</small>
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>
        <div className="flex justify-end gap-3 border-t border-cu-line px-6 py-4">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Batal
          </button>
          <button type="submit" disabled={isSaving} className="btn btn-primary">
            {isSaving ? "Menyimpan..." : editing ? "Simpan Permission" : "Buat Role"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
