"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { coreApi } from "@/core/api";
import { errorMessage, ManagedRole, type ManagedPermission } from "@/core/admin";
import { useAuth } from "@/providers/auth-provider";

export function useRoles() {
  const { hasPermission } = useAuth();
  
  const [roles, setRoles] = useState<ManagedRole[]>([]);
  const [permissions, setPermissions] = useState<ManagedPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editing, setEditing] = useState<ManagedRole | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const [deleting, setDeleting] = useState<ManagedRole | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [roleData, permissionData] = await Promise.all([
        coreApi.roles.list<ManagedRole[]>(),
        coreApi.roles.permissionCatalog<ManagedPermission[]>(),
      ]);
      setRoles(roleData);
      setPermissions(permissionData);
    } catch (requestError) {
      window.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: {
            status: "error",
            message: errorMessage(requestError),
          },
        })
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasPermission("manage-roles")) return;
    queueMicrotask(() => void loadData());
  }, [hasPermission, loadData]);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setSelectedPermissions([]);
    setShowEditor(true);
  };

  const openEdit = (role: ManagedRole) => {
    setEditing(role);
    setName(role.name);
    setSelectedPermissions(role.permissions);
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditing(null);
    setName("");
    setSelectedPermissions([]);
  };

  const togglePermission = (permissionKey: string) => {
    setSelectedPermissions((current) =>
      current.includes(permissionKey)
        ? current.filter((item) => item !== permissionKey)
        : [...current, permissionKey]
    );
  };

  const saveRole = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      if (editing) {
        await coreApi.roles.update(editing.id, { permissions: selectedPermissions });
        window.dispatchEvent(
          new CustomEvent("show-toast", {
            detail: {
              status: "success",
              message: `Permission role ${editing.name} berhasil diperbarui.`,
            },
          })
        );
      } else {
        await coreApi.roles.create({ name, permissions: selectedPermissions });
        window.dispatchEvent(
          new CustomEvent("show-toast", {
            detail: {
              status: "success",
              message: `Role ${name.trim()} berhasil dibuat.`,
            },
          })
        );
      }

      closeEditor();
      await loadData();
    } catch (requestError) {
      window.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: {
            status: "error",
            message: errorMessage(requestError),
          },
        })
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deleteRole = async () => {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      await coreApi.roles.remove(deleting.id);
      window.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: {
            status: "success",
            message: `Role ${deleting.name} berhasil dihapus.`,
          },
        })
      );
      setDeleting(null);
      await loadData();
    } catch (requestError) {
      window.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: {
            status: "error",
            message: errorMessage(requestError),
          },
        })
      );
      setDeleting(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    hasPermission: hasPermission("manage-roles"),
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
  };
}
