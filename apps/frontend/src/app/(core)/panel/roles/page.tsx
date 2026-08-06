"use client";

import React from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { SettingsLayout } from "@/components/layout/settings-layout";
import { AccessDenied } from "@/components/ui/access-denied";
import { ContentTitle } from "@/components/ui/content-title";

// Import Modular Components
import { RoleTable } from "@/components/panel/roles/role-table";
import { RoleEditorModal } from "@/components/panel/roles/role-editor-modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";

// Import Hooks
import { useRoles } from "./use-roles";

export default function RolesPage() {
  const {
    hasPermission,
    roles,
    permissions,
    isLoading,
    editing,
    showEditor,
    name,
    setName,
    selectedPermissions,
    isSaving,
    deleting,
    setDeleting,
    isDeleting,
    openCreate,
    openEdit,
    closeEditor,
    togglePermission,
    saveRole,
    deleteRole,
  } = useRoles();

  if (!hasPermission) {
    return <AccessDenied message="Anda tidak memiliki permission manage-roles." />;
  }

  return (
    <SettingsLayout>
      <div className="space-y-6 animate-fade-in">
        <ContentTitle
          title="Role & Permission"
          subtitle="Atur role dinamis dan akses aplikasi dari satu tempat."
          rightElement={
            <button type="button" onClick={openCreate} className="btn btn-primary rounded-full">
              <MaterialIcon name="add" size="sm" /> Buat Role
            </button>
          }
        />

        {/* Roles List Table */}
        <RoleTable
          roles={roles}
          isLoading={isLoading}
          onEdit={openEdit}
          onDelete={setDeleting}
        />

        {/* Editor Modal */}
        {showEditor && (
          <RoleEditorModal
            editing={editing}
            name={name}
            setName={setName}
            permissions={permissions}
            selectedPermissions={selectedPermissions}
            togglePermission={togglePermission}
            isSaving={isSaving}
            onSave={saveRole}
            onClose={closeEditor}
          />
        )}

        {/* Delete Modal */}
        {deleting && (
          <ConfirmModal
            title="Hapus Role"
            message={
              <>
                Role <strong className="text-cu-ink">{deleting.name}</strong> akan dihapus permanen. Role dengan pengguna aktif tidak dapat dihapus.
              </>
            }
            confirmText="Hapus Role"
            isDanger
            isLoading={isDeleting}
            onConfirm={deleteRole}
            onClose={() => setDeleting(null)}
          />
        )}
      </div>
    </SettingsLayout>
  );
}
