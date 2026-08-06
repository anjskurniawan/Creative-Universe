"use client";

import { AccessDenied } from "@/components/ui/access-denied";
import { ContentTitle } from "@/components/ui/content-title";

import { RoleTable } from "@/components/panel/roles/role-table";
import { RoleEditorModal } from "@/components/panel/roles/role-editor-modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";

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
    openEdit,
    closeEditor,
    togglePermission,
    saveRole,
    deleteRole,
  } = useRoles();

  if (!hasPermission) {
    return (
      <AccessDenied message="Anda tidak memiliki permission manage-roles." />
    );
  }

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <ContentTitle
        title="Role & Permission"
        subtitle="Atur role dinamis dan akses aplikasi dari satu tempat."
      />

      <RoleTable
        roles={roles}
        isLoading={isLoading}
        onEdit={openEdit}
      />

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
          onDelete={() => {
            if (editing) setDeleting(editing);
          }}
        />
      )}

      {deleting && (
        <ConfirmModal
          title="Hapus Role"
          message={
            <>
              Role <strong className="text-cu-ink">{deleting.name}</strong> akan
              dihapus permanen. Role dengan pengguna aktif tidak dapat dihapus.
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
  );
}
