"use client";

import React, { FormEvent } from "react";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/form/input";
import { DropdownMenu } from "@/components/ui/form/dropdown-menu";
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
  onDelete: () => void;
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
  onDelete,
}: RoleEditorModalProps) {
  const [permissionsDropdownOpen, setPermissionsDropdownOpen] = useState(false);
  const permissionItems = permissions.map((permission) => ({
    value: permission.key,
    label: permission.display_name,
  }));

  return (
    <Modal
      title={editing ? "Kelola Permission Role" : "Buat Role Baru"}
      onClose={onClose}
      fullHeight
      footer={
        <div className="flex w-full justify-end gap-3">
          {editing && !editing.protected && (
            <button type="button" onClick={onDelete} className="mr-auto btn btn-danger">
              Hapus Role
            </button>
          )}
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Batal
          </button>
          <button type="submit" form="role-edit-form" disabled={isSaving} className="btn btn-primary">
            {isSaving ? "Menyimpan..." : editing ? "Simpan Permission" : "Buat Role"}
          </button>
        </div>
      }
    >
      <form id="role-edit-form" onSubmit={onSave}>
        <div className="space-y-5">
          <p className="text-sm text-cu-muted">
            {editing
              ? "Nama role tidak diubah dari panel ini."
              : "Gunakan nama yang jelas, misalnya Koordinator Creative."}
          </p>
          
          <Input
            id="role-name"
            label="Nama Role"
            required
            minLength={3}
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={Boolean(editing)}
            placeholder="Koordinator Creative"
          />

          <section>
            <div className="relative z-10">
              <Input
                id="role-permissions"
                label="Permission"
                type="dropdown"
                placeholder="Pilih Permission"
                value={selectedPermissions
                  .map((key) => permissionItems.find((item) => item.value === key)?.label ?? key)
                  .join(", ")}
                onClick={() => setPermissionsDropdownOpen((open) => !open)}
                active={permissionsDropdownOpen}
              />
              <DropdownMenu
                isOpen={permissionsDropdownOpen}
                items={permissionItems}
                selectedValues={selectedPermissions}
                onSelect={togglePermission}
                onClose={() => setPermissionsDropdownOpen(false)}
                onReset={() => selectedPermissions.forEach(togglePermission)}
              />
            </div>
          </section>
        </div>
      </form>
    </Modal>
  );
}
